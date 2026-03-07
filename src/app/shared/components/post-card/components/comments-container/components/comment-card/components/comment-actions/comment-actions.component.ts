import { DatePipe } from '@angular/common';
import { Component, EventEmitter, inject, Input, Output, AfterViewInit } from '@angular/core';
import { TimeagoModule } from 'ngx-timeago';
import { Post } from '../../../../../../../../../core/models/posts/post.model';
import { PostService } from '../../../../../../../../../core/services/post.service';
import { AuthService } from '../../../../../../../../../core/services/auth.service';

@Component({
  selector: 'app-comment-actions',
  imports: [TimeagoModule, DatePipe],
  templateUrl: './comment-actions.component.html',
  styleUrl: './comment-actions.component.css',
})
export class CommentActions {
  private readonly postService: PostService = inject(PostService);
  private readonly authService: AuthService = inject(AuthService);

  @Input() commentId: string = '';
  @Input() commentCreatorId: string = '';
  @Input() likes!: string[];
  @Input() repliesCount?: number = 0;
  @Input() isReply: boolean = false;
  @Input() post!: Post;
  @Input() isLoadingCommentLike!: boolean;
  @Input() createdAt?: string;
  @Input() isOlderThanTwoDays: boolean = false;
  @Input() isShowReplyForm: boolean = false;

  @Output() likeComment = new EventEmitter<void>();
  @Output() replyToComment = new EventEmitter<void>();
  @Output() deleteComment = new EventEmitter<void>();
  @Output() editComment = new EventEmitter<void>();

  selectedDeletePostId = '';
  isEditMode: boolean = false;
  isDropdownOpen: boolean = false;

  toggleDropdown(): void {
    this.isDropdownOpen = !this.isDropdownOpen;
  }
  getRepliesCount(): number {
    return this.repliesCount || 0;
  }

  isLikedByCurrentUser(): boolean {
    const currentUser = this.authService.getCurrentUser();
    return currentUser ? this.likes.includes(currentUser._id) : false;
  }

  isPostOwner(): boolean {
    return this.postService.isPostOwner(this.post!);
  }

  isCommentOwner(): boolean {
    const currentUser = this.authService.getCurrentUser();
    return currentUser ? currentUser._id === this.commentCreatorId : false;
  }

  onEditPost(): void {
    this.editComment.emit();
  }

  onLikeComment(): void {
    this.likeComment.emit();
  }

  onReplyToComment(): void {
    this.replyToComment.emit();
  }

  onDeleteComment(): void {
    this.deleteComment.emit();
  }
}
