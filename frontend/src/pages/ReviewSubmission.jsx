import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import AdminNavbar from '../components/AdminNavbar';

const ReviewSubmission = () => {
  const { id } = useParams(); // lấy submissionId từ URL
  const [submission, setSubmission] = useState(null);
  const [loading, setLoading] = useState(true);
  const API_URL = process.env.REACT_APP_API_URL;

  useEffect(() => {
    const fetchSubmission = async () => {
      try {
        const res = await fetch(`${API_URL}/api/writing/list`);
        const allSubs = await res.json();
        const found = allSubs.find(s => s._id === id);
        setSubmission(found || null);
      } catch (err) {
        console.error('❌ Lỗi khi tải bài:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchSubmission();
  }, [id, API_URL]);

  if (loading) return <p style={{ padding: 40 }}>⏳ Đang tải...</p>;
  if (!submission) return <p style={{ padding: 40 }}>❌ Không tìm thấy bài viết.</p>;

  return (
    <>
      <AdminNavbar />
      <div style={{ padding: '30px' }}>
        <h2>📄 Chi tiết bài viết</h2>
        <p><strong>👤 Học sinh:</strong> {submission.user?.name}</p>
        <p><strong>📞 Số điện thoại:</strong> {submission.user?.phone}</p>
        <p><strong>🧾 Mã đề:</strong> Writing {submission.testId?.index}</p>
        <p><strong>🕒 Nộp lúc:</strong> {new Date(submission.submittedAt).toLocaleString()}</p>

        <h4>✍️ Task 1:</h4>
        <p style={{ whiteSpace: 'pre-line' }}>{submission.task1}</p>

        <h4>✍️ Task 2:</h4>
        <p style={{ whiteSpace: 'pre-line' }}>{submission.task2}</p>

        <h4>📩 Nhận xét hiện tại:</h4>
        <p style={{ background: '#e7f4e4', padding: 10, borderRadius: 6 }}>
          {submission.feedback || 'Chưa có nhận xét nào.'}
        </p>
      </div>
    </>
  );
};

export default ReviewSubmission;
