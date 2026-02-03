
import React from 'react';
import { LetterItem } from '../types';

interface LetterCardProps {
  item: LetterItem;
  onClick: (item: LetterItem) => void;
}

export const LetterCard: React.FC<LetterCardProps> = ({ item, onClick }) => {
  return (
    <button
      onClick={() => onClick(item)}
      className={`
        ${item.color} 
        group relative flex flex-col items-center justify-center 
        aspect-square rounded-3xl shadow-lg 
        transform transition-all duration-300 
        hover:scale-105 active:scale-95 hover:rotate-2
        border-4 border-white
      `}
    >
      <span className="text-6xl md:text-8xl text-white font-kids drop-shadow-md">
        {item.letter}
      </span>
      <span className="mt-2 text-white font-bold text-lg md:text-xl opacity-90 group-hover:opacity-100">
        {item.word}
      </span>
      <div className="absolute top-2 right-2 w-8 h-8 bg-white/20 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
        </svg>
      </div>
    </button>
  );
};
