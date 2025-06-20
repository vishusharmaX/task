import { useState } from 'react';
import { useStore } from './store';
import { Card } from './Card';
import type { Column as ColumnType, Priority } from './types';

interface ColumnProps {
  boardId: string;
  column: ColumnType;
}

export const Column: React.FC<ColumnProps> = ({ boardId, column }) => {
  const { addCard, deleteColumn, moveCard, reorderCards } = useStore();
  const [newCard, setNewCard] = useState({
    title: '',
    description: '',
    creator: 'User',
    priority: 'medium' as Priority,
    dueDate: '',
    assignee: '',
  });
  const [isAddingCard, setIsAddingCard] = useState(false);

  const handleAddCard = () => {
    if (newCard.title.trim()) {
      addCard(boardId, column.id, { ...newCard, id: crypto.randomUUID() });
      setNewCard({
        title: '',
        description: '',
        creator: 'User',
        priority: 'medium',
        dueDate: '',
        assignee: '',
      });
      setIsAddingCard(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    const cardId = e.dataTransfer.getData('cardId');
    const sourceColId = e.dataTransfer.getData('sourceColId');
    const sourceIndex = parseInt(e.dataTransfer.getData('sourceIndex'));
    if (sourceColId === column.id) {
      const destIndex = Array.from(e.currentTarget.querySelectorAll('.card')).findIndex(
        (el) => el === document.elementFromPoint(e.clientX, e.clientY)
      );
      if (destIndex !== -1 && destIndex !== sourceIndex) {
        reorderCards(boardId, column.id, sourceIndex, destIndex);
      }
    } else {
      moveCard(boardId, sourceColId, column.id, cardId, column.cards.length);
    }
  };

  return (
    <div
      className="bg-gray-100 p-4 rounded-xl shadow-md min-w-[250px] sm:min-w-[280px] flex flex-col transition-all duration-200 hover:border-2 hover:border-blue-300 fade-in"
      onDragOver={(e) => e.preventDefault()}
      onDrop={handleDrop}
    >
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg sm:text-xl font-semibold text-gray-800">{column.title}</h2>
        <button
          className="btn-danger px-2 sm:px-3 py-1 text-sm"
          onClick={() => deleteColumn(boardId, column.id)}
        >
          Delete
        </button>
      </div>
      <div className="flex-1 space-y-4">
        {column.cards.map((card, index) => (
          <Card key={card.id} boardId={boardId} columnId={column.id} card={card} index={index} />
        ))}
      </div>
      {isAddingCard ? (
        <div className="bg-white p-4 rounded-lg shadow-md mt-4">
          <input
            type="text"
            className="input mb-2"
            placeholder="Card title"
            value={newCard.title}
            onChange={(e) => setNewCard({ ...newCard, title: e.target.value })}
          />
          <textarea
            className="input mb-2"
            placeholder="Description"
            value={newCard.description}
            onChange={(e) => setNewCard({ ...newCard, description: e.target.value })}
          />
          <select
            className="input mb-2"
            value={newCard.priority}
            onChange={(e) => setNewCard({ ...newCard, priority: e.target.value as Priority })}
          >
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>
          <input
            type="date"
            className="input mb-2"
            value={newCard.dueDate}
            onChange={(e) => setNewCard({ ...newCard, dueDate: e.target.value })}
          />
          <input
            type="text"
            className="input mb-2"
            placeholder="Assignee"
            value={newCard.assignee}
            onChange={(e) => setNewCard({ ...newCard, assignee: e.target.value })}
          />
          <div className="flex gap-2 flex-wrap">
            <button className="btn-success" onClick={handleAddCard}>
              Add Card
            </button>
            <button className="btn-secondary" onClick={() => setIsAddingCard(false)}>
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <button
          className="btn-primary mt-4 w-full"
          onClick={() => setIsAddingCard(true)}
        >
          Add Card
        </button>
      )}
    </div>
  );
};