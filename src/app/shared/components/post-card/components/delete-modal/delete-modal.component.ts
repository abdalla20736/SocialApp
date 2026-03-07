import { Component, EventEmitter, HostListener, Input, Output } from '@angular/core';

@Component({
  selector: 'app-delete-modal',
  imports: [],
  templateUrl: './delete-modal.component.html',
  styleUrl: './delete-modal.component.css',
})
export class DeleteModal {
  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    const container = event.target as HTMLElement;
    if (container instanceof HTMLElement && container.classList.contains('modal-overlay')) {
      this.onCancel();
    }
  }

  @Input() isDisabled: boolean = false;
  @Input() deletedItemName!: string;
  @Input() title!: string;
  @Input() message!: string;

  @Output()
  confirm = new EventEmitter<void>();
  @Output() cancel = new EventEmitter<void>();

  onConfirm(): void {
    if (this.isDisabled) {
      return;
    }
    this.confirm.emit();
  }

  onCancel(): void {
    if (this.isDisabled) {
      return;
    }
    this.cancel.emit();
  }
}
