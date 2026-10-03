'use client';

import React, { useState, useRef, useEffect } from 'react';
import Icon from '@/components/common/Icons';
import { 
  ArrowLeft, 
  Undo2, 
  Redo2, 
  PanelLeft, 
  PanelRight, 
  Magnet, 
  Image as ImageIcon, 
  Palette, 
  Copy, 
  Save 
} from 'lucide-react';
import { TemplateWizard } from './workspace/TemplateWizard';
import { LeftToolbox } from './workspace/LeftToolbox';
import { RightProperties } from './workspace/RightProperties';

interface CanvaWorkspaceProps {
  builderTemplate: any;
  setBuilderTemplate: React.Dispatch<React.SetStateAction<any>>;
  selectedLayerId: string | null;
  setSelectedLayerId: (id: string | null) => void;
  assets: any;
  onSave: () => void;
  onClose: () => void;
  onClone: (tpl: any) => void;
}

export const CanvaWorkspace: React.FC<CanvaWorkspaceProps> = ({
  builderTemplate,
  setBuilderTemplate,
  selectedLayerId,
  setSelectedLayerId,
  assets,
  onSave,
  onClose,
  onClone
}) => {
  const [canvasZoom, setCanvasZoom] = useState(0.85);
  const [wizardStep, setWizardStep] = useState<number>(builderTemplate.isNew ? 1 : 0); // 0 means workspace, 1-3 is wizard steps
  const [snapToGrid, setSnapToGrid] = useState(false);
  const [isSpacePressed, setIsSpacePressed] = useState(false);
  const [showZoomMenu, setShowZoomMenu] = useState(false);
  const [editingTextLayerId, setEditingTextLayerId] = useState<string | null>(null);
  const [showLeftSidebar, setShowLeftSidebar] = useState(true);
  const [showRightSidebar, setShowRightSidebar] = useState(true);
  const builderContainerRef = useRef<HTMLDivElement>(null);
  const workboardRef = useRef<HTMLDivElement>(null);
  const canvasZoomRef = useRef(canvasZoom);
  canvasZoomRef.current = canvasZoom;

  // History stack for Undo (Ctrl+Z) & Redo (Ctrl+Y / Ctrl+Shift+Z)
  const [history, setHistory] = useState<any[]>([JSON.parse(JSON.stringify(builderTemplate))]);
  const [historyIndex, setHistoryIndex] = useState<number>(0);
  const historyRef = useRef({ history, historyIndex });
  historyRef.current = { history, historyIndex };
  const builderTemplateRef = useRef(builderTemplate);
  builderTemplateRef.current = builderTemplate;

  const recordHistory = (nextTemplate: any) => {
    if (!nextTemplate) return;
    const cloned = JSON.parse(JSON.stringify(nextTemplate));
    setHistory(prev => {
      const nextHistory = prev.slice(0, historyRef.current.historyIndex + 1);
      nextHistory.push(cloned);
      if (nextHistory.length > 30) nextHistory.shift();
      return nextHistory;
    });
    setHistoryIndex(prev => Math.min(29, prev + 1));
  };

  const updateTemplateAndHistory = (updater: any) => {
    setBuilderTemplate((prev: any) => {
      const nextState = typeof updater === 'function' ? updater(prev) : updater;
      setTimeout(() => {
        recordHistory(nextState);
      }, 0);
      return nextState;
    });
  };

  const handleUndo = () => {
    const { history: h, historyIndex: idx } = historyRef.current;
    if (idx > 0) {
      const targetIdx = idx - 1;
      const prevTpl = h[targetIdx];
      setHistoryIndex(targetIdx);
      setBuilderTemplate(JSON.parse(JSON.stringify(prevTpl)));
    }
  };

  const handleRedo = () => {
    const { history: h, historyIndex: idx } = historyRef.current;
    if (idx < h.length - 1) {
      const targetIdx = idx + 1;
      const nextTpl = h[targetIdx];
      setHistoryIndex(targetIdx);
      setBuilderTemplate(JSON.parse(JSON.stringify(nextTpl)));
    }
  };

  const MIN_ZOOM = 0.15;
  const MAX_ZOOM = 5.0;

  // Zoom helpers
  const handleZoomChange = (newZoom: number) => {
    const clamped = Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, Math.round(newZoom * 100) / 100));
    setCanvasZoom(clamped);
  };

  const handleZoomIn = () => {
    setCanvasZoom(prev => {
      const step = prev >= 2.0 ? 0.5 : prev >= 1.0 ? 0.25 : 0.1;
      return Math.min(MAX_ZOOM, Math.round((prev + step) * 100) / 100);
    });
  };

  const handleZoomOut = () => {
    setCanvasZoom(prev => {
      const step = prev > 2.0 ? 0.5 : prev > 1.0 ? 0.25 : 0.1;
      return Math.max(MIN_ZOOM, Math.round((prev - step) * 100) / 100);
    });
  };

  const handleFitToScreen = () => {
    if (!workboardRef.current) return;
    const { clientWidth, clientHeight } = workboardRef.current;
    const padX = 120;
    const padY = 120;
    const availW = Math.max(100, clientWidth - padX);
    const availH = Math.max(100, clientHeight - padY);
    const baseW = (builderTemplate.canvasWidth || 1200) * 0.25;
    const baseH = (builderTemplate.canvasHeight || 1600) * 0.25;
    const fitW = availW / baseW;
    const fitH = availH / baseH;
    const targetZoom = Math.min(fitW, fitH, 2.0);
    setCanvasZoom(Math.max(MIN_ZOOM, Math.round(targetZoom * 100) / 100));
  };

  // Wheel (Ctrl + Scroll / Trackpad Pinch) & Touch Pinch Gesture listeners
  useEffect(() => {
    const el = workboardRef.current;
    if (!el) return;

    // Trackpad Pinch / Ctrl + Mouse Scroll
    const handleWheel = (e: WheelEvent) => {
      if (e.ctrlKey || e.metaKey) {
        e.preventDefault();
        // Exponential zoom for smooth feeling on both mouse scroll and trackpad pinch
        const zoomDelta = -e.deltaY * 0.0025;
        setCanvasZoom(prev => {
          const next = prev * Math.exp(zoomDelta);
          return Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, Math.round(next * 1000) / 1000));
        });
      }
    };

    // Touch screen 2-finger pinch
    let initialTouchDist = 0;
    let initialTouchZoom = 1;

    const handleTouchStart = (e: TouchEvent) => {
      if (e.touches.length === 2) {
        const t1 = e.touches[0];
        const t2 = e.touches[1];
        initialTouchDist = Math.hypot(t2.clientX - t1.clientX, t2.clientY - t1.clientY);
        initialTouchZoom = canvasZoomRef.current;
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length === 2 && initialTouchDist > 0) {
        e.preventDefault();
        const t1 = e.touches[0];
        const t2 = e.touches[1];
        const currentDist = Math.hypot(t2.clientX - t1.clientX, t2.clientY - t1.clientY);
        const ratio = currentDist / initialTouchDist;
        const nextZoom = initialTouchZoom * ratio;
        setCanvasZoom(Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, Math.round(nextZoom * 100) / 100)));
      }
    };

    const handleTouchEnd = () => {
      initialTouchDist = 0;
    };

    el.addEventListener('wheel', handleWheel, { passive: false });
    el.addEventListener('touchstart', handleTouchStart, { passive: false });
    el.addEventListener('touchmove', handleTouchMove, { passive: false });
    el.addEventListener('touchend', handleTouchEnd);
    el.addEventListener('touchcancel', handleTouchEnd);

    return () => {
      el.removeEventListener('wheel', handleWheel);
      el.removeEventListener('touchstart', handleTouchStart);
      el.removeEventListener('touchmove', handleTouchMove);
      el.removeEventListener('touchend', handleTouchEnd);
      el.removeEventListener('touchcancel', handleTouchEnd);
    };
  }, []);

  // Keyboard navigation & Shortcuts (Arrows, Space to Pan, Ctrl+Plus/Minus/0)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const activeElement = document.activeElement;
      if (activeElement && (activeElement.tagName === 'INPUT' || activeElement.tagName === 'TEXTAREA' || activeElement.tagName === 'SELECT')) {
        return; // Avoid intercepting when typing in inputs
      }

      if (e.code === 'Space' && !e.repeat) {
        setIsSpacePressed(true);
      }

      // Undo & Redo shortcuts: Ctrl + Z / Ctrl + Y / Ctrl + Shift + Z
      if (e.ctrlKey || e.metaKey) {
        if ((e.key === 'z' || e.key === 'Z') && !e.shiftKey) {
          e.preventDefault();
          handleUndo();
          return;
        }
        if (e.key === 'y' || e.key === 'Y' || (e.shiftKey && (e.key === 'z' || e.key === 'Z'))) {
          e.preventDefault();
          handleRedo();
          return;
        }
      }

      // Ctrl + / Ctrl - / Ctrl 0 zoom shortcuts
      if (e.ctrlKey || e.metaKey) {
        if (e.key === '=' || e.key === '+') {
          e.preventDefault();
          handleZoomIn();
          return;
        } else if (e.key === '-' || e.key === '_') {
          e.preventDefault();
          handleZoomOut();
          return;
        } else if (e.key === '0') {
          e.preventDefault();
          handleFitToScreen();
          return;
        }
      }

      if (!selectedLayerId || wizardStep > 0) return;

      const layer = builderTemplate.layers.find((l: any) => l.id === selectedLayerId);
      if (!layer || layer.locked) return;

      const step = e.shiftKey ? 5 : 1;
      let updates: any = {};

      if (e.key === 'ArrowUp') {
        updates.y = Math.max(0, layer.y - step);
        e.preventDefault();
      } else if (e.key === 'ArrowDown') {
        updates.y = Math.min(100 - layer.height, layer.y + step);
        e.preventDefault();
      } else if (e.key === 'ArrowLeft') {
        updates.x = Math.max(0, layer.x - step);
        e.preventDefault();
      } else if (e.key === 'ArrowRight') {
        updates.x = Math.min(100 - layer.width, layer.x + step);
        e.preventDefault();
      }

      if (snapToGrid) {
        if (updates.x !== undefined) updates.x = Math.round(updates.x / 5) * 5;
        if (updates.y !== undefined) updates.y = Math.round(updates.y / 5) * 5;
      }

      if (Object.keys(updates).length > 0) {
        updateSelectedLayer(updates);
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.code === 'Space') {
        setIsSpacePressed(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [selectedLayerId, builderTemplate.layers, wizardStep, snapToGrid]);

  // Handle Workspace Pan (Middle click or Space+Drag or background drag)
  const handleWorkboardMouseDown = (e: React.MouseEvent) => {
    if (!workboardRef.current) return;
    // Pan if middle mouse (button 1) or space is held or clicking directly on workboard container
    const isMiddleClick = e.button === 1;
    const isWorkboardTarget = e.target === workboardRef.current || (e.target as HTMLElement)?.classList?.contains('workboard-inner-pad');
    
    if (isMiddleClick || isSpacePressed || isWorkboardTarget) {
      e.preventDefault();
      const startX = e.clientX;
      const startY = e.clientY;
      const initialScrollLeft = workboardRef.current.scrollLeft;
      const initialScrollTop = workboardRef.current.scrollTop;

      const handlePanMove = (moveEvent: MouseEvent) => {
        if (!workboardRef.current) return;
        workboardRef.current.scrollLeft = initialScrollLeft - (moveEvent.clientX - startX);
        workboardRef.current.scrollTop = initialScrollTop - (moveEvent.clientY - startY);
      };

      const handlePanUp = () => {
        window.removeEventListener('mousemove', handlePanMove);
        window.removeEventListener('mouseup', handlePanUp);
      };

      window.addEventListener('mousemove', handlePanMove);
      window.addEventListener('mouseup', handlePanUp);
    }
  };

  const handleAddFrameLayer = () => {
    const frameLayers = builderTemplate.layers.filter((l: any) => l.type === 'frame');
    const order = frameLayers.length + 1;
    const newLayer = {
      id: 'l-fr-' + Date.now(),
      type: 'frame',
      label: `Frame #${order}`,
      order: order,
      x: 10 + (order * 5) % 40,
      y: 10 + (order * 5) % 40,
      width: 40,
      height: 30,
      borderSize: 4,
      borderColor: '#ffffff',
      cornerRadius: 8,
      shadowColor: 'rgba(0,0,0,0.15)',
      shadowBlur: 10,
      shadowOffsetX: 0,
      shadowOffsetY: 4,
      rotation: 0,
      opacity: 100,
      locked: false,
      visible: true,
      aspectRatio: 'free'
    };
    updateTemplateAndHistory((prev: any) => ({ ...prev, layers: [...prev.layers, newLayer] }));
    setSelectedLayerId(newLayer.id);
  };

  const getResolvedFontFamily = (font?: string) => {
    switch (font) {
      case 'Patrick Hand': return '"Patrick Hand", "Mali", cursive';
      case 'Caveat': return '"Caveat", cursive';
      case 'Mali': return '"Mali", cursive';
      case 'Itim': return '"Itim", cursive';
      case 'Dancing Script': return '"Dancing Script", cursive';
      case 'Be Vietnam Pro': return '"Be Vietnam Pro", sans-serif';
      case 'Cormorant Garamond': return '"Cormorant Garamond", serif';
      default: return font || '"Patrick Hand", "Mali", cursive';
    }
  };

  const handleAddTextLayer = (withBackground: boolean = true) => {
    const newLayer = {
      id: 'l-txt-' + Date.now(),
      type: 'text',
      text: 'Nhập chữ...',
      x: 28,
      y: 10,
      width: 44,
      height: 8,
      fontSize: 26,
      fontColor: '#2b2b2b',
      fontFamily: 'Patrick Hand',
      backgroundColor: withBackground ? '#fad2d8' : 'transparent',
      bgRadius: 999,
      bgPadding: 8,
      fontWeight: 'bold',
      fontStyle: 'normal',
      align: 'center',
      rotation: 0,
      opacity: 100,
      locked: false,
      visible: true,
      shadowColor: 'rgba(0,0,0,0.0)',
      shadowBlur: 0,
      shadowOffsetX: 0,
      shadowOffsetY: 0,
      letterSpacing: 0,
      strokeSize: 0,
      strokeColor: '#ffffff'
    };
    updateTemplateAndHistory((prev: any) => ({ ...prev, layers: [...prev.layers, newLayer] }));
    setSelectedLayerId(newLayer.id);
    setEditingTextLayerId(newLayer.id);
  };

  const handleAddStickerLayer = (stickerUrl: string) => {
    const newLayer = {
      id: 'l-stk-' + Date.now(),
      type: 'sticker',
      url: stickerUrl,
      x: 35,
      y: 35,
      width: 20,
      height: 20,
      rotation: 0,
      opacity: 100,
      locked: false,
      visible: true,
      shadowColor: 'rgba(0,0,0,0.1)',
      shadowBlur: 5,
      shadowOffsetX: 0,
      shadowOffsetY: 2,
      flipX: false,
      flipY: false
    };
    updateTemplateAndHistory((prev: any) => ({ ...prev, layers: [...prev.layers, newLayer] }));
    setSelectedLayerId(newLayer.id);
  };

  const handleAddLogoLayer = (logoUrl: string) => {
    const newLayer = {
      id: 'l-logo-' + Date.now(),
      type: 'logo',
      url: logoUrl,
      logoText: '🎀 HANIU',
      x: 35,
      y: 85,
      width: 30,
      height: 8,
      rotation: 0,
      opacity: 100,
      locked: false,
      visible: true,
      color: '#475569',
      size: 20,
      flipX: false,
      flipY: false
    };
    updateTemplateAndHistory((prev: any) => ({ ...prev, layers: [...prev.layers, newLayer] }));
    setSelectedLayerId(newLayer.id);
  };

  const handleAddShapeLayer = (shapeType: 'rect' | 'circle' | 'triangle' | 'heart' | 'star') => {
    const newLayer = {
      id: 'l-shp-' + Date.now(),
      type: 'shape',
      shapeType: shapeType,
      x: 30,
      y: 30,
      width: 25,
      height: 25,
      fillColor: '#fda4af',
      borderColor: '#f43f5e',
      borderSize: 0,
      cornerRadius: shapeType === 'circle' ? 999 : 8,
      rotation: 0,
      opacity: 80,
      locked: false,
      visible: true,
      shadowColor: 'rgba(0,0,0,0.1)',
      shadowBlur: 5,
      shadowOffsetX: 0,
      shadowOffsetY: 2
    };
    updateTemplateAndHistory((prev: any) => ({ ...prev, layers: [...prev.layers, newLayer] }));
    setSelectedLayerId(newLayer.id);
  };

  const handleAddOverlayLayer = () => {
    const newLayer = {
      id: 'l-ovl-' + Date.now(),
      type: 'overlay',
      url: '',
      label: 'Lớp Phủ Thiết Kế',
      x: 0,
      y: 0,
      width: 100,
      height: 100,
      rotation: 0,
      opacity: 100,
      locked: false,
      visible: true,
      shadowColor: 'rgba(0,0,0,0)',
      shadowBlur: 0,
      shadowOffsetX: 0,
      shadowOffsetY: 0
    };
    updateTemplateAndHistory((prev: any) => ({ ...prev, layers: [...prev.layers, newLayer] }));
    setSelectedLayerId(newLayer.id);
  };

  const handleDuplicateLayer = (layer: any) => {
    const currentFrameCount = (builderTemplate.layers || []).filter((l: any) => l.type === 'frame').length;
    const newLayer = {
      ...JSON.parse(JSON.stringify(layer)),
      id: 'l-dup-' + Date.now(),
      x: Math.min(80, layer.x + 5),
      y: Math.min(80, layer.y + 5),
      label: layer.label ? `${layer.label} (Sao chép)` : undefined,
      order: layer.type === 'frame' ? currentFrameCount + 1 : layer.order,
      text: layer.text ? `${layer.text} Copy` : undefined,
      locked: false
    };
    updateTemplateAndHistory((prev: any) => ({ ...prev, layers: [...prev.layers, newLayer] }));
    setSelectedLayerId(newLayer.id);
  };

  const handleDeleteLayer = (layerId: string) => {
    updateTemplateAndHistory((prev: any) => ({
      ...prev,
      layers: prev.layers.filter((l: any) => l.id !== layerId)
    }));
    setSelectedLayerId(null);
  };

  const updateSelectedLayer = (updates: any) => {
    if (!selectedLayerId) return;
    updateTemplateAndHistory((prev: any) => ({
      ...prev,
      layers: prev.layers.map((l: any) => l.id === selectedLayerId ? { ...l, ...updates } : l)
    }));
  };

  const handleMoveLayerUp = (idx: number) => {
    if (idx === builderTemplate.layers.length - 1) return;
    const newLayers = [...builderTemplate.layers];
    const temp = newLayers[idx];
    newLayers[idx] = newLayers[idx + 1];
    newLayers[idx + 1] = temp;
    updateTemplateAndHistory((prev: any) => ({ ...prev, layers: newLayers }));
  };

  const handleMoveLayerDown = (idx: number) => {
    if (idx === 0) return;
    const newLayers = [...builderTemplate.layers];
    const temp = newLayers[idx];
    newLayers[idx] = newLayers[idx - 1];
    newLayers[idx - 1] = temp;
    updateTemplateAndHistory((prev: any) => ({ ...prev, layers: newLayers }));
  };

  const selectedLayer = builderTemplate?.layers.find((l: any) => l.id === selectedLayerId);

  const handleLayerMouseDown = (e: React.MouseEvent, layerId: string) => {
    const layer = builderTemplate.layers.find((l: any) => l.id === layerId);
    if (!layer) return;

    const isLocked = layer.locked === true || layer.locked === 'true';
    const isVisible = layer.visible !== false && layer.visible !== 'false';
    if (isLocked || !isVisible) return;

    e.stopPropagation();
    setSelectedLayerId(layerId);
    
    if (!builderContainerRef.current) return;

    const rect = builderContainerRef.current.getBoundingClientRect();
    const startX = e.clientX;
    const startY = e.clientY;
    const initialX = Number(layer.x) || 0;
    const initialY = Number(layer.y) || 0;
    const layerWidth = Number(layer.width) || 10;
    const layerHeight = Number(layer.height) || 10;
    let didMove = false;

    const handleMouseMove = (moveEvent: MouseEvent) => {
      didMove = true;
      const deltaX = ((moveEvent.clientX - startX) / rect.width) * 100;
      const deltaY = ((moveEvent.clientY - startY) / rect.height) * 100;
      
      let newX = Math.max(0, Math.min(100 - layerWidth, initialX + deltaX));
      let newY = Math.max(0, Math.min(100 - layerHeight, initialY + deltaY));
      
      if (snapToGrid) {
        newX = Math.round(newX / 5) * 5;
        newY = Math.round(newY / 5) * 5;
      } else {
        newX = Math.round(newX * 10) / 10;
        newY = Math.round(newY * 10) / 10;
      }
      
      setBuilderTemplate((prev: any) => {
        const cur = prev.layers.find((l: any) => l.id === layerId);
        if (cur && cur.x === newX && cur.y === newY) {
          return prev;
        }
        return {
          ...prev,
          layers: prev.layers.map((l: any) => l.id === layerId ? { ...l, x: newX, y: newY } : l)
        };
      });
    };

    const handleMouseUp = () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      if (didMove) {
        setBuilderTemplate((current: any) => {
          setTimeout(() => recordHistory(current), 0);
          return current;
        });
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
  };

  const getBackgroundStyle = () => {
    if (builderTemplate.backgroundType === 'gradient') {
      const grad = builderTemplate.backgroundGradient || { color1: '#fda4af', color2: '#f43f5e', angle: 45 };
      return {
        background: `linear-gradient(${grad.angle || 45}deg, ${grad.color1 || '#fda4af'}, ${grad.color2 || '#f43f5e'})`
      };
    } else if (
      builderTemplate.backgroundType === 'image' ||
      builderTemplate.background?.startsWith('http') ||
      builderTemplate.background?.startsWith('data:')
    ) {
      return {
        backgroundImage: `url(${builderTemplate.background})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      };
    } else {
      return {
        backgroundColor: builderTemplate.background || '#ffffff'
      };
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-900/90 dark:bg-zinc-950/95 z-50 flex flex-col h-screen select-none font-sans">
      
      {/* 3-STEP WIZARD MODAL */}
      {wizardStep > 0 && (
        <TemplateWizard
          builderTemplate={builderTemplate}
          setBuilderTemplate={setBuilderTemplate}
          assets={assets}
          onClose={() => {
            if (builderTemplate.isNew) {
              onClose();
            } else {
              setWizardStep(0);
            }
          }}
          onFinishWizard={() => {
            setBuilderTemplate((prev: any) => ({ ...prev, isNew: false }));
            setWizardStep(0);
          }}
        />
      )}

      {/* TOP MODERN HEADER BAR */}
      <header className="h-14 border-b border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 px-5 py-2 flex items-center justify-between shrink-0 shadow-2xs z-30 select-none gap-3">
        
        {/* LEFT ZONE: Back Navigation & Template Metadata */}
        <div className="flex items-center gap-3 min-w-0 shrink-0">
          <button 
            onClick={onClose}
            className="w-9 h-9 rounded-xl hover:bg-rose-50 hover:border-rose-300 dark:hover:bg-rose-950/30 dark:hover:border-rose-800 flex items-center justify-center border border-slate-200 dark:border-zinc-750 text-slate-600 dark:text-zinc-300 hover:text-rose-600 cursor-pointer transition-all shadow-2xs shrink-0"
            title="Quay lại danh sách Template"
          >
            <ArrowLeft size={16} strokeWidth={2} />
          </button>

          <div className="flex flex-col min-w-0">
            <input 
              type="text"
              value={builderTemplate.name}
              onChange={e => setBuilderTemplate((prev: any) => ({ ...prev, name: e.target.value }))}
              className="font-bold text-xs sm:text-sm text-slate-800 dark:text-zinc-100 focus:outline-none bg-transparent hover:bg-slate-100/80 dark:hover:bg-zinc-800/60 focus:bg-slate-100 dark:focus:bg-zinc-800 rounded-md px-1.5 -ml-1.5 py-0.5 transition-colors truncate w-44 sm:w-60 md:w-72"
              placeholder="Tên Template..."
            />
            <div className="flex items-center gap-1.5 text-[10px] text-slate-400 dark:text-zinc-500 font-semibold uppercase tracking-wider">
              <span>Canva Photobooth</span>
              <span className="w-1 h-1 rounded-full bg-slate-300 dark:bg-zinc-650" />
              <span className="font-mono text-slate-500 dark:text-zinc-400">
                {builderTemplate.canvasWidth}×{builderTemplate.canvasHeight} px
              </span>
            </div>
          </div>
        </div>

        {/* CENTER ZONE: Workspace Tools & Helpers (Segmented Capsules) */}
        <div className="hidden lg:flex items-center gap-2.5 shrink-0">
          
          {/* History Segment (Undo / Redo) */}
          <div className="h-9 flex items-center bg-slate-100/90 dark:bg-zinc-800/90 p-0.5 rounded-xl border border-slate-200/80 dark:border-zinc-700/60 shadow-2xs">
            <button
              onClick={handleUndo}
              disabled={historyIndex <= 0}
              className="h-7.5 px-2.5 rounded-lg text-xs font-bold flex items-center gap-1.5 text-slate-700 dark:text-zinc-200 hover:bg-white dark:hover:bg-zinc-700 disabled:opacity-30 disabled:hover:bg-transparent cursor-pointer disabled:cursor-not-allowed transition-all shadow-2xs"
              title="Hoàn tác (Ctrl + Z)"
            >
              <Undo2 size={14} strokeWidth={2} />
              <span>Undo</span>
            </button>
            <div className="w-px h-3.5 bg-slate-300 dark:bg-zinc-700 mx-0.5" />
            <button
              onClick={handleRedo}
              disabled={historyIndex >= history.length - 1}
              className="h-7.5 px-2.5 rounded-lg text-xs font-bold flex items-center gap-1.5 text-slate-700 dark:text-zinc-200 hover:bg-white dark:hover:bg-zinc-700 disabled:opacity-30 disabled:hover:bg-transparent cursor-pointer disabled:cursor-not-allowed transition-all shadow-2xs"
              title="Làm lại (Ctrl + Y hoặc Ctrl + Shift + Z)"
            >
              <span>Redo</span>
              <Redo2 size={14} strokeWidth={2} />
            </button>
          </div>

          {/* Sidebar Panels Toggle Segment (Icon-Only Buttons) */}
          <div className="h-9 flex items-center bg-slate-100/90 dark:bg-zinc-800/90 p-0.5 rounded-xl border border-slate-200/80 dark:border-zinc-700/60 shadow-2xs">
            <button
              type="button"
              onClick={() => setShowLeftSidebar(p => !p)}
              className={`h-7.5 w-8 rounded-lg flex items-center justify-center transition-all cursor-pointer ${
                showLeftSidebar
                  ? 'bg-white dark:bg-zinc-700 text-rose-600 dark:text-rose-400 shadow-xs font-bold'
                  : 'text-slate-500 dark:text-zinc-400 hover:text-slate-800 dark:hover:text-zinc-200'
              }`}
              title={showLeftSidebar ? 'Đóng thanh công cụ trái' : 'Mở thanh công cụ trái'}
            >
              <PanelLeft size={16} strokeWidth={2} />
            </button>
            <div className="w-px h-3.5 bg-slate-300 dark:bg-zinc-700 mx-0.5" />
            <button
              type="button"
              onClick={() => setShowRightSidebar(p => !p)}
              className={`h-7.5 w-8 rounded-lg flex items-center justify-center transition-all cursor-pointer ${
                showRightSidebar
                  ? 'bg-white dark:bg-zinc-700 text-rose-600 dark:text-rose-400 shadow-xs font-bold'
                  : 'text-slate-500 dark:text-zinc-400 hover:text-slate-800 dark:hover:text-zinc-200'
              }`}
              title={showRightSidebar ? 'Đóng bảng thuộc tính phải' : 'Mở bảng thuộc tính phải'}
            >
              <PanelRight size={16} strokeWidth={2} />
            </button>
          </div>

          {/* Canvas Smart Helpers Segment (Lưới hít & Nền ô ảnh) */}
          <div className="h-9 flex items-center bg-slate-100/90 dark:bg-zinc-800/90 p-0.5 rounded-xl border border-slate-200/80 dark:border-zinc-700/60 shadow-2xs">
            <button
              type="button"
              onClick={() => setSnapToGrid(p => !p)}
              className={`h-7.5 px-2.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                snapToGrid
                  ? 'bg-white dark:bg-zinc-700 text-rose-600 dark:text-rose-400 shadow-xs'
                  : 'text-slate-500 dark:text-zinc-400 hover:text-slate-800 dark:hover:text-zinc-200'
              }`}
              title="Bật/Tắt chế độ tự động hít vào lưới tọa độ 5%"
            >
              <Magnet size={14} strokeWidth={2} />
              <span>Lưới hít</span>
              {snapToGrid && <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse" />}
            </button>
            <div className="w-px h-3.5 bg-slate-300 dark:bg-zinc-700 mx-0.5" />
            <button
              type="button"
              onClick={() => updateTemplateAndHistory((prev: any) => ({ ...prev, showSlotBackground: !prev.showSlotBackground }))}
              className={`h-7.5 px-2.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                builderTemplate.showSlotBackground
                  ? 'bg-white dark:bg-zinc-700 text-rose-600 dark:text-rose-400 shadow-xs'
                  : 'text-slate-500 dark:text-zinc-400 hover:text-slate-800 dark:hover:text-zinc-200'
              }`}
              title="Bật/Tắt hiển thị hình mẫu xem trước bên trong các ô ảnh"
            >
              <ImageIcon size={14} strokeWidth={2} />
              <span>Nền ô ảnh</span>
              {builderTemplate.showSlotBackground && <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse" />}
            </button>
          </div>

        </div>

        {/* RIGHT ZONE: Main Actions (Strict h-9 Height Matching Center & Left Zones) */}
        <div className="flex items-center gap-2.5 shrink-0">
          <button 
            type="button"
            onClick={() => setWizardStep(1)}
            className="h-9 px-3.5 border border-slate-200 dark:border-zinc-750 bg-white dark:bg-zinc-800 hover:bg-slate-50 dark:hover:bg-zinc-750 text-slate-700 dark:text-zinc-200 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-2xs hover:shadow-sm"
            title="Mở hướng dẫn cấu hình nền và kích thước template"
          >
            <Palette size={14} strokeWidth={2} className="shrink-0 text-slate-500 dark:text-zinc-400" />
            <span>Cấu hình nền</span>
          </button>

          <button 
            type="button"
            onClick={() => {
              if (confirm('Nhân bản thiết kế hiện tại sang Template mới?')) {
                onClone(builderTemplate);
                onClose();
              }
            }}
            className="h-9 px-3.5 border border-slate-200 dark:border-zinc-750 bg-white dark:bg-zinc-800 hover:bg-slate-50 dark:hover:bg-zinc-750 text-slate-700 dark:text-zinc-200 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-2xs hover:shadow-sm"
            title="Tạo bản sao mới từ template này"
          >
            <Copy size={14} strokeWidth={2} className="shrink-0 text-slate-500 dark:text-zinc-400" />
            <span>Nhân Bản</span>
          </button>

          <button 
            type="button"
            onClick={onSave}
            className="h-9 px-4.5 bg-rose-600 hover:bg-rose-700 active:bg-rose-800 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-sm shadow-rose-600/25 active:scale-98 transition-all cursor-pointer"
            title="Lưu tất cả thay đổi"
          >
            <Save size={15} strokeWidth={2.2} className="shrink-0" />
            <span className="whitespace-nowrap tracking-wide">Lưu Thiết Kế</span>
          </button>
        </div>

      </header>

      {/* CORE WORKSPACE GRID */}
      <div className="flex-1 flex overflow-hidden">
        
        {/* LEFT TOOLBOX PANEL */}
        {showLeftSidebar && (
          <LeftToolbox
            builderTemplate={builderTemplate}
            setBuilderTemplate={updateTemplateAndHistory}
            selectedLayerId={selectedLayerId}
            setSelectedLayerId={setSelectedLayerId}
            assets={assets}
            handleAddFrameLayer={handleAddFrameLayer}
            handleAddTextLayer={handleAddTextLayer}
            handleAddShapeLayer={handleAddShapeLayer}
            handleAddStickerLayer={handleAddStickerLayer}
            handleAddLogoLayer={handleAddLogoLayer}
            handleDuplicateLayer={handleDuplicateLayer}
            handleMoveLayerUp={handleMoveLayerUp}
            handleMoveLayerDown={handleMoveLayerDown}
            handleAddOverlayLayer={handleAddOverlayLayer}
          />
        )}

        {/* WORKSPACE CENTRAL WORKBOARD CONTAINER */}
        <div className="flex-1 relative flex flex-col overflow-hidden min-w-0 min-h-0">
          
          {/* Scrollable Workboard */}
          <div 
            ref={workboardRef}
            onMouseDown={handleWorkboardMouseDown}
            className={`flex-1 bg-slate-100 dark:bg-zinc-950 overflow-auto select-none ${
              isSpacePressed ? 'cursor-grab active:cursor-grabbing' : 'cursor-default'
            }`}
          >
            {/* Inner flexible wrapper to guarantee centered alignment and full scrollability when canvas is huge */}
            <div className="workboard-inner-pad min-w-full min-h-full flex items-center justify-center p-12 md:p-20 w-fit h-fit m-auto">
            {/* Canva Canvas container */}
          <div 
            ref={builderContainerRef}
            className="relative shadow-2xl transition-all"
            style={{
              width: `${builderTemplate.canvasWidth * 0.25 * canvasZoom}px`,
              height: `${builderTemplate.canvasHeight * 0.25 * canvasZoom}px`,
              borderWidth: (builderTemplate.canvasBorderSize ?? 0) > 0
                ? `${Math.max(1, (builderTemplate.canvasBorderSize ?? 0) * 0.25 * canvasZoom)}px`
                : '1px',
              borderColor: (builderTemplate.canvasBorderSize ?? 0) > 0
                ? (builderTemplate.canvasBorderColor || '#ffffff')
                : 'rgba(203, 213, 225, 0.6)',
              borderStyle: (builderTemplate.canvasBorderSize ?? 0) > 0
                ? (builderTemplate.canvasBorderStyle || 'solid')
                : 'solid',
              borderRadius: `${(builderTemplate.canvasBorderRadius ?? 8) * 0.25 * canvasZoom}px`,
              ...getBackgroundStyle(),
              position: 'relative',
              boxSizing: 'border-box'
            }}
            onClick={() => setSelectedLayerId(null)}
          >
            {builderTemplate.layers?.map((layer: any, idx: number) => {
              if (layer.visible === false) return null;
              const isSelected = layer.id === selectedLayerId;
              
              // Shadow mapping
              const shadowStyle = layer.shadowColor 
                ? `${layer.shadowOffsetX || 0}px ${layer.shadowOffsetY || 4}px ${layer.shadowBlur || 10}px ${layer.shadowColor}` 
                : 'none';

              // Text outline stroke mapping
              const strokeStyle = layer.strokeSize > 0
                ? `${Math.max(1, layer.strokeSize * 0.75 * canvasZoom)}px ${layer.strokeColor || '#ffffff'}`
                : 'none';

              // Transformations including Flip Horizontal (FlipX) and Vertical (FlipY)
              let transformStr = layer.rotation ? `rotate(${layer.rotation}deg)` : '';
              if (layer.flipX) transformStr += ' scaleX(-1)';
              if (layer.flipY) transformStr += ' scaleY(-1)';

              return (
                <div
                  key={layer.id}
                  onMouseDown={(e) => handleLayerMouseDown(e, layer.id)}
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedLayerId(layer.id);
                  }}
                  className={`absolute select-none group flex items-center justify-center border transition-all ${
                    layer.locked ? 'cursor-not-allowed' : 'cursor-move'
                  } ${
                    isSelected 
                      ? 'border-2 border-rose-500 shadow-[0_0_12px_rgba(244,63,94,0.3)] z-30' 
                      : 'border-dashed border-slate-350 hover:border-rose-500/50 hover:bg-rose-500/5 z-10'
                  }`}
                  style={{
                    left: `${layer.x}%`,
                    top: `${layer.y}%`,
                    width: `${layer.width}%`,
                    height: `${layer.height}%`,
                    transform: transformStr || 'none',
                    opacity: (layer.opacity ?? 100) / 100,
                    boxShadow: layer.type !== 'frame' ? shadowStyle : 'none',
                    pointerEvents: (layer.locked && !isSelected) ? 'none' : 'auto'
                  }}
                >
                  
                  {/* FRAME LAYER RENDERING */}
                  {layer.type === 'frame' && (
                    <>
                      {layer.frameShape === 'custom-path' && layer.framePath && (
                        <svg width="0" height="0" className="absolute">
                          <defs>
                            <clipPath id={`clip-${layer.id}`} clipPathUnits="objectBoundingBox">
                              <path d={layer.framePath} transform="scale(0.01)" />
                            </clipPath>
                          </defs>
                        </svg>
                      )}
                      <div 
                        className={`w-full h-full flex flex-col items-center justify-center text-slate-455 border transition-all ${
                          builderTemplate.showSlotBackground ? 'bg-slate-50 dark:bg-zinc-900' : 'bg-transparent'
                        }`}
                        style={{
                          borderWidth: (layer.frameShape === 'rect' || layer.frameShape === 'circle') ? `${layer.borderSize ?? 4}px` : '0px',
                          borderColor: layer.borderColor || '#ffffff',
                          borderRadius: layer.frameShape === 'circle' ? '999px' : (layer.frameShape && layer.frameShape !== 'rect' && layer.frameShape !== 'custom' && layer.frameShape !== 'custom-path' ? '0px' : `${layer.cornerRadius ?? 8}px`),
                          clipPath: layer.frameShape === 'custom-path'
                            ? (layer.framePath ? `url(#clip-${layer.id})` : (layer.framePolygon ? `polygon(${layer.framePolygon})` : 'none'))
                            : (layer.frameShape && layer.frameShape !== 'rect' && layer.frameShape !== 'circle' && layer.frameShape !== 'custom'
                               ? (layer.frameShape === 'triangle' ? 'polygon(50% 0%, 0% 100%, 100% 100%)' 
                                  : layer.frameShape === 'heart' ? 'polygon(50% 24%, 62% 10%, 78% 10%, 90% 20%, 94% 40%, 82% 65%, 50% 95%, 18% 65%, 6% 40%, 10% 20%, 26% 10%, 38% 24%)'
                                  : 'polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)')
                               : 'none'),
                          boxShadow: shadowStyle
                        }}
                      >
                        {layer.frameShape === 'custom' && layer.frameMaskUrl && (
                          <img 
                            src={layer.frameMaskUrl} 
                            alt="custom mask" 
                            className="absolute inset-0 w-full h-full object-fill pointer-events-none z-10" 
                          />
                        )}
                        {layer.frameShape && layer.frameShape !== 'rect' && layer.frameShape !== 'circle' && layer.frameShape !== 'custom' && (
                          <svg className="absolute inset-0 w-full h-full pointer-events-none z-15" viewBox="0 0 100 100" preserveAspectRatio="none">
                            {layer.frameShape === 'custom-path' && layer.framePath ? (
                              <path 
                                d={layer.framePath}
                                fill="none"
                                stroke={layer.borderColor || '#ffffff'}
                                strokeWidth={(layer.borderSize ?? 4) * 2}
                                vectorEffect="non-scaling-stroke"
                              />
                            ) : (
                              <polygon 
                                points={
                                  layer.frameShape === 'triangle' ? '50 0, 0 100, 100 100'
                                  : layer.frameShape === 'heart' ? '50 24, 62 10, 78 10, 90 20, 94 40, 82 65, 50 95, 18 65, 6 40, 10 20, 26 10, 38 24'
                                  : layer.frameShape === 'custom-path' && layer.framePolygon ? layer.framePolygon.replace(/%/g, '')
                                  : '50 0, 61 35, 98 35, 68 57, 79 91, 50 70, 21 91, 32 57, 2 35, 39 35'
                                }
                                fill="none"
                                stroke={layer.borderColor || '#ffffff'}
                                strokeWidth={(layer.borderSize ?? 4) * 2}
                                vectorEffect="non-scaling-stroke"
                              />
                            )}
                          </svg>
                        )}
                        <Icon name="camera" size={24} className="text-slate-400" />
                        <span className="text-[9px] font-black uppercase mt-1 text-slate-455">{layer.label}</span>
                        <span className="absolute top-2 left-2 bg-rose-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-[10px] font-black">
                          {layer.order || 1}
                        </span>
                      </div>
                    </>
                  )}

                  {/* TEXT LAYER RENDERING */}
                  {layer.type === 'text' && (() => {
                    const textScale = 0.75 * canvasZoom;
                    const bgCol = layer.backgroundColor || layer.bg;
                    const hasBg = bgCol && bgCol !== 'transparent';
                    const radiusVal = (layer.bgRadius ?? 0) >= 999 ? '9999px' : `${(layer.bgRadius ?? 0) * textScale}px`;
                    const isEditing = editingTextLayerId === layer.id;
                    
                    return (
                      <div
                        className="w-full h-full flex items-center justify-center select-none overflow-visible transition-all"
                        style={{
                          backgroundColor: hasBg ? bgCol : 'transparent',
                          borderRadius: radiusVal,
                          borderWidth: (hasBg && (layer.bgBorderSize ?? 0) > 0) ? `${Math.max(1, (layer.bgBorderSize ?? 0) * textScale)}px` : '0px',
                          borderColor: layer.bgBorderColor || '#ffffff',
                          borderStyle: (layer.bgBorderStyle as any) || 'solid',
                          boxShadow: hasBg && layer.shadowColor ? shadowStyle : 'none'
                        }}
                      >
                        {isEditing ? (
                          <textarea
                            autoFocus
                            rows={1}
                            value={layer.text || ''}
                            onClick={e => e.stopPropagation()}
                            onMouseDown={e => e.stopPropagation()}
                            onFocus={e => {
                              if (layer.text === 'Nhập chữ...' || layer.text === 'Văn bản mới') {
                                e.target.select();
                              }
                            }}
                            onChange={e => {
                              updateSelectedLayer({ text: e.target.value });
                            }}
                            onKeyDown={e => {
                              if (e.key === 'Enter' && !e.shiftKey) {
                                e.preventDefault();
                                const trimmed = (layer.text || '').trim();
                                if (!trimmed || trimmed === 'Nhập chữ...') {
                                  handleDeleteLayer(layer.id);
                                }
                                setEditingTextLayerId(null);
                              } else if (e.key === 'Escape') {
                                const trimmed = (layer.text || '').trim();
                                if (!trimmed || trimmed === 'Nhập chữ...') {
                                  handleDeleteLayer(layer.id);
                                }
                                setEditingTextLayerId(null);
                              }
                            }}
                            onBlur={() => {
                              const trimmed = (layer.text || '').trim();
                              if (!trimmed) {
                                handleDeleteLayer(layer.id);
                              }
                              setEditingTextLayerId(null);
                            }}
                            className="w-full h-full bg-transparent text-center border-none outline-none resize-none overflow-hidden p-0 font-bold block"
                            style={{
                              fontSize: `${Math.max(10, (layer.fontSize || 24) * textScale)}px`,
                              color: layer.fontColor || '#2b2b2b',
                              fontFamily: getResolvedFontFamily(layer.fontFamily),
                              fontWeight: layer.fontWeight || 'bold',
                              fontStyle: layer.fontStyle || 'normal',
                              textAlign: (layer.align || 'center') as any,
                              letterSpacing: `${layer.letterSpacing || 0}px`,
                            }}
                          />
                        ) : (
                          <span 
                            onDoubleClick={(e) => {
                              e.stopPropagation();
                              setEditingTextLayerId(layer.id);
                            }}
                            className="block text-center select-none whitespace-pre-wrap leading-tight font-bold px-1 cursor-text"
                            style={{
                              fontSize: `${Math.max(10, (layer.fontSize || 24) * textScale)}px`,
                              color: layer.fontColor || '#2b2b2b',
                              fontFamily: getResolvedFontFamily(layer.fontFamily),
                              fontWeight: layer.fontWeight || 'bold',
                              fontStyle: layer.fontStyle || 'normal',
                              textAlign: (layer.align || 'center') as any,
                              letterSpacing: `${layer.letterSpacing || 0}px`,
                              WebkitTextStroke: strokeStyle,
                              paintOrder: 'stroke fill'
                            }}
                          >
                            {layer.text || 'Nhập chữ...'}
                          </span>
                        )}
                      </div>
                    );
                  })()}

                  {/* STICKER LAYER RENDERING */}
                  {layer.type === 'sticker' && (
                    <img 
                      src={layer.url} 
                      alt="sticker" 
                      className="w-full h-full object-contain pointer-events-none"
                    />
                  )}

                  {/* OVERLAY LAYER RENDERING */}
                  {layer.type === 'overlay' && (
                    layer.url ? (
                      <img 
                        src={layer.url} 
                        alt="overlay layer" 
                        className="w-full h-full object-fill pointer-events-none"
                      />
                    ) : (
                      <div className="w-full h-full bg-slate-200/50 dark:bg-zinc-800/50 border border-dashed border-slate-400 dark:border-zinc-700 flex flex-col items-center justify-center text-slate-400 dark:text-zinc-500 text-[10px] p-2 text-center leading-normal">
                        <Icon name="image" size={22} className="mb-1 text-slate-400" />
                        <span>LỚP PHỦ TRỐNG</span>
                        <span className="text-[8px] mt-1">Click chọn để tải ảnh lớp phủ (.png)</span>
                      </div>
                    )
                  )}

                  {/* LOGO LAYER RENDERING */}
                  {layer.type === 'logo' && (
                    <div className="flex items-center justify-center gap-1.5 w-full h-full">
                      {layer.url ? (
                        <img src={layer.url} alt="logo" className="max-h-full object-contain pointer-events-none" />
                      ) : (
                        <span 
                          className="font-bold select-none text-center block w-full truncate"
                          style={{
                            fontSize: `${(layer.size || 20) * 0.25 * canvasZoom}px`,
                            color: layer.color || '#475569'
                          }}
                        >
                          {layer.logoText}
                        </span>
                      )}
                    </div>
                  )}

                  {/* SHAPE LAYER RENDERING */}
                  {layer.type === 'shape' && (
                    <div 
                      className="w-full h-full transition-all flex items-center justify-center"
                      style={{
                        backgroundColor: layer.fillColor || '#fda4af',
                        borderWidth: `${layer.borderSize ?? 0}px`,
                        borderColor: layer.borderColor || '#f43f5e',
                        borderStyle: layer.borderSize > 0 ? 'solid' : 'none',
                        borderRadius: layer.shapeType === 'circle' ? '999px' : `${layer.cornerRadius ?? 8}px`,
                        clipPath: layer.shapeType === 'triangle' ? 'polygon(50% 0%, 0% 100%, 100% 100%)' : 'none'
                      }}
                    >
                      {layer.shapeType === 'heart' && (
                        <div className="w-full h-full flex items-center justify-center" style={{ backgroundColor: 'transparent' }}>
                          <Icon name="heart" size={Math.min(48, Math.max(16, 28 * canvasZoom))} className="text-red-500 fill-red-500" />
                        </div>
                      )}
                      {layer.shapeType === 'star' && (
                        <div className="w-full h-full flex items-center justify-center" style={{ backgroundColor: 'transparent' }}>
                          <Icon name="star" size={Math.min(48, Math.max(16, 28 * canvasZoom))} className="text-yellow-500 fill-yellow-500" />
                        </div>
                      )}
                    </div>
                  )}

                  {/* RESIZE HANDLE */}
                  {isSelected && !(layer.locked === true || layer.locked === 'true') && (
                    <div 
                      className="absolute bottom-[-6px] right-[-6px] w-3.5 h-3.5 rounded-full bg-rose-600 border border-white cursor-se-resize shadow-md z-45 hover:scale-125 transition-transform"
                      onMouseDown={(e) => {
                        e.stopPropagation();
                        const startX = e.clientX;
                        const startY = e.clientY;
                        const startWidth = Number(layer.width) || 10;
                        const startHeight = Number(layer.height) || 10;
                        const rect = builderContainerRef.current!.getBoundingClientRect();
                        let didResize = false;

                        const handleResize = (moveEvent: MouseEvent) => {
                          didResize = true;
                          const deltaWidth = ((moveEvent.clientX - startX) / rect.width) * 100;
                          const deltaHeight = ((moveEvent.clientY - startY) / rect.height) * 100;

                          let rawW = Math.max(1, Math.min(100 - Number(layer.x), startWidth + deltaWidth));
                          let rawH = Math.max(1, Math.min(100 - Number(layer.y), startHeight + deltaHeight));

                          let w = snapToGrid ? Math.round(rawW / 5) * 5 : Math.round(rawW * 10) / 10;
                          let h = snapToGrid ? Math.round(rawH / 5) * 5 : Math.round(rawH * 10) / 10;

                          // Support Fixed Aspect Ratio resize for Frames
                          if (layer.type === 'frame' && layer.aspectRatio && layer.aspectRatio !== 'free') {
                            let ratioVal = 1;
                            if (layer.aspectRatio === '3:4') ratioVal = 3 / 4;
                            else if (layer.aspectRatio === '9:16') ratioVal = 9 / 16;
                            else if (layer.aspectRatio === '4:5') ratioVal = 4 / 5;
                            else if (layer.aspectRatio === '1:1') ratioVal = 1;
                            
                            h = Math.round(((w * builderTemplate.canvasWidth) / (builderTemplate.canvasHeight * ratioVal)) * 10) / 10;
                          }

                          setBuilderTemplate((prev: any) => {
                            const cur = prev.layers.find((l: any) => l.id === layer.id);
                            if (cur && cur.width === w && cur.height === h) {
                              return prev;
                            }
                            return {
                              ...prev,
                              layers: prev.layers.map((l: any) => l.id === layer.id ? { ...l, width: w, height: h } : l)
                            };
                          });
                        };

                        const handleResizeUp = () => {
                          window.removeEventListener('mousemove', handleResize);
                          window.removeEventListener('mouseup', handleResizeUp);
                          if (didResize) {
                            setBuilderTemplate((current: any) => {
                              setTimeout(() => recordHistory(current), 0);
                              return current;
                            });
                          }
                        };

                        window.addEventListener('mousemove', handleResize);
                        window.addEventListener('mouseup', handleResizeUp);
                      }}
                    />
                  )}

                </div>
              );
            })}

            {/* Visual Snap-to-Grid guidelines overlay */}
            {snapToGrid && (
              <div className="absolute inset-0 pointer-events-none z-25 overflow-hidden rounded-xl">
                {/* 5% sub-grid pattern */}
                <div 
                  className="w-full h-full opacity-25 dark:opacity-20"
                  style={{
                    backgroundImage: `
                      linear-gradient(to right, rgba(244, 63, 94, 0.4) 1px, transparent 1px),
                      linear-gradient(to bottom, rgba(244, 63, 94, 0.4) 1px, transparent 1px)
                    `,
                    backgroundSize: '5% 5%'
                  }}
                />
                {/* Center crosshair guides at 50% X and 50% Y */}
                <div className="absolute left-1/2 top-0 bottom-0 w-[1px] -translate-x-1/2 border-l border-dashed border-rose-500/70 pointer-events-none" />
                <div className="absolute top-1/2 left-0 right-0 h-[1px] -translate-y-1/2 border-t border-dashed border-rose-500/70 pointer-events-none" />
              </div>
            )}

            {/* Design template overlay PNG */}
            {builderTemplate.overlay && (
              <img 
                src={builderTemplate.overlay} 
                alt="layout overlay" 
                className="absolute inset-0 w-full h-full object-fill pointer-events-none z-20" 
              />
            )}
          </div>
          </div>
        </div>

        {/* Floating Zoom & View Controls Toolbar (Fixed to non-scrolling workspace parent) */}
        <div className="absolute bottom-5 right-5 z-40 flex items-center gap-1.5 bg-white/95 dark:bg-zinc-900/95 backdrop-blur-md border border-slate-200 dark:border-zinc-800 p-1.5 rounded-2xl shadow-xl">
            {/* Zoom out button */}
            <button 
              onClick={handleZoomOut}
              disabled={canvasZoom <= MIN_ZOOM}
              className="w-8 h-8 flex items-center justify-center rounded-xl text-slate-600 dark:text-zinc-300 hover:bg-slate-100 dark:hover:bg-zinc-800 disabled:opacity-40 disabled:hover:bg-transparent cursor-pointer font-bold transition-colors"
              title="Thu nhỏ (Ctrl + -)"
            >
              <Icon name="minus" size={14} />
            </button>

            {/* Percentage selector popover trigger */}
            <div className="relative">
              <button 
                onClick={() => setShowZoomMenu(p => !p)}
                className="px-2.5 h-8 flex items-center gap-1.5 rounded-xl text-xs font-black font-mono text-slate-700 dark:text-zinc-200 hover:bg-slate-100 dark:hover:bg-zinc-800 cursor-pointer transition-colors"
                title="Chọn mức zoom"
              >
                <span>{Math.round(canvasZoom * 100)}%</span>
                <Icon name="chevron-down" size={10} className="text-slate-400" />
              </button>

              {/* Zoom Presets Popover Menu */}
              {showZoomMenu && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setShowZoomMenu(false)} />
                  <div className="absolute bottom-full right-0 mb-2 w-36 bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-2xl shadow-2xl p-1.5 z-50 flex flex-col gap-0.5">
                    <div className="px-2 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                      Mức thu phóng
                    </div>
                    {[
                      { label: '500% (Tối đa)', value: 5.0 },
                      { label: '400%', value: 4.0 },
                      { label: '300%', value: 3.0 },
                      { label: '200%', value: 2.0 },
                      { label: '150%', value: 1.5 },
                      { label: '100% (Gốc)', value: 1.0 },
                      { label: '75%', value: 0.75 },
                      { label: '50%', value: 0.5 },
                      { label: '25%', value: 0.25 },
                    ].map(preset => (
                      <button
                        key={preset.value}
                        onClick={() => {
                          handleZoomChange(preset.value);
                          setShowZoomMenu(false);
                        }}
                        className={`w-full text-left px-2.5 py-1.5 rounded-xl text-xs font-bold flex items-center justify-between cursor-pointer transition-colors ${
                          Math.round(canvasZoom * 100) === Math.round(preset.value * 100)
                            ? 'bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400'
                            : 'text-slate-700 dark:text-zinc-300 hover:bg-slate-100 dark:hover:bg-zinc-800'
                        }`}
                      >
                        <span>{preset.label}</span>
                        {Math.round(canvasZoom * 100) === Math.round(preset.value * 100) && (
                          <Icon name="check" size={12} className="text-rose-600" />
                        )}
                      </button>
                    ))}
                    <div className="h-px bg-slate-100 dark:bg-zinc-800 my-1" />
                    <button
                      onClick={() => {
                        handleFitToScreen();
                        setShowZoomMenu(false);
                      }}
                      className="w-full text-left px-2.5 py-1.5 rounded-xl text-xs font-bold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 cursor-pointer flex items-center gap-1.5"
                    >
                      <Icon name="maximize" size={13} className="shrink-0" />
                      <span>Vừa màn hình</span>
                    </button>
                  </div>
                </>
              )}
            </div>

            {/* Zoom in button */}
            <button 
              onClick={handleZoomIn}
              disabled={canvasZoom >= MAX_ZOOM}
              className="w-8 h-8 flex items-center justify-center rounded-xl text-slate-600 dark:text-zinc-300 hover:bg-slate-100 dark:hover:bg-zinc-800 disabled:opacity-40 disabled:hover:bg-transparent cursor-pointer font-bold transition-colors"
              title="Phóng to (Ctrl + +)"
            >
              <Icon name="plus" size={14} />
            </button>

            <div className="w-px h-5 bg-slate-200 dark:bg-zinc-800 mx-0.5" />

            {/* Fit to screen button */}
            <button
              onClick={handleFitToScreen}
              className="px-2.5 h-8 flex items-center justify-center rounded-xl text-[11px] font-bold text-slate-600 dark:text-zinc-300 hover:bg-slate-100 dark:hover:bg-zinc-800 cursor-pointer transition-colors"
              title="Vừa màn hình (Ctrl + 0)"
            >
              Fit
            </button>

            {/* 100% reset button */}
            <button
              onClick={() => handleZoomChange(1.0)}
              className={`px-2 h-8 flex items-center justify-center rounded-xl text-[11px] font-bold transition-colors cursor-pointer ${
                Math.round(canvasZoom * 100) === 100
                  ? 'bg-rose-500 text-white'
                  : 'text-slate-600 dark:text-zinc-300 hover:bg-slate-100 dark:hover:bg-zinc-800'
              }`}
              title="Tỉ lệ 100%"
            >
              1:1
            </button>
          </div>
        </div>

        {/* RIGHT SIDEBAR PANEL: CONTEXTUAL LAYER PROPERTIES */}
        {showRightSidebar && (
          <RightProperties
            selectedLayer={selectedLayer}
            updateSelectedLayer={updateSelectedLayer}
            handleDeleteLayer={handleDeleteLayer}
            builderTemplate={builderTemplate}
            setBuilderTemplate={updateTemplateAndHistory}
          />
        )}

      </div>

    </div>
  );
};
