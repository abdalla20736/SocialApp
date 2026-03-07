import {
  Component,
  EventEmitter,
  Input,
  Output,
  OnChanges,
  SimpleChanges,
  inject,
} from '@angular/core';
import { Comment } from '../../../../../../../../core/models/comments/comment.model';
import { EditForm } from '../../../../edit-form/edit-form.component';
import { CommentActions } from '../components/comment-actions/comment-actions.component';
import { Post } from '../../../../../../../../core/models/posts/post.model';
import { DatePipe } from '@angular/common';
import { TimeagoModule } from 'ngx-timeago';
import { FormsModule } from '@angular/forms';
import { Reply } from '../../../../../../../../core/models/replies/reply.model';
import { ReplyService } from '../../../../../../../../core/services/reply.service';
import { ReplyContainer } from '../../reply-container/reply-container.component';
import { finalize } from 'rxjs';


@Component({
  selector: 'app-comment-card',
  imports: [DatePipe, TimeagoModule, CommentActions, FormsModule, EditForm, ReplyContainer],
  templateUrl: './comment-card.component.html',
  styleUrl: './comment-card.component.css',
})
export class CommentCard {
  private readonly replyService: ReplyService = inject(ReplyService);
  _replies: Reply[] = [];

  @Input() id!: string;
  @Input() commenterPhotoUrl!: string;
  @Input() commenterName!: string;
  @Input() commenterUsername?: string;
  @Input() commentCreatorId!: string;
  @Input() likes!: string[];
  @Input() content!: string;
  @Input() image?: string;
  @Input() createdAt!: string;
  @Input() repliesCount!: number;
  @Input() post!: Post;
  @Input() isLoadingCommentLike!: boolean;
  @Input() isUpdatingComment!: boolean;
  @Input() isReply: boolean = false;

  @Output() likeComment = new EventEmitter<string>();
  @Output() replyToComment = new EventEmitter<string>();
  @Output() deleteComment = new EventEmitter<string>();
  @Output() update = new EventEmitter<{ id: string; content: string }>();
  @Output() deleteReply = new EventEmitter<string>();
  @Output() updateReply = new EventEmitter<{ id: string; content: string }>();

  isEditMode: boolean = false;
  isShowReplyForm: boolean = false;
  isLoadingReplies: boolean = false;


  isOlderThanTwoDays(): boolean {
    if (!this.createdAt) return false;
    const commentDate = new Date(this.createdAt);
    const now = new Date();
    const diffInMs = now.getTime() - commentDate.getTime();
    const TwoDayInMs = 48 * 60 * 60 * 1000;
    return diffInMs >= TwoDayInMs;
  }

  onImageError(): void {
    this.commenterPhotoUrl = 'images/default-profile.png';
  }

  onLikeComment(): void {
    this.likeComment.emit(this.id);
  }

  toggleReplyForm(): void {
    this.isShowReplyForm = !this.isShowReplyForm;
    if (this.isShowReplyForm && this._replies.length === 0) {
      this.loadReplies();
    }
  }

  onDeleteComment(): void {
    this.deleteComment.emit(this.id);
  }

  onEditMode(): void {
    this.isEditMode = true;
  }
  onCancelEdit(): void {
    this.isEditMode = false;
  }
  onUpdate(payload: { id: string; content: string }): void {
    this.update.emit(payload);
  }

  loadReplies(): void {
    this.isLoadingReplies = true;
    this.replyService
      .getAllRepliesByCommentId(this.post._id, this.id)
      .pipe(finalize(() => (this.isLoadingReplies = false)))
      .subscribe({
        next: (replies) => {
          this._replies = replies;
        },
        error: (err) => {
          console.error('Failed to load replies:', err);
          this._replies = [];
        },
      });
  }

  onUpdateReply(payload: { id: string; content: string }): void {
    this.updateReply.emit(payload);
  }

  onDeleteReply(replyId: string): void {
    this.deleteReply.emit(replyId);
  }
}
