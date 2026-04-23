import { useState } from 'react';

const STORAGE_KEY = 'findme_resumes';

// 기본 더미 이력서 (localStorage 비어있을 때 초기값)
const DEFAULT_RESUMES = [
  {
    id: 1,
    name: '다재다능한 디자이너 최수정',
    isMain: true,
    status: 'complete',
    lastModified: '2024.05.06',
    formData: null,
  },
  {
    id: 2,
    name: '패기와 열정이 있는 디자이너 최수정',
    isMain: false,
    status: 'draft',
    lastModified: '2024.05.06',
    formData: null,
  },
];

function loadFromStorage() {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : DEFAULT_RESUMES;
  } catch {
    return DEFAULT_RESUMES;
  }
}

function saveToStorage(list) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
}

function todayStr() {
  const d = new Date();
  return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, '0')}.${String(d.getDate()).padStart(2, '0')}`;
}

export function useResumeStore() {
  const [resumes, setResumes] = useState(() => loadFromStorage());

  const _commit = (newList) => {
    setResumes(newList);
    saveToStorage(newList);
  };

  /** 새 이력서 추가. 저장된 id 반환 */
  const add = (formData, status = 'draft') => {
    const id = Date.now();
    const entry = {
      id,
      name: formData.resumeName?.trim() || '새 이력서',
      isMain: resumes.length === 0,   // 첫 이력서는 자동으로 기본
      status,
      lastModified: todayStr(),
      formData,
    };
    _commit([...resumes, entry]);
    return id;
  };

  /** 기존 이력서 수정 */
  const update = (id, formData, status) => {
    _commit(
      resumes.map((r) =>
        r.id === id
          ? {
              ...r,
              name: formData.resumeName?.trim() || r.name,
              status: status ?? r.status,
              lastModified: todayStr(),
              formData,
            }
          : r
      )
    );
  };

  /** 삭제 */
  const remove = (id) => {
    const next = resumes.filter((r) => r.id !== id);
    // 삭제된 게 기본이력서였으면 첫 번째를 기본으로
    if (resumes.find((r) => r.id === id)?.isMain && next.length > 0) {
      next[0].isMain = true;
    }
    _commit(next);
  };

  /** 이름 변경 */
  const rename = (id, newName) => {
    _commit(resumes.map((r) => (r.id === id ? { ...r, name: newName } : r)));
  };

  /** 사본 만들기 */
  const copy = (id) => {
    const original = resumes.find((r) => r.id === id);
    if (!original) return;
    _commit([
      ...resumes,
      { ...original, id: Date.now(), name: original.name + ' 사본', isMain: false, lastModified: todayStr() },
    ]);
  };

  /** 기본이력서 설정 */
  const setMain = (id) => {
    _commit(resumes.map((r) => ({ ...r, isMain: r.id === id })));
  };

  /** id로 이력서 조회 */
  const getById = (id) => resumes.find((r) => r.id === id) || null;

  return { resumes, add, update, remove, rename, copy, setMain, getById };
}
