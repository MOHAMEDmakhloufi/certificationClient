import {Component, OnInit} from '@angular/core';

@Component({
  selector: 'app-root',
  template: `
    <a href="/certifications"> testing</a>
    <router-outlet></router-outlet>
    <notifier-container></notifier-container>
  `,
  styles: []
})
export class AppComponent implements OnInit{

  ngOnInit(): void {

  }
}
