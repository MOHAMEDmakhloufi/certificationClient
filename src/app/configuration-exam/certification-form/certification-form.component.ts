import {Component, Input, OnInit} from '@angular/core';
import {Exam} from "../../models/Exam";
import {FormArray, FormBuilder, FormGroup, ValidatorFn, Validators} from "@angular/forms";
import {BehaviorSubject} from "rxjs";
import {ExamService} from "../services/exam.service";
import {Router} from "@angular/router";
import {NotificationService} from "../services/notification.service";


@Component({
  selector: 'app-certification-form',
  templateUrl: './certification-form.component.html',
  styleUrls: ['./certification-form.component.css']
})
export class CertificationFormComponent implements OnInit {

  @Input() exam : Exam;
  examFormGroup: FormGroup;
  selectedFile: File;
  imageSrc: string;
  isLoading= new BehaviorSubject<boolean>(false);
  isLoading$= this.isLoading.asObservable();
  createForm : boolean;
  constructor(private fb: FormBuilder,
              private examService: ExamService,
              private notifier : NotificationService,
              private route: Router) { }

  ngOnInit(): void {
    this.createForm= this.route.url.includes("create-certification");
    this.examFormGroup = this.fb.group({
      logo : this.fb.control( this.exam.logo,
        this.createForm?[Validators.required]: null),
      certificationName : this.fb.control( this.exam.certificationName,
        [Validators.required, Validators.minLength(3)]),
      timeLimit : this.fb.control( this.exam.timeLimit,
        [Validators.required, Validators.min(5)]),
      nbQuestion : this.fb.control( this.exam.nbQuestion,
        [Validators.required, Validators.min(1)]),
      description : this.fb.control( this.exam.description,
        [Validators.maxLength(100)]),
      skillsMeasuredList : this.fb.array(this.exam.skillsMeasuredList
        .map(skill => this.newSkill(skill.skillName, skill.percent)),
        { validators: [this.sumPercentValidator()] })
    });


  }
  get skills() : FormArray {
    return this.examFormGroup.get("skillsMeasuredList") as FormArray
  }
  getFormGroup(i : number): FormGroup{
    return this.skills.at(i) as FormGroup;
  }
  newSkill(skillName: string, percent: number): FormGroup{
    return this.fb.group({
      skillName : this.fb.control( skillName,
        [Validators.required, Validators.minLength(3)]),
      percent : this.fb.control( percent,
        [Validators.required, Validators.min(0), Validators.max(100)])
    })
  }
  onFileSelected(event) {
    this.selectedFile = event.target.files[0];

    if (this.selectedFile) {
      // Read the contents of the selected file
      const reader = new FileReader();
      reader.readAsDataURL(this.selectedFile);

      // Set the image source to the data URL created by the FileReader
      reader.onload = () => {
        this.imageSrc = reader.result as string;
      };
    }
  }
  sumPercentValidator(): ValidatorFn {
    return (formArray: FormArray): { [key: string]: any } | null => {
      const sum = formArray.controls.reduce((acc, control) => {
        return acc + parseInt(control.get('percent').value || '0', 10);
      }, 0);
      return (sum === 100 || formArray.length==0) ? null : { sumPercent: true };
    };
  }
  addSkill(){
    this.skills.push(this.newSkill(null, null));
    setTimeout(()=> window.scrollTo(0, window.outerHeight), 10);
  }
  removeSkill(i : number){
    this.skills.removeAt(i);
  }

  onSubmit() {
    console.log(this.examFormGroup.value);
    this.isLoading.next(true);
    const examValue = this.examFormGroup.value as Exam;
    this.exam = {...examValue, id: this.exam.id};
    const formData = new FormData();
    formData.append('exam', JSON.stringify(this.exam));
    formData.append('logo', this.selectedFile);
    if(this.createForm)
      this.examService.saveCertification$(formData).subscribe({
        next : response =>  {
          this.isLoading.next(false);
          this.route.navigateByUrl(`/display-certification/${response.data.exam.certificationName}/${response.data.exam.id}`);
          this.notifier.onSuccess(response.message);
        },
        complete : ()=> {
          this.examFormGroup.reset();
        },
        error: err => {
          this.notifier.onError(err);
          this.isLoading.next(false);
          alert(err);
        }
      });
    else
      this.examService.updateCertification$(formData).subscribe({
        next : response =>  {
          this.isLoading.next(false);
          this.route.navigateByUrl(`/display-certification/${response.data.exam.certificationName}/${response.data.exam.id}`);
          this.notifier.onInfo(response.message);
        },
        complete : ()=> {
          this.examFormGroup.reset();
        },
        error: err => {
          this.notifier.onError(err);
          this.isLoading.next(false);
          alert(err);
        }
      });

  }
}
