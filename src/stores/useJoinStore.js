import { useState, useRef } from 'react';

const STORAGE_KEY = 'findme_joins';

function load() {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY)) || []; }
  catch { return []; }
}

export function useJoinStore() {
  const [joins, setJoins] = useState(load);
  const ref = useRef(joins);

  const _commit = (list) => {
    ref.current = list;
    setJoins(list);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
  };

  /** 중복 신청 방지: coachingId 기준 */
  const add = ({ coachingId, category, title, deadline, img }) => {
    if (ref.current.some((j) => j.coachingId === coachingId)) return false;
    _commit([...ref.current, { id: Date.now(), coachingId, category, title, deadline, img }]);
    return true;
  };

  const remove = (id) => _commit(ref.current.filter((j) => j.id !== id));

  const isJoined = (coachingId) => ref.current.some((j) => j.coachingId === coachingId);

  return { joins, add, remove, isJoined };
}
