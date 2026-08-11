import React, { useState } from 'react';
import { User, Plus, Search, ZoomIn, ZoomOut, RotateCcw } from 'lucide-react';

export default function BinaryTree({ treeData, onSelectNode, onAddMemberSlot }) {
  const [zoom, setZoom] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');

  if (!treeData) {
    return (
      <div className="glass-card p-8 sm:p-12 text-center text-[#736C63]">
        <p>No binary tree network found in database</p>
      </div>
    );
  }

  const renderTreeNode = (node, position = 'ROOT') => {
    if (!node) {
      return (
        <div 
          onClick={() => onAddMemberSlot && onAddMemberSlot(position)}
          className="tree-empty-box group"
        >
          <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-[#EFECE6] border border-[#D6CFB9] flex items-center justify-center mx-auto mb-1 group-hover:border-[#1B3B2B] group-hover:bg-[#EAF2EC]">
            <Plus className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#8C8375] group-hover:text-[#1B3B2B]" />
          </div>
          <span className="text-[11px] sm:text-xs font-bold block text-[#554F47]">Add Member</span>
          <span className="text-[9px] sm:text-[10px] text-[#A37B34] uppercase font-bold">{position}</span>
        </div>
      );
    }

    const isMatch = searchQuery && (
      node.member_id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (node.full_name && node.full_name.toLowerCase().includes(searchQuery.toLowerCase()))
    );

    return (
      <div className="flex flex-col items-center">
        {/* Node Box */}
        <div 
          onClick={() => onSelectNode && onSelectNode(node)}
          className={`tree-node-box ${isMatch ? 'ring-4 ring-[#C5A059]' : ''}`}
        >
          <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-[#1B3B2B] border border-[#C5A059] flex items-center justify-center mx-auto mb-1 text-[#C5A059]">
            <User className="w-4 h-4 sm:w-5 sm:h-5" />
          </div>
          <span className="text-xs sm:text-sm font-serif font-bold text-[#1C1917] block truncate max-w-[100px] sm:max-w-[120px] mx-auto">{node.member_id}</span>
          <span className="text-[11px] sm:text-xs text-[#554F47] block truncate max-w-[100px] sm:max-w-[120px] mx-auto font-medium">{node.full_name || node.name}</span>
          
          <div className="mt-1.5 sm:mt-2 pt-1.5 sm:pt-2 border-t border-[#E2DDD1] flex items-center justify-between text-[10px] sm:text-[11px]">
            <span className="text-[#1B3B2B] font-bold">L: {node.left_count || 0}</span>
            <span className="text-[#A37B34] font-bold">R: {node.right_count || 0}</span>
          </div>
        </div>

        {/* Children Connector Lines */}
        {(node.left_child || node.right_child || node.left || node.right || onAddMemberSlot) && (
          <div className="flex flex-col items-center w-full mt-2">
            <div className="w-0.5 h-4 sm:h-6 bg-[#C5A059]/60"></div>
            
            <div className="flex justify-between w-full relative pt-3 sm:pt-4">
              {/* Horizontal Line connecting children */}
              <div className="absolute top-0 left-1/4 right-1/4 h-0.5 bg-[#C5A059]/60"></div>

              {/* Left Subtree */}
              <div className="flex-1 flex justify-center px-1 sm:px-2">
                {renderTreeNode(node.left_child || node.left, 'LEFT')}
              </div>

              {/* Right Subtree */}
              <div className="flex-1 flex justify-center px-1 sm:px-2">
                {renderTreeNode(node.right_child || node.right, 'RIGHT')}
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-4">
      {/* Responsive Controls Bar */}
      <div className="glass-card p-3 sm:p-4 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="relative flex items-center w-full sm:w-auto flex-1 min-w-[200px]">
          <Search className="w-4 h-4 text-[#736C63] absolute left-3.5 pointer-events-none" />
          <input
            type="text"
            placeholder="Search Member ID or Name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="form-input form-input-icon text-xs py-2"
          />
        </div>

        <div className="flex items-center justify-center sm:justify-end gap-2">
          <button 
            onClick={() => setZoom(Math.max(0.6, zoom - 0.1))}
            className="btn-secondary p-2 text-xs"
            title="Zoom Out"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
          <span className="text-xs font-bold text-[#332F2B] w-10 text-center">{Math.round(zoom * 100)}%</span>
          <button 
            onClick={() => setZoom(Math.min(1.5, zoom + 0.1))}
            className="btn-secondary p-2 text-xs"
            title="Zoom In"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
          <button 
            onClick={() => setZoom(1)}
            className="btn-secondary p-2 text-xs"
            title="Reset Zoom"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Responsive Tree Canvas Container */}
      <div className="glass-card p-4 sm:p-8 overflow-x-auto min-h-[450px] bg-[#FDFBF7] scroll-touch border border-[#E2DDD1]">
        <div 
          style={{ transform: `scale(${zoom})`, transformOrigin: 'top center', transition: 'transform 0.2s ease' }}
          className="py-4 min-w-[650px] lg:min-w-0 mx-auto flex justify-center"
        >
          {renderTreeNode(treeData)}
        </div>
      </div>
    </div>
  );
}
