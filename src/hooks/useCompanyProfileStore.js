import { useState } from 'react';
import { CURRENT_COMPANY } from '../constants/currentUser';

const STORAGE_KEY = 'findme_company_profile';

function load() {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : null;
  } catch { return null; }
}

function save(profile) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
}

/** CURRENT_COMPANY를 기본값으로, localStorage 저장값으로 오버라이드 */
export function useCompanyProfileStore() {
  const [profile, setProfile] = useState(() => load() || {
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
  });

  const update = (fields) => {
    const next = { ...profile, ...fields };
    setProfile(next);
    save(next);
  };

  return { profile, update };
}
