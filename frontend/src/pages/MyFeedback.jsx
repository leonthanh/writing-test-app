import React, { useEffect, useState } from 'react';

const MyFeedback = () => {
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const user = JSON.parse(localStorage.getItem('user'));
  const API_URL = process.env.REACT_APP_API_URL;

  useEffect(() => {
    if (!user) return;
    fetch(`${API_URL}/api/writing/list`)
      .then(res => res.json())
      .then(data => {
        // Lọc bài viết của học sinh hiện tại
        const userSubmissions = data.filter(sub => sub.user?.phone === user.phone);
        setSubmissions(userSubmissions);
        setLoading(false);
      })
      .catch(err => {
        console.error('Lỗi khi tải bài viết:', err);
        setLoading(false);
      });
  }, [user, API_URL]);

  if (!user) {
    return <p style={{ padding: 40 }}>❌ Bạn chưa đăng nhập.</p>;
  }

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

      <h2>📝 Bài viết & Nhận xét</h2>
      {loading && <p>⏳ Đang tải bài viết...</p>}
      {!loading && submissions.length === 0 && <p>🙁 Bạn chưa nộp bài viết nào.</p>}

      {submissions.map((sub, idx) => (
        <div key={sub._id || idx} style={{
          border: '1px solid #ccc',
          borderRadius: 8,
          padding: '20px',
          marginBottom: '20px',
          backgroundColor: '#f9f9f9'
        }}>
          <p><strong>🕒 Thời gian nộp:</strong> {new Date(sub.submittedAt).toLocaleString()}</p>
          <p><strong>⏳ Thời gian còn lại:</strong> {Math.floor(sub.timeLeft / 60)} phút</p>

          <h4>✍️ Task 1:</h4>
          <p style={{ whiteSpace: 'pre-line' }}>{sub.task1}</p>

          <h4>✍️ Task 2:</h4>
          <p style={{ whiteSpace: 'pre-line' }}>{sub.task2}</p>

          <h4 style={{ marginTop: 20 }}>📩 Nhận xét từ giáo viên:</h4>
          {sub.feedback ? (
            <p style={{ background: '#e7f4e4', padding: 10, borderRadius: 6 }}>{sub.feedback}</p>
          ) : (
            <p style={{ fontStyle: 'italic', color: '#999' }}>Chưa có nhận xét nào.</p>
          )}
        </div>
      ))}
    </div>
  );
};

export default MyFeedback;
