export interface MyLeadOffer {
  id: string;
  name: string;
  category: 'dating' | 'adult_dating' | 'smartlink';
  smartlinkUrl: string;
  targetGeo: string;
  payout: string;
  trafficRules: string[];
  isActive: boolean;
}

export type QueueItemStatus = 'new' | 'queued' | 'processing' | 'ready' | 'sent_to_make';

export interface QueueItem {
  id: string;
  fileName: string;
  fileType: 'image' | 'video';
  source: 'google_drive' | 'local';
  driveFileId?: string;
  status: QueueItemStatus;
  dateAdded: string;
  processedUrl?: string;
}

export interface ContentConcept {
  id: string;
  hookType: 'mistake' | 'contrarian' | 'ranking' | 'curiosity';
  hookText: string;
  visualAction: string;
  onScreenText: string[];
  callToAction: string;
  durationSeconds: number;
}
