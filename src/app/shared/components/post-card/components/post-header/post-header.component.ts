import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { PostCrudMenu } from '../post-crud-menu/post-crud-menu.component';
import { Router } from '@angular/router';
import { Post } from '../../../../../core/models/posts/post.model';
import { TimeagoModule } from 'ngx-timeago';
import { FormsModule } from '@angular/forms';
import { Privacy } from '../../../../types/privacy.type';


@Component({
  selector: 'app-post-header',
  imports: [PostCrudMenu, TimeagoModule, FormsModule],
  templateUrl: './post-header.component.html',
  styleUrl: './post-header.component.css',
})
export class PostHeader {
  private readonly router: Router = inject(Router);

  privacy!: Privacy;

  @Input() userName: string = '';
  @Input() userAvatarUrl: string = '';
  @Input() post!: Post;
  @Input() isUpdatedCoverPhoto: boolean = false;
  @Input() isUpdatedProfilePhoto: boolean = false;
  @Input() isRegularPost: boolean = false;
  @Input() isPostOwner: boolean = false;
  @Input() isPostSaved: boolean = false;
  @Input() isSavingPost: boolean = false;

  @Output() openPost = new EventEmitter<void>();
  @Output() privacyChanged = new EventEmitter<Privacy>();
  @Output() toggleSavePost = new EventEmitter<void>();
  @Output() editPost = new EventEmitter<void>();
  @Output() deletePost = new EventEmitter<void>();

  ngAfterViewInit(): void {
    this.privacy = this.post?.privacy!;
  }

  navigateToUserProfile(): void {
    const profileUrl = this.isPostOwner ? '/profile' : `/profile/${this.post.user?._id}`;
    this.router.navigate([profileUrl]);
  }

  onOpenPost(): void {
    this.openPost.emit();
  }

  onPrivacyChanged(privacy: Privacy): void {
    this.privacyChanged.emit(privacy);
  }

  onToggleSavePost(): void {
    this.toggleSavePost.emit();
  }
  onEditPost(): void {
    this.editPost.emit();
  }
  onDeletePost(): void {
    this.deletePost.emit();
  }
}
