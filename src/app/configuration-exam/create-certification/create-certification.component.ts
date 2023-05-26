import {Component, OnInit} from '@angular/core';
import {Exam} from "../../models/Exam";


@Component({
  selector: 'app-create-certification',
  templateUrl: './create-certification.component.html',
  styleUrls: ['./create-certification.component.css']
})
export class CreateCertificationComponent implements OnInit{
  exam: Exam;
  ngOnInit(): void {
    this.exam= {id: null,
      logoUrl: '../../../assets/images/default-img.jpg',
      certificationName:null,
      createAt: null,
      timeLimit: null,
      nbQuestion: null,
      description: null,
      skillsMeasuredList: [],
      availability:null };
  }

}
