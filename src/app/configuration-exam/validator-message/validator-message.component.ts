import {Component, Input, OnInit} from '@angular/core';
import {FormGroup} from "@angular/forms";

@Component({
  selector: 'app-validator-message',
  templateUrl: './validator-message.component.html',
  styleUrls: ['./validator-message.component.css']
})
export class ValidatorMessageComponent implements OnInit {
  @Input() fg: FormGroup;
  @Input() fcn: string;
  @Input() vld: string;
  @Input() msg: string;
  constructor() { }

  ngOnInit(): void {
  }

}
