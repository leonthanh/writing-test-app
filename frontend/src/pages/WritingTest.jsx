import React, { useState, useEffect, useCallback } from 'react';
import Split from 'react-split';

const WritingTest = () => {
  const [task1, setTask1] = useState(localStorage.getItem('writing_task1') || '');
  const [task2, setTask2] = useState(localStorage.getItem('writing_task2') || '');
  const [timeLeft, setTimeLeft] = useState(() => {
    const saved = localStorage.getItem('writing_timeLeft');
    return saved ? parseInt(saved, 10) : 60 * 60;
  });
  const [started, setStarted] = useState(localStorage.getItem('writing_started') === 'true');
  const [submitted, setSubmitted] = useState(false);
  const [message, setMessage] = useState('');
  const [activeTask, setActiveTask] = useState('task1');
  const [testData, setTestData] = useState(null);
  const [feedback, setFeedback] = useState('');

  const user = JSON.parse(localStorage.getItem('user'));
  const selectedTestId = localStorage.getItem('selectedTestId');
  const API_URL = process.env.REACT_APP_API_URL;

  useEffect(() => {
    localStorage.setItem('writing_task1', task1);
  }, [task1]);

  useEffect(() => {
    localStorage.setItem('writing_task2', task2);
  }, [task2]);

  useEffect(() => {
    localStorage.setItem('writing_timeLeft', timeLeft.toString());
  }, [timeLeft]);

  useEffect(() => {
    localStorage.setItem('writing_started', started.toString());
  }, [started]);

  useEffect(() => {
    fetch(`${API_URL}/api/writing-tests/${selectedTestId}`)
      .then(res => res.json())
      .then(data => setTestData(data))
      .catch(err => console.error('Lỗi khi tải đề:', err));
  }, [selectedTestId, API_URL]);

  const handleSubmit = useCallback(async () => {
    setSubmitted(true);

    try {
      const res = await fetch(`${API_URL}/api/writing/submit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ task1, task2, timeLeft, user, testId: selectedTestId }),
      });

      const data = await res.json();
      setMessage(data.message || '✅ Đã nộp bài!');

      localStorage.removeItem('writing_task1');
      localStorage.removeItem('writing_task2');
      localStorage.removeItem('writing_timeLeft');
      localStorage.removeItem('writing_started');
      localStorage.removeItem('selectedTestId');
      localStorage.removeItem('user');

      setTimeout(() => {
        window.location.href = '/login';
      }, 3000);
    } catch (err) {
      console.error('Lỗi nộp bài:', err);
      setMessage('❌ Lỗi khi gửi bài.');
    }
  }, [task1, task2, timeLeft, user, selectedTestId, API_URL]);

  useEffect(() => {
    if (!started || submitted) return;
    if (timeLeft <= 0) {
      handleSubmit();
      return;
    }
    const timer = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
    return () => clearInterval(timer);
  }, [started, submitted, timeLeft, handleSubmit]);

  // 🔄 Khi đã nộp => lấy bài mới nhất để xem nhận xét
  useEffect(() => {
    if (!user || !user.phone) return;

    fetch(`${API_URL}/api/writing/list`)
      .then(res => res.json())
      .then(list => {
        const last = list.find(item => item.user?.phone === user.phone);
        if (last) setFeedback(last.feedback || '');
      })
      .catch(err => console.error('❌ Lỗi lấy feedback:', err));
  }, [submitted, API_URL, user]);

  const formatTime = s => {
    const m = Math.floor(s / 60).toString().padStart(2, '0');
    const sec = (s % 60).toString().padStart(2, '0');
    return `${m}:${sec}`;
  };

  const countWords = text => text.trim().split(/\s+/).filter(Boolean).length;

  if (!testData) return <div style={{ padding: 50 }}>⏳ Đang tải đề...</div>;

  if (submitted) {
    return (
      <div style={{ padding: 50 }}>
        ✅ Bài làm đã nộp. {message}
        {feedback && (
          <>
            <h3 style={{ marginTop: 30 }}>🗒️ Nhận xét từ giáo viên:</h3>
            <p style={{ whiteSpace: 'pre-line' }}>{feedback}</p>
          </>
        )}
      </div>
    );
  }

  if (!started) {
    return (
      <div style={{ padding: 50, textAlign: 'center' }}>
        <h2>Bắt đầu bài viết IELTS</h2>
        <p>Bạn có 60 phút để làm cả Task 1 và Task 2</p>
        <button onClick={() => setStarted(true)}>Bắt đầu làm bài</button>
      </div>
    );
  }

  return (
    <div style={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
      <div style={{ padding: 10, background: '#f0f0f0', borderBottom: '1px solid #ccc' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <div>
            ⏳ <b>Thời gian:</b> {formatTime(timeLeft)}<br />
            👤 {user?.name} — Đề {selectedTestId}
          </div>
          <button onClick={() => {
            localStorage.removeItem('user');
            window.location.href = '/login';
          }} style={{
            background: '#f44', color: '#fff',
            border: 'none', padding: '6px 12px', borderRadius: 4
          }}>
            🔓 Đăng xuất
          </button>
        </div>
      </div>

      <Split sizes={[50, 50]} minSize={200} gutterSize={8} direction="horizontal"
        style={{ flexGrow: 1, overflow: 'hidden', height: '100%', display: 'flex' }}>
        <div style={{
          height: '100vh', overflow: 'hidden',
          display: 'flex', flexDirection: 'column', fontFamily: 'sans-serif'
        }}>
          {activeTask === 'task1' && (
            <>
              <h2>WRITING TASK 1</h2>
              <p>{testData.task1}</p>
              {testData.task1Image && (
                <img src={`${API_URL}${testData.task1Image}`} alt="Task 1" style={{ maxWidth: '100%' }} />
              )}
              <p><i>Viết ít nhất 150 từ.</i></p>
            </>
          )}
          {activeTask === 'task2' && (
            <>
              <h2>WRITING TASK 2</h2>
              <p>{testData.task2}</p>
              <p><i>Viết ít nhất 250 từ.</i></p>
            </>
          )}
        </div>

        <div style={{ padding: 20 }}>
          <h3>Your Answer – {activeTask.toUpperCase()} ({countWords(activeTask === 'task1' ? task1 : task2)} từ)</h3>
          <textarea
            rows={25}
            style={{ width: '100%', padding: '10', boxSizing: 'border-box', fontSize: '18px', fontFamily: 'sans-serif' }}
            value={activeTask === 'task1' ? task1 : task2}
            onChange={e => {
              if (activeTask === 'task1') setTask1(e.target.value);
              else setTask2(e.target.value);
            }}
          />
        </div>
      </Split>

      <div style={{
        display: 'flex', justifyContent: 'center', padding: 10,
        background: '#fafafa', borderTop: '1px solid #ccc'
      }}>
        <button onClick={() => setActiveTask('task1')} style={taskBtnStyle(activeTask === 'task1')}>Task 1</button>
        <button onClick={() => setActiveTask('task2')} style={taskBtnStyle(activeTask === 'task2')}>Task 2</button>
        <button onClick={handleSubmit} style={{
          margin: '0 10px', padding: '10px 20px', border: 'none',
          borderRadius: '8px', fontSize: '16px', backgroundColor: '#28a745',
          color: 'white', cursor: 'pointer'
        }}>
          📩 Submit
        </button>
      </div>
    </div>
  );
};

const taskBtnStyle = (isActive) => ({
  margin: '0 10px',
  padding: '10px 20px',
  border: 'none',
  borderRadius: '8px',
  fontSize: '16px',
  backgroundColor: isActive ? '#007bff' : '#e0e0e0',
  color: isActive ? 'white' : '#333',
  cursor: 'pointer'
});

export default WritingTest;
