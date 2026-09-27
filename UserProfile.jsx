import { useState, useEffect } from 'react';

function UserProfile() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchUser = async () => {
    setLoading(true);
    try {
      const response = await fetch('https://randomuser.me/api/');
      const data = await response.json();
      setUser(data.results[0]);
    } catch (error) {
      console.error('유저 정보 로딩 에러:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  return (
    <div style={{ marginTop: '30px', padding: '16px', border: '1px solid #ddd', borderRadius: '8px' }}>
      <h3 style={{ marginTop: 0 }}>랜덤 유저 프로필</h3>
      {loading ? (
        <p>로딩 중...</p>
      ) : user ? (
        <div style={{ marginBottom: '12px' }}>
          <img src={user.picture.medium} alt="profile" style={{ borderRadius: '50%' }} />
          <p style={{ margin: '4px 0' }}>
            <strong>이름:</strong> {user.name.first} {user.name.last}
          </p>
          <p style={{ margin: '4px 0' }}>
            <strong>이메일:</strong> {user.email}
          </p>
        </div>
      ) : (
        <p>유저 정보가 없습니다.</p>
      )}
      <button onClick={fetchUser} disabled={loading}>
        새로고침
      </button>
    </div>
  );
}

export default UserProfile;