import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-image-overlay',
  imports: [],
  templateUrl: './image-overlay.component.html',
  styleUrl: './image-overlay.component.css',
})
export class ImageOverlay {
  @Input() ImageUrl!: string;
  @Input() alt!: string;

  @Output() onClose = new EventEmitter<Event>();

  Close(event: Event): void {
    this.onClose.emit(event);
  }
}
