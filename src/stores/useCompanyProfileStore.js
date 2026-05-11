import { useState, useEffect } from 'react';
import { CURRENT_COMPANY } from '../mocks/currentUser';
import { saveImage, loadImage } from '../utils/imageDB';

const STORAGE_KEY = 'findme_company_profile';
const LOGO_KEY = 'company_logoPreview';

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

// one-time migration
(function migrateLogoPreview() {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return;
  try {
    const parsed = JSON.parse(raw);
    if (parsed.logoPreview) {
      const { logoPreview, ...rest } = parsed;
      saveImage(LOGO_KEY, logoPreview).then(() => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(rest));
        _profile = { ..._profile, logoPreview };
        _notify();
      }).catch(() => {});
    }
  } catch {}
})();

// 모듈 로드 시 IndexedDB에서 로고 이미지 비동기 로드
loadImage(LOGO_KEY).then((img) => {
  if (img) {
    _profile = { ..._profile, logoPreview: img };
    _notify();
  }
}).catch(() => {});

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
