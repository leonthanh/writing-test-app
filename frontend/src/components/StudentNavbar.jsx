import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const StudentNavbar = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));
    const API_URL = process.env.REACT_APP_API_URL;
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
      <div>
        <img src={`${API_URL}/uploads/staredu.jpg`} alt="Logo" style={{ height: 40, marginRight: 20 }} />

        <Link to="/select-test" style={navLinkStyle}>📝 Chọn đề</Link>
        <Link to="/my-feedback" style={navLinkStyle}>📄 Xem Nhận xét</Link>
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
