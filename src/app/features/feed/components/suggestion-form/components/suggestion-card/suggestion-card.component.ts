import { Component, EventEmitter, Input, Output } from '@angular/core';
import { SuggestedUser } from '../../../../../../core/models/user/suggested-user.model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-suggestion-card',
  imports: [CommonModule],
  templateUrl: './suggestion-card.component.html',
  styleUrl: './suggestion-card.component.css',
})
export class SuggestionCard {
  @Input() FollowingState: 'not-following' | 'following' | 'followed' = 'not-following';
  @Input() suggestedUser!: SuggestedUser;
  @Output() follow = new EventEmitter<string>();

  onImageError(event: Event): void {
    const img = event.target as HTMLImageElement;
    img.src = './images/default-profile.png';
  }
  followUser(): void {
    this.follow.emit(this.suggestedUser._id);
  }
}
