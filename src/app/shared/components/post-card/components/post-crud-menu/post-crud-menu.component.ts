import { Component, EventEmitter, Input, Output, HostListener } from '@angular/core';

@Component({
  selector: 'app-post-crud-menu',
  imports: [],
  templateUrl: './post-crud-menu.component.html',
  styleUrl: './post-crud-menu.component.css',
})
export class PostCrudMenu {
  @Input() postId!: string;
  @Input() isPostOwner: boolean = false;
  @Input() isPostSaved: boolean = false;
  @Input() isSavingPost: boolean = false;

  @Output() toggleSavePost = new EventEmitter<void>();
  @Output() editPost = new EventEmitter<void>();
  @Output() deletePost = new EventEmitter<void>();

  isDropdownOpen: boolean = false;

  toggleDropdown(): void {
    this.isDropdownOpen = !this.isDropdownOpen;
  }

  @HostListener('document:click', ['$event'])
  onClickOutside(event: MouseEvent): void {
    const target = event.target as HTMLElement;
    if (!target.closest('.post-crud-menu') && this.isDropdownOpen) {
      this.isDropdownOpen = false;
    }
  }

  onToggleSavePost(): void {
    this.toggleSavePost.emit();
    this.isDropdownOpen = false;
  }

  onEditPost(): void {
    this.editPost.emit();
    this.isDropdownOpen = false;
  }

  onDeletePost(): void {
    this.deletePost.emit();
    this.isDropdownOpen = false;
  }
}
