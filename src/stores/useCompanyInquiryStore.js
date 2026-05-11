import { useState, useRef } from 'react';

const STORAGE_KEY = 'findme_company_inquiries';

function load() {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY)) || []; }
  catch { return []; }
}

function todayStr() {
  const d = new Date();
  return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, '0')}.${String(d.getDate()).padStart(2, '0')}`;
}

export function useCompanyInquiryStore() {
  const [inquiries, setInquiries] = useState(load);
  const ref = useRef(inquiries);

  const _commit = (list) => {
    ref.current = list;
    setInquiries(list);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
  };

  /** 개인이 기업에게 문의 */
  const add = ({ companyId, companyName, title, content, email }) => {
    const item = { id: Date.now(), companyId, companyName, title, content, email, date: todayStr(), state: '답변대기' };
    _commit([item, ...ref.current]);
    return item.id;
  };

  const remove = (id) => _commit(ref.current.filter((q) => q.id !== id));
  const getById = (id) => ref.current.find((q) => q.id === id) || null;

  /** 특정 기업이 받은 문의 목록 */
  const getByCompanyId = (companyId) => ref.current.filter((q) => q.companyId === companyId);

  return { inquiries, add, remove, getById, getByCompanyId };
}
