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
  frameShape?: string;
  framePath?: string;
  framePolygon?: string;
  frameMaskUrl?: string;
  borderSize?: number;
  borderColor?: string;
  cornerRadius?: number;
}

export interface PhotoboothTemplate {
  id: string;
  name: string;
  layout: 'grid' | 'strip';
  canvasWidth: number;
  canvasHeight: number;
  background: string;
  slots: PhotoboothSlot[];
  layers?: any[];
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
  userName?: string;
  showDate: boolean;
  frameColor?: string;
  backgroundImage?: string;
  borderSize?: number;
  userNameFont?: string;
  userNameColor?: string;
  userNameSize?: number;
  userNameX?: number;
  userNameY?: number;
  dateFont?: string;
  dateColor?: string;
  dateSize?: number;
  dateX?: number;
  dateY?: number;
}

export interface Sticker {
  id: string;
  url: string;
  x: number;
  y: number;
  scale: number;
  rotation: number;
  color?: string;
}

export type PhotoboothStep = 
  | 'idle' 
  | 'select-mode' 
  | 'countdown' 
  | 'capturing' 
  | 'review' 
  | 'design-menu'
  | 'edit-frame'
  | 'editing' 
  | 'result' 
  | 'error' 
  | 'timeout';

export type FaceFilterType = 
  | 'none'
  | 'deer-horns'
  | 'cat-ears'
  | 'dog-ears'
  | 'sunglasses'
  | 'crown'
  | 'clown-nose'
  | 'face-zoom'
  | 'sparkle';

export interface FaceFilterConfig {
  id: FaceFilterType;
  name: string;
  icon: string;
  category: 'accessories' | 'animal' | 'effect';
}
