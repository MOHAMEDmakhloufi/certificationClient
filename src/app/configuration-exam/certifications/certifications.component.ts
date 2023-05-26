import {Component, OnInit} from '@angular/core';
import {BehaviorSubject, catchError, map, Observable, of, startWith} from "rxjs";
import {AppState} from "../../models/AppState";
import {CustomResponse} from "../../models/CustomResponse";
import {AvailabilityStatus} from "../../enums/Availability";
import {DataState} from "../../enums/DataState";
import {ExamService} from "../services/exam.service";
import {Exam} from "../../models/Exam";
import {NotificationService} from "../services/notification.service";



@Component({
  selector: 'app-certifications',
  templateUrl: 'certifications.component.html',
  styleUrls: ['./certifications.component.css']
})
export class CertificationsComponent implements OnInit{
  appState$: Observable<AppState<CustomResponse<Exam>>>;
  private dataSubject = new BehaviorSubject<CustomResponse<Exam>>(null);
  readonly DataState = DataState  ;
  readonly Status = AvailabilityStatus;

  constructor(private examService: ExamService,
              private notifier : NotificationService) {}

  ngOnInit(): void {

    this.appState$= this.examService.certifications$
        .pipe(
          map(response =>{
            this.dataSubject.next(response);
            this.notifier.onDefault(response.message);
            return {dataState : DataState.LOADED_STATE,
                    appData: {...response, data:{exams: response.data.exams.reverse()}}}
          }),
          startWith({dataState : DataState.LOADING_STATE}),
          catchError((err : string)=>{
            this.notifier.onError(err);
            return of({dataState : DataState.ERROR_STATE, error: err})
          })
        );
  }
  deleteCertification(exam: Exam){
    exam.showConfirmation = true;
  }
  confirmDelete(exam: Exam): void {
    this.appState$= this.examService.deleteCertification$(exam.id).pipe(
      map(response =>{
        this.dataSubject.next({
          ...response, data: {exams: this.dataSubject.value.data.exams.filter(e => e.id !== exam.id)}
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
    exam.showConfirmation = false;
  }

  cancelDelete(exam: Exam): void {
    exam.showConfirmation = false;
  }

}
