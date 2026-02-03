
import React, { useState } from 'react';
import { AppState, LetterItem } from './types';
import { ALPHABET_DATA } from './constants';
import { LetterCard } from './components/LetterCard';
import { DetailView } from './components/DetailView';
import { QuizView } from './components/QuizView';
import { DrawView } from './components/DrawView';

const App: React.FC = () => {
  const [state, setState] = useState<AppState>(AppState.GRID);
  const [selectedLetter, setSelectedLetter] = useState<LetterItem | null>(null);

  const handleLetterClick = (item: LetterItem) => {
    setSelectedLetter(item);
    setState(AppState.DETAIL);
  };

  const handleBack = () => {
    setState(AppState.GRID);
    setSelectedLetter(null);
  };

  const handleDetailBack = () => {
    setState(AppState.GRID);
    setSelectedLetter(null);
  };

  const handleToDraw = () => {
    setState(AppState.DRAW);
  };

  const handleFromDrawToDetail = () => {
    setState(AppState.DETAIL);
  };

  const startQuiz = () => {
    setState(AppState.QUIZ);
  };

  return (
    <div className="min-h-screen pb-12">
      {/* Header - Only show in GRID mode to keep screens focused */}
      {state === AppState.GRID && (
        <header className="bg-white shadow-md py-6 px-4 md:px-8 mb-8 sticky top-0 z-40">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-red-500 rounded-full flex items-center justify-center font-kids text-white text-2xl animate-bounce">
                M
              </div>
              <div>
                <h1 className="text-3xl md:text-4xl text-gray-800 flex items-center gap-2">
                  <span>Zoli</span>
                  <span className="text-red-500">L'Alfabet</span>
                  <span className="text-blue-500">Morisien</span>
                </h1>
                <p className="text-gray-500 font-medium hidden md:block">Apprende bann let avek bann zoli zimaz nou pei</p>
              </div>
            </div>
            
            <button 
              onClick={startQuiz}
              className="bg-yellow-400 hover:bg-yellow-500 text-white font-kids text-xl px-8 py-3 rounded-full shadow-lg transition-all active:scale-95 flex items-center gap-2"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Zwe enn Jeu!
            </button>
          </div>
        </header>
      )}

      {/* Main Grid */}
      {state === AppState.GRID && (
        <main className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
            {ALPHABET_DATA.map((item) => (
              <LetterCard 
                key={item.letter} 
                item={item} 
                onClick={handleLetterClick} 
              />
            ))}
          </div>
        </main>
      )}

      {/* Overlays */}
      {state === AppState.DETAIL && selectedLetter && (
        <DetailView 
          item={selectedLetter} 
          onBack={handleDetailBack} 
          onDraw={handleToDraw}
        />
      )}

      {state === AppState.QUIZ && (
        <QuizView onClose={handleBack} />
      )}

      {state === AppState.DRAW && selectedLetter && (
        <DrawView 
          item={selectedLetter} 
          onBack={handleFromDrawToDetail} 
        />
      )}

      {/* Footer Info */}
      {state === AppState.GRID && (
        <footer className="mt-20 text-center text-gray-400 font-medium px-4">
          <p>Ki bon! To pe apprende bien. Kontigne koumsa mem!</p>
          <div className="flex justify-center gap-2 mt-4">
            <div className="w-8 h-2 bg-red-500 rounded-full"></div>
            <div className="w-8 h-2 bg-blue-500 rounded-full"></div>
            <div className="w-8 h-2 bg-yellow-500 rounded-full"></div>
            <div className="w-8 h-2 bg-green-500 rounded-full"></div>
          </div>
        </footer>
      )}
    </div>
  );
};

export default App;
