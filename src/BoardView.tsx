import { useState } from 'react';
import { useStore } from './store';
import type { Board } from './types';

export const BoardView: React.FC = () => {
  const { boards, addBoard, searchQuery, setSearchQuery } = useStore();
  const [newBoardName, setNewBoardName] = useState('');
  const [page, setPage] = useState(1);
  const itemsPerPage = 5;

  const filteredBoards = boards.filter((board: Board) =>
    board.name.toLowerCase().includes(searchQuery.toLowerCase())
  );
  const paginatedBoards = filteredBoards.slice((page - 1) * itemsPerPage, page * itemsPerPage);

  const handleAddBoard = () => {
    if (newBoardName.trim()) {
      addBoard(newBoardName);
      setNewBoardName('');
    }
  };

  return (
    <div className="py-8 fade-in">
      <h1 className="text-3xl font-bold mb-6">Task Boards</h1>
      <div className="mb-6 flex flex-col sm:flex-row gap-4">
        <input
          type="text"
          className="input"
          placeholder="Search boards..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <input
          type="text"
          className="input"
          placeholder="New board name"
          value={newBoardName}
          onChange={(e) => setNewBoardName(e.target.value)}
        />
        <button className="btn-primary" onClick={handleAddBoard}>
          Add Board
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="table">
          <thead>
            <tr>
              <th>Board Name</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginatedBoards.map((board: Board, index: number) => (
              <tr key={board.id} className={index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                <td>{board.name}</td>
                <td>
                  <a
                    href={`#board/${board.id}`}
                    className="text-blue-600 hover:underline font-medium"
                  >
                    View Details
                  </a>
                </td>
              </tr>
            ))}
            {paginatedBoards.length === 0 && (
              <tr>
                <td colSpan={2} className="text-center text-gray-500 py-4">
                  No boards found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <div className="mt-6 flex justify-between">
        <button
          className="btn-secondary disabled:opacity-50"
          disabled={page === 1}
          onClick={() => setPage(page - 1)}
        >
          Previous
        </button>
        <button
          className="btn-secondary disabled:opacity-50"
          disabled={page * itemsPerPage >= filteredBoards.length}
          onClick={() => setPage(page + 1)}
        >
          Next
        </button>
      </div>
    </div>
  );
};