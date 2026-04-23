import { useState, useRef } from 'react';

const STORAGE_KEY = 'findme_cp_qna';

function load() {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY)) || []; }
  catch { return []; }
}

function todayStr() {
  const d = new Date();
  return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, '0')}.${String(d.getDate()).padStart(2, '0')}`;
}

export function useCpQnaStore() {
  const [qnas, setQnas] = useState(load);
  const ref = useRef(qnas);

  const _commit = (list) => {
    ref.current = list;
    setQnas(list);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
  };

  const add = ({ title, content }) => {
    const item = { id: Date.now(), title, content, date: todayStr(), state: '답변대기', answered: false };
    _commit([item, ...ref.current]);
    return item.id;
  };

  const remove = (id) => _commit(ref.current.filter((q) => q.id !== id));
  const getById = (id) => ref.current.find((q) => q.id === id) || null;

  return { qnas, add, remove, getById };
}
