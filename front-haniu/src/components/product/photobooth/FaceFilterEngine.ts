'use client';

import { FaceLandmarker, FilesetResolver } from '@mediapipe/tasks-vision';
import type { FaceFilterType, FaceFilterConfig } from './types';

// ─── Filter Registry ─────────────────────────────────────────
export const FACE_FILTERS: FaceFilterConfig[] = [
  { id: 'none', name: 'Không filter', icon: '🚫', category: 'accessories' },
  { id: 'deer-horns', name: 'Sừng Hươu', icon: '🦌', category: 'animal' },
  { id: 'cat-ears', name: 'Tai Mèo', icon: '🐱', category: 'animal' },
  { id: 'dog-ears', name: 'Tai Chó', icon: '🐶', category: 'animal' },
  { id: 'sunglasses', name: 'Kính Mát', icon: '😎', category: 'accessories' },
  { id: 'crown', name: 'Vương Miện', icon: '👑', category: 'accessories' },
  { id: 'clown-nose', name: 'Mũi Hề', icon: '🤡', category: 'accessories' },
  { id: 'sparkle', name: 'Lấp Lánh', icon: '✨', category: 'effect' },
];

// ─── Landmark Index Constants ────────────────────────────────
// Reference: https://github.com/google/mediapipe/blob/master/mediapipe/modules/face_geometry/data/canonical_face_model_uv_visualization.png
const LANDMARK = {
  FOREHEAD_TOP: 10,
  FOREHEAD_LEFT: 67,
  FOREHEAD_RIGHT: 297,
  NOSE_TIP: 1,
  NOSE_BRIDGE: 6,
  LEFT_EYE_CENTER: 159,
  RIGHT_EYE_CENTER: 386,
  LEFT_EYE_OUTER: 33,
  LEFT_EYE_INNER: 133,
  RIGHT_EYE_OUTER: 263,
  RIGHT_EYE_INNER: 362,
  LEFT_EYE_TOP: 159,
  LEFT_EYE_BOTTOM: 145,
  RIGHT_EYE_TOP: 386,
  RIGHT_EYE_BOTTOM: 374,
  MOUTH_TOP: 13,
  MOUTH_BOTTOM: 14,
  MOUTH_LEFT: 61,
  MOUTH_RIGHT: 291,
  LEFT_CHEEK: 234,
  RIGHT_CHEEK: 454,
  CHIN: 152,
  LEFT_EAR: 234,
  RIGHT_EAR: 454,
  LEFT_EYEBROW_OUTER: 70,
  RIGHT_EYEBROW_OUTER: 300,
  LEFT_EYEBROW_INNER: 107,
  RIGHT_EYEBROW_INNER: 336,
};

// ─── Sparkle Particles State ─────────────────────────────────
interface SparkleParticle {
  x: number;
  y: number;
  size: number;
  opacity: number;
  rotation: number;
  speed: number;
  angle: number;
  life: number;
  maxLife: number;
}

let sparkleParticles: SparkleParticle[] = [];
let lastSparkleTime = 0;

// ─── Helper Functions ────────────────────────────────────────

interface Point {
  x: number;
  y: number;
  z: number;
}

function getLandmarkPoint(
  landmarks: Point[],
  index: number,
  width: number,
  height: number
): { x: number; y: number; z: number } {
  const lm = landmarks[index];
  if (!lm) return { x: 0, y: 0, z: 0 };
  const x = lm.x * width;
  const y = lm.y * height;
  const z = lm.z * width;
  // Guard against NaN / Infinity which crashes canvas gradient APIs
  if (!isFinite(x) || !isFinite(y) || !isFinite(z)) {
    return { x: 0, y: 0, z: 0 };
  }
  return { x, y, z };
}

function getHeadRotation(landmarks: Point[], width: number, height: number): number {
  const leftEye = getLandmarkPoint(landmarks, LANDMARK.LEFT_EYE_OUTER, width, height);
  const rightEye = getLandmarkPoint(landmarks, LANDMARK.RIGHT_EYE_OUTER, width, height);
  return Math.atan2(rightEye.y - leftEye.y, rightEye.x - leftEye.x);
}

function getFaceWidth(landmarks: Point[], width: number, height: number): number {
  const left = getLandmarkPoint(landmarks, LANDMARK.LEFT_CHEEK, width, height);
  const right = getLandmarkPoint(landmarks, LANDMARK.RIGHT_CHEEK, width, height);
  return Math.sqrt(Math.pow(right.x - left.x, 2) + Math.pow(right.y - left.y, 2));
}

function getMidpoint(p1: { x: number; y: number }, p2: { x: number; y: number }) {
  return { x: (p1.x + p2.x) / 2, y: (p1.y + p2.y) / 2 };
}

// ─── Filter Renderers ────────────────────────────────────────

function renderDeerHorns(
  ctx: CanvasRenderingContext2D,
  landmarks: Point[],
  w: number,
  h: number
) {
  const forehead = getLandmarkPoint(landmarks, LANDMARK.FOREHEAD_TOP, w, h);
  const rotation = getHeadRotation(landmarks, w, h);
  const faceW = getFaceWidth(landmarks, w, h);
  const hornSize = faceW * 0.5;

  ctx.save();
  ctx.translate(forehead.x, forehead.y - hornSize * 0.3);
  ctx.rotate(rotation);

  // Left horn
  drawAntler(ctx, -hornSize * 0.35, -hornSize * 0.1, hornSize, -1);
  // Right horn
  drawAntler(ctx, hornSize * 0.35, -hornSize * 0.1, hornSize, 1);

  ctx.restore();
}

function drawAntler(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  size: number,
  direction: number
) {
  const s = size * 0.8;
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(direction, 1);

  // Main trunk
  ctx.strokeStyle = '#8B4513';
  ctx.lineWidth = s * 0.08;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';

  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.quadraticCurveTo(s * 0.1, -s * 0.5, s * 0.15, -s * 0.85);
  ctx.stroke();

  // Branch 1
  ctx.beginPath();
  ctx.moveTo(s * 0.08, -s * 0.35);
  ctx.quadraticCurveTo(s * 0.3, -s * 0.5, s * 0.35, -s * 0.55);
  ctx.stroke();

  // Branch 2
  ctx.lineWidth = s * 0.06;
  ctx.beginPath();
  ctx.moveTo(s * 0.12, -s * 0.6);
  ctx.quadraticCurveTo(s * 0.35, -s * 0.7, s * 0.4, -s * 0.75);
  ctx.stroke();

  // Branch 3 (top)
  ctx.beginPath();
  ctx.moveTo(s * 0.14, -s * 0.78);
  ctx.quadraticCurveTo(s * 0.3, -s * 0.9, s * 0.28, -s * 0.95);
  ctx.stroke();

  // Tips glow
  const gradient = ctx.createRadialGradient(s * 0.15, -s * 0.85, 0, s * 0.15, -s * 0.85, s * 0.06);
  gradient.addColorStop(0, 'rgba(255, 220, 180, 0.8)');
  gradient.addColorStop(1, 'rgba(255, 220, 180, 0)');
  ctx.fillStyle = gradient;
  ctx.beginPath();
  ctx.arc(s * 0.15, -s * 0.85, s * 0.06, 0, Math.PI * 2);
  ctx.fill();

  ctx.restore();
}

function renderCatEars(
  ctx: CanvasRenderingContext2D,
  landmarks: Point[],
  w: number,
  h: number
) {
  const forehead = getLandmarkPoint(landmarks, LANDMARK.FOREHEAD_TOP, w, h);
  const rotation = getHeadRotation(landmarks, w, h);
  const faceW = getFaceWidth(landmarks, w, h);
  const earSize = faceW * 0.35;

  ctx.save();
  ctx.translate(forehead.x, forehead.y - earSize * 0.15);
  ctx.rotate(rotation);

  // Left ear
  drawCatEar(ctx, -faceW * 0.32, -earSize * 0.3, earSize, -0.3);
  // Right ear
  drawCatEar(ctx, faceW * 0.32, -earSize * 0.3, earSize, 0.3);

  // Whiskers
  const noseTip = getLandmarkPoint(landmarks, LANDMARK.NOSE_TIP, w, h);
  ctx.restore();

  ctx.save();
  ctx.translate(noseTip.x, noseTip.y);
  ctx.rotate(rotation);
  drawWhiskers(ctx, faceW);
  ctx.restore();
}

function drawCatEar(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  size: number,
  tilt: number
) {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(tilt);

  // Outer ear
  ctx.fillStyle = '#4a4a4a';
  ctx.beginPath();
  ctx.moveTo(-size * 0.35, size * 0.15);
  ctx.quadraticCurveTo(-size * 0.15, -size * 0.8, 0, -size * 0.9);
  ctx.quadraticCurveTo(size * 0.15, -size * 0.8, size * 0.35, size * 0.15);
  ctx.closePath();
  ctx.fill();

  // Inner ear
  ctx.fillStyle = '#ff9eb5';
  ctx.beginPath();
  ctx.moveTo(-size * 0.2, size * 0.05);
  ctx.quadraticCurveTo(-size * 0.08, -size * 0.55, 0, -size * 0.65);
  ctx.quadraticCurveTo(size * 0.08, -size * 0.55, size * 0.2, size * 0.05);
  ctx.closePath();
  ctx.fill();

  ctx.restore();
}

function drawWhiskers(ctx: CanvasRenderingContext2D, faceW: number) {
  ctx.strokeStyle = '#555';
  ctx.lineWidth = 1.5;
  ctx.lineCap = 'round';
  const whiskerLen = faceW * 0.35;

  // Left whiskers
  for (let i = -1; i <= 1; i++) {
    ctx.beginPath();
    ctx.moveTo(-faceW * 0.12, i * 6);
    ctx.quadraticCurveTo(-whiskerLen * 0.6, i * 10 - 5, -whiskerLen, i * 12 - 3);
    ctx.stroke();
  }
  // Right whiskers
  for (let i = -1; i <= 1; i++) {
    ctx.beginPath();
    ctx.moveTo(faceW * 0.12, i * 6);
    ctx.quadraticCurveTo(whiskerLen * 0.6, i * 10 - 5, whiskerLen, i * 12 - 3);
    ctx.stroke();
  }
}

function renderDogEars(
  ctx: CanvasRenderingContext2D,
  landmarks: Point[],
  w: number,
  h: number
) {
  const forehead = getLandmarkPoint(landmarks, LANDMARK.FOREHEAD_TOP, w, h);
  const rotation = getHeadRotation(landmarks, w, h);
  const faceW = getFaceWidth(landmarks, w, h);
  const earSize = faceW * 0.45;

  ctx.save();
  ctx.translate(forehead.x, forehead.y);
  ctx.rotate(rotation);

  // Left floppy ear
  drawDogEar(ctx, -faceW * 0.4, -earSize * 0.1, earSize, -1);
  // Right floppy ear
  drawDogEar(ctx, faceW * 0.4, -earSize * 0.1, earSize, 1);

  ctx.restore();

  // Dog nose
  const nose = getLandmarkPoint(landmarks, LANDMARK.NOSE_TIP, w, h);
  ctx.save();
  ctx.translate(nose.x, nose.y);
  ctx.rotate(rotation);

  // Black nose
  ctx.fillStyle = '#1a1a1a';
  ctx.beginPath();
  ctx.ellipse(0, 0, faceW * 0.08, faceW * 0.06, 0, 0, Math.PI * 2);
  ctx.fill();

  // Nose shine
  ctx.fillStyle = 'rgba(255,255,255,0.3)';
  ctx.beginPath();
  ctx.ellipse(-faceW * 0.02, -faceW * 0.015, faceW * 0.025, faceW * 0.018, -0.4, 0, Math.PI * 2);
  ctx.fill();

  // Tongue
  const mouth = getLandmarkPoint(landmarks, LANDMARK.MOUTH_BOTTOM, w, h);
  ctx.restore();

  ctx.save();
  ctx.translate(mouth.x, mouth.y + faceW * 0.05);
  ctx.rotate(rotation);
  
  ctx.fillStyle = '#ff6b8a';
  ctx.beginPath();
  ctx.ellipse(0, faceW * 0.08, faceW * 0.06, faceW * 0.12, 0, 0, Math.PI);
  ctx.fill();

  // Tongue highlight
  ctx.fillStyle = '#ff8fa8';
  ctx.beginPath();
  ctx.ellipse(-faceW * 0.01, faceW * 0.06, faceW * 0.025, faceW * 0.06, 0, 0, Math.PI);
  ctx.fill();

  ctx.restore();
}

function drawDogEar(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  size: number,
  direction: number
) {
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(direction, 1);

  // Outer ear (floppy)
  ctx.fillStyle = '#A0522D';
  ctx.beginPath();
  ctx.moveTo(-size * 0.15, -size * 0.1);
  ctx.quadraticCurveTo(-size * 0.45, -size * 0.3, -size * 0.4, size * 0.3);
  ctx.quadraticCurveTo(-size * 0.3, size * 0.65, -size * 0.05, size * 0.5);
  ctx.quadraticCurveTo(size * 0.05, size * 0.2, size * 0.1, -size * 0.05);
  ctx.closePath();
  ctx.fill();

  // Inner ear
  ctx.fillStyle = '#D2956A';
  ctx.beginPath();
  ctx.moveTo(-size * 0.08, 0);
  ctx.quadraticCurveTo(-size * 0.3, -size * 0.1, -size * 0.28, size * 0.2);
  ctx.quadraticCurveTo(-size * 0.2, size * 0.45, -size * 0.02, size * 0.35);
  ctx.quadraticCurveTo(size * 0.02, size * 0.12, size * 0.02, 0);
  ctx.closePath();
  ctx.fill();

  ctx.restore();
}

function renderSunglasses(
  ctx: CanvasRenderingContext2D,
  landmarks: Point[],
  w: number,
  h: number
) {
  const leftEye = getLandmarkPoint(landmarks, LANDMARK.LEFT_EYE_CENTER, w, h);
  const rightEye = getLandmarkPoint(landmarks, LANDMARK.RIGHT_EYE_CENTER, w, h);
  const noseBridge = getLandmarkPoint(landmarks, LANDMARK.NOSE_BRIDGE, w, h);
  const rotation = getHeadRotation(landmarks, w, h);
  const faceW = getFaceWidth(landmarks, w, h);

  const eyeCenter = getMidpoint(leftEye, rightEye);
  const lensW = faceW * 0.28;
  const lensH = faceW * 0.22;

  ctx.save();
  ctx.translate(eyeCenter.x, eyeCenter.y);
  ctx.rotate(rotation);

  // Frame
  ctx.strokeStyle = '#1a1a1a';
  ctx.lineWidth = faceW * 0.025;
  ctx.fillStyle = 'rgba(30, 30, 30, 0.75)';

  const leftCx = -(faceW * 0.19);
  const rightCx = faceW * 0.19;

  // Left lens
  ctx.beginPath();
  roundedRect(ctx, leftCx - lensW / 2, -lensH / 2, lensW, lensH, lensH * 0.25);
  ctx.fill();
  ctx.stroke();

  // Right lens
  ctx.beginPath();
  roundedRect(ctx, rightCx - lensW / 2, -lensH / 2, lensW, lensH, lensH * 0.25);
  ctx.fill();
  ctx.stroke();

  // Bridge
  ctx.beginPath();
  ctx.moveTo(leftCx + lensW / 2, 0);
  ctx.quadraticCurveTo(0, -lensH * 0.15, rightCx - lensW / 2, 0);
  ctx.stroke();

  // Arms
  ctx.beginPath();
  ctx.moveTo(leftCx - lensW / 2, -lensH * 0.1);
  ctx.lineTo(leftCx - lensW / 2 - faceW * 0.15, -lensH * 0.05);
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(rightCx + lensW / 2, -lensH * 0.1);
  ctx.lineTo(rightCx + lensW / 2 + faceW * 0.15, -lensH * 0.05);
  ctx.stroke();

  // Lens reflection
  ctx.fillStyle = 'rgba(255,255,255,0.12)';
  ctx.beginPath();
  ctx.ellipse(leftCx - lensW * 0.12, -lensH * 0.12, lensW * 0.18, lensH * 0.15, -0.3, 0, Math.PI * 2);
  ctx.fill();

  ctx.beginPath();
  ctx.ellipse(rightCx - lensW * 0.12, -lensH * 0.12, lensW * 0.18, lensH * 0.15, -0.3, 0, Math.PI * 2);
  ctx.fill();

  ctx.restore();
}

function roundedRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number
) {
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.arcTo(x + w, y, x + w, y + r, r);
  ctx.lineTo(x + w, y + h - r);
  ctx.arcTo(x + w, y + h, x + w - r, y + h, r);
  ctx.lineTo(x + r, y + h);
  ctx.arcTo(x, y + h, x, y + h - r, r);
  ctx.lineTo(x, y + r);
  ctx.arcTo(x, y, x + r, y, r);
}

function renderCrown(
  ctx: CanvasRenderingContext2D,
  landmarks: Point[],
  w: number,
  h: number
) {
  const forehead = getLandmarkPoint(landmarks, LANDMARK.FOREHEAD_TOP, w, h);
  const rotation = getHeadRotation(landmarks, w, h);
  const faceW = getFaceWidth(landmarks, w, h);
  const crownW = faceW * 0.7;
  const crownH = faceW * 0.35;

  ctx.save();
  ctx.translate(forehead.x, forehead.y - crownH * 0.65);
  ctx.rotate(rotation);

  // Crown body
  const grad = ctx.createLinearGradient(0, -crownH, 0, crownH * 0.3);
  grad.addColorStop(0, '#FFD700');
  grad.addColorStop(0.5, '#FFA500');
  grad.addColorStop(1, '#FF8C00');

  ctx.fillStyle = grad;
  ctx.strokeStyle = '#B8860B';
  ctx.lineWidth = 2;

  ctx.beginPath();
  // Base
  ctx.moveTo(-crownW / 2, crownH * 0.3);
  // Left side
  ctx.lineTo(-crownW / 2, -crownH * 0.1);
  // Peak 1
  ctx.lineTo(-crownW * 0.3, -crownH * 0.7);
  ctx.lineTo(-crownW * 0.15, -crownH * 0.15);
  // Peak 2 (center, tallest)
  ctx.lineTo(0, -crownH);
  ctx.lineTo(crownW * 0.15, -crownH * 0.15);
  // Peak 3
  ctx.lineTo(crownW * 0.3, -crownH * 0.7);
  // Right side
  ctx.lineTo(crownW / 2, -crownH * 0.1);
  ctx.lineTo(crownW / 2, crownH * 0.3);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  // Gems
  const gemPositions = [
    { x: -crownW * 0.3, y: -crownH * 0.5 },
    { x: 0, y: -crownH * 0.75 },
    { x: crownW * 0.3, y: -crownH * 0.5 },
  ];
  const gemColors = ['#FF0040', '#00BFFF', '#FF0040'];

  gemPositions.forEach((pos, i) => {
    // Gem glow
    const glow = ctx.createRadialGradient(pos.x, pos.y, 0, pos.x, pos.y, faceW * 0.04);
    glow.addColorStop(0, gemColors[i]);
    glow.addColorStop(1, 'rgba(255,255,255,0)');
    ctx.fillStyle = glow;
    ctx.beginPath();
    ctx.arc(pos.x, pos.y, faceW * 0.04, 0, Math.PI * 2);
    ctx.fill();

    // Gem
    ctx.fillStyle = gemColors[i];
    ctx.beginPath();
    ctx.arc(pos.x, pos.y, faceW * 0.025, 0, Math.PI * 2);
    ctx.fill();

    // Gem shine
    ctx.fillStyle = 'rgba(255,255,255,0.6)';
    ctx.beginPath();
    ctx.arc(pos.x - faceW * 0.008, pos.y - faceW * 0.008, faceW * 0.008, 0, Math.PI * 2);
    ctx.fill();
  });

  // Base band
  ctx.fillStyle = '#B8860B';
  ctx.fillRect(-crownW / 2, crownH * 0.15, crownW, crownH * 0.15);

  // Band dots
  ctx.fillStyle = '#FFD700';
  for (let i = 0; i < 7; i++) {
    const dotX = -crownW / 2 + (crownW / 7) * (i + 0.5);
    ctx.beginPath();
    ctx.arc(dotX, crownH * 0.225, faceW * 0.012, 0, Math.PI * 2);
    ctx.fill();
  }

  ctx.restore();
}

function renderClownNose(
  ctx: CanvasRenderingContext2D,
  landmarks: Point[],
  w: number,
  h: number
) {
  const nose = getLandmarkPoint(landmarks, LANDMARK.NOSE_TIP, w, h);
  const rotation = getHeadRotation(landmarks, w, h);
  const faceW = getFaceWidth(landmarks, w, h);
  const noseRadius = faceW * 0.08;

  ctx.save();
  ctx.translate(nose.x, nose.y);
  ctx.rotate(rotation);

  // Red nose with gradient
  const noseGrad = ctx.createRadialGradient(-noseRadius * 0.2, -noseRadius * 0.2, 0, 0, 0, noseRadius);
  noseGrad.addColorStop(0, '#FF3333');
  noseGrad.addColorStop(0.7, '#CC0000');
  noseGrad.addColorStop(1, '#990000');

  ctx.fillStyle = noseGrad;
  ctx.beginPath();
  ctx.arc(0, 0, noseRadius, 0, Math.PI * 2);
  ctx.fill();

  // Shine
  ctx.fillStyle = 'rgba(255,255,255,0.4)';
  ctx.beginPath();
  ctx.ellipse(-noseRadius * 0.25, -noseRadius * 0.25, noseRadius * 0.3, noseRadius * 0.2, -0.5, 0, Math.PI * 2);
  ctx.fill();

  ctx.restore();

  // Cheek blush
  const leftCheek = getLandmarkPoint(landmarks, LANDMARK.LEFT_CHEEK, w, h);
  const rightCheek = getLandmarkPoint(landmarks, LANDMARK.RIGHT_CHEEK, w, h);
  const blushRadius = faceW * 0.08;

  [leftCheek, rightCheek].forEach((cheek) => {
    const blushGrad = ctx.createRadialGradient(cheek.x, cheek.y, 0, cheek.x, cheek.y, blushRadius);
    blushGrad.addColorStop(0, 'rgba(255, 100, 130, 0.35)');
    blushGrad.addColorStop(1, 'rgba(255, 100, 130, 0)');
    ctx.fillStyle = blushGrad;
    ctx.beginPath();
    ctx.arc(cheek.x, cheek.y, blushRadius, 0, Math.PI * 2);
    ctx.fill();
  });
}

function renderFaceZoom(
  ctx: CanvasRenderingContext2D,
  landmarks: Point[],
  w: number,
  h: number,
  videoElement: HTMLVideoElement
) {
  const leftCheek = getLandmarkPoint(landmarks, LANDMARK.LEFT_CHEEK, w, h);
  const rightCheek = getLandmarkPoint(landmarks, LANDMARK.RIGHT_CHEEK, w, h);
  const forehead = getLandmarkPoint(landmarks, LANDMARK.FOREHEAD_TOP, w, h);
  const chin = getLandmarkPoint(landmarks, LANDMARK.CHIN, w, h);

  const faceCenterX = (leftCheek.x + rightCheek.x) / 2;
  const faceCenterY = (forehead.y + chin.y) / 2;
  const faceW = getFaceWidth(landmarks, w, h);
  const faceH = chin.y - forehead.y;

  // Source region (the face area from original video)
  const padding = 0.3;
  const srcX = Math.max(0, (faceCenterX - faceW * (0.5 + padding)) / w * videoElement.videoWidth);
  const srcY = Math.max(0, (faceCenterY - faceH * (0.5 + padding)) / h * videoElement.videoHeight);
  const srcW = Math.min(videoElement.videoWidth - srcX, (faceW * (1 + padding * 2)) / w * videoElement.videoWidth);
  const srcH = Math.min(videoElement.videoHeight - srcY, (faceH * (1 + padding * 2)) / h * videoElement.videoHeight);

  // Destination: draw zoomed face as a circle overlay
  const zoomScale = 1.5;
  const destRadius = faceW * 0.5 * zoomScale;

  ctx.save();

  // Create circular clip
  ctx.beginPath();
  ctx.arc(faceCenterX, faceCenterY, destRadius, 0, Math.PI * 2);
  ctx.closePath();
  ctx.clip();

  // Draw zoomed face
  ctx.drawImage(
    videoElement,
    srcX, srcY, srcW, srcH,
    faceCenterX - destRadius,
    faceCenterY - destRadius,
    destRadius * 2,
    destRadius * 2
  );

  ctx.restore();

  // Circle border
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.6)';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.arc(faceCenterX, faceCenterY, destRadius, 0, Math.PI * 2);
  ctx.stroke();

  // Funny eyes emoji overlay  
  const leftEye = getLandmarkPoint(landmarks, LANDMARK.LEFT_EYE_CENTER, w, h);
  const rightEye = getLandmarkPoint(landmarks, LANDMARK.RIGHT_EYE_CENTER, w, h);
  const eyeSize = faceW * 0.14;
  
  ctx.font = `${eyeSize}px serif`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('👁️', leftEye.x, leftEye.y);
  ctx.fillText('👁️', rightEye.x, rightEye.y);
}

function renderSparkle(
  ctx: CanvasRenderingContext2D,
  landmarks: Point[],
  w: number,
  h: number
) {
  const now = Date.now();
  const faceW = getFaceWidth(landmarks, w, h);
  const forehead = getLandmarkPoint(landmarks, LANDMARK.FOREHEAD_TOP, w, h);
  const chin = getLandmarkPoint(landmarks, LANDMARK.CHIN, w, h);
  const leftCheek = getLandmarkPoint(landmarks, LANDMARK.LEFT_CHEEK, w, h);
  const rightCheek = getLandmarkPoint(landmarks, LANDMARK.RIGHT_CHEEK, w, h);

  const faceCenterX = (leftCheek.x + rightCheek.x) / 2;
  const faceCenterY = (forehead.y + chin.y) / 2;
  const spawnRadius = faceW * 0.65;

  // Spawn new particles
  if (now - lastSparkleTime > 80) {
    lastSparkleTime = now;
    const angle = Math.random() * Math.PI * 2;
    const dist = spawnRadius * (0.5 + Math.random() * 0.5);
    sparkleParticles.push({
      x: faceCenterX + Math.cos(angle) * dist,
      y: faceCenterY + Math.sin(angle) * dist,
      size: 4 + Math.random() * 10,
      opacity: 1,
      rotation: Math.random() * Math.PI * 2,
      speed: 0.3 + Math.random() * 0.8,
      angle: angle + Math.PI, // Move outward
      life: 0,
      maxLife: 40 + Math.random() * 30,
    });
  }

  // Update and render particles
  sparkleParticles = sparkleParticles.filter((p) => p.life < p.maxLife);

  sparkleParticles.forEach((p) => {
    p.life++;
    p.x += Math.cos(p.angle) * p.speed;
    p.y += Math.sin(p.angle) * p.speed - 0.5; // Float upward
    p.rotation += 0.05;
    p.opacity = 1 - p.life / p.maxLife;

    ctx.save();
    ctx.translate(p.x, p.y);
    ctx.rotate(p.rotation);
    ctx.globalAlpha = p.opacity;

    // Draw 4-pointed star
    drawSparkStar(ctx, 0, 0, p.size);

    ctx.restore();
  });
}

function drawSparkStar(ctx: CanvasRenderingContext2D, x: number, y: number, size: number) {
  const colors = ['#FFD700', '#FFF8DC', '#FFFACD', '#FFE4B5'];
  const color = colors[Math.floor(Math.random() * colors.length)];

  ctx.fillStyle = color;
  ctx.beginPath();

  const outerR = size;
  const innerR = size * 0.3;
  const points = 4;

  for (let i = 0; i < points * 2; i++) {
    const r = i % 2 === 0 ? outerR : innerR;
    const angle = (i * Math.PI) / points - Math.PI / 2;
    const px = x + Math.cos(angle) * r;
    const py = y + Math.sin(angle) * r;
    if (i === 0) ctx.moveTo(px, py);
    else ctx.lineTo(px, py);
  }
  ctx.closePath();
  ctx.fill();

  // Center glow
  const glow = ctx.createRadialGradient(x, y, 0, x, y, size * 0.5);
  glow.addColorStop(0, 'rgba(255, 255, 255, 0.8)');
  glow.addColorStop(1, 'rgba(255, 255, 255, 0)');
  ctx.fillStyle = glow;
  ctx.beginPath();
  ctx.arc(x, y, size * 0.5, 0, Math.PI * 2);
  ctx.fill();
}

// ─── Main Render Function ────────────────────────────────────

export function renderFaceFilter(
  ctx: CanvasRenderingContext2D,
  landmarks: Point[],
  filterType: FaceFilterType,
  width: number,
  height: number,
  videoElement?: HTMLVideoElement
) {
  if (filterType === 'none' || !landmarks || landmarks.length === 0) return;
  // Guard: skip rendering if dimensions are invalid
  if (!isFinite(width) || !isFinite(height) || width <= 0 || height <= 0) return;

  switch (filterType) {
    case 'deer-horns':
      renderDeerHorns(ctx, landmarks, width, height);
      break;
    case 'cat-ears':
      renderCatEars(ctx, landmarks, width, height);
      break;
    case 'dog-ears':
      renderDogEars(ctx, landmarks, width, height);
      break;
    case 'sunglasses':
      renderSunglasses(ctx, landmarks, width, height);
      break;
    case 'crown':
      renderCrown(ctx, landmarks, width, height);
      break;
    case 'clown-nose':
      renderClownNose(ctx, landmarks, width, height);
      break;
    case 'face-zoom':
      if (videoElement) {
        renderFaceZoom(ctx, landmarks, width, height, videoElement);
      }
      break;
    case 'sparkle':
      renderSparkle(ctx, landmarks, width, height);
      break;
  }
}

// ─── FaceLandmarker Manager ──────────────────────────────────

let faceLandmarkerInstance: FaceLandmarker | null = null;
let isInitializing = false;

export async function initFaceLandmarker(): Promise<FaceLandmarker | null> {
  if (faceLandmarkerInstance) return faceLandmarkerInstance;
  if (isInitializing) {
    // Wait for existing initialization
    return new Promise((resolve) => {
      const check = setInterval(() => {
        if (faceLandmarkerInstance) {
          clearInterval(check);
          resolve(faceLandmarkerInstance);
        }
      }, 100);
      // Timeout after 15s
      setTimeout(() => {
        clearInterval(check);
        resolve(null);
      }, 15000);
    });
  }

  isInitializing = true;

  try {
    const vision = await FilesetResolver.forVisionTasks(
      'https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm'
    );

    faceLandmarkerInstance = await FaceLandmarker.createFromOptions(vision, {
      baseOptions: {
        modelAssetPath: 'https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task',
        delegate: 'GPU',
      },
      runningMode: 'VIDEO',
      numFaces: 1,
      outputFaceBlendshapes: false,
      outputFacialTransformationMatrixes: false,
    });

    isInitializing = false;
    return faceLandmarkerInstance;
  } catch (err) {
    console.error('Failed to initialize FaceLandmarker:', err);
    isInitializing = false;
    return null;
  }
}

export function destroyFaceLandmarker() {
  if (faceLandmarkerInstance) {
    // Suppress MediaPipe WASM internal logs during close()
    const origWarn = console.warn;
    const origLog = console.log;
    const origInfo = console.info;
    console.warn = () => {};
    console.log = () => {};
    console.info = () => {};
    try {
      faceLandmarkerInstance.close();
    } catch {
      // Ignore close errors
    } finally {
      console.warn = origWarn;
      console.log = origLog;
      console.info = origInfo;
    }
    faceLandmarkerInstance = null;
  }
  sparkleParticles = [];
}

export function detectFaceLandmarks(
  faceLandmarker: FaceLandmarker,
  video: HTMLVideoElement,
  timestamp: number
) {
  try {
    const results = faceLandmarker.detectForVideo(video, timestamp);
    if (results && results.faceLandmarks && results.faceLandmarks.length > 0) {
      return results.faceLandmarks[0]; // First face
    }
  } catch (err) {
    // Silently handle detection errors (can happen on bad frames)
  }
  return null;
}
