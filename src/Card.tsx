import { useRef, useState } from 'react';
import { useStore } from './store';
import type { Card as CardType, Priority } from './types';

interface CardProps {
  boardId: string;
  columnId: string;
  card: CardType;
  index: number;
}

export const Card: React.FC<CardProps> = ({ boardId, columnId, card, index }) => {
  const { updateCard, deleteCard } = useStore();
  const [isEditing, setIsEditing] = useState(false);
  const [editedCard, setEditedCard] = useState(card);
  const cardRef = useRef<HTMLDivElement>(null);

  const handleDragStart = (e: React.DragEvent) => {
    e.dataTransfer.setData('cardId', card.id);
    e.dataTransfer.setData('sourceColId', columnId);
    e.dataTransfer.setData('sourceIndex', index.toString());
  };

  const handleSave = () => {
    updateCard(boardId, columnId, card.id, editedCard);
    setIsEditing(false);
  };

  const priorityColors: Record<Priority, string> = {
    high: 'bg-red-500 text-white',
    medium: 'bg-yellow-500 text-black',
    low: 'bg-green-500 text-white',
  };

  return (
    <div
      ref={cardRef}
      draggable
      onDragStart={handleDragStart}
      className="card bg-white p-4 rounded-lg shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-200 fade-in"
    >
      {isEditing ? (
        <div className="space-y-2">
          <input
            type="text"
            className="input"
            value={editedCard.title}
            onChange={(e) => setEditedCard({ ...editedCard, title: e.target.value })}
          />
          <textarea
            className="input"
            value={editedCard.description}
            onChange={(e) => setEditedCard({ ...editedCard, description: e.target.value })}
          />
          <select
            className="input"
            value={editedCard.priority}
            onChange={(e) => setEditedCard({ ...editedCard, priority: e.target.value as Priority })}
          >
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>
          <input
            type="date"
            className="input"
            value={editedCard.dueDate}
            onChange={(e) => setEditedCard({ ...editedCard, dueDate: e.target.value })}
          />
          <input
            type="text"
            className="input"
            value={editedCard.assignee}
            onChange={(e) => setEditedCard({ ...editedCard, assignee: e.target.value })}
            placeholder="Assignee"
          />
          <div className="flex gap-2 flex-wrap">
            <button className="btn-success" onClick={handleSave}>
              Save
            </button>
            <button className="btn-secondary" onClick={() => setIsEditing(false)}>
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <div>
          <div className="flex justify-between items-start">
            <h3 className="text-base sm:text-lg font-semibold text-gray-800">{card.title}</h3>
            <span
              className={`px-2 py-1 text-xs font-medium rounded-full ${priorityColors[card.priority]}`}
            >
              {card.priority}
            </span>
          </div>
          <p className="text-sm text-gray-600 mt-2 line-clamp-3">{card.description}</p>
          <p className="text-xs sm:text-sm text-gray-500 mt-2">Due: {card.dueDate || 'N/A'}</p>
          <p className="text-xs sm:text-sm text-gray-500">Assignee: {card.assignee || 'Unassigned'}</p>
          <p className="text-xs text-gray-400 mt-1">Created by: {card.creator}</p>
          <div className="mt-4 flex gap-2 flex-wrap">
            <button
              className="btn-primary px-3 py-1 text-sm"
              onClick={() => setIsEditing(true)}
            >
              Edit
            </button>
            <button
              className="btn-danger px-3 py-1 text-sm"
              onClick={() => deleteCard(boardId, columnId, card.id)}
            >
              Delete
            </button>
          </div>
        </div>
      )}
    </div>
  );
};