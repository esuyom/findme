import { useState } from 'react';
import Layout from '../../components/layout/Layout';
import CompanySidebar from '../../components/sidebar/CompanySidebar';
import { CURRENT_COMPANY } from '../../constants/currentUser';

export default function CpInfoModifyPage() {
  const [selectedKeywords, setSelectedKeywords] = useState([]);

  const keywords = [
    '연봉 업계 평균 이상',
    '일한만큼 받는 보상',
    '퇴사율 10% 이하',
    '수평적인 기업 문화',
    '지속 성장중인 기업',
    '다양한 근무 지원 제도 운영',
    '요즘 뜨는 산업'
  ];

  const toggleKeyword = (keyword) => {
    if (selectedKeywords.includes(keyword)) {
      setSelectedKeywords(selectedKeywords.filter(k => k !== keyword));
    } else if (selectedKeywords.length < 3) {
      setSelectedKeywords([...selectedKeywords, keyword]);
    }
  };

  return (
    <Layout containerClass="mypage cp info">
      <div className="contents_wrap">
        <CompanySidebar />
        <section className="contents">
          <h4 className="big_title">회사정보</h4>

          <div className="input">
            <h5 className="sub_title">회사로고 이미지</h5>
            <div className="img_wrap">
              <div className="form-input-file-wrap cp">
                <input className="form-input-file cp" id="upload1" type="file" multiple="" />
                <span id="profileSpan1" className="form-span-file cp"></span>
                <label className="form-label-file cp" htmlFor="upload1">파일선택</label>
                <div className="icon"></div>
              </div>
            </div>
          </div>

          <div className="input">
            <h5 className="sub_title">대표 이미지</h5>
            <div className="img_wrap">
              <div className="form-input-file-wrap cp">
                <input className="form-input-file cp" id="upload2" type="file" multiple="" />
                <span id="profileSpan2" className="form-span-file cp cp_main"></span>
                <label className="form-label-file cp cp_main" htmlFor="upload2">파일선택</label>
                <div className="icon cp_main"></div>
              </div>
            </div>
          </div>

          <div className="input w400">
            <h5 className="sub_title">이메일</h5>
            <input type="text" className="normal" defaultValue={CURRENT_COMPANY.email} />
          </div>

          <div className="input pw w400">
            <h5 className="sub_title">비밀번호</h5>
            <input name="pw01" type="password" className="normal mb-2" placeholder="비밀번호를 입력하세요." />
            <input name="pw02" type="password" className="normal" placeholder="비밀번호를 다시 한번 입력하세요." />
            <p className="noti">영문 대소문자, 숫자, 특수문자를 3가지 이상으로 조합해 8자 이상 16자<br/>이하로 입력해주세요.</p>
          </div>

          <div className="input">
            <h5 className="sub_title">회사명</h5>
            <input name="cpname" type="text" className="normal" placeholder="회사명을 입력해 주세요." />
          </div>

          <div className="input">
            <h5 className="sub_title">회사/서비스 소개</h5>
            <textarea className="normal" placeholder="내용을 입력해 주세요."></textarea>
          </div>

          <div className="input">
            <h5 className="sub_title">회사 홈페이지</h5>
            <input type="text" className="normal" placeholder="예)https://www.website.com" />
          </div>

          <div className="input">
            <h5 className="sub_title">회사주소</h5>
            <div className="d-flex align-content-center gap-2">
              <div className="w100 d-flex align-content-center gap-2">
                <select name="add1" id="" className="w100">
                  <option value="서울">서울</option>
                </select>
                <select name="add2" id="" className="w100">
                  <option value="강남구">강남구</option>
                </select>
              </div>
              <input name="add3" type="text" className="normal" placeholder="상세주소를 입력해 주세요." />
            </div>
          </div>

          <div className="input d-flex align-content-center gap-2">
            <div className="w100">
              <h5 className="sub_title">사업자 등록번호</h5>
              <input name="cornumber" type="number" className="normal" placeholder='"-"를 제외한 숫자만 입력해 주세요.' />
            </div>
            <div className="w100">
              <h5 className="sub_title">매출액/투지금액</h5>
              <div className="d-flex align-content-center gap-2">
                <input name="cornumber" type="number" className="normal" placeholder="숫자만 입력해 주세요." />
                <select name="" id="" className="w100">
                  <option value="">만원</option>
                  <option value="">억원</option>
                </select>
              </div>
            </div>
          </div>

          <div className="input d-flex align-content-center gap-2">
            <div className="w100">
              <h5 className="sub_title">산업군</h5>
              <select name="" id="" className="w100">
                <option value="">산업군</option>
              </select>
            </div>
            <div className="w100 d-flex align-content-center gap-2">
              <div className="w100">
                <h5 className="sub_title">회사규모</h5>
                <select name="" id="" className="w100">
                  <option value="">회사규모</option>
                </select>
              </div>
              <div className="w100">
                <h5 className="sub_title">직원수</h5>
                <input type="text" className="normal" placeholder="숫자만 입력해 주세요." />
              </div>
            </div>
          </div>

          <div className="input d-flex align-content-center gap-2">
            <div className="w100">
              <h5 className="sub_title">설립연도</h5>
              <input type="text" className="normal" placeholder="숫자만 입력해 주세요." />
            </div>
            <div className="w100">
              <h5 className="sub_title">정보수신 이메일</h5>
              <input type="text" className="normal" placeholder="예) findme@email.com" />
            </div>
          </div>

          <div className="input d-flex align-content-center gap-2">
            <div className="w100">
              <h5 className="sub_title">인사담당자</h5>
              <input type="text" className="normal" placeholder="인사 담당자 이름을 입력해 주세요." />
            </div>
            <div className="w100">
              <h5 className="sub_title">인사담당자 연락처</h5>
              <input type="text" className="normal" placeholder='"-"를 제외한 숫자만 입력해 주세요.' />
            </div>
          </div>

          <div className="input keywords">
            <h5 className="sub_title">기업키워드</h5>
            <p className="noti">최대 3개까지 선택</p>
            <div className="multi_input">
              {keywords.map((keyword, i) => (
                <label key={i}>
                  <input
                    name=""
                    type="checkbox"
                    checked={selectedKeywords.includes(keyword)}
                    onChange={() => toggleKeyword(keyword)}
                  />
                  <span>{keyword}</span>
                </label>
              ))}
            </div>
          </div>
        </section>
      </div>
    </Layout>
  );
}
