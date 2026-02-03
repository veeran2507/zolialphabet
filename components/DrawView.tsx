
import React, { useRef, useState, useEffect, useCallback } from 'react';
import { LetterItem } from '../types';
import { audioService } from '../services/gemini';

interface DrawViewProps {
  item: LetterItem;
  onBack: () => void;
}

export const DrawView: React.FC<DrawViewProps> = ({ item, onBack }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [color, setColor] = useState('#ef4444');
  const [brushSize, setBrushSize] = useState(12);

  const colors = [
    { name: 'Red', value: '#ef4444' },
    { name: 'Blue', value: '#3b82f6' },
    { name: 'Yellow', value: '#eab308' },
    { name: 'Green', value: '#22c55e' },
    { name: 'Black', value: '#1f2937' },
  ];

  const drawBackground = useCallback((canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D) => {
    const w = canvas.width;
    const h = canvas.height;

    // 1. Clear everything
    ctx.clearRect(0, 0, w, h);

    // 2. Draw notebook lines (Handwriting guidelines)
    const centerY = h / 2;
    const lineSpacing = h * 0.15;

    ctx.setLineDash([5, 5]);
    ctx.strokeStyle = '#e5e7eb'; // Light gray for guidelines
    ctx.lineWidth = 2;

    // Top line
    ctx.beginPath();
    ctx.moveTo(0, centerY - lineSpacing * 1.5);
    ctx.lineTo(w, centerY - lineSpacing * 1.5);
    ctx.stroke();

    // Middle line (dashed)
    ctx.beginPath();
    ctx.moveTo(0, centerY);
    ctx.lineTo(w, centerY);
    ctx.stroke();

    // Bottom line
    ctx.setLineDash([]); // Solid line for bottom
    ctx.beginPath();
    ctx.moveTo(0, centerY + lineSpacing * 1.5);
    ctx.lineTo(w, centerY + lineSpacing * 1.5);
    ctx.stroke();

    // 3. Draw Reference Letter (Centered and scaled)
    // We show both Uppercase and Lowercase for better learning
    const displayText = `${item.letter}${item.letter.toLowerCase()}`;
    const fontSize = Math.min(w * 0.4, h * 0.6);
    ctx.font = `bold ${fontSize}px 'Quicksand', sans-serif`;
    ctx.fillStyle = 'rgba(243, 244, 246, 0.8)'; // Very faint gray
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    
    // Slight offset to account for visual baseline
    ctx.fillText(displayText, w / 2, centerY);
    
    // Outline version for tracing path guidance
    ctx.strokeStyle = 'rgba(229, 231, 235, 0.5)';
    ctx.lineWidth = 1;
    ctx.strokeText(displayText, w / 2, centerY);
  }, [item]);

  const resizeCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const container = canvas.parentElement;
    if (!container) return;

    // Set internal dimensions to match display size (1:1 pixel mapping)
    canvas.width = container.clientWidth;
    canvas.height = container.clientHeight;

    const ctx = canvas.getContext('2d');
    if (ctx) drawBackground(canvas, ctx);
  }, [drawBackground]);

  useEffect(() => {
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    audioService.speak(`Pratik ekrir let ${item.letter}. Swazir enn kouler ek trase lor bann ligne!`);
    return () => window.removeEventListener('resize', resizeCanvas);
  }, [item, resizeCanvas]);

  const startDrawing = (e: React.MouseEvent | React.TouchEvent) => {
    setIsDrawing(true);
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = ('touches' in e ? e.touches[0].clientX : e.clientX) - rect.left;
    const y = ('touches' in e ? e.touches[0].clientY : e.clientY) - rect.top;

    ctx.beginPath();
    ctx.moveTo(x, y);
  };

  const draw = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = ('touches' in e ? e.touches[0].clientX : e.clientX) - rect.left;
    const y = ('touches' in e ? e.touches[0].clientY : e.clientY) - rect.top;

    ctx.lineWidth = brushSize;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.strokeStyle = color;

    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const endDrawing = () => {
    setIsDrawing(false);
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (canvas && ctx) {
      drawBackground(canvas, ctx);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-yellow-50 overflow-hidden">
      {/* Top Bar */}
      <div className="bg-white p-4 shadow-md flex items-center justify-between">
        <button 
          onClick={onBack}
          className="bg-gray-100 p-3 rounded-full hover:bg-gray-200 transition-colors"
          aria-label="Back"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
        </button>

        <div className="text-center">
          <h2 className="font-kids text-2xl text-gray-800">Pratik let {item.letter}</h2>
          <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">Trase lor bann ligne</p>
        </div>

        <button 
          onClick={clearCanvas}
          className="bg-red-100 text-red-600 font-kids px-6 py-2 rounded-full hover:bg-red-200 transition-colors shadow-sm"
        >
          Effase
        </button>
      </div>

      {/* Canvas Area */}
      <div className="flex-1 relative cursor-crosshair m-4 bg-white rounded-[2rem] shadow-inner border-4 border-white overflow-hidden">
        {/* The dashed border is now handled inside the canvas drawing for better integration */}
        <canvas
          ref={canvasRef}
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={endDrawing}
          onMouseOut={endDrawing}
          onTouchStart={startDrawing}
          onTouchMove={draw}
          onTouchEnd={endDrawing}
          className="touch-none w-full h-full block"
        />
      </div>

      {/* Toolbar */}
      <div className="bg-white p-6 shadow-2xl flex flex-wrap items-center justify-center gap-6 rounded-t-[3rem]">
        <div className="flex items-center gap-3">
          {colors.map((c) => (
            <button
              key={c.value}
              onClick={() => setColor(c.value)}
              className={`w-12 h-12 rounded-full border-4 transition-all duration-200 ${color === c.value ? 'border-gray-800 scale-125 shadow-lg' : 'border-transparent scale-100'}`}
              style={{ backgroundColor: c.value }}
              title={c.name}
            />
          ))}
        </div>

        <div className="h-10 w-px bg-gray-200 hidden sm:block"></div>

        <div className="flex items-center gap-4 bg-gray-50 px-6 py-2 rounded-2xl">
          <span className="font-kids text-gray-500 text-sm">Groser crayon:</span>
          <input 
            type="range" 
            min="4" 
            max="30" 
            value={brushSize} 
            onChange={(e) => setBrushSize(parseInt(e.target.value))}
            className="w-32 accent-blue-500"
          />
        </div>
      </div>
    </div>
  );
};
