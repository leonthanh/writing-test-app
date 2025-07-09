import React, { useState, useEffect, useCallback } from 'react';
import Split from 'react-split';

const WritingTest = () => {
  const [task1, setTask1] = useState('');
  const [task2, setTask2] = useState('');
  const [timeLeft, setTimeLeft] = useState(60 * 60);
  const [started, setStarted] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [message, setMessage] = useState('');
  const [activeTask, setActiveTask] = useState('task1');
  const [testData, setTestData] = useState(null);

  const user = JSON.parse(localStorage.getItem('user'));
  const selectedTestId = localStorage.getItem('selectedTestId');

  // Nếu chưa chọn đề
  if (!selectedTestId) {
    return (
      <div style={{ padding: 50, textAlign: 'center' }}>
        ⚠️ Bạn chưa chọn đề thi. Vui lòng quay lại trang chọn đề.
      </div>
    );
  }

  // Lấy đề từ backend
  useEffect(() => {
    fetch(`http://localhost:5000/api/writing-tests/${selectedTestId}`)
      .then(res => res.json())
      .then(data => setTestData(data))
      .catch(err => console.error('Lỗi khi tải đề:', err));
  }, [selectedTestId]);

  // Nộp bài
  const handleSubmit = useCallback(async () => {
    setSubmitted(true);
    try {
      const res = await fetch('http://localhost:5000/api/writing/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ task1, task2, timeLeft }),
      });
      const data = await res.json();
      setMessage(data.message || 'Đã nộp bài!');
    } catch (err) {
      console.error('Lỗi nộp bài:', err);
      setMessage('Lỗi khi gửi bài.');
    }
  }, [task1, task2, timeLeft]);

  // Đếm ngược thời gian
  useEffect(() => {
    if (!started || submitted) return;
    if (timeLeft <= 0) {
      handleSubmit();
      return;
    }
    const timer = setInterval(() => {
      setTimeLeft(prev => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [started, submitted, timeLeft, handleSubmit]);

  const formatTime = s => {
    const m = Math.floor(s / 60).toString().padStart(2, '0');
    const sec = (s % 60).toString().padStart(2, '0');
    return `${m}:${sec}`;
  };

  const countWords = text => text.trim().split(/\s+/).filter(Boolean).length;

  if (!testData) {
    return <div style={{ padding: 50, textAlign: 'center' }}>⏳ Đang tải đề thi...</div>;
  }

  if (!started && !submitted) {
    return (
      <div style={{ padding: 50, textAlign: 'center' }}>
        <h2>Bắt đầu bài viết IELTS</h2>
        <p>Bạn có 60 phút để làm cả Task 1 và Task 2</p>
        <button onClick={() => setStarted(true)}>Bắt đầu làm bài</button>
      </div>
    );
  }

  if (submitted) {
    return (
      <div style={{ padding: 50, textAlign: 'center' }}>
        <h2>✅ Bài làm đã được nộp</h2>
        <p>{message}</p>
      </div>
    );
  }

  return (
    <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', fontFamily: 'sans-serif' }}>
      {/* Header */}
      <div style={{ padding: '10px 20px', background: '#f5f5f5', borderBottom: '1px solid #ccc' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            ⏳ <strong>Thời gian còn lại:</strong> {formatTime(timeLeft)} <br />
            👤 {user?.name} — Đề số {selectedTestId}
          </div>
          <button
            onClick={() => {
              localStorage.removeItem('user');
              window.location.href = '/login';
            }}
            style={{ background: '#f44', color: 'white', border: 'none', padding: '6px 12px', borderRadius: 4 }}
          >
            🔓 Đăng xuất
          </button>
        </div>
      </div>

      {/* Main content */}
      <Split sizes={[50, 50]} minSize={200} gutterSize={8} direction="horizontal" style={{ flexGrow: 1, display: 'flex' }}>
        <div style={{ padding: 20, overflowY: 'auto' }}>
          {activeTask === 'task1' && (
            <>
              <h2>WRITING TASK 1</h2>
              <p>You should spend 20 minutes on this task.</p>
              <p>{testData.task1}</p>
              {testData.task1Image && (
                <img
                  src={`http://localhost:5000${testData.task1Image}`}
                  alt="Task 1"
                  style={{ maxWidth: '100%', marginTop: 10 }}
                />
              )}
              <p><i>Write at least 150 words.</i></p>
            </>
          )}
          {activeTask === 'task2' && (
            <>
              <h2>WRITING TASK 2</h2>
              <p>You should spend 40 minutes on this task.</p>
              <p>{testData.task2}</p>
              <p><i>Write at least 250 words.</i></p>
            </>
          )}
        </div>

        <div style={{ padding: 20, overflowY: 'auto' }}>
          {activeTask === 'task1' && (
            <>
              <h3>Your Answer – Task 1 ({countWords(task1)} từ)</h3>
              <textarea
                rows={15}
                style={{ width: '100%', padding: '10px' }}
                value={task1}
                onChange={e => setTask1(e.target.value)}
              />
            </>
          )}
          {activeTask === 'task2' && (
            <>
              <h3>Your Answer – Task 2 ({countWords(task2)} từ)</h3>
              <textarea
                rows={15}
                style={{ width: '100%', padding: '10px' }}
                value={task2}
                onChange={e => setTask2(e.target.value)}
              />
            </>
          )}
        </div>
      </Split>

      {/* Navbar dưới */}
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        padding: '10px',
        backgroundColor: '#fafafa',
        borderTop: '1px solid #ccc',
        position: 'sticky',
        bottom: 0,
        zIndex: 10
      }}>
        <button onClick={() => setActiveTask('task1')} style={{ margin: '0 10px' }}>
          Task 1
        </button>
        <button onClick={() => setActiveTask('task2')} style={{ margin: '0 10px' }}>
          Task 2
        </button>
        <button onClick={handleSubmit} style={{ margin: '0 10px', backgroundColor: '#007e86', color: 'white' }}>
          📩 Nộp bài
        </button>
      </div>
    </div>
  );
};

export default WritingTest;
