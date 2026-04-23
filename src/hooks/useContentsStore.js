import { useState, useRef } from 'react';

const STORAGE_KEY = 'findme_contents';

function load() {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY)) || []; }
  catch { return []; }
}

function todayStr() {
  const d = new Date();
  return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, '0')}.${String(d.getDate()).padStart(2, '0')}`;
}

export function useContentsStore() {
  const [contents, setContents] = useState(load);
  const ref = useRef(contents);

  const _commit = (list) => {
    ref.current = list;
    setContents(list);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
  };

  const add = (formData, status = 'draft') => {
    const item = {
      id: Date.now(),
      title: formData.company
        ? `${formData.company} 취업 성공 스토리`
        : formData.feeling || '새 인터뷰',
      lastModified: todayStr(),
      status,
      formData,
    };
    _commit([item, ...ref.current]);
    return item.id;
  };

  const update = (id, formData, status) => {
    _commit(
      ref.current.map((c) =>
        c.id === id
          ? {
              ...c,
              title: formData.company
                ? `${formData.company} 취업 성공 스토리`
                : formData.feeling || c.title,
              lastModified: todayStr(),
              status: status ?? c.status,
              formData,
            }
          : c
      )
    );
  };

  const remove = (id) => _commit(ref.current.filter((c) => c.id !== id));
  const getById = (id) => ref.current.find((c) => c.id === id) || null;

  return { contents, add, update, remove, getById };
}
