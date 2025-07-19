import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminNavbar from '../components/AdminNavbar';

const Review = () => {
  const [unreviewed, setUnreviewed] = useState([]);
  const [loading, setLoading] = useState(true);
  const API_URL = process.env.REACT_APP_API_URL;
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUnreviewed = async () => {
      try {
        const res = await fetch(`${API_URL}/api/writing/list`);
        const all = await res.json();
        const filtered = all.filter(sub => !sub.feedback);
        setUnreviewed(filtered);
      } catch (err) {
        console.error('❌ Lỗi khi tải bài chưa chấm:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchUnreviewed();
  }, [API_URL]);

  return (
    <>
      <AdminNavbar />
      <h3>📝 Danh sách bài chưa nhận xét</h3>

      {loading && <p>⏳ Đang tải dữ liệu...</p>}
      {!loading && unreviewed.length === 0 && <p>✅ Không có bài viết nào cần chấm.</p>}
      {!loading && unreviewed.length > 0 && (
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th>#</th>
              <th>👤 Học sinh</th>
              <th>📞 Số điện thoại</th>
              <th>🧾 Mã đề</th>
              <th>⏱ Thời gian nộp</th>
              <th>✏️</th>
            </tr>
          </thead>
          <tbody>
            {unreviewed.map((sub, idx) => (
              <tr key={sub._id}>
                <td>{idx + 1}</td>
                <td>{sub.user?.name || 'N/A'}</td>
                <td>{sub.user?.phone || 'N/A'}</td>
                <td>Writing {sub.testId?.index || 'N/A'}</td>
                <td>{new Date(sub.submittedAt).toLocaleString()}</td>
                <td>
                  <button
                    onClick={() => navigate(`/review/${sub._id}`)}
                    style={{
                      background: '#3498db',
                      color: 'white',
                      padding: '6px 12px',
                      border: 'none',
                      borderRadius: 4,
                      cursor: 'pointer'
                    }}
                  >
                    ✏️ Nhận xét
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </>
  );
};

export default Review;
