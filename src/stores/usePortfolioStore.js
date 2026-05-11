import { useState, useEffect, useRef } from 'react';
import { saveImage, loadImage, removeImage } from '../utils/imageDB';

const STORAGE_KEY = 'findme_portfolios';

function loadMeta() {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY)) || []; }
  catch { return []; }
}

/** 이미지 필드 제거 후 localStorage 저장 */
function saveMeta(list) {
  const stripped = list.map(({ thumbData, pfData, ...rest }) => rest);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(stripped));
}

async function savePortfolioImages(id, thumbData, pfData) {
  await saveImage(`portfolio_${id}_thumb`, thumbData?.length ? thumbData : null);
  await saveImage(`portfolio_${id}_pf`, pfData?.length ? pfData : null);
}

async function loadPortfolioImages(id) {
  const [thumbData, pfData] = await Promise.all([
    loadImage(`portfolio_${id}_thumb`),
    loadImage(`portfolio_${id}_pf`),
  ]);
  return { thumbData: thumbData ?? [], pfData: pfData ?? [] };
}

export function usePortfolioStore() {
  const [portfolios, setPortfolios] = useState(loadMeta);
  const ref = useRef(portfolios);

  // 마운트 시 각 포트폴리오 이미지를 IndexedDB에서 로드
  useEffect(() => {
    const meta = loadMeta();
    if (meta.length === 0) return;
    Promise.all(meta.map(async (p) => ({ ...p, ...(await loadPortfolioImages(p.id)) })))
      .then((full) => {
        ref.current = full;
        setPortfolios(full);
      })
      .catch(() => {});
  }, []);

  const _commit = (list) => {
    ref.current = list;
    setPortfolios(list);
    saveMeta(list);
  };

  const add = async (data) => {
    const id = Date.now();
    const { thumbData, pfData, ...rest } = data;
    const next = [...ref.current, { id, ...rest, thumbData: thumbData ?? [], pfData: pfData ?? [] }];
    _commit(next);
    await savePortfolioImages(id, thumbData, pfData).catch((err) => {
      console.warn('[usePortfolioStore] 이미지 저장 실패:', err);
    });
  };

  const update = async (id, data) => {
    const { thumbData, pfData, ...rest } = data;
    const next = ref.current.map((p) =>
      p.id === id
        ? { ...p, ...rest, thumbData: thumbData ?? p.thumbData, pfData: pfData ?? p.pfData }
        : p
    );
    _commit(next);
    const updated = next.find((p) => p.id === id);
    if (updated) {
      await savePortfolioImages(id, updated.thumbData, updated.pfData).catch((err) => {
        console.warn('[usePortfolioStore] 이미지 저장 실패:', err);
      });
    }
  };

  const remove = async (id) => {
    _commit(ref.current.filter((p) => p.id !== id));
    await Promise.all([
      removeImage(`portfolio_${id}_thumb`),
      removeImage(`portfolio_${id}_pf`),
    ]).catch((err) => {
      console.warn('[usePortfolioStore] 이미지 삭제 실패:', err);
    });
  };

  const getById = (id) => ref.current.find((p) => p.id === id) || null;

  return { portfolios, add, update, remove, getById };
}
