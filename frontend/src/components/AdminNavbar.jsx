import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const AdminNavbar = () => {
  const navigate = useNavigate();
  const API_URL = process.env.REACT_APP_API_URL;

  const [unreviewed, setUnreviewed] = useState([]);
  const [dropdownVisible, setDropdownVisible] = useState(false);

  useEffect(() => {
    const fetchUnreviewed = async () => {
      try {
        const res = await fetch(`${API_URL}/api/writing/list`);
        const all = await res.json();
        const notReviewed = all.filter(sub => !sub.feedback);
        setUnreviewed(notReviewed);
      } catch (err) {
        console.error('❌ Lỗi khi tải thông báo GV:', err);
      }
    };

    fetchUnreviewed();
    const interval = setInterval(fetchUnreviewed, 30000);
    return () => clearInterval(interval);
  }, [API_URL]);

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/login');
  };

  const linkStyle = {
    color: 'white',
    marginRight: '20px',
    textDecoration: 'none',
    fontWeight: 'bold',
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
        <Link to="/admin" style={linkStyle}>📄 Bài viết</Link>
        <Link to="/admin/create-writing" style={linkStyle}>✏️ Tạo đề</Link>
        <Link to="/review" style={linkStyle}>📝 Nhận xét bài</Link>

        {/* 🔔 Chuông thông báo */}
        <div style={{ position: 'relative', marginRight: '20px', cursor: 'pointer' }} onClick={() => setDropdownVisible(!dropdownVisible)}>
          🔔
          {unreviewed.length > 0 && (
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
              {unreviewed.length}
            </span>
          )}
        </div>

        {/* 📥 Dropdown danh sách bài chưa chấm */}
        {dropdownVisible && (
          <div style={{
            position: 'absolute',
            top: 60,
            right: 20,
            background: 'white',
            color: 'black',
            border: '1px solid #ccc',
            borderRadius: 6,
            padding: 10,
            zIndex: 1000,
            width: 300
          }}>
            {unreviewed.length === 0 ? (
              <div>✅ Không có bài chưa chấm</div>
            ) : (
              unreviewed.map((sub, i) => (
                <div
                  key={i}
                  style={{ padding: '6px 0', cursor: 'pointer', borderBottom: '1px solid #eee' }}
                  onClick={() => {
                    setDropdownVisible(false);
                    navigate(`/review/${sub._id}`);
                  }}
                >
                  👤 {sub.user?.name || 'N/A'} - 📞 {sub.user?.phone || 'N/A'}
                </div>
              ))
            )}
          </div>
        )}
      </div>

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
    </nav>
  );
};

export default AdminNavbar;
