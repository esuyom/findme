import { useState, useRef } from 'react';

const STORAGE_KEY = 'findme_cp_recruits';

function load() {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY)) || []; }
  catch { return []; }
}

function todayStr() {
  const d = new Date();
  return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, '0')}.${String(d.getDate()).padStart(2, '0')}`;
}

export function useCpRecruitStore() {
  const [recruits, setRecruits] = useState(load);
  const ref = useRef(recruits);

  const _commit = (list) => {
    ref.current = list;
    setRecruits(list);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
  };

  const add = (data, status = 'draft') => {
    const item = { id: Date.now(), date: todayStr(), status, applicants: 0, ...data };
    _commit([item, ...ref.current]);
    return item.id;
  };

  const update = (id, data, status) => {
    _commit(ref.current.map((r) => (r.id === id ? { ...r, ...data, status: status ?? r.status } : r)));
  };

  const remove = (id) => _commit(ref.current.filter((r) => r.id !== id));

  const close = (id) => _commit(ref.current.map((r) => (r.id === id ? { ...r, status: 'closed' } : r)));

  const getById = (id) => ref.current.find((r) => r.id === id) || null;

  return { recruits, add, update, remove, close, getById };
}
