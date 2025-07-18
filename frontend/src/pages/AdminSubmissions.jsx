import React, { useEffect, useState } from 'react';
import AdminNavbar from '../components/AdminNavbar';

const AdminSubmissions = () => {
  const [data, setData] = useState([]);
  const [feedbacks, setFeedbacks] = useState({});
  const [messages, setMessages] = useState({});

  const API_URL = process.env.REACT_APP_API_URL;
  const teacher = JSON.parse(localStorage.getItem('user')); // 👈 lấy tên giáo viên

  useEffect(() => {
    fetch(`${API_URL}/api/writing/list`)
      .then(res => res.json())
      .then(setData)
      .catch(err => console.error('Lỗi khi lấy dữ liệu:', err));
  }, [API_URL]);

  const handleSendFeedback = async (submissionId) => {
    const feedback = feedbacks[submissionId];
    if (!feedback || !feedback.trim()) {
      alert('Vui lòng nhập nhận xét.');
      return;
    }

    try {
      const res = await fetch(`${API_URL}/api/writing/comment`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          submissionId,
          feedback,
          teacherName: teacher?.name || 'Giáo viên ẩn danh'
        })
      });

      const result = await res.json();
      setMessages(prev => ({ ...prev, [submissionId]: result.message }));

      // ✅ Cập nhật ngay feedback mới hiển thị
      const updated = data.map(item =>
        item._id === submissionId
          ? { ...item, feedback, feedbackBy: teacher?.name, feedbackAt: new Date().toISOString() }
          : item
      );
      setData(updated);
    } catch (err) {
      console.error(err);
      setMessages(prev => ({ ...prev, [submissionId]: '❌ Gửi nhận xét thất bại' }));
    }
  };

  const formatDateTime = (isoString) => {
    const d = new Date(isoString);
    return `${d.getHours()}:${d.getMinutes()} ngày ${d.getDate()}/${d.getMonth() + 1}/${d.getFullYear()}`;
  };

  return (
    <>
      <AdminNavbar />
      <div style={{ padding: '30px' }}>
        <h2>📋 Danh sách bài viết đã nộp</h2>
        {data.length === 0 && <p>Chưa có bài nào được nộp.</p>}

        {data.map((item) => (
          <div
            key={item._id}
            style={{
              border: '1px solid #ccc',
              padding: '20px',
              marginTop: '20px',
              borderRadius: 8,
              background: '#f9f9f9'
            }}
          >
            <p><strong>👤 Học sinh:</strong> {item.user?.name || 'N/A'}</p>
            <p><strong>📞 Số điện thoại:</strong> {item.user?.phone || 'N/A'}</p>
            <p><strong>🧾 Mã đề:</strong> {item.testId?.index ? `Writing ${item.testId.index}` : 'Không rõ'}</p>
            <p><strong>🕒 Nộp lúc:</strong> {new Date(item.submittedAt).toLocaleString()}</p>
            <p><strong>⏳ Thời gian còn lại:</strong> {Math.floor(item.timeLeft / 60)} phút</p>

            <h4>✍️ Task 1:</h4>
            <p style={{ whiteSpace: 'pre-line' }}>{item.task1}</p>

            <h4>✍️ Task 2:</h4>
            <p style={{ whiteSpace: 'pre-line' }}>{item.task2}</p>

            <div style={{ marginTop: 20 }}>
              {item.feedback && item.feedbackAt && item.feedbackBy && (
                <p style={{ background: '#e7f4e4', padding: 10, borderRadius: 6, marginBottom: 10 }}>
                  🟢 <strong>Đã nhận xét</strong> lúc {formatDateTime(item.feedbackAt)} bởi <strong>{item.feedbackBy}</strong>
                </p>
              )}

              <textarea
                placeholder="Nhận xét của giáo viên..."
                rows={3}
                style={{ width: '100%', padding: 10 }}
                value={feedbacks[item._id] || ''}
                onChange={e =>
                  setFeedbacks(prev => ({ ...prev, [item._id]: e.target.value }))
                }
              />
              <button
                onClick={() => handleSendFeedback(item._id)}
                style={{
                  marginTop: 10,
                  padding: '8px 16px',
                  backgroundColor: '#007bff',
                  color: '#fff',
                  border: 'none',
                  borderRadius: 6,
                  cursor: 'pointer'
                }}
              >
                📤 Gửi nhận xét
              </button>
              {messages[item._id] && (
                <p style={{ marginTop: 5, color: '#28a745' }}>{messages[item._id]}</p>
              )}
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default AdminSubmissions;
