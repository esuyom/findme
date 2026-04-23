import { useState, useRef } from 'react';

const STORAGE_KEY = 'findme_applications';

function load() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
  } catch {
    return [];
  }
}

function todayStr() {
  const d = new Date();
  return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, '0')}.${String(d.getDate()).padStart(2, '0')}`;
}

export function useApplicationStore() {
  const [applications, setApplications] = useState(load);
  const listRef = useRef(applications);

  const _commit = (newList) => {
    listRef.current = newList;
    setApplications(newList);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newList));
  };

  /** 입사지원 추가 */
  const add = ({ recruitId, company, title, field }) => {
    // 동일 공고 중복 지원 방지
    if (listRef.current.some((a) => a.recruitId === recruitId)) return false;
    _commit([
      { id: Date.now(), date: todayStr(), recruitId, company, title, field, status: '진행중', viewed: false },
      ...listRef.current,
    ]);
    return true;
  };

  /** 지원 취소 또는 삭제 */
  const remove = (id) => {
    _commit(listRef.current.filter((a) => a.id !== id));
  };

  return { applications, add, remove };
}
