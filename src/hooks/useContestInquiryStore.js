import { useState, useRef } from 'react';

const STORAGE_KEY = 'findme_contest_inquiries';

function load() {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY)) || []; }
  catch { return []; }
}

function todayStr() {
  const d = new Date();
  return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, '0')}.${String(d.getDate()).padStart(2, '0')}`;
}

export function useContestInquiryStore() {
  const [inquiries, setInquiries] = useState(load);
  const ref = useRef(inquiries);

  const _commit = (list) => {
    ref.current = list;
    setInquiries(list);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
  };

  /** 문의 추가. 동일 공모전 중복 문의 방지 → 중복이면 false 반환 */
  const add = ({ contestId, contestTitle, name, phone, location, agreed }) => {
    if (ref.current.some((q) => q.contestId === contestId)) return false;
    _commit([
      { id: Date.now(), contestId, contestTitle, name, phone, location, agreed, date: todayStr() },
      ...ref.current,
    ]);
    return true;
  };

  const isInquired = (contestId) => ref.current.some((q) => q.contestId === contestId);

  const remove = (id) => _commit(ref.current.filter((q) => q.id !== id));

  return { inquiries, add, isInquired, remove };
}
