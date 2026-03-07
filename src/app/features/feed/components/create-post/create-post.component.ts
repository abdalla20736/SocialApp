import {
  Component,
  ElementRef,
  EventEmitter,
  HostListener,
  inject,
  Output,
  ViewChild,
} from '@angular/core';
import { User } from '../../../../core/models/auth/user.model';
import { PostService } from '../../../../core/services/post.service';
import { AuthService } from '../../../../core/services/auth.service';
import { PickerComponent } from '@ctrl/ngx-emoji-mart';
import { FormsModule } from '@angular/forms';
import { Post } from '../../../../core/models/posts/post.model';

@Component({
  selector: 'app-create-post',
  imports: [PickerComponent, FormsModule],
  templateUrl: './create-post.component.html',
  styleUrl: './create-post.component.css',
})
export class CreatePost {
  private authService: AuthService = inject(AuthService);
  private postService = inject(PostService);

  @Output() unshiftPost: EventEmitter<Post> = new EventEmitter<Post>();

  onUnshiftPost(post: Post): void {
    this.unshiftPost.emit(post);
  }

  user: User = this.authService.getCurrentUser();
  showEmojiPicker: boolean = false;
  isPosting: boolean = false;
  postContent: string = '';
  selectedImageUrl: string = '';
  selectedImageFile: File | null = null;
  selectedPrivacy: 'public' | 'following' | 'only_me' = 'public';

  get isPostDataEmpty(): boolean {
    return !this.postContent.trim() && !this.selectedImageFile;
  }

  @ViewChild('postTextarea') postTextarea!: ElementRef<HTMLTextAreaElement>;
  @ViewChild('emojiPickerContainer') emojiPickerContainer!: ElementRef;

  onSubmit(): void {
    if (this.postContent.trim() || this.selectedImageFile) {
      this.isPosting = true;
  
      this.postService.createPost(this.postContent, this.selectedImageFile!, this.selectedPrivacy).subscribe({
        next: (newPost) => {
          this.onUnshiftPost(newPost);
          this.postContent = '';
          this.removePostImage();
          this.isPosting = false;
        },
        error: (err) => {
          this.isPosting = false;
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

  removePostImage(): void {
    this.selectedImageFile = null;
    this.selectedImageUrl = '';
  }

  toggleEmojiPicker(): void {
    this.showEmojiPicker = !this.showEmojiPicker;
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
