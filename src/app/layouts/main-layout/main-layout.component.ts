import { Component, inject } from '@angular/core';

import { RouterOutlet } from '@angular/router';
import { Navbar } from './navbar/navbar.component';
import { Loading } from '../../shared/components/loading/loading.component';
import { DeleteModal } from '../../shared/components/post-card/components/delete-modal/delete-modal.component';
import { AsyncPipe } from '@angular/common';
import { ProfileUploadPictureModal } from '../../features/profile/components/profile-upload-picture-modal/profile-upload-picture-modal';
import { DeleteModalService } from '../../core/services/delete-modal.service';

@Component({
  selector: 'app-main-layout',
  imports: [RouterOutlet, Navbar, Loading, DeleteModal, AsyncPipe],
  templateUrl: './main-layout.component.html',
  styleUrls: ['./main-layout.component.css'],
})
export class MainLayout {
  private readonly deleteModalService: DeleteModalService = inject(DeleteModalService);

  deleteModal$ = this.deleteModalService.getModal();
  isDeleting$ = this.deleteModalService.getIsDeleting();

  closeDeleteModal() {
    this.deleteModalService.closeModal();
  }
}
