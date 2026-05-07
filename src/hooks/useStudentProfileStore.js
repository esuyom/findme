import { useState, useEffect } from 'react';
import { CURRENT_STUDENT } from '../constants/currentUser';

const KEY = 'findme_student_profile';

function load() {
  try { return JSON.parse(localStorage.getItem(KEY)) || {}; } catch { return {}; }
}
function save(data) {
  localStorage.setItem(KEY, JSON.stringify(data));
}

// ── 모듈 레벨 싱글톤 ──────────────────────────────────────────
// 컴포넌트별로 독립 state를 갖던 구조를 전역 단일 상태로 통일.
// update() 호출 시 구독 중인 모든 컴포넌트가 즉시 리렌더링됨.
let _profile = { profileImg: CURRENT_STUDENT.profileImg || '', ...load() };
const _listeners = new Set();

function _subscribe(fn) {
  _listeners.add(fn);
  return () => _listeners.delete(fn);
}

function _notify() {
  _listeners.forEach((fn) => fn({ ..._profile }));
}

export function useStudentProfileStore() {
  const [profile, setProfile] = useState(() => ({ ..._profile }));

  useEffect(() => {
    // 구독 등록 — useState 초기값이 이미 최신 싱글톤을 읽으므로 동기화 불필요
    const unsub = _subscribe(setProfile);
    return unsub;
  }, []);

  const update = (fields) => {
    _profile = { ..._profile, ...fields };
    save(_profile);
    _notify();
  };

  return { profile, update };
}
