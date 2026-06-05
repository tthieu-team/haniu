export interface CapturedPhoto {
  id: string;
  url: string;
  blob: Blob;
}

export interface PhotoboothSlot {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface PhotoboothTemplate {
  id: string;
  name: string;
  layout: 'grid' | 'strip';
  canvasWidth: number;
  canvasHeight: number;
  background: string;
  slots: PhotoboothSlot[];
}

export type PhotoboothMode = 
  | 'single' 
  | 'grid-2-v' 
  | 'grid-2-h' 
  | 'grid-3-v' 
  | 'grid-4' 
  | 'grid-6' 
  | 'grid-9' 
  | 'strip-3' 
  | 'strip-4' 
  | 'wide-1' 
  | 'mixed-3' 
  | 'mixed-4';

export interface PhotoboothConfig {
  mode: PhotoboothMode;
  template: PhotoboothTemplate;
  filter: string;
  frameStyle: 'white' | 'black' | 'pink' | 'retro';
  countdown: number;
  userName: string;
  showDate: boolean;
}

export interface Sticker {
  id: string;
  url: string;
  x: number;
  y: number;
  scale: number;
  rotation: number;
}

export type PhotoboothStep = 
  | 'idle' 
  | 'select-mode' 
  | 'countdown' 
  | 'capturing' 
  | 'review' 
  | 'editing' 
  | 'result' 
  | 'error' 
  | 'timeout';
