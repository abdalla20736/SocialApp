import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { UploadModalData } from '../models/shared/upload-modal-data.model';

@Injectable({
  providedIn: 'root',
})
export class UploadPictureModalService {
  private pictureModal = new BehaviorSubject<UploadModalData | null>(null);
  private isSaving = new BehaviorSubject<boolean>(false);

  openModal(data: UploadModalData): void {
    this.pictureModal.next(data);
  }

  closeModal(): void {
    this.pictureModal.next(null);
    this.isSaving.next(false);
  }

  setSavingState(isSaving: boolean): void {
    this.isSaving.next(isSaving);
  }

  getSavingState(): Observable<boolean> {
    return this.isSaving.asObservable();
  }

  getPictureModalState() {
    return this.pictureModal.asObservable();
  }
}
