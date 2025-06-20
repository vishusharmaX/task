import { useState } from 'react';
import { useStore } from './store';
import { Column } from './Column';
import type { Board } from './types';
import './index.css';
interface BoardDetailProps {
  boardId: string;
}

export const BoardDetail: React.FC<BoardDetailProps> = ({ boardId }) => {
  const { boards, addColumn } = useStore();
  const [newColumnTitle, setNewColumnTitle] = useState('');
  const board = boards.find((b: Board) => b.id === boardId);

  if (!board) return <div className="text-center text-gray-500 py-8 fade-in">Board not found</div>;

  const handleAddColumn = () => {
    if (newColumnTitle.trim()) {
      addColumn(boardId, newColumnTitle);
      setNewColumnTitle('');
    }
  };

  return (
    <div className="py-8 fade-in">
      <div className="sticky top-0 bg-gray-50 z-10 pb-4">
        <h1 className="text-3xl font-bold text-blue-600 mb-4">{board.name}</h1>
        <div className="flex flex-col sm:flex-row gap-4">
          <input
            type="text"
            className="input"
            placeholder="New column title"
            value={newColumnTitle}
            onChange={(e) => setNewColumnTitle(e.target.value)}
          />
          <button className="btn-primary" onClick={handleAddColumn}>
            Add Column
          </button>
          <a href="#" className="btn-secondary text-center">
            Back to Boards
          </a>
        </div>
      </div>
      <div className="flex flex-col sm:flex-row gap-4 overflow-x-auto pb-4">
        {board.columns.map((column) => (
          <Column key={column.id} boardId={boardId} column={column} />
        ))}
        {board.columns.length === 0 && (
          <p className="text-gray-500 text-sm sm:text-base">No columns yet. Add one to get started!</p>
        )}
      </div>
    </div>
  );
};