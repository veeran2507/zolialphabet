
import React, { useEffect, useState } from 'react';
import { LetterItem } from '../types';
import { audioService } from '../services/gemini';

interface DetailViewProps {
  item: LetterItem;
  onBack: () => void;
  onDraw: () => void;
}

export const DetailView: React.FC<DetailViewProps> = ({ item, onBack, onDraw }) => {
  const [isSpeaking, setIsSpeaking] = useState(false);

  const handleSpeak = async () => {
    setIsSpeaking(true);
    await audioService.speak(`${item.letter}. ${item.word}. ${item.description}`);
    setIsSpeaking(false);
  };

  useEffect(() => {
    handleSpeak();
  }, [item]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
      <div className="bg-white w-full max-w-4xl rounded-[3rem] shadow-2xl overflow-hidden flex flex-col md:flex-row animate-in fade-in zoom-in duration-300">
        {/* Left Side: Image */}
        <div className={`md:w-1/2 relative h-64 md:h-auto ${item.color}`}>
          <img 
            src={item.imagePath} 
            alt={item.word} 
            className="w-full h-full object-cover"
          />
          <button 
            onClick={onBack}
            className="absolute top-4 left-4 bg-white/90 p-3 rounded-full shadow-md hover:bg-white transition-colors z-10"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-800" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
          </button>
        </div>

        {/* Right Side: Content */}
        <div className="md:w-1/2 p-8 md:p-12 flex flex-col justify-between items-center text-center">
          <div>
            <div className={`inline-block px-8 py-4 rounded-3xl ${item.color} text-white font-kids text-8xl mb-6 shadow-lg transform rotate-2`}>
              {item.letter}{item.letter.toLowerCase()}
            </div>
            <h2 className="text-5xl font-kids text-gray-800 mb-2 uppercase tracking-wide">
              {item.word}
            </h2>
            <p className="text-2xl text-blue-600 font-semibold mb-4 italic">
              ({item.translation})
            </p>
            <p className="text-xl text-gray-600 leading-relaxed max-w-sm mx-auto">
              {item.description}
            </p>
          </div>

          <div className="mt-8 flex flex-col gap-3 w-full">
            <button
              onClick={handleSpeak}
              disabled={isSpeaking}
              className={`w-full py-4 rounded-2xl flex items-center justify-center gap-3 text-white text-xl font-kids shadow-lg transition-all active:scale-95 ${isSpeaking ? 'bg-gray-400' : 'bg-green-500 hover:bg-green-600'}`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM14.657 2.929a1 1 0 011.414 0A9.972 9.972 0 0119 10a9.972 9.972 0 01-2.929 7.071 1 1 0 01-1.414-1.414A7.971 7.971 0 0017 10c0-2.21-.894-4.208-2.343-5.657a1 1 0 010-1.414zm-2.829 2.828a1 1 0 011.415 0A5.983 5.983 0 0115 10a5.983 5.983 0 01-1.757 4.243 1 1 0 01-1.415-1.415A3.984 3.984 0 0013 10a3.984 3.984 0 00-1.172-2.828a1 1 0 010-1.415z" clipRule="evenodd" />
              </svg>
              {isSpeaking ? 'Ekout...' : 'Ekoute!'}
            </button>
            <button
              onClick={onDraw}
              className="w-full py-4 rounded-2xl flex items-center justify-center gap-3 bg-yellow-400 hover:bg-yellow-500 text-white text-xl font-kids shadow-lg transition-all active:scale-95"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
              </svg>
              Pratik ekrir
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
