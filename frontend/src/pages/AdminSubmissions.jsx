import React, { useEffect, useState } from 'react';

const AdminSubmissions = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    fetch('http://localhost:5000/api/writing/list')
      .then(res => res.json())
      .then(setData)
      .catch(err => console.error('Lỗi khi lấy dữ liệu:', err));
  }, []);
 
  return (
    <div style={{ padding: '30px' }}>
      <button
  onClick={() => {
    localStorage.removeItem('user');
    window.location.href = '/login';
  }}
  style={{ position: 'absolute', top: 10, right: 10 }}
>
  🔓 Đăng xuất
</button>
      <h2>📋 Danh sách bài viết đã nộp</h2>
      {data.length === 0 && <p>Chưa có bài nào được nộp.</p>}

      {data.map((item, idx) => (
        <div
          key={item._id || idx}
          style={{ border: '1px solid #ccc', padding: '20px', marginTop: '20px' }}
        >
          <p><strong>🕒 Nộp lúc:</strong> {new Date(item.submittedAt).toLocaleString()}</p>
          <p><strong>⏳ Thời gian còn lại:</strong> {Math.floor(item.timeLeft / 60)} phút</p>

          <h4>✍️ Task 1:</h4>
          <p style={{ whiteSpace: 'pre-line' }}>{item.task1}</p>

          <h4>✍️ Task 2:</h4>
          <p style={{ whiteSpace: 'pre-line' }}>{item.task2}</p>
        </div>
      ))}
    </div>

  );
 

};

export default AdminSubmissions;
