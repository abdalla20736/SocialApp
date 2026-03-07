import { ToastrService } from 'ngx-toastr';
import { Component, EventEmitter, inject, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { Post } from '../../../../core/models/posts/post.model';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { TimeagoModule } from 'ngx-timeago';
import { AuthService } from '../../../../core/services/auth.service';
import { User } from '../../../../core/models/auth/user.model';
import { finalize, Observable, Subscription } from 'rxjs';
import { PostService } from '../../../../core/services/post.service';
import { FormsModule } from '@angular/forms';
import { ShareModal } from '../components/share-modal/share-modal.component';
import { CommentsContainer } from '../components/comments-container/comments-container/comments-container.component';
import { PostActions } from '../components/post-actions/post-actions.component';
import { PostStats } from '../components/post-stats/post-stats.component';
import { PostBody } from '../components/post-body/post-body.component';
import { PostHeader } from '../components/post-header/post-header.component';
import { Privacy } from '../../../types/privacy.type';
import { CommentService } from '../../../../core/services/comment.service';
import { Comment } from '../../../../core/models/comments/comment.model';
import { TopComment } from '../components/top-comment/top-comment.component';
import { CommentReplyForm } from '../../../../core/models/comments/comment-reply-form.model';
import { EditForm } from '../components/edit-form/edit-form.component';
import { DeleteModalService } from '../../../../core/services/delete-modal.service';

@Component({
  selector: 'app-post-card',
  imports: [
    CommonModule,
    TimeagoModule,
    FormsModule,
    ShareModal,
    CommentsContainer,
    PostActions,
    PostStats,
    PostBody,
    PostHeader,
    TopComment,
    EditForm,
  ],
  templateUrl: './post-card.component.html',
  styleUrl: './post-card.component.css',
})
export class PostCard implements OnInit, OnDestroy {
  private readonly authService: AuthService = inject(AuthService);
  private readonly postService: PostService = inject(PostService);
  private readonly router: Router = inject(Router);
  private readonly toastrService: ToastrService = inject(ToastrService);
  private readonly commentService: CommentService = inject(CommentService);
  private readonly deleteModalService: DeleteModalService = inject(DeleteModalService);

  @Input() post?: Post;
  @Output() deletePostFromArray: EventEmitter<Post> = new EventEmitter<Post>();
  @Output() addPostToArray: EventEmitter<Post> = new EventEmitter<Post>();

  user: Observable<User | null> = this.authService.currentUser$;

  comments: Comment[] = [];
  isShowedAllComments: boolean = false;
  isLoadingComments: boolean = false;
  isSubmittingComment: boolean = false;
  isUpdatingComment: boolean = false;
  userPhoto: string = '';
  userName: string = '';
  isSavingPost: boolean = false;
  selectedSharePostId: string = '';
  selectedOverlayImageUrl: string = '';
  user$!: Subscription;
  isUpdateingCommentSet: Set<string> = new Set<string>();
  isCommentLikesSet: Set<string> = new Set<string>();
  isEditMode: boolean = false;
  isUpdatingPost: boolean = false;
  isModalConfirmed: boolean = false;

  ngOnInit(): void {
    if (this.post?.user?.photo) {
      this.userPhoto = this.post.user.photo;
      this.userName = this.post.user.name;
    } else {
      this.user$ = this.user.subscribe((user) => {
        if (user) {
          this.userPhoto = user.photo;
          this.userName = user.name;
        }
      });
    }
  }

  isUpdatedCoverPhoto(): boolean {
    return this.post?.body?.includes('updated cover photo') ? true : false;
  }
  isUpdatedProfilePhoto(): boolean {
    return this.post?.body?.includes('updated profile picture.') ? true : false;
  }
  isRegularPost(): boolean {
    return !this.isUpdatedCoverPhoto() && !this.isUpdatedProfilePhoto() ? true : false;
  }

  isPostOwner(): boolean {
    return this.postService.isPostOwner(this.post!);
  }

  isPostSaved(): boolean {
    return this.post?.bookmarked || false;
  }
  isPostLikedByCurrentUser(): boolean {
    const currentUser = this.authService.getCurrentUser();
    return this.post?.likes?.some((likedUserId) => likedUserId === currentUser._id) || false;
  }

  openPost() {
    this.router.navigate(['/post', this.post?._id]);
  }

  expandImage(imgUrl: string) {
    this.selectedOverlayImageUrl = imgUrl;
  }
  closeImageOverlay(event: Event) {
    if (!(event.target instanceof HTMLImageElement) && (this.selectedOverlayImageUrl = '')) {
      this.selectedOverlayImageUrl = '';
    }
  }

  onPrivacyChange(privacy: Privacy = this.post?.privacy!): void {
    if (this.post?._id) {
      this.postService.updatePost(this.post._id, privacy).subscribe({
        next: (updatedPost) => {
          this.post!.privacy = updatedPost.privacy;
        },
        error: (err) => {
          console.error('Failed to update post privacy:', err);
        },
      });
    }
  }

  onAddingPost(post: Post): void {
    this.addPostToArray.emit(post);
  }

  onDeletePost(post: Post): void {
    this.deletePostFromArray.emit(post);
  }

  openEditMode() {
    this.isEditMode = true;
  }
  closeEditMode() {
    this.isEditMode = false;
  }

  openDeleteModal(type: 'post' | 'comment', id: string, action: () => void): void {
    this.deleteModalService.setDeleteModal(type, id, action);
  }

  onConfirmDeletePost = () => {
    this.deletePost();
  };

  onConfirmDeleteComment = (commentId: string) => {
    return () => this.deleteComment(commentId);
  };

  openComments(): void {
    this.isShowedAllComments = !this.isShowedAllComments;
    if (this.isShowedAllComments) {
      this.loadComments();
    }
  }

  openShareModal(): void {
    this.selectedSharePostId = this.post?._id || '';
  }
  closeShareModal() {
    this.selectedSharePostId = '';
  }
  isSharedPost(): boolean {
    return this.post?.isShare || false;
  }

  toggleBookmarkPost(): void {
    this.isSavingPost = true;
    if (this.post?._id) {
      const previousBookmarkState = this.post.bookmarked;
      this.post.bookmarked = !previousBookmarkState;
      this.postService.bookmarkPost(this.post._id).subscribe({
        next: (updatedBookmark) => {
          this.post!.bookmarked = updatedBookmark.bookmarked;
          this.isSavingPost = false;
        },
        error: (err) => {
          console.error('Failed to bookmark post:', err);
          this.post!.bookmarked = previousBookmarkState;
          this.isSavingPost = false;
        },
      });
    }
  }

  toggleLikePost(): void {
    this.isSavingPost = true;
    const previousLikeState = this.isPostLikedByCurrentUser();
    if (this.post?.likes && this.post?.user?._id) {
      const userLikeIndex = this.post.likes.findIndex(
        (likedUserId) => likedUserId === this.post?.user?._id,
      );
      if (userLikeIndex > -1) {
        this.post.likes.splice(userLikeIndex, 1);
        this.post.likesCount--;
      } else {
        this.post.likes.push(this.post.user._id);
        this.post.likesCount++;
      }
    }
    if (this.post?._id) {
      this.postService.likePost(this.post._id).subscribe({
        next: () => {
          this.isSavingPost = false;
        },
        error: (err) => {
          console.error('Failed to like post:', err);
          this.isSavingPost = false;
          if (previousLikeState) {
            if (this.post?.likes && this.post?.user?._id) {
              const userLikeIndex = this.post.likes.findIndex(
                (likedUserId) => likedUserId === this.post?.user?._id,
              );
              if (userLikeIndex > -1) {
                this.post.likes.splice(userLikeIndex, 1);
                this.post.likesCount--;
              } else {
                this.post.likes.push(this.post.user._id);
                this.post.likesCount++;
              }
            } else {
              this.post?.likes.push(this.post?.user?._id || '');
              this.post!.likesCount++;
            }
          }
        },
      });
    }
  }
  closeDeleteModal() {
    this.deleteModalService.closeModal();
  }

  updatePost(payload: { id: string; content: string }): void {
    if (payload.content.trim() === '') {
      this.toastrService.error('Post content cannot be empty', '');
      return;
    }

    this.isUpdatingPost = true;
    this.postService
      .updatePost(payload.id, undefined, payload.content)
      .pipe(finalize(() => (this.isUpdatingPost = false)))
      .subscribe({
        next: (updatedPost) => {
          this.post = updatedPost;
        },
        error: (err) => {
          console.error('Failed to update post:', err);
        },
      });
  }

  deletePost() {
    if (this.deleteModalService.getModalValue()?.id == '') return;
    this.deleteModalService.setDeleting(true);
    this.postService.deletePost(this.deleteModalService.getModalValue()!.id).subscribe({
      next: () => {
        this.onDeletePost(this.post!);
        this.closeDeleteModal();
      },
      error: (err) => {
        console.error('Failed to delete post:', err);
        this.closeDeleteModal();
      },
    });
  }

  sharePost(body?: string) {
    if (this.selectedSharePostId == '') return;
    if (this.isSharedPost()) {
      this.toastrService.error('Post Already Shared', '');
      this.closeShareModal();
      return;
    }
    this.isModalConfirmed = true;
    this.postService.sharePost(this.selectedSharePostId, body).subscribe({
      next: (sharedPost) => {
        this.closeShareModal();
        this.isModalConfirmed = false;
        this.onAddingPost(sharedPost);
      },
      error: (err) => {
        console.error('Failed to share post:', err);
        this.closeShareModal();
      },
    });
  }

  loadComments(): void {
    this.isLoadingComments = true;
    this.commentService.getAllCommentsByPostId(this.post?._id!).subscribe({
      next: (comments) => {
        this.comments = comments;
        this.isLoadingComments = false;
      },
      error: (error) => {
        console.error('Error loading comments:', error);
        this.isLoadingComments = false;
      },
    });
  }

  submitComment(payload: CommentReplyForm): void {
    this.isSubmittingComment = true;
    this.commentService
      .createComment(this.post?._id!, payload)
      .pipe(finalize(() => (this.isSubmittingComment = false)))
      .subscribe({
        next: (newComment) => {
          this.comments.unshift(newComment);
          if (this.post) {
            this.post.commentsCount = this.comments.length;
          }
        },
        error: (err) => {
          console.error('Failed to create comment:', err);
        },
      });
  }

  updateComment(payload: { id: string; content: string }): void {
    this.isUpdateingCommentSet.add(payload.id);
    this.commentService
      .updateComment(this.post?._id!, payload.id, payload.content)
      .pipe(finalize(() => this.isUpdateingCommentSet.delete(payload.id)))
      .subscribe({
        next: (updatedComment) => {
          const index = this.comments.findIndex((comment) => comment._id === updatedComment._id);
          if (index !== -1) {
            this.comments[index] = updatedComment;
          }
        },
        error: (err) => {
          console.error('Failed to update comment:', err);
        },
      });
  }

  likeComment(commentId: string): void {
    this.isCommentLikesSet.add(commentId);
    this.commentService
      .toggleCommentLike(this.post?._id!, commentId)
      .pipe(finalize(() => this.isCommentLikesSet.delete(commentId)))
      .subscribe({
        next: (updatedComment) => {
          const index = this.comments.findIndex((comment) => comment._id === updatedComment._id);
          if (index !== -1) {
            this.comments[index] = updatedComment;
          }
        },
        error: (err) => {
          console.error('Failed to like comment:', err);
        },
      });
  }

  replyToComment(commentId: string): void {}

  deleteComment(commentId: string): void {
    if (this.deleteModalService.getModalValue()?.id == '') return;
    this.deleteModalService.setDeleting(true);
    this.commentService
      .deleteComment(this.post?._id!, commentId)
      .pipe(
        finalize(() => {
          this.closeDeleteModal();
        }),
      )
      .subscribe({
        next: () => {
          const index = this.comments.findIndex((comment) => comment._id === commentId);
          if (index !== -1) {
            this.comments.splice(index, 1);
            if (this.post) {
              this.post.commentsCount = this.comments.length;
            }
          }
        },
        error: (err) => {
          console.error('Failed to delete comment:', err);
        },
      });
  }

  ngOnDestroy(): void {
    this.user$?.unsubscribe();
  }
}
