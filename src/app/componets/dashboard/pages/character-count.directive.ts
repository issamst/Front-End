import { Directive, ElementRef, Input, HostListener } from '@angular/core';

@Directive({
  selector: '[appCharacterCount]'
})
export class CharacterCountDirective {
  @Input('countId') countId!: string;

  constructor(private el: ElementRef) { }

  @HostListener('input', ['$event.target'])
  onInput(textarea: HTMLTextAreaElement): void {
    const characterCount = textarea.value.length;
    const currentCountElement = document.getElementById(this.countId);
    if (currentCountElement) {
      currentCountElement.textContent = characterCount.toString();
    }
  }
}
