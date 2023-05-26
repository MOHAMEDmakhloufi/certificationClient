import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormArray, FormBuilder, FormControlStatus, FormGroup, ValidatorFn, Validators} from "@angular/forms";
import {Question} from "../../models/Question";
import {AnswerValidity} from "../../enums/AnswerValidity";
import {ActivatedRoute, Router} from "@angular/router";
import {catchError, map, Observable, of, startWith} from "rxjs";
import {AppState} from "../../models/AppState";
import {CustomResponse} from "../../models/CustomResponse";
import {DataState} from "../../enums/DataState";
import {ExamService} from "../services/exam.service";
import {SkillsMeasured} from "../../models/SkillsMeasured";
import {Answer} from "../../models/Answer";
import {NotificationService} from "../services/notification.service";


@Component({
  selector: 'app-question-form',
  templateUrl: './question-form.component.html',
  styleUrls: ['./question-form.component.css']
})
export class QuestionFormComponent implements OnInit {
  @Input() page;
  @Output() formChanged = new EventEmitter<Boolean>();
  @Output() formUpdated = new EventEmitter<Boolean>();
  appState$ :  Observable<AppState<CustomResponse<Question>>>;
  readonly DataState = DataState;
  questionFormGroup: FormGroup;
  question : Question;
  skillsMeasuredList : SkillsMeasured[];
  certificationName: string;
  certificationId: number;

  constructor(private fb: FormBuilder,
              private route: ActivatedRoute,
              private router: Router,
              private examService: ExamService,
              private notifier: NotificationService) { }

  ngOnInit(): void {

    this.certificationId =+ this.route.snapshot.paramMap.get('id');
    this.certificationName = this.route.snapshot.params['name'];
    if(this.page == "create"){
      this.initialFormGroup(null,
        null,
        [{id: null, answerBody: null, answerValidity: AnswerValidity.INCORRECT}]);
      this.appState$= this.examService.getSkillsMeasuredList$(this.certificationId).pipe(
        map( response => {
          this.skillsMeasuredList = response.data.skillsMeasured;
          this.notifier.onDefault(response.message);
          return {dataState: DataState.LOADED_STATE, appData : response}
        }),
        startWith({dataState: DataState.LOADING_STATE}),
        catchError((err: string) => {
          this.notifier.onError(err);
          return of ({dataState: DataState.ERROR_STATE, error: err})
        })
      );
    }else {
      const questionId =+ this.route.snapshot.paramMap.get('questionId');
      this.getQuestionById(questionId);
    }

  }
  getQuestionById(id : number){
    this.appState$= of ({dataState: DataState.LOADING_STATE});
    this.examService.getSkillsMeasuredList$(this.certificationId).subscribe({
      next : rsp => {
        this.skillsMeasuredList = rsp.data.skillsMeasured;
        this.appState$ = this.examService.getQuestionById$(id).pipe(
          map( response => {
            this.initialFormGroup(response.data.question.questionHeader,
              response.data.question.skillMeasured,
              response.data.question.answers);
            setTimeout(()=>{
              this.initialTextarea();
            }, 2);
            this.question = response.data.question;
            this.notifier.onDefault(response.message);
            return {dataState: DataState.LOADED_STATE, appData: response};
          }),
          startWith({dataState: DataState.LOADING_STATE}),
          catchError((err: string) => {
            this.notifier.onError(err);
            return of ({dataState: DataState.ERROR_STATE, error: err})
          })
        );
      }
    })

  }
  onSubmit(){
    if(this.page == "create"){
      this.onCreate();
    }else {
      this.onUpdate();
    }
  }
  onCreate() {
    let question = this.questionFormGroup.value as Question;
    question.answers = question.answers.map(anr => {
      anr.answerValidity = anr.answerValidity? AnswerValidity.CORRECT : AnswerValidity.INCORRECT;
      return anr;
    });
    console.log(question)
    this.appState$ = this.examService.createQuestion$(question).pipe(
      map(response => {
        this.router.navigateByUrl(`/display-certification/${this.certificationName}/${this.certificationId}`);
        this.notifier.onSuccess(response.message);
        return { dataState : DataState.LOADED_STATE}}
      ),
      startWith({dataState: DataState.LOADING_STATE}),
      catchError( err => {
        this.notifier.onError(err);
        return of ({dataState: DataState.ERROR_STATE, error: err})
      })
    );
  }
  onUpdate() {
    let question = this.questionFormGroup.value as Question;
    question.id = this.question.id;
    question.createAt = this.question.createAt;
    question.answers = question.answers.map(anr => {
      anr.answerValidity = anr.answerValidity? AnswerValidity.CORRECT : AnswerValidity.INCORRECT;
      return anr;
    });

    this.appState$ = this.examService.updateQuestion$(question.id, question).pipe(
      map(response => {
        this.notifier.onInfo(response.message);
        setTimeout(()=>{
          this.initialTextarea();
        }, 2);

        this.onFormUpdated(true);
        return { dataState : DataState.LOADED_STATE}}
      ),
      startWith({dataState: DataState.LOADING_STATE}),
      catchError( err => {
        this.notifier.onError(err);
        return of ({dataState: DataState.ERROR_STATE, error: err})
      })
    );
  }
  initialFormGroup(questionHeader : string,
                   skillMeasured : SkillsMeasured,
                   answers : Answer[]){
    this.questionFormGroup= this.fb.group({
      questionHeader: this.fb.control(questionHeader,
        [Validators.required, Validators.minLength(5)]),
      skillMeasured : this.fb.control(skillMeasured,
        [Validators.required]),
      answers: this.fb.array(answers
          .map(answer => this.newAnswer(answer.answerBody, answer.answerValidity)),
        {validators: [this.answersListLengthValidator(), this.nbCorrectAnswersValidator()]})
    });
    this.questionFormGroup.statusChanges
      .subscribe(status => {
        //console.log('Form status changed:', status);
        this.onFormUpdated(false);
        this.onFormChanged();
      });
  }
  initialTextarea(){
    var textareas = document.getElementsByTagName("textarea");
    for(let i=0; i< textareas.length; i++){
      textareas[i].style.height = "auto";
      textareas[i].style.height = textareas[i].scrollHeight + "px";
    }
  }
  nbCorrectAnswersValidator(): ValidatorFn{
    return (formArray: FormArray) : { [key: string]: any} | null => {
      const numberOfCorrectAnswers= formArray.controls.filter(answer => answer.value.answerValidity).length;
      return numberOfCorrectAnswers >= 1 ? null : {minAnswerNumber: true}
    }
  }
  answersListLengthValidator(): ValidatorFn{
    return (formArray: FormArray) : { [key: string]: any } | null => {
      return formArray.controls.length >= 2 ?  null: {minLengthList: true};
    }
  }
  checkAnswer(checkInput: HTMLInputElement, answer: HTMLDivElement) {
    if (checkInput.checked){
      answer.setAttribute("class", "answer answer-correct row  my-3")
    }else{
      answer.setAttribute("class", "answer answer-incorrect row  my-3")
    }
  }

  get answers(): FormArray{
    return this.questionFormGroup.get("answers") as FormArray;
  }
  private newAnswer(answerBody: string, answerValidity: AnswerValidity) {
    return this.fb.group({
      answerBody: this.fb.control(answerBody,
        [Validators.required, Validators.minLength(2)]),
      answerValidity: this.fb.control(answerValidity == AnswerValidity.CORRECT)
    });
  }
  addAnswer(){
    this.answers.push(this.newAnswer(null, AnswerValidity.INCORRECT));
    setTimeout(()=> {
      window.scrollTo(0, window.outerHeight);
      this.onFormChanged();
    }, 10);

  }
  removeAnswer(i : number){
    this.answers.removeAt(i);
    this.onFormChanged();
  }
  getFormGroup(i : number): FormGroup{
    return this.answers.at(i) as FormGroup;
  }


  onFormChanged() {
    this.formChanged.emit(this.questionFormGroup.valid);
  }
  onFormUpdated(isUpdated){
    this.formUpdated.emit(isUpdated);
  }
}
