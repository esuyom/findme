import { useState, useRef } from 'react';

const STORAGE_KEY = 'findme_cp_offers';

function load() {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY)) || []; }
  catch { return []; }
}

function todayStr() {
  const d = new Date();
  return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, '0')}.${String(d.getDate()).padStart(2, '0')}`;
}

export function useCpOfferStore() {
  const [offers, setOffers] = useState(load);
  const ref = useRef(offers);

  const _commit = (list) => {
    ref.current = list;
    setOffers(list);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
  };

  /** HrDetailPage 면접제의 시 저장 */
  const add = ({ studentId, studentName, studentAge, jobGroup, recruitTitles, deadline }) => {
    const item = {
      id: Date.now(),
      date: todayStr(),
      studentId,
      studentName,
      studentAge,
      jobGroup,
      recruitTitles,
      deadline,
      status: '대기중',
    };
    _commit([item, ...ref.current]);
    return item.id;
  };

  const remove = (id) => _commit(ref.current.filter((o) => o.id !== id));

  return { offers, add, remove };
}
