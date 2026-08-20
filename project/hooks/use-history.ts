'use client';

import { useCallback, useEffect, useState } from 'react';
import type { HistoryItem } from '@/types';
import { clearHistory, loadHistory, saveHistory } from '@/services/storage';

export function useHistory() {
  const [items, setItems] = useState<HistoryItem[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setItems(loadHistory());
    setLoaded(true);
  }, []);

  const persist = useCallback((next: HistoryItem[]) => {
    setItems(next);
    saveHistory(next);
  }, []);

  const addHistory = useCallback(
    (item: HistoryItem) => {
      setItems((prev) => {
        const next = [item, ...prev];
        saveHistory(next);
        return next;
      });
    },
    []
  );

  const deleteHistory = useCallback(
    (id: string) => {
      setItems((prev) => {
        const next = prev.filter((i) => i.id !== id);
        saveHistory(next);
        return next;
      });
    },
    []
  );

  const toggleFavorite = useCallback(
    (id: string) => {
      setItems((prev) => {
        const next = prev.map((i) =>
          i.id === id ? { ...i, favorite: !i.favorite } : i
        );
        saveHistory(next);
        return next;
      });
    },
    []
  );

  const clearAll = useCallback(() => {
    setItems([]);
    clearHistory();
  }, []);

  return { items, loaded, addHistory, deleteHistory, toggleFavorite, clearAll, persist };
}
