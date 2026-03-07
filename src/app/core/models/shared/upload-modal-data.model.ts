import { Privacy } from '../../../shared/types/privacy.type';
import { UploadModalSubmissionData } from './upload-modal-submission-data.model';

export interface UploadModalData {
  imgFile: File;
  imgUrl: string;
  type: 'profile' | 'cover';
  onSubmit: (payload: UploadModalSubmissionData) => void;
}
