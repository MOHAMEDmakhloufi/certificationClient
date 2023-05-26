import {Component, Input, OnInit} from '@angular/core';


@Component({
  selector: 'app-exam-navbar',
  templateUrl: './exam-navbar.component.html',
  styleUrls: ['./exam-navbar.component.css']
})
export class ExamNavbarComponent implements OnInit {
  @Input() examName;
  @Input() examId;
  toggle= true;
  constructor() { }

  ngOnInit(): void {
  }
  handlerCenterButton(){
    this.toggle = ! this.toggle;
  }

}
