import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {ExamService} from "../services/exam.service";
import {catchError, map, Observable, of, startWith} from "rxjs";
import {AppState} from "../../models/AppState";
import {CustomResponse} from "../../models/CustomResponse";
import {Exam} from "../../models/Exam";
import {DataState} from "../../enums/DataState";
import {NotificationService} from "../services/notification.service";

@Component({
  selector: 'app-edit-certification',
  templateUrl: './edit-certification.component.html',
  styleUrls: ['./edit-certification.component.css']
})
export class EditCertificationComponent implements OnInit {
  appState$: Observable<AppState<CustomResponse<Exam>>>;
  readonly DataState = DataState  ;
  constructor(private route: ActivatedRoute,
              private examService: ExamService,
              private notifier: NotificationService) { }

  ngOnInit(): void {
    this.getExamById();
  }
  getExamById(){
    const examId= this.route.snapshot.paramMap.get('id');
    if (examId!=null){
      this.appState$=this.examService.getCertification$(+examId).pipe(
        map(response => {
          this.notifier.onDefault(response.message);
          return {dataState : DataState.LOADED_STATE, appData: response}
        }),
        startWith({dataState: DataState.LOADING_STATE}),
        catchError((err : string) => {
          this.notifier.onError(err);
          return of({dataState: DataState.ERROR_STATE, error: err})
        })
      );
    }
  }

}
