import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {RouterModule, Routes} from "@angular/router";
import { CertificationsComponent } from './certifications/certifications.component';
import { NavbarComponent } from './navbar/navbar.component';
import { CreateCertificationComponent } from './create-certification/create-certification.component';
import {ExamService} from "./services/exam.service";
import {LoadingBarComponent} from "./loading-bar/loading-bar.component";
import { DisplayCertificationComponent } from './display-certification/display-certification.component';
import { CertificationFormComponent } from './certification-form/certification-form.component';
import { EditCertificationComponent } from './edit-certification/edit-certification.component';
import {ReactiveFormsModule} from "@angular/forms";
import { ValidatorMessageComponent } from './validator-message/validator-message.component';
import { QuestionFormComponent } from './question-form/question-form.component';
import { CreateQuestionComponent } from './create-question/create-question.component';
import { UpdateQuestionComponent } from './update-question/update-question.component';
import { DisplayQuestionComponent } from './display-question/display-question.component';
import { OffcanvasComponent } from './offcanvas/offcanvas.component';
import { TextareaDirective } from './directives/textarea.directive';
import { ExamNavbarComponent } from './exam-navbar/exam-navbar.component';
import { ImageLoadingDirective } from './directives/image-loading.directive';
import { ConfirmDialogComponent } from './confirm-dialog/confirm-dialog.component';
import {NotificationModule} from "./notification.module";
import {NotificationService} from "./services/notification.service";





const routes : Routes =[
  {path: 'certifications', component: CertificationsComponent},
  {path: 'create-certification', component: CreateCertificationComponent},
  {path: 'edit-certification/:id', component: EditCertificationComponent},
  {path: 'display-certification/:name/:id', component: DisplayCertificationComponent},
  {path: 'display-certification/:name/:id/edit-question/:questionId', component: UpdateQuestionComponent},
  {path: 'display-certification/:name/:id/create-question', component: CreateQuestionComponent},
  {path: 'display-certification/:name/:id/display-question/:questionId', component: DisplayQuestionComponent}
]

@NgModule({
  declarations: [
    CertificationsComponent,
    NavbarComponent,
    CreateCertificationComponent,
    LoadingBarComponent,
    DisplayCertificationComponent,
    CertificationFormComponent,
    EditCertificationComponent,
    ValidatorMessageComponent,
    QuestionFormComponent,
    CreateQuestionComponent,
    UpdateQuestionComponent,
    DisplayQuestionComponent,
    OffcanvasComponent,
    TextareaDirective,
    ExamNavbarComponent,
    ImageLoadingDirective,
    ConfirmDialogComponent
  ],
  imports: [
    RouterModule.forChild(routes),
    CommonModule,
    ReactiveFormsModule,
    NotificationModule
  ],
  providers: [ExamService,
  NotificationService]
})
export class ConfigurationExamModule { }
