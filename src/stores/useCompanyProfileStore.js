import { useState, useEffect } from 'react';
import { saveImage, loadImage } from '../utils/imageDB';

const STORAGE_KEY = 'findme_company_profile';
const LOGO_KEY = 'company_logoPreview';

// TODO (Phase 2): GET /api/profile/company 응답으로 초기값 교체
const DEFAULT_PROFILE = {
  name:           '코리아교육그룹',
  email:          'hr@koreaedugroup.com',
  intro:          '',
  website:        '',
  address:        '',
  businessNumber: '',
  revenue:        '',
  industry:       '',
  size:           '',
  employees:      '',
  founded:        '',
  hrEmail:        '',
  hrManager:      '',
  hrPhone:        '',
  keywords:       [],
  welfare:        '',
  logoPreview:    '/img/company/co-logo.jpg',
};

function loadMeta() {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : null;
  } catch { return null; }
}

function saveMeta(profile) {
  const { logoPreview, ...meta } = profile;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(meta));
}

let _profile = loadMeta() || { ...DEFAULT_PROFILE };
const _listeners = new Set();

function _subscribe(fn) {
  _listeners.add(fn);
  return () => _listeners.delete(fn);
}

function _notify() {
  _listeners.forEach((fn) => fn({ ..._profile }));
}

// 모듈 로드 시 migration 완료 후 IndexedDB에서 로고 이미지 비동기 로드
(function initLogoImg() {
  const raw = localStorage.getItem(STORAGE_KEY);
  let migrationPromise = Promise.resolve();

  if (raw) {
    try {
      const parsed = JSON.parse(raw);
      if (parsed.logoPreview) {
        const { logoPreview, ...rest } = parsed;
        migrationPromise = saveImage(LOGO_KEY, logoPreview).then(() => {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(rest));
        }).catch(() => {});
      }
    } catch {}
  }

  migrationPromise.then(() => loadImage(LOGO_KEY)).then((img) => {
    if (img) {
      _profile = { ..._profile, logoPreview: img };
      _notify();
    }
  }).catch(() => {});
})();

export function useCompanyProfileStore() {
  const [profile, setProfile] = useState(() => ({ ..._profile }));

  useEffect(() => {
    const unsub = _subscribe(setProfile);
    return unsub;
  }, []);

  const update = (fields) => {
    _profile = { ..._profile, ...fields };
    saveMeta(_profile);
    if ('logoPreview' in fields) {
      saveImage(LOGO_KEY, fields.logoPreview).catch((err) => {
        console.warn('[useCompanyProfileStore] 이미지 저장 실패:', err);
      });
    }
    _notify();
  };

  return { profile, update };
}
