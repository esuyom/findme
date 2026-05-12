import { useState, useRef } from 'react';

const STORAGE_KEY = 'findme_cp_recruits';

// TODO (Phase 2): localStorage 제거 후 GET /api/recruits (기업 소유 공고) 로 교체
function load() {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    const stored = data ? JSON.parse(data) : [];

    // TODO (Phase 2): 마감일 자동 상태 변경은 백엔드에서 처리
    // 아래 로직은 백엔드 연동 후 제거
    /*
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    let autoClosedAny = false;
    const autoChecked = stored.map((r) => {
      if (r.status === 'active' && r.deadline && r.deadline !== '상시채용') {
        const dl = new Date(r.deadline);
        dl.setHours(23, 59, 59, 0);
        if (dl < today) {
          autoClosedAny = true;
          return { ...r, status: 'closed' };
        }
      }
      return r;
    });
    if (autoClosedAny) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(autoChecked));
    }
    return autoChecked;
    */

    return stored;
  } catch {
    return [];
  }
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
