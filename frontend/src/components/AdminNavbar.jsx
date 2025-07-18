import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const AdminNavbar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/login');
  };

  const linkStyle = {
    color: 'white',
    marginRight: '20px',
    textDecoration: 'none',
    fontWeight: 'bold',
    transition: 'color 0.2s',
  };

  const navItemHover = {
    ...linkStyle,
    ':hover': {
      color: '#ddd',
    }
  };

  return (
    <nav style={{
      padding: '12px 24px',
      background: '#0e276f',
      color: 'white',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
    }}>
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <Link to="/admin" style={navItemHover}>📄 Bài viết</Link>
        <Link to="/admin/create-writing" style={linkStyle}>✏️ Tạo đề</Link>
        <Link to="/review" style={linkStyle}>📝 Nhận xét bài</Link>
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
