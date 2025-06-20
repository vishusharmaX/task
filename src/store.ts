import { create } from 'zustand';
import type { Board, Card } from './types';


interface StoreState {
  boards: Board[];
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  addBoard: (name: string) => void;
  addColumn: (boardId: string, title: string) => void;
  addCard: (boardId: string, columnId: string, card: Card) => void;
  updateCard: (boardId: string, columnId: string, cardId: string, updatedCard: Card) => void;
  deleteCard: (boardId: string, columnId: string, cardId: string) => void;
  deleteColumn: (boardId: string, columnId: string) => void;
  moveCard: (boardId: string, sourceColId: string, destColId: string, cardId: string, destIndex: number) => void;
  reorderCards: (boardId: string, columnId: string, sourceIndex: number, destIndex: number) => void;
}

export const useStore = create<StoreState>((set) => ({
  boards: JSON.parse(localStorage.getItem('boards') || '[]') as Board[],
  searchQuery: '',
  setSearchQuery: (query) => set({ searchQuery: query }),
  addBoard: (name) =>
    set((state) => {
      const newBoard: Board = { id: crypto.randomUUID(), name, columns: [] };
      const updatedBoards = [...state.boards, newBoard];
      localStorage.setItem('boards', JSON.stringify(updatedBoards));
      return { boards: updatedBoards };
    }),
  addColumn: (boardId, title) =>
    set((state) => {
      const updatedBoards = state.boards.map((board) =>
        board.id === boardId
          ? { ...board, columns: [...board.columns, { id: crypto.randomUUID(), title, cards: [] }] }
          : board
      );
      localStorage.setItem('boards', JSON.stringify(updatedBoards));
      return { boards: updatedBoards };
    }),
  addCard: (boardId, columnId, card) =>
    set((state) => {
      const updatedBoards = state.boards.map((board) =>
        board.id === boardId
          ? {
              ...board,
              columns: board.columns.map((col) =>
                col.id === columnId ? { ...col, cards: [...col.cards, card] } : col
              ),
            }
          : board
      );
      localStorage.setItem('boards', JSON.stringify(updatedBoards));
      return { boards: updatedBoards };
    }),
  updateCard: (boardId, columnId, cardId, updatedCard) =>
    set((state) => {
      const updatedBoards = state.boards.map((board) =>
        board.id === boardId
          ? {
              ...board,
              columns: board.columns.map((col) =>
                col.id === columnId
                  ? {
                      ...col,
                      cards: col.cards.map((card) =>
                        card.id === cardId ? updatedCard : card
                      ),
                    }
                  : col
              ),
            }
          : board
      );
      localStorage.setItem('boards', JSON.stringify(updatedBoards));
      return { boards: updatedBoards };
    }),
  deleteCard: (boardId, columnId, cardId) =>
    set((state) => {
      const updatedBoards = state.boards.map((board) =>
        board.id === boardId
          ? {
              ...board,
              columns: board.columns.map((col) =>
                col.id === columnId
                  ? { ...col, cards: col.cards.filter((card) => card.id !== cardId) }
                  : col
              ),
            }
          : board
      );
      localStorage.setItem('boards', JSON.stringify(updatedBoards));
      return { boards: updatedBoards };
    }),
  deleteColumn: (boardId, columnId) =>
    set((state) => {
      const updatedBoards = state.boards.map((board) =>
        board.id === boardId
          ? { ...board, columns: board.columns.filter((col) => col.id !== columnId) }
          : board
      );
      localStorage.setItem('boards', JSON.stringify(updatedBoards));
      return { boards: updatedBoards };
    }),
  moveCard: (boardId, sourceColId, destColId, cardId, destIndex) =>
    set((state) => {
      const updatedBoards = state.boards.map((board) => {
        if (board.id !== boardId) return board;
        const sourceCol = board.columns.find((col) => col.id === sourceColId);
        const destCol = board.columns.find((col) => col.id === destColId);
        if (!sourceCol || !destCol) return board;
        const card = sourceCol.cards.find((c) => c.id === cardId);
        if (!card) return board;
        const updatedColumns = board.columns.map((col) => {
          if (col.id === sourceColId) {
            return { ...col, cards: col.cards.filter((c) => c.id !== cardId) };
          }
          if (col.id === destColId) {
            const newCards = [...col.cards];
            newCards.splice(destIndex, 0, card);
            return { ...col, cards: newCards };
          }
          return col;
        });
        return { ...board, columns: updatedColumns };
      });
      localStorage.setItem('boards', JSON.stringify(updatedBoards));
      return { boards: updatedBoards };
    }),
  reorderCards: (boardId, columnId, sourceIndex, destIndex) =>
    set((state) => {
      const updatedBoards = state.boards.map((board) => {
        if (board.id !== boardId) return board;
        const column = board.columns.find((col) => col.id === columnId);
        if (!column) return board;
        const newCards = [...column.cards];
        const [movedCard] = newCards.splice(sourceIndex, 1);
        newCards.splice(destIndex, 0, movedCard);
        return {
          ...board,
          columns: board.columns.map((col) =>
            col.id === columnId ? { ...col, cards: newCards } : col
          ),
        };
      });
      localStorage.setItem('boards', JSON.stringify(updatedBoards));
      return { boards: updatedBoards };
    }),
}));