import { Component, ViewChild, AfterViewInit, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BackButton } from '../../../shared/components/back-button/back-button.component';
import { ProfileHeader } from '../components/profile-header/profile-header.component';
import { ProfilePosts } from '../components/profile-posts/profile-posts/profile-posts.component';
import { UploadPictureModalService } from '../../../core/services/upload-picture-modal.service';
import { ProfileUploadPictureModal } from '../components/profile-upload-picture-modal/profile-upload-picture-modal';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-profile',
  imports: [BackButton, ProfileHeader, ProfilePosts, ProfileUploadPictureModal, AsyncPipe],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css',
})
export class ProfileUser {
  private route = inject(ActivatedRoute);

  private readonly uploadPictureModalService: UploadPictureModalService =
    inject(UploadPictureModalService);

  postCount: number = 0;
  bookmarkedPostsCount: number = 0;
  uploadPicture$ = this.uploadPictureModalService.getPictureModalState();
  isModalLoading$ = this.uploadPictureModalService.getSavingState();

  isOpenPictureModal: boolean = false;

  @ViewChild('profilePosts') profilePostsComponent!: ProfilePosts;

  isProfileOwner: boolean = this.route.snapshot.paramMap.get('id') ? false : true;
  pendingUserId: string = '';

  onCloseUploadPictureModal() {
    this.uploadPictureModalService.closeModal();
  }

  onHeaderLoadPosts(userId: string): void {
    if (this.pendingUserId === userId) this.profilePostsComponent.onLoadPosts();
    this.pendingUserId = userId;
  }

  onPostsLoaded(postsCount: number[]): void {
    this.postCount = postsCount[0];
    this.bookmarkedPostsCount = postsCount[1];
  }
}
