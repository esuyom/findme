import { useState } from 'react';

const BRANCHES = [
  { label: 'SBS아카데미컴퓨터아트', url: 'https://www.sbsart.com' },
  { label: '강남', url: 'https://gangnam.sbsart.com' },
  { label: '홍대', url: 'https://sinchon.sbsart.com' },
  { label: '인천부평', url: 'https://incheon.sbsart.com' },
  { label: '인천구월', url: 'https://guwol.sbsart.com' },
  { label: '부산', url: 'https://busan.sbsart.com' },
  { label: '대구', url: 'https://daegu.sbsart.com' },
  { label: '대전', url: 'https://daejeon.sbsart.com' },
  { label: '광주', url: 'https://gwangju.sbsart.com' },
  { label: '수원', url: 'https://suwon.sbsart.com' },
  { label: '일산', url: 'https://ilsan.sbsart.com' },
  { label: '울산', url: 'https://ulsan.sbsart.com' },
  { label: '노원', url: 'https://nowon.sbsart.com' },
  { label: '분당', url: 'https://bundang.sbsart.com' },
  { label: '종로(혜화)', url: 'https://hyehwa.sbsart.com' },
  { label: '안산', url: 'https://ansan.sbsart.com' },
  { label: '안양', url: 'https://anyang.sbsart.com' },
  { label: '천안', url: 'https://cheonan.sbsart.com' },
];

export default function Footer() {
  const [siteOpen, setSiteOpen] = useState(false);

  return (
    <footer>
      <div className="wrap">
        <ul className="footer_menu">
          <li><a href="#">개인정보처리방침</a></li>
          <li><a href="#">학원소개</a></li>
          <li><a href="#">산학협력 현황</a></li>
          <li><a href="#">고객상담센터</a></li>
          <li><a href="#">학원위치안내</a></li>
          <li>대표문의전화 1588-5530</li>
        </ul>
        <div className="footer_info">
          <address className="footer_ads">
            <p><span>사업자(법인)명 : (주)에스씨에이아카데미강남</span><span>사업자등록번호 : 214-87-96784</span></p>
            <p><span>통신판매업번호 : 제2008-서울서초-1428호</span></p>
            <p><span>대표 : 정해승 </span><span>개인정보책임자 : 조영성</span></p>
            <p><span>주소 : 서울특별시 서초구 서초대로77길 3, 5층(서초동, 아라타워)</span></p>
            <p>
              <span>교육담당 : SBS아카데미컴퓨터아트학원</span>{' '}
              <span>학원명 : 에스비에스(SBS)아카데미컴퓨터아트학원</span>{' '}
              <span>학원등록번호 : 서울강남서초 제7713호</span>
            </p>
            <p>
              <span>대표전화 : 1588-5530</span>{' '}
              <span>대표이메일 : <a href="mailto:privacy@koreaedugroup.com">privacy@koreaedugroup.com</a></span>
            </p>
            <p className="copyrignt">© SBS ACADEMY COMPUTER ART. All Rights Reserved.</p>
          </address>
          <div className="footer_site">
            <div
              className={`select_site${siteOpen ? ' on' : ''}`}
              onClick={() => setSiteOpen((prev) => !prev)}
            >
              <h2><a href="#sbsWebSite">SBS아카데미컴퓨터아트학원 전국지점안내</a></h2>
              <div id="sbsWebSite" className="company_group">
                <ul>
                  {BRANCHES.map((branch, i) => (
                    <li key={branch.label} className={i === 0 ? 'current' : ''}>
                      <a href={branch.url} onClick={(e) => e.stopPropagation()}>
                        {branch.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
