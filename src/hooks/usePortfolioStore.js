import { useState, useRef } from 'react';

const STORAGE_KEY = 'findme_portfolios';

function load() {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY)) || []; }
  catch { return []; }
}

export function usePortfolioStore() {
  const [portfolios, setPortfolios] = useState(load);
  const ref = useRef(portfolios);

  const _commit = (list) => {
    ref.current = list;
    setPortfolios(list);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
  };

  const add    = (data) => _commit([...ref.current, { id: Date.now(), ...data }]);
  const update = (id, data) => _commit(ref.current.map((p) => (p.id === id ? { ...p, ...data } : p)));
  const remove = (id) => _commit(ref.current.filter((p) => p.id !== id));
  const getById = (id) => ref.current.find((p) => p.id === id) || null;

  return { portfolios, add, update, remove, getById };
}
