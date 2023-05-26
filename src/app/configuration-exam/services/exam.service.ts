import { Injectable } from '@angular/core';
import {HttpClient, HttpErrorResponse} from "@angular/common/http";
import {catchError, delay, Observable, tap, throwError} from "rxjs";
import {CustomResponse} from "../../models/CustomResponse";
import {Exam} from "../../models/Exam";
import {Question} from "../../models/Question";
import {SkillsMeasured} from "../../models/SkillsMeasured";

@Injectable()
export class ExamService {
  private readonly apiUrl = 'http://localhost:3000';
  constructor(private http:HttpClient) { }
  // certification/list
  certifications$= <Observable<CustomResponse<Exam>>>
      this.http.get<CustomResponse<Exam>>(this.apiUrl+"/CustomResponse").pipe(
          delay(1000),
          tap(console.log),
          catchError(this.handleError)
      );

  //
  deleteCertification$ =(id: number) => <Observable<CustomResponse<boolean>>>
    this.http.delete<CustomResponse<boolean>>(this.apiUrl+`/examsDeleted/${id}`).pipe(
      delay(1000),
      tap(console.log),
      catchError(this.handleError)
    );
  // certification/create
  saveCertification$ = (examData: FormData) => <Observable<CustomResponse<Exam>>>
    this.http.post<CustomResponse<Exam>>(`${this.apiUrl}/exams`, examData).pipe(
      delay(1000),
      tap(console.log),
      catchError(this.handleError)
    );
  // certification/update
  updateCertification$ = (examData: FormData) => <Observable<CustomResponse<Exam>>>
    this.http.put<CustomResponse<Exam>>(`${this.apiUrl}/exams`, examData).pipe(
      delay(1000),
      tap(console.log),
      catchError(this.handleError)
    );
  // certification/{{id}}
  getCertification$ = (id: number) =>  <Observable<CustomResponse<Exam>>>
    this.http.get<CustomResponse<Exam>>(`${this.apiUrl}/examUpdate`).pipe(
      delay(1000),
      tap(console.log),
      catchError(this.handleError)
    );
  //certification/{{id}}/questions
  getCertificationQuestions$ = (id: number) =>  <Observable<CustomResponse<Exam>>>
    this.http.get<CustomResponse<Exam>>(`${this.apiUrl}/exam`).pipe(
      delay(1000),
      tap(console.log),
      catchError(this.handleError)
    );
  //certification/{{id}}/question/{{qId}}
  getQuestionById$ = (qId: number) =>  <Observable<CustomResponse<Question>>>
    this.http.get<CustomResponse<Question>>(`${this.apiUrl}/question`).pipe(
      delay(1000),
      tap(console.log),
      catchError(this.handleError)
    );
  //certification/{{id}}/question/{{qId}}
  updateQuestion$ = (qId: number, question: Question) =>  <Observable<CustomResponse<Question>>>
    this.http.put<CustomResponse<Question>>(`${this.apiUrl}/questions/${qId}`, question).pipe(
      delay(1000),
      tap(console.log),
      catchError(this.handleError)
    );
  //certification/{{id}}/skillsMeasured
  getSkillsMeasuredList$ = (id: number) => <Observable<CustomResponse<SkillsMeasured>>>
    this.http.get<CustomResponse<SkillsMeasured>>(`${this.apiUrl}/skillsMeasured`).pipe(
      delay(1000),
      tap(console.log),
      catchError(this.handleError)
    );
  //certification/{{id}}/question/hasNext/{{qId}}
  hasNext$ = (certificationId: number, questionId: number) => <Observable<CustomResponse<Number>>>
    this.http.get<CustomResponse<Number>>(`${this.apiUrl}/hasNext`).pipe(
      delay(1000),
      tap(console.log),
      catchError(this.handleError)
    );
  //certification/{{id}}/question/hasPrevious/{{qId}}
  hasPrevious$ = (certificationId: number, questionId: number) => <Observable<CustomResponse<Number>>>
    this.http.get<CustomResponse<Number>>(`${this.apiUrl}/hasPrevious`).pipe(
      delay(1000),
      tap(console.log),
      catchError(this.handleError)
    );
  //certification/{{id}}/question/create
  createQuestion$ = (question : Question) => <Observable<CustomResponse<Question>>>
    this.http.post<CustomResponse<Question>>(`${this.apiUrl}/questions`, question).pipe(
      delay(1000),
      tap(console.log),
      catchError(this.handleError)
  );

  deleteQuestions$ =(ids: number[]) =><Observable<CustomResponse<boolean>>>
    this.http.delete<CustomResponse<boolean>>(`${this.apiUrl}/deleteQuestions`, { body: ids }).pipe(
      delay(1000),
      tap(console.log),
      catchError(this.handleError)
    );
  handleError(error: HttpErrorResponse): Observable<never>{
    console.log(error)
    return throwError(`An error occurred - Error code: ${error.status}` );
  }


}
