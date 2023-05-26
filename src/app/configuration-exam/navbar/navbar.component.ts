import {Component, OnInit} from '@angular/core';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit{


  constructor() {}

  ngOnInit(): void {
    this.onScroll();

  }
  onScroll(){
    const navbar = document.querySelector('.root');

    window.addEventListener('scroll', () => {
      if (window.scrollY > 0) {
        navbar.classList.add('shadow-sm');
      } else {
        navbar.classList.remove('shadow-sm');
      }
    });
  }

}
