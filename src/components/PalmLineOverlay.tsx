import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { PalmLine } from '../types';
import { Eye, EyeOff, Info, Maximize2 } from 'lucide-react';

interface PalmLineOverlayProps {
  imageUrl: string;
  lines: PalmLine[];
  title?: string;
}

const PalmLineOverlay: React.FC<PalmLineOverlayProps> = ({ imageUrl, lines, title }) => {
  const [visibleLines, setVisibleLines] = useState<Record<string, boolean>>({});
  const [hoveredLine, setHoveredLine] = useState<string | null>(null);
  const [selectedLine, setSelectedLine] = useState<PalmLine | null>(null);
  const [showAll, setShowAll] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Initialize all lines as visible
    const initialVisibility: Record<string, boolean> = {};
    lines.forEach(line => {
      initialVisibility[line.id] = true;
    });
    setVisibleLines(initialVisibility);
  }, [lines]);

  const toggleLine = (id: string) => {
    setVisibleLines(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const toggleAll = () => {
    const newState = !showAll;
    setShowAll(newState);
    const updatedVisibility: Record<string, boolean> = {};
    lines.forEach(line => {
      updatedVisibility[line.id] = newState;
    });
    setVisibleLines(updatedVisibility);
  };

  const getLineColor = (id: string) => {
    const colors: Record<string, string> = {
      life_line: '#ef4444', // red-500
      head_line: '#3b82f6', // blue-500
      heart_line: '#ec4899', // pink-500
      fate_line: '#8b5cf6', // purple-500
      sun_line: '#f59e0b', // amber-500
      marriage_line: '#10b981', // emerald-500
      wrist_lines: '#6b7280', // gray-500
    };
    return colors[id] || '#ffffff';
  };

  return (
    <div className="flex flex-col gap-4 w-full">
      {title && <h3 className="text-lg font-medium text-slate-800">{title}</h3>}
      
      <div className="relative group rounded-2xl overflow-hidden bg-slate-900 shadow-xl aspect-[3/4] md:aspect-auto">
        {/* Base Image */}
        <img 
          src={imageUrl} 
          alt="Bàn tay" 
          className="w-full h-full object-contain"
          referrerPolicy="no-referrer"
        />

        {/* SVG Overlay */}
        <svg 
          viewBox="0 0 1000 1000" 
          className="absolute inset-0 w-full h-full pointer-events-none"
          preserveAspectRatio="xMidYMid meet"
        >
          <defs>
            {lines.map(line => (
              <filter id={`glow-${line.id}`} key={`glow-${line.id}`}>
                <feGaussianBlur stdDeviation="3" result="coloredBlur" />
                <feMerge>
                  <feMergeNode in="coloredBlur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            ))}
          </defs>

          <AnimatePresence>
            {lines.map(line => {
              if (!visibleLines[line.id]) return null;

              const isHovered = hoveredLine === line.id;
              const isSelected = selectedLine?.id === line.id;
              const color = getLineColor(line.id);

              // Function to create a smooth SVG path from points using Catmull-Rom to Bezier conversion
              const createSmoothPath = (points: [number, number][]) => {
                if (!points || points.length < 2) return '';
                if (points.length === 2) return `M ${points[0][0]} ${points[0][1]} L ${points[1][0]} ${points[1][1]}`;

                let d = `M ${points[0][0]} ${points[0][1]}`;
                
                for (let i = 0; i < points.length - 1; i++) {
                  const p0 = points[i === 0 ? i : i - 1];
                  const p1 = points[i];
                  const p2 = points[i + 1];
                  const p3 = points[i + 2 === points.length ? i + 1 : i + 2];

                  // Catmull-Rom to Cubic Bezier conversion
                  const cp1x = p1[0] + (p2[0] - p0[0]) / 6;
                  const cp1y = p1[1] + (p2[1] - p0[1]) / 6;
                  const cp2x = p2[0] - (p3[0] - p1[0]) / 6;
                  const cp2y = p2[1] - (p3[1] - p1[1]) / 6;

                  d += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${p2[0]} ${p2[1]}`;
                }
                return d;
              };

              const pathData = createSmoothPath(line.points);

              return (
                <motion.path
                  key={line.id}
                  d={pathData}
                  fill="none"
                  stroke={color}
                  strokeWidth={isHovered || isSelected ? 8 : 4}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={{ 
                    pathLength: 1, 
                    opacity: isHovered || isSelected ? 1 : 0.7,
                    strokeWidth: isHovered || isSelected ? 8 : 4
                  }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 1.5, ease: "easeInOut" }}
                  style={{ 
                    filter: isHovered || isSelected ? `url(#glow-${line.id})` : 'none',
                    pointerEvents: 'auto',
                    cursor: 'pointer'
                  }}
                  onMouseEnter={() => setHoveredLine(line.id)}
                  onMouseLeave={() => setHoveredLine(null)}
                  onClick={() => setSelectedLine(line)}
                />
              );
            })}
          </AnimatePresence>
        </svg>

        {/* Selected Line Info Overlay */}
        <AnimatePresence>
          {selectedLine && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="absolute bottom-4 left-4 right-4 bg-white/90 backdrop-blur-md p-4 rounded-xl shadow-lg border border-white/20 z-10"
            >
              <div className="flex justify-between items-start mb-2">
                <h4 className="font-bold text-slate-900 flex items-center gap-2">
                  <span 
                    className="w-3 h-3 rounded-full" 
                    style={{ backgroundColor: getLineColor(selectedLine.id) }}
                  />
                  {selectedLine.name}
                </h4>
                <button 
                  onClick={() => setSelectedLine(null)}
                  className="text-slate-400 hover:text-slate-600"
                >
                  <EyeOff size={16} />
                </button>
              </div>
              <p className="text-sm text-slate-700 leading-relaxed">
                {selectedLine.meaning}
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Controls */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <span className="text-sm font-semibold text-slate-700">Các đường chỉ tay</span>
          <button 
            onClick={toggleAll}
            className="text-xs text-indigo-600 hover:text-indigo-700 font-medium flex items-center gap-1"
          >
            {showAll ? <EyeOff size={14} /> : <Eye size={14} />}
            {showAll ? 'Ẩn tất cả' : 'Hiện tất cả'}
          </button>
        </div>
        
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
          {lines.map(line => (
            <button
              key={line.id}
              onClick={() => toggleLine(line.id)}
              onMouseEnter={() => setHoveredLine(line.id)}
              onMouseLeave={() => setHoveredLine(null)}
              className={`
                flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium transition-all
                ${visibleLines[line.id] 
                  ? 'bg-slate-100 text-slate-900 border-slate-200' 
                  : 'bg-white text-slate-400 border-transparent opacity-60'}
                border hover:border-slate-300
              `}
            >
              <div 
                className="w-2 h-2 rounded-full shrink-0" 
                style={{ 
                  backgroundColor: getLineColor(line.id),
                  boxShadow: visibleLines[line.id] ? `0 0 8px ${getLineColor(line.id)}` : 'none'
                }}
              />
              <span className="truncate">{line.name}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PalmLineOverlay;
