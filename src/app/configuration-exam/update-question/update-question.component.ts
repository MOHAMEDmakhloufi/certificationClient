import {Component, OnInit} from '@angular/core';
import {FormBuilder} from "@angular/forms";

import {ActivatedRoute, Router} from "@angular/router";
import {catchError, map, Observable, of, startWith, Subject} from "rxjs";

import {CustomResponse} from "../../models/CustomResponse";

import {ExamService} from "../services/exam.service";
import {Exam} from "../../models/Exam";


@Component({
  selector: 'app-update-question',
  templateUrl:'./update-question.component.html',
  styleUrls: ['./update-question.component.css']
})
export class UpdateQuestionComponent implements OnInit {
  questionId : number;
  formValidator= new Subject<Boolean>();
  formValidator$ = this.formValidator.asObservable();
  formUpdated= true;
  certificationId: number;
  certificationName: string;
  hasNext$ : Observable<CustomResponse<Number>>;
  hasPrevious$ : Observable<CustomResponse<Number>>;
  showConfirmation: boolean;
  constructor(private fb: FormBuilder,
              private route: ActivatedRoute,
              private examService: ExamService,
              private router: Router) { }

  ngOnInit(): void {
    this.certificationId =+ this.route.snapshot.paramMap.get('id');
    this.certificationName = this.route.snapshot.paramMap.get('name');
    this.questionId =+ this.route.snapshot.paramMap.get('questionId');
    this.hasNext$ = this.examService.hasNext$(this.certificationId, this.questionId);
    this.hasPrevious$ = this.examService.hasPrevious$(this.certificationId, this.questionId);

  }

  onFormChanged($event: Boolean) {
    this.formValidator.next($event);
  }

  onFormUpdated($event: Boolean) {
    this.formUpdated= $event.valueOf();
  }

  confirm(hasId: Number): void {
    if(hasId == -1)
      this.router.navigateByUrl(`/display-certification/${this.certificationName}/${this.certificationId}/display-question/${this.questionId}`);
    else
      this.router.navigateByUrl(`/display-certification/${this.certificationName}/${this.certificationId}/edit-question/${hasId}`);

    this.showConfirmation = false;
  }

  cancel(): void {
    this.showConfirmation = false;
  }

  otherQuestionHandler(hasId: Number) {
    if(this.formUpdated)
      this.router.navigateByUrl(`/display-certification/${this.certificationName}/${this.certificationId}/edit-question/${hasId}`);
    else
      this.showConfirmation = true;
  }

  displayQuestion() {
    if(this.formUpdated)
      this.router.navigateByUrl(`/display-certification/${this.certificationName}/${this.certificationId}/display-question/${this.questionId}`);
    else
      this.showConfirmation = true;
  }
}
