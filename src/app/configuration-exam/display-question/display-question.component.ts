import {Component, Input, OnInit} from '@angular/core';
import {Question} from "../../models/Question";
import {ActivatedRoute} from "@angular/router";
import {catchError, map, Observable, of, startWith} from "rxjs";
import {AppState} from "../../models/AppState";
import {CustomResponse} from "../../models/CustomResponse";
import {DataState} from "../../enums/DataState";
import {ExamService} from "../services/exam.service";
import {AnswerValidity} from "../../enums/AnswerValidity";
import {NotificationService} from "../services/notification.service";


@Component({
  selector: 'app-display-question',
  templateUrl:'./display-question.component.html',
  styleUrls: ['./display-question.component.css']
})
export class DisplayQuestionComponent implements OnInit {
  @Input() page;
  appState$ :  Observable<AppState<CustomResponse<Question>>>;
  readonly DataState = DataState;
  readonly AnswerValidity = AnswerValidity;
  question : Question;
  certificationId: number;
  certificationName: string
  hasNext$ : Observable<CustomResponse<Number>>;
  hasPrevious$ : Observable<CustomResponse<Number>>;
  constructor(private route: ActivatedRoute,
              private examService: ExamService,
              private notifier: NotificationService) { }

  ngOnInit(): void {
    this.certificationName = this.route.snapshot.params['name'];
    this.certificationId =+ this.route.snapshot.paramMap.get('id');
    const questionId =+ this.route.snapshot.paramMap.get('questionId');
    this.hasNext$ = this.examService.hasNext$(this.certificationId, questionId);
    this.hasPrevious$ = this.examService.hasPrevious$(this.certificationId, questionId);

    this.getQuestionById(questionId);
  }
  getQuestionById(id : number){

    this.appState$ = this.examService.getQuestionById$(id).pipe(
      map( response => {
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

}
