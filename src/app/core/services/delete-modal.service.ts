import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { DeleteModalData } from '../models/shared/delete-modal.model';

@Injectable({
  providedIn: 'root',
})
export class DeleteModalService {
  private deleteModal$ = new BehaviorSubject<DeleteModalData | null>(null);
  private isDeleting$ = new BehaviorSubject<boolean>(false);

  openModal(data: DeleteModalData): void {
    this.deleteModal$.next(data);
  }

  closeModal(): void {
    this.deleteModal$.next(null);
    this.isDeleting$.next(false);
  }

  setDeleting(isDeleting: boolean): void {
    this.isDeleting$.next(isDeleting);
  }

  getModal(): Observable<DeleteModalData | null> {
    return this.deleteModal$.asObservable();
  }

  getIsDeleting(): Observable<boolean> {
    return this.isDeleting$.asObservable();
  }

  getModalValue(): DeleteModalData | null {
    return this.deleteModal$.value;
  }

  setDeleteModal(type: 'post' | 'comment' | 'reply', id: string, deleteAction: () => void): void {
    let deleteModalData: DeleteModalData;

    switch (type) {
      case 'post':
        deleteModalData = {
          title: 'Delete this post?',
          message: 'This post will be permanently removed from your profile and feed.',
          type: 'post',
          id: id,
          deletedItemName: 'post',
          onDelete: deleteAction,
        };
        break;
      case 'comment':
        deleteModalData = {
          title: 'Delete this comment?',
          message: 'This comment will be permanently removed.',
          type: 'comment',
          id: id,
          deletedItemName: 'comment',
          onDelete: deleteAction,
        };
        break;
      case 'reply':
        deleteModalData = {
          title: 'Delete this reply?',
          message: 'This reply will be permanently removed.',
          type: 'reply',
          id: id,
          deletedItemName: 'comment',
          onDelete: deleteAction,
        };
        break;
    }

    this.openModal(deleteModalData);
  }
}
