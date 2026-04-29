import { useState } from 'react';
import { CURRENT_STUDENT } from '../constants/currentUser';

const KEY = 'findme_student_profile';

function load() {
  try { return JSON.parse(localStorage.getItem(KEY)) || {}; } catch { return {}; }
}
function save(data) {
  localStorage.setItem(KEY, JSON.stringify(data));
}

export function useStudentProfileStore() {
  const [profile, setProfile] = useState(() => ({
    profileImg: CURRENT_STUDENT.profileImg || '',
    ...load(),
  }));

  const update = (fields) => {
    const next = { ...profile, ...fields };
    setProfile(next);
    save(next);
  };

  return { profile, update };
}
