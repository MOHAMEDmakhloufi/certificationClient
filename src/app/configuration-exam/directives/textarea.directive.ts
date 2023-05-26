import {Directive, ElementRef, HostListener} from '@angular/core';

@Directive({
  selector: '[appTextarea]'
})
export class TextareaDirective {

  constructor(private  el: ElementRef) {
    this.initialTextarea()
  }
  initialTextarea(){
    this.el.nativeElement.addEventListener("input", function() {
        this.style.height = "auto";
        this.style.height = this.scrollHeight + "px";
      });
  }
}
