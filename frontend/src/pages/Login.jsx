import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [role, setRole] = useState('student');
  const [message, setMessage] = useState('');

  const navigate = useNavigate();

  // ✅ Nếu đã đăng nhập → chuyển trang luôn
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user) {
      navigate(user.role === 'teacher' ? '/admin' : '/');
    }
  }, [navigate]);

 const handleLogin = async () => {
  if (!name.trim() || !phone.trim()) {
    setMessage('❌ Vui lòng nhập đầy đủ họ tên và số điện thoại');
    return;
  }

  try {
    const res = await fetch('http://localhost:5000/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, phone, role })
    });

    const data = await res.json();
    if (res.ok) {
      setMessage('✅ Đăng nhập thành công!');
      localStorage.setItem('user', JSON.stringify(data.user));

      // ✅ Chuyển trang chắc chắn bằng reload
    window.location.href = data.user.role === 'teacher' ? '/admin' : '/';
    } else {
      setMessage('❌ ' + data.message);
    }
  } catch (err) {
    setMessage('Lỗi kết nối server');
  }
    };
  const handleRegister = async () => {
    if (!name.trim() || !phone.trim()) {
      setMessage('❌ Vui lòng nhập đầy đủ họ tên và số điện thoại');
      return;
    }
  
    try {
      const res = await fetch('http://localhost:5000/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, phone, role }) // role mặc định là student
      });
  
      const data = await res.json();
      if (res.ok) {
        localStorage.setItem('user', JSON.stringify(data.user));
        setMessage('✅ Đăng ký thành công!');
        window.location.href = '/'; 
      } else {
        setMessage('❌ ' + data.message);
      }
    } catch (err) {
        setMessage('Lỗi kết nối server');
    }
    };


    // ✅ Hàm đăng nhập
  return (
    <div style={{ maxWidth: '400px', margin: '50px auto' }}>
      <h2>Đăng nhập StarEdu</h2>

      <input
        type="text"
        placeholder="Họ tên"
        value={name}
        onChange={e => setName(e.target.value)}
        style={{ width: '100%', marginBottom: '10px' }}
      />

      <input
        type="text"
        placeholder="Số điện thoại"
        value={phone}
        onChange={e => setPhone(e.target.value)}
        style={{ width: '100%', marginBottom: '10px' }}
      />

      <select
        value={role}
        onChange={e => setRole(e.target.value)}
        style={{ width: '100%', marginBottom: '10px' }}
      >
        <option value="student">🎓 Học sinh</option>
        <option value="teacher">👩‍🏫 Giáo viên</option>
      </select>

      <button onClick={handleLogin} style={{ width: '100%' }}>
        Đăng nhập
      </button>

      <p style={{ marginTop: '10px' }}>{message}</p>
      <button onClick={handleRegister} style={{ width: '100%', marginTop: '10px', backgroundColor: '#4CAF50', color: 'white' }}>
        Đăng ký
        </button>

    </div>
  );
};

export default Login;
