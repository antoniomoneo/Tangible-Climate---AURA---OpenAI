import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import type { Language, GlossaryTerm } from '../types';
import { locales } from '../locales';
import { ResetIcon } from './icons';

interface GlossaryMindMapProps {
  terms: GlossaryTerm[];
  categories: string[];
  selectedTerm: GlossaryTerm | null;
  onSelectTerm: (term: GlossaryTerm | null) => void;
  language: Language;
}

interface Node {
  id: string;
  label: string;
  type: 'category' | 'term';
  termData?: GlossaryTerm;
  radius: number;
}

interface Link {
  source: string;
  target: string;
}

interface NodePosition {
  x: number;
  y: number;
  vx: number;
  vy: number;
}

const categoryColors: { [key: string]: string } = {
  "Conceptos Fundamentales": "#38bdf8", // sky-500
  "Medición y Modelos": "#34d399", // emerald-400
  "Impactos y Riesgos": "#fbbf24", // amber-400
  "Soluciones y Políticas": "#a78bfa", // violet-400
  "Actores y Acuerdos": "#f472b6", // pink-400
};

const SIMULATION_ITERATIONS = 200;
const DAMPING = 0.95;
const REPULSION_STRENGTH = 2000;
const LINK_STRENGTH = 0.1;
const CENTER_GRAVITY = 0.05;

const GlossaryMindMap: React.FC<GlossaryMindMapProps> = ({ terms, categories, selectedTerm, onSelectTerm, language }) => {
  const t = locales[language];
  const svgRef = useRef<SVGSVGElement>(null);
  const [{ width, height }, setDimensions] = useState({ width: 800, height: 600 });
  
  const [nodePositions, setNodePositions] = useState<Map<string, NodePosition>>(new Map());
  const [transform, setTransform] = useState({ k: 1, x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const dragStartRef = useRef({ x: 0, y: 0 });
  const [isSimulating, setIsSimulating] = useState(true);

  const { nodes, links } = useMemo(() => {
    const termMap = new Map<string, GlossaryTerm>(terms.map(t => [t.name, t]));
    const newNodes: Node[] = categories.map(c => ({
      id: c,
      label: c,
      type: 'category',
      radius: 20,
    }));
    const newLinks: Link[] = [];

    terms.forEach(term => {
      newNodes.push({
        id: term.name,
        label: term.name,
        type: 'term',
        termData: term,
        radius: 12,
      });
      newLinks.push({ source: term.name, target: term.category });
      term.relatedTerms?.forEach(related => {
        if (termMap.has(related)) {
          newLinks.push({ source: term.name, target: related });
        }
      });
    });

    return { nodes: newNodes, links: newLinks };
  }, [terms, categories]);

  useEffect(() => {
    const resizeObserver = new ResizeObserver(entries => {
      if (entries[0]) {
        const { width, height } = entries[0].contentRect;
        setDimensions({ width, height });
      }
    });
    if (svgRef.current) {
      resizeObserver.observe(svgRef.current);
    }
    return () => resizeObserver.disconnect();
  }, []);
  
  useEffect(() => {
    setIsSimulating(true);
    let positions = new Map<string, NodePosition>();
    nodes.forEach(node => {
      positions.set(node.id, {
        x: Math.random() * width,
        y: Math.random() * height,
        vx: 0,
        vy: 0,
      });
    });
    
    let frameId: number;
    let iteration = 0;

    const tick = () => {
      if (iteration >= SIMULATION_ITERATIONS) {
        setIsSimulating(false);
        cancelAnimationFrame(frameId);
        return;
      }
      
      const nextPositions = new Map(positions);

      // Apply forces
      nodes.forEach(nodeA => {
        let { x: ax, y: ay, vx: avx, vy: avy } = nextPositions.get(nodeA.id)!;
        
        avx += (width / 2 - ax) * CENTER_GRAVITY * 0.01;
        avy += (height / 2 - ay) * CENTER_GRAVITY * 0.01;

        nodes.forEach(nodeB => {
          if (nodeA === nodeB) return;
          const { x: bx, y: by } = nextPositions.get(nodeB.id)!;
          const dx = ax - bx;
          const dy = ay - by;
          let distSq = dx * dx + dy * dy;
          if (distSq < 1) distSq = 1;
          const force = REPULSION_STRENGTH / distSq;
          avx += (dx / Math.sqrt(distSq)) * force * 0.01;
          avy += (dy / Math.sqrt(distSq)) * force * 0.01;
        });

        nextPositions.set(nodeA.id, { x: ax, y: ay, vx: avx, vy: avy });
      });

      links.forEach(link => {
        const sourceNode = nextPositions.get(link.source)!;
        const targetNode = nextPositions.get(link.target)!;
        const dx = targetNode.x - sourceNode.x;
        const dy = targetNode.y - sourceNode.y;
        
        sourceNode.vx += dx * LINK_STRENGTH * 0.01;
        sourceNode.vy += dy * LINK_STRENGTH * 0.01;
        targetNode.vx -= dx * LINK_STRENGTH * 0.01;
        targetNode.vy -= dy * LINK_STRENGTH * 0.01;
      });

      nodes.forEach(node => {
        const pos = nextPositions.get(node.id)!;
        pos.vx *= DAMPING;
        pos.vy *= DAMPING;
        pos.x += pos.vx;
        pos.y += pos.vy;
      });

      positions = nextPositions;
      setNodePositions(new Map(positions));
      iteration++;
      frameId = requestAnimationFrame(tick);
    };

    frameId = requestAnimationFrame(tick);

    return () => cancelAnimationFrame(frameId);
  }, [nodes, links, width, height]);


  const handleWheel = useCallback((e: React.WheelEvent) => {
    e.preventDefault();
    const { deltaY } = e;
    const scaleFactor = 1.1;
    const newK = deltaY < 0 ? transform.k * scaleFactor : transform.k / scaleFactor;
    
    const svgPoint = svgRef.current!.createSVGPoint();
    svgPoint.x = e.clientX;
    svgPoint.y = e.clientY;
    const point = svgPoint.matrixTransform(svgRef.current!.getScreenCTM()!.inverse());

    setTransform(prev => {
        const k = Math.max(0.1, Math.min(10, newK));
        const x = point.x - (point.x - prev.x) * (k / prev.k);
        const y = point.y - (point.y - prev.y) * (k / prev.k);
        return { k, x, y };
    });
  }, [transform.k]);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    setIsDragging(true);
    dragStartRef.current = { x: e.clientX - transform.x, y: e.clientY - transform.y };
  }, [transform]);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!isDragging) return;
    const x = e.clientX - dragStartRef.current.x;
    const y = e.clientY - dragStartRef.current.y;
    setTransform(prev => ({ ...prev, x, y }));
  }, [isDragging]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  const resetView = useCallback(() => {
    setTransform({ k: 1, x: 0, y: 0 });
  }, []);

  const getNodeColor = (node: Node) => {
    if (node.type === 'category') return categoryColors[node.id] || '#9ca3af';
    return categoryColors[node.termData?.category || ''] || '#e5e7eb';
  };
  
  const highlightedNodes = useMemo(() => {
    if (!selectedTerm) return new Set<string>();
    
    const highlighted = new Set<string>();
    highlighted.add(selectedTerm.name);
    highlighted.add(selectedTerm.category);
    selectedTerm.relatedTerms?.forEach(related => highlighted.add(related));
    
    return highlighted;
  }, [selectedTerm]);

  const isAnyTermSelected = !!selectedTerm;
  
  return (
    <div className="w-full h-full relative bg-gray-900 overflow-hidden cursor-grab active:cursor-grabbing">
      <svg
        ref={svgRef}
        className="w-full h-full"
        onWheel={handleWheel}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        <g transform={`translate(${transform.x}, ${transform.y}) scale(${transform.k})`}>
          {links.map((link, i) => {
            const sourcePos = nodePositions.get(link.source);
            const targetPos = nodePositions.get(link.target);
            if (!sourcePos || !targetPos) return null;
            
            const isLinkDimmed = isAnyTermSelected && (!highlightedNodes.has(link.source) || !highlightedNodes.has(link.target));

            return (
              <line
                key={`${link.source}-${link.target}-${i}`}
                x1={sourcePos.x} y1={sourcePos.y}
                x2={targetPos.x} y2={targetPos.y}
                className={`transition-all duration-300 ${isLinkDimmed ? 'stroke-gray-800' : 'stroke-gray-600'}`}
                strokeWidth={0.5}
              />
            );
          })}
          {nodes.map(node => {
            const pos = nodePositions.get(node.id);
            if (!pos) return null;
            const isSelected = selectedTerm?.name === node.id;
            const isHighlighted = highlightedNodes.has(node.id);
            const isDimmed = isAnyTermSelected && !isHighlighted;
            const color = getNodeColor(node);

            return (
              <g
                key={node.id}
                transform={`translate(${pos.x}, ${pos.y})`}
                className={`cursor-pointer transition-all duration-300 ${isDimmed ? 'opacity-20' : 'opacity-100'}`}
                onClick={() => onSelectTerm(node.termData || null)}
              >
                <circle
                  r={isSelected ? node.radius * 1.5 : node.radius}
                  fill={color}
                  stroke={isSelected ? 'white' : color}
                  strokeWidth={2}
                  className="transition-all duration-200"
                />
                <text
                  textAnchor="middle"
                  fill="white"
                  className="pointer-events-none select-none"
                  dy={(node.type === 'category' ? 5 : 4.5) / transform.k}
                  fontSize={(node.type === 'category' ? 14 : 12) / transform.k}
                  strokeWidth={(node.type === 'category' ? 4 : 3) / transform.k}
                  stroke="rgba(17, 24, 39, 0.8)"
                  paintOrder="stroke"
                  style={{
                    fontWeight: node.type === 'category' ? 'bold' : '600',
                  }}
                >
                  {node.label}
                </text>
              </g>
            );
          })}
        </g>
      </svg>
      <div className="absolute top-2 right-2 flex items-center gap-2 bg-gray-800/50 p-2 rounded-lg text-xs text-gray-300 select-none">
        <span>{t.mindMapControls}</span>
        <button onClick={resetView} title={t.mindMapResetView} className="p-1 hover:bg-gray-700 rounded-full">
            <ResetIcon className="h-4 w-4"/>
        </button>
      </div>
      {isSimulating && (
          <div className="absolute inset-0 bg-gray-900/50 flex items-center justify-center text-white">
              <p>Organizando conceptos...</p>
          </div>
      )}
    </div>
  );
};

export default GlossaryMindMap;