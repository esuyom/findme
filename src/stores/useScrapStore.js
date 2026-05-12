import { useState, useEffect } from 'react';

function load(key) {
  try { return JSON.parse(localStorage.getItem(key) || '[]'); } catch { return []; }
}
function save(key, list) {
  localStorage.setItem(key, JSON.stringify(list));
}

function makeHook(storageKey) {
  let _list = load(storageKey);
  const _listeners = new Set();

  function _notify() {
    _listeners.forEach((fn) => fn([..._list]));
  }

  return function useScrap() {
    const [list, setList] = useState(() => [..._list]);

    useEffect(() => {
      _listeners.add(setList);
      return () => _listeners.delete(setList);
    }, []);

    const toggle = (id) => {
      _list = _list.includes(id) ? _list.filter((i) => i !== id) : [..._list, id];
      save(storageKey, _list);
      _notify();
    };

    const remove = (id) => {
      _list = _list.filter((i) => i !== id);
      save(storageKey, _list);
      _notify();
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
