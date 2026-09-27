import { useNavigate } from 'react';

function SettingsPage() {
  const navigate = useNavigate();

  return (
    <div>
      <h2>설정 페이지</h2>
      <p>환경 설정 화면입니다.</p>
      <button onClick={() => navigate('/')}>메인으로 돌아가기</button>
    </div>
  );
}

export default SettingsPage;