import { useState, useEffect } from 'react';

const KEY = 'findme_wish_students';

function load() {
  try { return JSON.parse(localStorage.getItem(KEY) || '[]'); } catch { return []; }
}

function save(list) {
  localStorage.setItem(KEY, JSON.stringify(list));
}

let _list = load();
const _listeners = new Set();

function _notify() {
  _listeners.forEach((fn) => fn([..._list]));
}

export function useWishList() {
  const [wishList, setWishList] = useState(() => [..._list]);

  useEffect(() => {
    _listeners.add(setWishList);
    return () => _listeners.delete(setWishList);
  }, []);

  const toggle = (id) => {
    _list = _list.includes(id) ? _list.filter((i) => i !== id) : [..._list, id];
    save(_list);
    _notify();
  };

  const remove = (id) => {
    _list = _list.filter((i) => i !== id);
    save(_list);
    _notify();
  };

  const isWished = (id) => wishList.includes(id);

  return { wishList, toggle, remove, isWished };
}
