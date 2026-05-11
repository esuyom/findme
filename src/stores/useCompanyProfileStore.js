import { useState, useEffect } from 'react';
import { CURRENT_COMPANY } from '../mocks/currentUser';

const STORAGE_KEY = 'findme_company_profile';

const DEFAULT_PROFILE = {
  name:           CURRENT_COMPANY.name,
  email:          CURRENT_COMPANY.email,
  intro:          CURRENT_COMPANY.intro || '',
  website:        CURRENT_COMPANY.website || '',
  address:        CURRENT_COMPANY.address || '',
  businessNumber: CURRENT_COMPANY.businessNumber || '',
  revenue:        CURRENT_COMPANY.revenue || '',
  industry:       CURRENT_COMPANY.industry || '',
  size:           CURRENT_COMPANY.size || '',
  employees:      CURRENT_COMPANY.employees || '',
  founded:        CURRENT_COMPANY.founded || '',
  hrEmail:        CURRENT_COMPANY.hrEmail || '',
  hrManager:      CURRENT_COMPANY.hrManager || '',
  hrPhone:        CURRENT_COMPANY.hrPhone || '',
  keywords:       CURRENT_COMPANY.keywords || [],
  logoPreview:    CURRENT_COMPANY.logoImg || '',
};

function load() {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : null;
  } catch { return null; }
}

function save(profile) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
}

// ── 모듈 레벨 싱글톤 ──────────────────────────────────────────
// 여러 컴포넌트(Header, 수정 페이지 등)가 동일한 상태를 공유.
// update() 호출 시 구독 중인 모든 컴포넌트가 즉시 리렌더링됨.
let _profile = load() || { ...DEFAULT_PROFILE };
const _listeners = new Set();

function _subscribe(fn) {
  _listeners.add(fn);
  return () => _listeners.delete(fn);
}

function _notify() {
  _listeners.forEach((fn) => fn({ ..._profile }));
}

/** CURRENT_COMPANY를 기본값으로, localStorage 저장값으로 오버라이드 */
export function useCompanyProfileStore() {
  const [profile, setProfile] = useState(() => ({ ..._profile }));

  useEffect(() => {
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
