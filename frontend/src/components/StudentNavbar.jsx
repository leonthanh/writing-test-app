import React, { useEffect, useState, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const StudentNavbar = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));
  const API_URL = process.env.REACT_APP_API_URL;

  const [feedbackCount, setFeedbackCount] = useState(0);
  const [newTestCount, setNewTestCount] = useState(0);

  // ✅ Dùng useCallback để ổn định hàm và tránh cảnh báo ESLint
  const fetchNotifications = useCallback(async () => {
    try {
      const [testsRes, submissionsRes] = await Promise.all([
        fetch(`${API_URL}/api/writing-tests`).then(res => res.json()),
        fetch(`${API_URL}/api/writing/list`).then(res => res.json()),
      ]);

      const userSubs = submissionsRes.filter(sub => sub.user?.phone === user?.phone);
      const unseenFeedbacks = userSubs.filter(sub => sub.feedback && !sub.feedbackSeen);
      setFeedbackCount(unseenFeedbacks.length);

      const submittedTestIds = userSubs.map(sub => sub.testId?.toString());
      const unsubmittedTests = testsRes.filter(test => !submittedTestIds.includes(test._id?.toString()));
      setNewTestCount(unsubmittedTests.length);
    } catch (err) {
      console.error('❌ Lỗi khi tải thông báo:', err);
    }
  }, [API_URL, user]);

  useEffect(() => {
    if (user) fetchNotifications();
  }, [user, fetchNotifications]);

  const markFeedbackAsSeen = async () => {
    try {
      await fetch(`${API_URL}/api/writing/mark-feedback-seen`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: user.phone })
      });
    } catch (err) {
      console.error('❌ Lỗi khi đánh dấu đã xem nhận xét:', err);
    }
  };

  const handleNotificationClick = async () => {
    await markFeedbackAsSeen();
    await fetchNotifications(); // cập nhật lại số thông báo
    navigate('/my-feedback');
  };

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

  const totalNotifications = feedbackCount + newTestCount;

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
        <div
          style={{
            position: 'relative',
            marginRight: '20px',
            cursor: 'pointer',
            fontSize: '20px',
            animation: totalNotifications > 0 ? 'shake 0.5s infinite' : 'none'
          }}
          onClick={handleNotificationClick}
          title="Thông báo mới"
        >
          🔔
          {totalNotifications > 0 && (
            <span style={{
              position: 'absolute',
              top: -6,
              right: -10,
              background: 'red',
              color: 'white',
              borderRadius: '50%',
              padding: '2px 6px',
              fontSize: '12px',
              fontWeight: 'bold'
            }}>
              {totalNotifications}
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

      {/* CSS animation cho chuông */}
      <style>
        {`
          @keyframes shake {
            0% { transform: rotate(0deg); }
            25% { transform: rotate(10deg); }
            50% { transform: rotate(-10deg); }
            75% { transform: rotate(10deg); }
            100% { transform: rotate(0deg); }
          }
        `}
      </style>
    </nav>
  );
};

export default StudentNavbar;
