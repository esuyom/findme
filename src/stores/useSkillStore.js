import { useState } from 'react';

const STORAGE_KEY = 'findme_skills';

function load() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
  } catch {
    return [];
  }
}

export function useSkillStore() {
  const [skills, setSkills] = useState(load);

  // 즉시 저장 (추가/삭제)
  const commit = (newList) => {
    setSkills(newList);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newList));
  };

  return { skills, setSkills, commit };
}
