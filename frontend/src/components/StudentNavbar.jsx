import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const StudentNavbar = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));
  const API_URL = process.env.REACT_APP_API_URL;

  const [notificationCount, setNotificationCount] = useState(0);

  // 🔔 Kiểm tra số thông báo mới
  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const [testsRes, submissionsRes] = await Promise.all([
          fetch(`${API_URL}/api/writing-tests`).then(res => res.json()),
          fetch(`${API_URL}/api/writing/list`).then(res => res.json()),
        ]);

        const userSubs = submissionsRes.filter(sub => sub.user?.phone === user?.phone);
        const hasNewFeedback = userSubs.some(sub => sub.feedback && !sub.feedbackSeen);
        const totalNewTests = testsRes.length;

        // Ví dụ: 1 thông báo cho feedback mới, 1 cho đề mới (bạn có thể tùy chỉnh logic đếm)
        let count = 0;
        if (hasNewFeedback) count += 1;
        if (totalNewTests > 0) count += 1;

        setNotificationCount(count);
      } catch (err) {
        console.error('❌ Lỗi khi tải thông báo:', err);
      }
    };

    if (user) fetchNotifications();
  }, [user, API_URL]);

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/login');
  };

  if (!user) return null;

  const navLinkStyle = {
    color: 'white',
    marginRight: '20px',
    textDecoration: 'none',
    fontWeight: 'bold',
    fontSize: '16px'
  };

  return (
    <nav style={{
      padding: '12px 24px',
      background: '#004080',
      color: 'white',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      boxShadow: '0 2px 6px rgba(0,0,0,0.2)',
    }}>
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <img src={`${API_URL}/uploads/staredu.jpg`} alt="Logo" style={{ height: 40, marginRight: 20 }} />

        <Link to="/select-test" style={navLinkStyle}>📝 Chọn đề</Link>
        <Link to="/my-feedback" style={navLinkStyle}>📄 Xem Nhận xét</Link>

        {/* 🔔 Icon chuông thông báo */}
        <div style={{ position: 'relative', marginRight: '20px', cursor: 'pointer' }} onClick={() => navigate('/my-feedback')}>
  🔔
  {notificationCount > 0 && (
    <span style={{
      position: 'absolute',
      top: -6,
      right: -10,
      background: 'red',
      color: 'white',
      borderRadius: '50%',
      padding: '2px 6px',
      fontSize: '12px'
    }}>
      {notificationCount}
    </span>
  )}
</div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center' }}>
        <span style={{ marginRight: 16 }}>👤 {user.name}</span>
        <button
          onClick={handleLogout}
          style={{
            background: '#e74c3c',
            border: 'none',
            padding: '8px 16px',
            borderRadius: '6px',
            color: 'white',
            fontWeight: 'bold',
            cursor: 'pointer',
            transition: 'background 0.3s',
          }}
          onMouseOver={e => e.currentTarget.style.background = '#c0392b'}
          onMouseOut={e => e.currentTarget.style.background = '#e74c3c'}
        >
          🔓 Đăng xuất
        </button>
      </div>
    </nav>
  );
};

export default StudentNavbar;
