import { Post } from '../../core/models/posts/post.model';
import { Component, inject, OnInit, ViewChild, ElementRef, HostListener } from '@angular/core';
import { PostCard } from './post-card/post-card.component';
import { PostService } from '../../core/services/post.service';
import { AuthService } from '../../core/services/auth.service';
import { PickerComponent } from '@ctrl/ngx-emoji-mart';
import { FormsModule } from '@angular/forms';
import { PostSkeletonComponent } from './post-skeleton/post-skeleton.component';
import { SocialSidebar } from './social-sidebar/social-sidebar.component';
import { NavSidebarComponent } from './nav-sidebar/nav-sidebar.component';
import { User } from '../../core/models/auth/user.model';

@Component({
  selector: 'app-feed',
  imports: [
    PostCard,
    PickerComponent,
    FormsModule,
    PostSkeletonComponent,
    SocialSidebar,
    NavSidebarComponent,
  ],
  templateUrl: './feed.component.html',
  styleUrl: './feed.component.css',
})
export class Feed implements OnInit {
  private authService: AuthService = inject(AuthService);
  private postService = inject(PostService);

  posts: Post[] = [];
  user: User = this.authService.getCurrentUser();
  showEmojiPicker: boolean = false;
  isLoading: boolean = true;
  postContent: string = '';
  selectedImageUrl: string = '';
  selectedImageFile: File | null = null;
  selectedPrivacy: 'public' | 'following' | 'only_me' = 'public';

  @ViewChild('postTextarea') postTextarea!: ElementRef<HTMLTextAreaElement>;
  @ViewChild('emojiPickerContainer') emojiPickerContainer!: ElementRef;

  get isPostDisabled(): boolean {
    return !this.postContent.trim() && !this.selectedImageFile;
  }

  ngOnInit(): void {
    this.postService.getHomeFeed().subscribe({
      next: (posts) => {
        console.log('Posts loaded:', posts);
        this.posts = posts;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Failed to load posts:', err);
        this.posts = [];
        this.isLoading = false;
      },
    });
  }

  onSubmit(): void {
    if (this.postContent.trim() || this.selectedImageFile) {
      const formData = new FormData();

      if (this.postContent) {
        formData.append('body', this.postContent);
      }
      if (this.selectedImageFile) {
        formData.append('image', this.selectedImageFile);
      }

      formData.append('privacy', this.selectedPrivacy);

      this.postService.CreatePost(formData).subscribe({
        next: (newPost) => {
          this.posts.unshift(newPost);
          console.log('Post created successfully:', newPost);
          this.postContent = '';
          this.removePostImage();
        },
        error: (err) => {
          console.error('Failed to create post:', err);
        },
      });
    }
  }

  onImageSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];
      this.selectedImageFile = file;

      const reader = new FileReader();
      reader.onload = (e) => {
        const imageUrl = e.target?.result as string;
        this.selectedImageUrl = imageUrl;
      };
      reader.readAsDataURL(file);
    }
  }

  toggleEmojiPicker(): void {
    this.showEmojiPicker = !this.showEmojiPicker;
  }

  removePostImage(): void {
    this.selectedImageFile = null;
    this.selectedImageUrl = '';
  }
  addEmoji(event: any): void {
    const emoji = event.emoji.native;
    const textarea = this.postTextarea.nativeElement;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;

    this.postContent =
      this.postContent.substring(0, start) + emoji + this.postContent.substring(end);

    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + emoji.length, start + emoji.length);
    }, 0);
  }

  @HostListener('document:click', ['$event'])
  onClickOutside(event: MouseEvent): void {
    if (this.showEmojiPicker && this.emojiPickerContainer) {
      const clickedInside = this.emojiPickerContainer.nativeElement.contains(event.target);
      if (!clickedInside) {
        this.showEmojiPicker = false;
      }
    }
  }
}
