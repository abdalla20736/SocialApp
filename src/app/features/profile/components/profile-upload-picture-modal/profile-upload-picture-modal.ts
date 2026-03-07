import { Component, ElementRef, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { UploadModalData } from '../../../../core/models/shared/upload-modal-data.model';
import { Privacy } from '../../../../shared/types/privacy.type';
import { UploadModalSubmissionData } from '../../../../core/models/shared/upload-modal-submission-data.model';

@Component({
  selector: 'app-profile-upload-picture-modal',
  imports: [FormsModule],
  templateUrl: './profile-upload-picture-modal.html',
  styleUrl: './profile-upload-picture-modal.css',
})
export class ProfileUploadPictureModal {
  @Input() data!: UploadModalData;
  @Input() isLoading: boolean = false;

  @Output() submitModal = new EventEmitter<UploadModalSubmissionData>();
  @Output() closeModal = new EventEmitter<void>();

  @ViewChild('profileImage') profileImageElement!: ElementRef<HTMLImageElement>;

  zoomValue: number = 100;
  privacy: Privacy = 'public';

  getZoomValue(): string {
    return (this.zoomValue / 100).toFixed(2);
  }

  onZoomChange(value: number): void {
    if (this.data.type === 'profile') {
      this.scaleImage(value);
    }
  }

  private async createZoomedFile(imageElement: HTMLImageElement, imgFile: File): Promise<File> {
    const img = imageElement;
    const canvas = document.createElement('canvas');
    const size = 560;
    canvas.width = size;
    canvas.height = size;

    const ctx = canvas.getContext('2d')!;
    const scale = this.zoomValue / 100;

    const sw = img.naturalWidth / scale;
    const sh = img.naturalHeight / scale;
    const sx = (img.naturalWidth - sw) / 2;
    const sy = (img.naturalHeight - sh) / 2;

    ctx.drawImage(img, sx, sy, sw, sh, 0, 0, size, size);

    const blob = await new Promise<Blob>((resolve) =>
      canvas.toBlob((b) => resolve(b!), 'image/jpeg', 0.92),
    );

    return new File([blob], imgFile.name, { type: imgFile.type });
  }

  scaleImage(value: number) {
    const scale = value / 100;
    this.profileImageElement.nativeElement.style.transform = `scale(${scale})`;
  }

  async onSubmit(): Promise<void> {
    let submissionData: UploadModalSubmissionData = { privacy: this.privacy };
    if (this.data.type === 'profile') {
      const zoomedFile = await this.createZoomedFile(
        this.profileImageElement.nativeElement,
        this.data.imgFile,
      );
      submissionData.zoomedImageFile = zoomedFile;
    }

    this.submitModal.emit(submissionData);
  }
  onCloseModal(): void {
    this.closeModal.emit();
  }
}
