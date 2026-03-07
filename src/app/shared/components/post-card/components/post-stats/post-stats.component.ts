import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-post-stats',
  imports: [],
  templateUrl: './post-stats.component.html',
  styleUrl: './post-stats.component.css',
})
export class PostStats {
  @Input() likesCount: number = 0;
  @Input() commentsCount: number = 0;
  @Input() sharesCount: number = 0;

  @Output() openDetaliedPostView = new EventEmitter<void>();

  onOpenDetailedPostView(): void {
    this.openDetaliedPostView.emit();
  }
}
