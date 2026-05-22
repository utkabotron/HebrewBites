export type PageType = 'alphabetical' | 'conjugation' | 'verb-examples';

export interface PageJob {
  type: PageType;
  pdf: string;
  page: number;
  groundTruth: string;
}

export interface RunConfig {
  geminiApiKey: string;
  model: string;
  zoomLevel: number;
  maxImageSize: number;
  useNativePdf: boolean;
  maxRetries: number;
  timeoutMs: number;
}
