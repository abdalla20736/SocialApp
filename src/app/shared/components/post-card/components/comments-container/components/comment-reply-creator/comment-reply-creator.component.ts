import {
  Component,
  EventEmitter,
  Input,
  Output,
  ViewChild,
  ElementRef,
  HostListener,
  inject,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommentReplyForm } from '../../../../../../../core/models/comments/comment-reply-form.model';
import { PickerComponent } from '@ctrl/ngx-emoji-mart';
import { User } from '../../../../../../../core/models/auth/user.model';
import { AuthService } from '../../../../../../../core/services/auth.service';

@Component({
  selector: 'app-comment-reply-creator',
  imports: [FormsModule, PickerComponent],
  templateUrl: './comment-reply-creator.component.html',
  styleUrl: './comment-reply-creator.component.css',
})
export class CommentReplyCreator {
  private readonly authService: AuthService = inject(AuthService);

  @Input() placeholder: string = 'Write a comment...';
  @Input() isSubmitting: boolean = false;
  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;

  @Output() create: EventEmitter<CommentReplyForm> = new EventEmitter<CommentReplyForm>();

  selectedImage: File | null = null;
  textContent: string = '';
  showEmojiPicker: boolean = false;
  previewUrl: string | null = null;
  currentUser: User = this.authService.getCurrentUser();

  @ViewChild('fieldTextarea') Textarea!: ElementRef<HTMLTextAreaElement>;
  @ViewChild('emojiPickerContainer') emojiPickerContainer!: ElementRef;

  isSubmitButtonDisabled(): boolean {
    return !this.textContent || this.textContent.trim() === '';
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      this.selectedImage = input.files[0];
      const reader = new FileReader();
      reader.onload = (e) => {
        this.previewUrl = e.target?.result as string;
      };
      reader.readAsDataURL(this.selectedImage);
    }
  }

  removeImage(): void {
    this.selectedImage = null;
    this.previewUrl = null;
    if (this.fileInput) {
      this.fileInput.nativeElement.value = '';
    }
  }

  onSubmit(): void {
    if (event) {
      event.preventDefault();
    }

    if (this.isSubmitButtonDisabled()) {
      return;
    }

    const payload: CommentReplyForm = {
      content: this.textContent.trim(),
      image: this.selectedImage || undefined,
    };

    this.create.emit(payload);

    this.textContent = '';
    this.removeImage();
  }

  toggleEmojiPicker(): void {
    this.showEmojiPicker = !this.showEmojiPicker;
  }

  addEmoji(event: any): void {
    const emoji = event.emoji.native;
    const textarea = this.Textarea.nativeElement;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;

    this.textContent =
      this.textContent.substring(0, start) + emoji + this.textContent.substring(end);

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
