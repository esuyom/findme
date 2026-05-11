import { useState, useEffect } from 'react';
import { CURRENT_STUDENT } from '../mocks/currentUser';
import { saveImage, loadImage } from '../utils/imageDB';

const KEY = 'findme_student_profile';
const IMG_KEY = 'student_profileImg';

function loadMeta() {
  try { return JSON.parse(localStorage.getItem(KEY)) || {}; } catch { return {}; }
}
function saveMeta(data) {
  const { profileImg, ...meta } = data;
  localStorage.setItem(KEY, JSON.stringify(meta));
}

// one-time migration: localStorage에 있던 profileImg를 IndexedDB로 이전
(function migrateProfileImg() {
  const raw = localStorage.getItem(KEY);
  if (!raw) return;
  try {
    const parsed = JSON.parse(raw);
    if (parsed.profileImg) {
      saveImage(IMG_KEY, parsed.profileImg).then(() => {
        const { profileImg, ...rest } = parsed;
        localStorage.setItem(KEY, JSON.stringify(rest));
      }).catch(() => {});
    }
  } catch {}
})();

let _profile = { profileImg: CURRENT_STUDENT.profileImg || '', ...loadMeta() };
const _listeners = new Set();

function _subscribe(fn) {
  _listeners.add(fn);
  return () => _listeners.delete(fn);
}

function _notify() {
  _listeners.forEach((fn) => fn({ ..._profile }));
}

// 모듈 로드 시 IndexedDB에서 이미지 비동기 로드
loadImage(IMG_KEY).then((img) => {
  if (img) {
    _profile = { ..._profile, profileImg: img };
    _notify();
  }
}).catch(() => {});

export function useStudentProfileStore() {
  const [profile, setProfile] = useState(() => ({ ..._profile }));

  useEffect(() => {
    const unsub = _subscribe(setProfile);
    return unsub;
  }, []);

  const update = (fields) => {
    _profile = { ..._profile, ...fields };
    saveMeta(_profile);
    if ('profileImg' in fields) {
      saveImage(IMG_KEY, fields.profileImg).catch(() => {});
    }
    _notify();
  };

  return { profile, update };
}
