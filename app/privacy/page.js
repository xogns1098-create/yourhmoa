export const metadata = {
  title: "개인정보처리방침 | 청년모아",
  description: "청년모아 개인정보처리방침 안내 페이지입니다.",
};

export default function PrivacyPage() {
  return (
    <main id="main-content" className="content-page">
      <h1>개인정보처리방침</h1>
      <p className="lead">
        청년모아(이하 “서비스”)는 이용자의 개인정보를 소중히 여기며, 관련 법령을
        준수합니다. 본 방침은 서비스가 어떤 정보를 수집·이용하는지 안내합니다.
      </p>

      <section>
        <h2>1. 수집하는 정보</h2>
        <p>
          청년모아는 회원가입 절차가 없으며, 이름·연락처 등 이용자를 직접 식별하는
          개인정보를 수집하지 않습니다. 다만 서비스 이용 과정에서 아래와 같은 정보가
          자동으로 생성·수집될 수 있습니다.
        </p>
        <ul>
          <li>접속 로그, 접속 IP 정보, 브라우저 및 기기 정보</li>
          <li>서비스 이용 기록, 방문 페이지 등 통계 정보</li>
          <li>쿠키(Cookie)를 통한 방문·이용 정보</li>
        </ul>
      </section>

      <section>
        <h2>2. 쿠키 및 광고</h2>
        <p>
          청년모아는 서비스 운영을 위해 쿠키를 사용할 수 있으며, 향후 광고 게재 시
          Google 등 제3자 광고 사업자가 쿠키를 사용할 수 있습니다.
        </p>
        <ul>
          <li>
            Google을 포함한 제3자 광고 사업자는 쿠키를 사용하여 이용자의 이전 방문
            기록을 바탕으로 맞춤형 광고를 제공할 수 있습니다.
          </li>
          <li>
            이용자는{" "}
            <a
              href="https://www.google.com/settings/ads"
              target="_blank"
              rel="noopener noreferrer"
            >
              Google 광고 설정
            </a>
            에서 맞춤 광고를 거부할 수 있습니다.
          </li>
          <li>
            브라우저 설정을 통해 쿠키 저장을 거부하거나 삭제할 수 있습니다. 다만 이
            경우 일부 서비스 이용에 제한이 있을 수 있습니다.
          </li>
        </ul>
      </section>

      <section>
        <h2>3. 이용 목적</h2>
        <p>
          수집된 정보는 서비스 운영·개선, 이용 통계 분석, 부정 이용 방지, 광고 게재
          목적으로만 이용됩니다.
        </p>
      </section>

      <section>
        <h2>4. 보관 및 제3자 제공</h2>
        <p>
          청년모아는 이용자의 개인정보를 제3자에게 판매하거나 임의로 제공하지 않습니다.
          자동 생성 정보는 관련 법령에서 정한 기간 동안 보관 후 파기합니다.
        </p>
      </section>

      <section>
        <h2>5. 문의처</h2>
        <p>
          개인정보 관련 문의는 아래 이메일로 연락해 주세요.
          <br />
          <strong>xogns1098@gmail.com</strong>
        </p>
      </section>

      <p className="effective-date">본 방침은 2026년 7월 14일부터 시행됩니다.</p>
    </main>
  );
}
