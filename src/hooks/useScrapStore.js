import { useState } from 'react';

function load(key) {
  try { return JSON.parse(localStorage.getItem(key) || '[]'); } catch { return []; }
}
function save(key, list) {
  localStorage.setItem(key, JSON.stringify(list));
}

function makeHook(storageKey) {
  return function useScrap() {
    const [list, setList] = useState(() => load(storageKey));

    const toggle = (id) => {
      setList((prev) => {
        const next = prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id];
        save(storageKey, next);
        return next;
      });
    };

    const remove = (id) => {
      setList((prev) => {
        const next = prev.filter((i) => i !== id);
        save(storageKey, next);
        return next;
      });
    };

    const isScraped = (id) => list.includes(id);

    return { list, toggle, remove, isScraped };
  };
}

export const useRecruitScrap  = makeHook('findme_scrap_recruits');
export const useCompanyScrap  = makeHook('findme_scrap_companies');
export const useCoachingScrap = makeHook('findme_scrap_coachings');
export const useTrendScrap    = makeHook('findme_scrap_trends');
export const useContestScrap  = makeHook('findme_scrap_contests');
