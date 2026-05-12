import { useState, useEffect } from 'react';
import { saveImage, loadImage } from '../utils/imageDB';

const KEY = 'findme_student_profile';
const IMG_KEY = 'student_profileImg';

// TODO (Phase 2): GET /api/profile/student 응답으로 초기값 교체
const DEFAULT_PROFILE_IMG = '/img/sub/img-teacher.jpg';

function loadMeta() {
  try { return JSON.parse(localStorage.getItem(KEY)) || {}; } catch { return {}; }
}
function saveMeta(data) {
  const { profileImg, ...meta } = data;
  localStorage.setItem(KEY, JSON.stringify(meta));
}

let _profile = { profileImg: DEFAULT_PROFILE_IMG, ...loadMeta() };
const _listeners = new Set();

function _subscribe(fn) {
  _listeners.add(fn);
  return () => _listeners.delete(fn);
}

function _notify() {
  _listeners.forEach((fn) => fn({ ..._profile }));
}

// 모듈 로드 시 migration 완료 후 IndexedDB에서 이미지 비동기 로드
(function initProfileImg() {
  const raw = localStorage.getItem(KEY);
  let migrationPromise = Promise.resolve();

  if (raw) {
    try {
      const parsed = JSON.parse(raw);
      if (parsed.profileImg) {
        const { profileImg, ...rest } = parsed;
        migrationPromise = saveImage(IMG_KEY, profileImg).then(() => {
          localStorage.setItem(KEY, JSON.stringify(rest));
        }).catch(() => {});
      }
    } catch {}
  }

  migrationPromise.then(() => loadImage(IMG_KEY)).then((img) => {
    if (img) {
      _profile = { ..._profile, profileImg: img };
      _notify();
    }
  }).catch(() => {});
})();

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
      saveImage(IMG_KEY, fields.profileImg).catch((err) => {
        console.warn('[useStudentProfileStore] 이미지 저장 실패:', err);
      });
    }
    _notify();
  };

  return { profile, update };
}
