export interface ImprovementEntry {
  id: string;
  controlNumber: string;
  recordNumber: string;
  areaCode: string;
  category: string;
  entryTitle: string;
  description: string;
  beforeImage: string;
  improvement: string;
  afterImage: string;
  improvementEffect: string;
  dateTime: string;
  month: string;
}

export interface ViewSession {
  id: string;
  idNumber: string;
  month: string;
  completedAt: Date;
}