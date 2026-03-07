import { Component, EventEmitter, inject, Input, OnInit, Output } from '@angular/core';
import { UserProfile } from '../../../../core/models/user/user-profile.model';
import { UserService } from '../../../../core/services/user.service';
import { finalize } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { ImageOverlay } from '../../../../shared/components/image-overlay/image-overlay.component';
import { AuthService } from '../../../../core/services/auth.service';
import { UploadPictureModalService } from '../../../../core/services/upload-picture-modal.service';
import { UploadModalData } from '../../../../core/models/shared/upload-modal-data.model';
import { PostService } from '../../../../core/services/post.service';
import { Privacy } from '../../../../shared/types/privacy.type';
import { User } from '../../../../core/models/auth/user.model';
import { OwnerProfile } from '../../../../core/models/user/owner-profile.model';
import { Title } from '@angular/platform-browser';
import { APP_TITLE_SUFFIX } from '../../../../core/constants/app.constant';

@Component({
  selector: 'app-profile-header',
  imports: [ImageOverlay],
  templateUrl: './profile-header.component.html',
  styleUrl: './profile-header.component.css',
})
export class ProfileHeader implements OnInit {
  private readonly authService: AuthService = inject(AuthService);
  private readonly postService: PostService = inject(PostService);
  private titleService = inject(Title);
  private userService: UserService = inject(UserService);
  private route: ActivatedRoute = inject(ActivatedRoute);
  private uploadPictureModalService: UploadPictureModalService = inject(UploadPictureModalService);

  @Input() isProfileOwner: boolean = false;
  @Input() allPostsCount!: number;
  @Input() bookmarkedPostsCount!: number;

  @Output() loadPosts = new EventEmitter<string>();

  selectedOverlayImageUrl: string = '';
  profile!: UserProfile | OwnerProfile;
  isLoading: boolean = false;
  isFollowingLoading: boolean = false;
  isFollowing: boolean = false;
  currentUser = this.authService.getCurrentUser();
  isDeletingCover: boolean = false;

  profileId = !this.isProfileOwner ? this.route.snapshot.paramMap.get('id') || '' : null;

  ngOnInit(): void {
    this.loadProfile();
  }

  expandImage(imgUrl: string) {
    if (imgUrl == 'images/default-profile.png') return;
    this.selectedOverlayImageUrl = imgUrl;
  }

  closeImageOverlay(event: Event) {
    if (!(event.target instanceof HTMLImageElement) && (this.selectedOverlayImageUrl = '')) {
      this.selectedOverlayImageUrl = '';
    }
  }

  onLoadPosts(id: string): void {
    this.loadPosts.emit(id);
  }

  loadProfile() {
    if (this.isProfileOwner) {
      this.loadMyProfile();
    } else {
      this.loadUserProfile(this.profileId!);
    }
  }

  onSelectedImageChange(event: Event, isCover: boolean = false) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];
      const reader = new FileReader();
      reader.onload = (e) => {
        const imgUrl = e.target?.result as string;
        const uploadModalData: UploadModalData = {
          imgFile: file,
          imgUrl: imgUrl,
          type: isCover ? 'cover' : 'profile',
          onSubmit: isCover
            ? (payload) => this.updateCoverPicture(file, payload.privacy)
            : (payload) => this.updateProfilePicture(payload.zoomedImageFile!, payload.privacy),
        };
        this.uploadPictureModalService.openModal(uploadModalData);
      };
      reader.readAsDataURL(file);
    }
  }

  loadMyProfile() {
    this.isLoading = true;
    this.userService
      .getOwnerProfile()
      .pipe(finalize(() => (this.isLoading = false)))
      .subscribe({
        next: (profile) => {
          this.profile = profile;
          this.onLoadPosts(profile.id);
          this.titleService.setTitle(`${profile.name} Profile${APP_TITLE_SUFFIX}`);
        },
        error: (err) => {
          console.error('Failed to load profile:', err);
        },
      });
  }

  updateProfilePicture(file: File, privacy: Privacy) {
    this.uploadPictureModalService.setSavingState(true);
    this.userService.updateProfilePhoto(file).subscribe({
      next: (response) => {
        this.profile.photo = response.data.photo;
        this.currentUser.photo = response.data.photo;
        this.authService.setUser(this.currentUser);
        this.onLoadPosts(this.profile._id);

        this.createUpdatedProfilePost(false, file, privacy);
      },
      error: (err) => {
        console.error('Failed to upload profile picture:', err);
      },
    });
  }

  updateCoverPicture(file: File, privacy: Privacy) {
    this.uploadPictureModalService.setSavingState(true);
    this.userService.updateProfileCover(file, 'public').subscribe({
      next: (response) => {
        this.profile.cover = response.data.cover;
        this.onLoadPosts(this.profile._id);
        this.createUpdatedProfilePost(true, file, privacy);
      },
      error: (err) => {
        console.error('Failed to upload cover picture:', err);
      },
    });
  }

  createUpdatedProfilePost(isCover: boolean, imgFile: File, privacy: Privacy): void {
    const updateBody = isCover ? 'updated cover photo.' : 'updated profile picture.';
    this.postService.createPost(updateBody, imgFile, privacy).subscribe({
      next: () => {
        this.uploadPictureModalService.closeModal();
      },
      error: (err) => {
        console.error('Failed to create post:', err);
      },
    });
  }

  deleteCoverPicture() {
    if (!this.profile.cover) return;
    this.isDeletingCover = true;
    this.userService
      .deleteProfileCover()
      .pipe(finalize(() => (this.isDeletingCover = false)))
      .subscribe({
        next: () => {
          this.profile.cover = '';
        },
        error: (err) => {
          console.error('Failed to delete cover picture:', err);
        },
      });
  }

  loadUserProfile(id: string) {
    this.isLoading = true;
    this.userService
      .getUserProfile(id)
      .pipe(finalize(() => (this.isLoading = false)))
      .subscribe({
        next: (profile) => {
          this.profile = profile;
          const profileFollowers = profile.followers as User[];
          this.isFollowing = !!profileFollowers.find((user) => user._id === this.currentUser._id);
          this.onLoadPosts(id);
          this.titleService.setTitle(`${profile.name} Profile${APP_TITLE_SUFFIX}`);
        },
        error: (err) => {
          console.error('Failed to load user profile:', err);
        },
      });
  }

  followUser() {
    if (!this.profile || this.isProfileOwner) return;
    this.isFollowingLoading = true;
    this.userService
      .followUser(this.profile._id)
      .pipe(finalize(() => (this.isFollowingLoading = false)))
      .subscribe({
        next: (followingUser) => {
          const followers = this.profile.followers as User[];
          this.profile.followers = followingUser.following
            ? [...followers, this.currentUser]
            : followers.filter((user) => user._id !== this.currentUser._id);

          this.isFollowing = followingUser.following;
          this.profile.followersCount = followingUser.followersCount;
        },
        error: (err) => {
          console.error('Failed to follow/unfollow user:', err);
        },
      });
  }
}
