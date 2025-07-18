import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminNavbar from '../components/AdminNavbar';

const CreateWritingTest = () => {
  const [task1, setTask1] = useState('');
  const [task2, setTask2] = useState('');
  const [image, setImage] = useState(null);
  const [message, setMessage] = useState('');

  const API = process.env.REACT_APP_API_URL;

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!task1.trim() || !task2.trim()) {
      setMessage('❌ Vui lòng nhập đầy đủ nội dung Task 1 và Task 2.');
      return;
    }

    const formData = new FormData();
    formData.append('task1', task1);
    formData.append('task2', task2);
    if (image) formData.append('image', image);

    try {
      const res = await fetch(`${API}/api/writing-tests`, {
        method: 'POST',
        body: formData
      });

      const data = await res.json();
      setMessage(data.message || '✅ Đã tạo đề');

      // Reset form
      setTask1('');
      setTask2('');
      setImage(null);

      // Reload sau 2 giây
      setTimeout(() => window.location.reload(), 2000);
    } catch (err) {
      setMessage('❌ Lỗi khi tạo đề');
    }
  };

  const inputStyle = {
    width: '100%',
    padding: '10px',
    marginBottom: '10px',
    fontSize: '16px',
    fontFamily: 'Segoe UI, sans-serif',
    borderRadius: '6px',
    border: '1px solid #ccc'
  };

  return (
    <>
      <AdminNavbar />
      <div style={{ maxWidth: '800px', margin: '20px auto', fontFamily: 'Segoe UI, sans-serif' }}>
        <h2>📝 Thêm đề Writing</h2>
        <form onSubmit={handleSubmit}>
          <textarea
            placeholder="Nội dung Task 1"
            rows={5}
            value={task1}
            onChange={e => setTask1(e.target.value)}
            style={inputStyle}
          />
          <textarea
            placeholder="Nội dung Task 2"
            rows={5}
            value={task2}
            onChange={e => setTask2(e.target.value)}
            style={inputStyle}
          />
          <input
            type="file"
            accept="image/*"
            onChange={e => setImage(e.target.files[0])}
            style={{ marginBottom: '10px' }}
          />
          <button type="submit" style={{
            padding: '10px 20px',
            fontSize: '16px',
            backgroundColor: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer'
          }}>
            ➕ Tạo đề
          </button>
        </form>

        {message && (
          <p style={{ marginTop: 10, fontWeight: 'bold', color: message.includes('❌') ? 'red' : 'green' }}>
            {message}
          </p>
        )}
      </div>
    </>
  );
};

export default CreateWritingTest;
