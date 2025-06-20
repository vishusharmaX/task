import { useEffect, useState } from 'react';
import { BoardView } from './BoardView';
import { BoardDetail } from './BoardDetail';
import './index.css';
export const App: React.FC = () => {
  const [currentBoardId, setCurrentBoardId] = useState<string | null>(null);

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash;
      if (hash.startsWith('#board/')) {
        setCurrentBoardId(hash.replace('#board/', ''));
      } else {
        setCurrentBoardId(null);
      }
    };
    window.addEventListener('hashchange', handleHashChange);
    handleHashChange();
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-3xl font-bold text-red-500 text-white">Hello Tailwind!</div>
      {currentBoardId ? <BoardDetail boardId={currentBoardId} /> : <BoardView />}
    </div>
  );
};