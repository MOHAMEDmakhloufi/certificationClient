import {Directive, ElementRef} from '@angular/core';

@Directive({
  selector: '[appImageLoading]'
})
export class ImageLoadingDirective {
  constructor(private elementRef: ElementRef) {
    const img = this.elementRef.nativeElement as HTMLImageElement;

    img.addEventListener('load', () => {
      this.hideLoadingIcon();
    });

    img.addEventListener('error', () => {
      this.hideLoadingIcon();
      // Optionally, set a default image here
    });
  }

  private hideLoadingIcon() {
    const img = this.elementRef.nativeElement as HTMLImageElement;
    const loadingIcon = img.previousElementSibling as HTMLDivElement;
    if (loadingIcon && loadingIcon.classList.contains('loading-icon')) {
      loadingIcon.style.display = 'none ';
    }
  }

}
