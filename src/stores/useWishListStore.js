import { useState } from 'react';

const KEY = 'findme_wish_students';

function load() {
  try { return JSON.parse(localStorage.getItem(KEY) || '[]'); } catch { return []; }
}

function save(list) {
  localStorage.setItem(KEY, JSON.stringify(list));
}

export function useWishList() {
  const [wishList, setWishList] = useState(load);

  const toggle = (id) => {
    setWishList((prev) => {
      const next = prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id];
      save(next);
      return next;
    });
  };

  const remove = (id) => {
    setWishList((prev) => {
      const next = prev.filter((i) => i !== id);
      save(next);
      return next;
    });
  };

  const isWished = (id) => wishList.includes(id);

  return { wishList, toggle, remove, isWished };
}
