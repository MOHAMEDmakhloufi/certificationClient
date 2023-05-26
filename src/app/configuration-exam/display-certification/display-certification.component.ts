import { Component, OnInit } from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {Exam} from "../../models/Exam";
import {BehaviorSubject, catchError, map, Observable, of, startWith} from "rxjs";
import {CustomResponse} from "../../models/CustomResponse";
import {ExamService} from "../services/exam.service";
import {DataState} from "../../enums/DataState";
import {AppState} from "../../models/AppState";
import {SkillsMeasured} from "../../models/SkillsMeasured";
import {NotificationService} from "../services/notification.service";


@Component({
  selector: 'app-display-certification',
  templateUrl: './display-certification.component.html',
  styleUrls: ['./display-certification.component.css']
})
export class DisplayCertificationComponent implements OnInit {
  examId: number;
  examName: string;
  appState$: Observable<AppState<CustomResponse<Exam>>>;
  private dataSubject = new BehaviorSubject<CustomResponse<Exam>>(null);
  viewAllSkills=false;
  private disabledTrash= new BehaviorSubject<number>(0);
  disabledTrash$= this.disabledTrash.asObservable();
  readonly DataState = DataState  ;

  constructor(private route: ActivatedRoute,
              private examService : ExamService,
              private notifier: NotificationService) {
  }

  ngOnInit(): void {

    this.examId = this.route.snapshot.params['id'];
    this.examName = this.route.snapshot.params['name'];
    this.appState$= this.examService.getCertificationQuestions$(this.examId).pipe(
      map(response => {
        this.dataSubject.next(response);
        this.notifier.onDefault(response.message);
        return {dataState: DataState.LOADED_STATE, appData: response}
      }),
      startWith({dataState: DataState.LOADING_STATE}),
      catchError(err => {
        this.notifier.onError(err);
        return of({dataState: DataState.ERROR_STATE})
      })
    );
  }

  numberOfQuestions(skill: SkillsMeasured) {
    return 18;
  }

  requirementsQuestions(skill: SkillsMeasured) {
    return 10;
  }

  viewAll(skills: HTMLDivElement) {
    this.viewAllSkills?skills.style.maxHeight="80px":skills.style.maxHeight="1000px";
    if (this.viewAllSkills){
      document.getElementById("arrow").style.rotate= "0deg";
      document.getElementById("arrow").style.transitionDelay="1s";
    }else{
      document.getElementById("arrow").style.rotate= "180deg";
      document.getElementById("arrow").style.transitionDelay="0s";
    }
    this.viewAllSkills= !this.viewAllSkills;
  }

  checkQuestion(questionCheck: HTMLDivElement) {

    let input =questionCheck.getElementsByTagName("input")[0];
    if (!input.checked){
      questionCheck.style.backgroundColor="#dc354540";
      input.checked= true;
      this.disabledTrash.next(this.disabledTrash.value + 1);
    }else {
      questionCheck.style.backgroundColor="#E0E0E0";
      input.checked= false;
      this.disabledTrash.next(this.disabledTrash.value - 1);
    }


  }

  selectAll(selectAllInput :HTMLInputElement, length: number) {
    if (selectAllInput.getAttribute("class").includes("select-all-input")){
      for (let i=0; i<length; i++){
        let questionCheck= document.getElementById(`question-check-${i}`) as HTMLDivElement;
        if(questionCheck.getElementsByTagName("input")[0].checked){
          console.log(i);
          this.checkQuestion(questionCheck);
        }
      }
    }
    else {
      selectAllInput.checked= !selectAllInput.checked;
      for (let i=0; i< length; i++) {
        this.checkQuestion(document.getElementById(`question-check-${i}`) as HTMLDivElement);
      }
    }

  }
  getAllSelected(): number[]{
    const questionCheck= document.getElementsByClassName("question-check");
    let arrayId= [];
    for (let i=0; i<questionCheck.length; i++){
      const element = questionCheck[i].getElementsByTagName("input")[0];
      if (element.checked)
        arrayId.push(+element.value);
    }
    return  arrayId;
  }
  deleteAll(exam: Exam) {
    exam.showConfirmation= true;
  }

  confirmDelete(exam: Exam) {
    const ids = this.getAllSelected();
    this.appState$= this.examService.deleteQuestions$(ids).pipe(
      map(response =>{
        this.dataSubject.next({
          ...response, data: {exam: {...this.dataSubject.value.data.exam, questions : this.dataSubject.value.data.exam.questions.filter(e => !ids.includes(e.id))}}
        });
        this.notifier.onWarning(response.message);
        return {dataState: DataState.LOADED_STATE, appData: this.dataSubject.value}
      }),
      startWith({dataState : DataState.LOADING_STATE}),
      catchError((err : string)=>{
        this.notifier.onError(err);
        return of({dataState : DataState.ERROR_STATE, error: err})
      })
    );
    exam.showConfirmation=false;
  }

  cancelDelete(exam: Exam) {
    exam.showConfirmation= false;
  }
}
