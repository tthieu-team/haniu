'use client';

import React, { useState, useRef, useEffect } from 'react';
import Icon from '@/components/common/Icons';
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
  const builderContainerRef = useRef<HTMLDivElement>(null);

  // Handle arrow key navigation for selected layer
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!selectedLayerId || wizardStep > 0) return;
      const activeElement = document.activeElement;
      if (activeElement && (activeElement.tagName === 'INPUT' || activeElement.tagName === 'TEXTAREA' || activeElement.tagName === 'SELECT')) {
        return; // Avoid intercepting when typing in inputs
      }

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

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedLayerId, builderTemplate.layers, wizardStep, snapToGrid]);

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
    setBuilderTemplate((prev: any) => ({ ...prev, layers: [...prev.layers, newLayer] }));
    setSelectedLayerId(newLayer.id);
  };

  const handleAddTextLayer = () => {
    const newLayer = {
      id: 'l-txt-' + Date.now(),
      type: 'text',
      text: 'HANIU PHOTOBOOTH',
      x: 25,
      y: 75,
      width: 50,
      height: 8,
      fontSize: 28,
      fontColor: '#1e293b',
      fontFamily: 'sans-serif',
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
    setBuilderTemplate((prev: any) => ({ ...prev, layers: [...prev.layers, newLayer] }));
    setSelectedLayerId(newLayer.id);
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
    setBuilderTemplate((prev: any) => ({ ...prev, layers: [...prev.layers, newLayer] }));
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
    setBuilderTemplate((prev: any) => ({ ...prev, layers: [...prev.layers, newLayer] }));
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
    setBuilderTemplate((prev: any) => ({ ...prev, layers: [...prev.layers, newLayer] }));
    setSelectedLayerId(newLayer.id);
  };

  const handleDuplicateLayer = (layer: any) => {
    const newLayer = {
      ...JSON.parse(JSON.stringify(layer)),
      id: 'l-dup-' + Date.now(),
      x: Math.min(80, layer.x + 5),
      y: Math.min(80, layer.y + 5),
      label: layer.label ? `${layer.label} (Sao chép)` : undefined,
      text: layer.text ? `${layer.text} Copy` : undefined,
      locked: false
    };
    setBuilderTemplate((prev: any) => ({ ...prev, layers: [...prev.layers, newLayer] }));
    setSelectedLayerId(newLayer.id);
  };

  const handleDeleteLayer = (layerId: string) => {
    setBuilderTemplate((prev: any) => ({
      ...prev,
      layers: prev.layers.filter((l: any) => l.id !== layerId)
    }));
    setSelectedLayerId(null);
  };

  const updateSelectedLayer = (updates: any) => {
    if (!selectedLayerId) return;
    setBuilderTemplate((prev: any) => ({
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
    setBuilderTemplate((prev: any) => ({ ...prev, layers: newLayers }));
  };

  const handleMoveLayerDown = (idx: number) => {
    if (idx === 0) return;
    const newLayers = [...builderTemplate.layers];
    const temp = newLayers[idx];
    newLayers[idx] = newLayers[idx - 1];
    newLayers[idx - 1] = temp;
    setBuilderTemplate((prev: any) => ({ ...prev, layers: newLayers }));
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

    const handleMouseMove = (moveEvent: MouseEvent) => {
      const deltaX = ((moveEvent.clientX - startX) / rect.width) * 100;
      const deltaY = ((moveEvent.clientY - startY) / rect.height) * 100;
      
      let newX = Math.round(Math.max(0, Math.min(100 - layerWidth, initialX + deltaX)));
      let newY = Math.round(Math.max(0, Math.min(100 - layerHeight, initialY + deltaY)));
      
      if (snapToGrid) {
        newX = Math.round(newX / 5) * 5;
        newY = Math.round(newY / 5) * 5;
      }
      
      setBuilderTemplate((prev: any) => ({
        ...prev,
        layers: prev.layers.map((l: any) => l.id === layerId ? { ...l, x: newX, y: newY } : l)
      }));
    };

    const handleMouseUp = () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
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

      {/* TOP HEADER BAR */}
      <div className="h-16 border-b border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 px-6 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-4">
          <button 
            onClick={onClose}
            className="w-9 h-9 rounded-xl hover:bg-slate-50 dark:hover:bg-zinc-850 flex items-center justify-center border border-slate-200 dark:border-zinc-800 text-slate-500 cursor-pointer"
          >
            <Icon name="arrow-left" size={14} />
          </button>
          <div>
            <input 
              type="text"
              value={builderTemplate.name}
              onChange={e => setBuilderTemplate((prev: any) => ({ ...prev, name: e.target.value }))}
              className="font-black text-sm uppercase text-slate-800 dark:text-zinc-200 focus:outline-none focus:border-b focus:border-rose-500 bg-transparent py-0.5"
              placeholder="Nhập tên Template..."
            />
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
              Trình biên tập Canva Haniu • Tỉ lệ: {builderTemplate.canvasWidth}x{builderTemplate.canvasHeight} px
            </p>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-2 overflow-x-auto scrollbar-none shrink-0">
          <button
            onClick={() => setSnapToGrid(p => !p)}
            className={`px-3 py-2 rounded-xl text-[10px] font-black uppercase tracking-wider border cursor-pointer transition-colors ${
              snapToGrid 
                ? 'bg-rose-500 text-white border-rose-600' 
                : 'bg-white dark:bg-zinc-850 border-slate-200 text-slate-600'
            }`}
          >
            {snapToGrid ? '🧲 Hít lưới: BẬT' : '🧲 Hít lưới: TẮT'}
          </button>

          <button
            onClick={() => setBuilderTemplate((prev: any) => ({ ...prev, showSlotBackground: !prev.showSlotBackground }))}
            className={`px-3 py-2 rounded-xl text-[10px] font-black uppercase tracking-wider border cursor-pointer transition-colors ${
              builderTemplate.showSlotBackground
                ? 'bg-rose-500 text-white border-rose-600'
                : 'bg-white dark:bg-zinc-850 border-slate-200 text-slate-600'
            }`}
          >
            {builderTemplate.showSlotBackground ? '🖼️ Nền ô ảnh: BẬT' : '🖼️ Nền ô ảnh: TẮT'}
          </button>
          
          <button 
            onClick={() => setWizardStep(1)}
            className="px-3 py-2 border border-slate-200 dark:border-zinc-805 text-slate-600 dark:text-zinc-400 hover:bg-slate-50 dark:hover:bg-zinc-800 rounded-xl text-[10px] font-black uppercase tracking-wider cursor-pointer"
          >
            Cấu hình nền
          </button>
          <button 
            onClick={() => {
              if (confirm('Nhân bản thiết kế hiện tại sang Template mới?')) {
                onClone(builderTemplate);
                onClose();
              }
            }}
            className="px-4 py-2 border border-slate-200 dark:border-zinc-850 rounded-xl text-xs font-black uppercase tracking-wider cursor-pointer"
          >
            Nhân Bản
          </button>
          <button 
            onClick={onSave}
            className="px-5 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-black uppercase tracking-wider shadow-md shadow-rose-600/15 cursor-pointer"
          >
            Lưu Thiết Kế
          </button>
        </div>
      </div>

      {/* CORE WORKSPACE GRID */}
      <div className="flex-1 flex overflow-hidden">
        
        {/* LEFT TOOLBOX PANEL */}
        <LeftToolbox
          builderTemplate={builderTemplate}
          setBuilderTemplate={setBuilderTemplate}
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
        />

        {/* WORKSPACE CENTRAL WORKBOARD */}
        <div className="flex-1 bg-slate-100 dark:bg-zinc-950 overflow-auto p-10 flex items-center justify-center relative">
          
          {/* Zoom Actions */}
          <div className="absolute bottom-4 right-4 bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 py-1.5 px-3 rounded-full shadow-lg flex items-center gap-3 text-xs font-bold text-slate-500 z-10">
            <button onClick={() => setCanvasZoom(z => Math.max(0.2, z - 0.1))} className="hover:text-rose-500 cursor-pointer">Less</button>
            <span className="font-mono text-[10px]">{Math.round(canvasZoom * 100)}%</span>
            <button onClick={() => setCanvasZoom(z => Math.min(1.5, z + 0.1))} className="hover:text-rose-500 cursor-pointer">More</button>
          </div>

          {/* Canva Canvas container */}
          <div 
            ref={builderContainerRef}
            className="relative shadow-2xl border border-slate-350 dark:border-zinc-800 transition-all rounded-xl"
            style={{
              width: `${builderTemplate.canvasWidth * 0.25 * canvasZoom}px`,
              height: `${builderTemplate.canvasHeight * 0.25 * canvasZoom}px`,
              ...getBackgroundStyle(),
              position: 'relative'
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
                ? `${layer.strokeSize}px ${layer.strokeColor || '#ffffff'}`
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
                    boxShadow: layer.type !== 'frame' ? shadowStyle : 'none'
                  }}
                >
                  
                  {/* FRAME LAYER RENDERING */}
                  {layer.type === 'frame' && (
                    <div 
                      className={`w-full h-full flex flex-col items-center justify-center text-slate-450 border transition-all ${
                        builderTemplate.showSlotBackground ? 'bg-slate-50 dark:bg-zinc-900' : 'bg-transparent'
                      }`}
                      style={{
                        borderWidth: `${layer.borderSize ?? 4}px`,
                        borderColor: layer.borderColor || '#ffffff',
                        borderRadius: `${layer.cornerRadius ?? 8}px`,
                        boxShadow: shadowStyle
                      }}
                    >
                      <span className="text-xl">📸</span>
                      <span className="text-[9px] font-black uppercase mt-1 text-slate-455">{layer.label}</span>
                      <span className="absolute top-2 left-2 bg-rose-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-[10px] font-black">
                        {layer.order || 1}
                      </span>
                    </div>
                  )}

                  {/* TEXT LAYER RENDERING */}
                  {layer.type === 'text' && (
                    <span 
                      className="block text-center select-none truncate w-full font-bold px-1"
                      style={{
                        fontSize: `${(layer.fontSize || 24) * 0.25 * canvasZoom}px`,
                        color: layer.fontColor || '#1e293b',
                        fontFamily: layer.fontFamily || 'sans-serif',
                        fontWeight: layer.fontWeight || 'bold',
                        fontStyle: layer.fontStyle || 'normal',
                        textAlign: (layer.align || 'center') as any,
                        letterSpacing: `${layer.letterSpacing || 0}px`,
                        WebkitTextStroke: strokeStyle
                      }}
                    >
                      {layer.text}
                    </span>
                  )}

                  {/* STICKER LAYER RENDERING */}
                  {layer.type === 'sticker' && (
                    <img 
                      src={layer.url} 
                      alt="sticker" 
                      className="w-full h-full object-contain pointer-events-none"
                    />
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
                      className="w-full h-full transition-all"
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
                        <div className="w-full h-full flex items-center justify-center text-red-500 text-3xl" style={{ backgroundColor: 'transparent' }}>
                          ❤️
                        </div>
                      )}
                      {layer.shapeType === 'star' && (
                        <div className="w-full h-full flex items-center justify-center text-yellow-500 text-3xl" style={{ backgroundColor: 'transparent' }}>
                          ⭐
                        </div>
                      )}
                    </div>
                  )}

                  {/* RESIZE HANDLE */}
                  {isSelected && !(layer.locked === true || layer.locked === 'true') && (
                    <div 
                      className="absolute bottom-[-6px] right-[-6px] w-3.5 h-3.5 rounded-full bg-rose-600 border border-white cursor-se-resize shadow-md z-45"
                      onMouseDown={(e) => {
                        e.stopPropagation();
                        const startX = e.clientX;
                        const startY = e.clientY;
                        const startWidth = Number(layer.width) || 10;
                        const startHeight = Number(layer.height) || 10;
                        const rect = builderContainerRef.current!.getBoundingClientRect();

                        const handleResize = (moveEvent: MouseEvent) => {
                          const deltaWidth = ((moveEvent.clientX - startX) / rect.width) * 100;
                          const deltaHeight = ((moveEvent.clientY - startY) / rect.height) * 100;

                          let w = Math.round(Math.max(5, Math.min(100 - Number(layer.x), startWidth + deltaWidth)));
                          let h = Math.round(Math.max(5, Math.min(100 - Number(layer.y), startHeight + deltaHeight)));

                          if (snapToGrid) {
                            w = Math.round(w / 5) * 5;
                            h = Math.round(h / 5) * 5;
                          }

                          // Support Fixed Aspect Ratio resize for Frames
                          if (layer.type === 'frame' && layer.aspectRatio && layer.aspectRatio !== 'free') {
                            let ratioVal = 1;
                            if (layer.aspectRatio === '3:4') ratioVal = 3 / 4;
                            else if (layer.aspectRatio === '9:16') ratioVal = 9 / 16;
                            
                            h = Math.round((w * builderTemplate.canvasWidth) / (builderTemplate.canvasHeight * ratioVal));
                          }

                          updateSelectedLayer({ width: w, height: h });
                        };

                        const handleResizeUp = () => {
                          window.removeEventListener('mousemove', handleResize);
                          window.removeEventListener('mouseup', handleResizeUp);
                        };

                        window.addEventListener('mousemove', handleResize);
                        window.addEventListener('mouseup', handleResizeUp);
                      }}
                    />
                  )}

                </div>
              );
            })}
          </div>
        </div>

        {/* RIGHT SIDEBAR PANEL: CONTEXTUAL LAYER PROPERTIES */}
        <RightProperties
          selectedLayer={selectedLayer}
          updateSelectedLayer={updateSelectedLayer}
          handleDeleteLayer={handleDeleteLayer}
        />

      </div>

    </div>
  );
};
