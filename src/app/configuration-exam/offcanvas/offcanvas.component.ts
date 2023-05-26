import { Component, OnInit } from '@angular/core';
import {catchError, map, Observable, of, startWith} from "rxjs";
import {AppState} from "../../models/AppState";
import {CustomResponse} from "../../models/CustomResponse";
import {Exam} from "../../models/Exam";
import {ExamService} from "../services/exam.service";
import {DataState} from "../../enums/DataState";


@Component({
  selector: 'app-offcanvas',
  templateUrl: './offcanvas.component.html',
  styleUrls: ['./offcanvas.component.css']
})
export class OffcanvasComponent implements OnInit {
  appState$: Observable<AppState<CustomResponse<Exam>>>;
  readonly DataState = DataState  ;
  constructor(private examService: ExamService) { }

  ngOnInit(): void {
    this.appState$= this.examService.certifications$
      .pipe(
        map(response =>{
          return {dataState : DataState.LOADED_STATE,
            appData: {...response, data:{exams: response.data.exams.reverse()}}}
        }),
        startWith({dataState : DataState.LOADING_STATE}),
        catchError((err : string)=>{
          return of({dataState : DataState.ERROR_STATE, error: err})
        })
      );
  }

}
