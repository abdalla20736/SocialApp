import { Privacy } from "../../../shared/types/privacy.type";

export interface UploadModalSubmissionData {
  privacy: Privacy;
  zoomedImageFile?: File;
}