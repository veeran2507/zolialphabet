
import React, { useState, useEffect } from 'react';
import { ALPHABET_DATA } from '../constants';
import { LetterItem } from '../types';
import { audioService } from '../services/gemini';

interface QuizViewProps {
  onClose: () => void;
}

export const QuizView: React.FC<QuizViewProps> = ({ onClose }) => {
  const [question, setQuestion] = useState<LetterItem | null>(null);
  const [options, setOptions] = useState<LetterItem[]>([]);
  const [message, setMessage] = useState('Ki let ki koumanse...');
  const [score, setScore] = useState(0);

  const generateQuestion = () => {
    const randomIdx = Math.floor(Math.random() * ALPHABET_DATA.length);
    const correctItem = ALPHABET_DATA[randomIdx];
    
    // Pick 3 more random items for options
    const otherItems = ALPHABET_DATA
      .filter(i => i.letter !== correctItem.letter)
      .sort(() => 0.5 - Math.random())
      .slice(0, 3);
    
    const allOptions = [correctItem, ...otherItems].sort(() => 0.5 - Math.random());
    
    setQuestion(correctItem);
    setOptions(allOptions);
    setMessage(`Ki let ki koumanse ar "${correctItem.word}"?`);
    audioService.speak(`Ki let ki koumanse ar word ${correctItem.word}?`);
  };

  useEffect(() => {
    generateQuestion();
  }, []);

  const handleAnswer = (item: LetterItem) => {
    if (item.letter === question?.letter) {
      setScore(s => s + 1);
      setMessage("Bravo! Sa mem sa!");
      audioService.speak("Bravo! Sa mem sa!");
      setTimeout(() => generateQuestion(), 2000);
    } else {
      setMessage("Eseye ankor...");
      audioService.speak("Non, eseye ankor.");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-blue-500">
      <div className="bg-white w-full max-w-2xl rounded-[3rem] p-8 shadow-2xl text-center">
        <div className="flex justify-between items-center mb-6">
          <div className="bg-yellow-400 px-6 py-2 rounded-full font-kids text-white text-2xl shadow-md">
            Score: {score}
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <h2 className="text-4xl md:text-5xl font-kids text-gray-800 mb-8 px-4">
          {message}
        </h2>

        {question && (
          <div className="mb-12">
            <img 
              src={question.imagePath} 
              alt="Question" 
              className="w-48 h-48 mx-auto object-cover rounded-3xl shadow-lg border-8 border-yellow-100"
            />
          </div>
        )}

        <div className="grid grid-cols-2 gap-4">
          {options.map((opt) => (
            <button
              key={opt.letter}
              onClick={() => handleAnswer(opt)}
              className={`${opt.color} py-8 rounded-2xl text-white font-kids text-5xl shadow-lg transform transition-all active:scale-95 border-4 border-white`}
            >
              {opt.letter}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
