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

  const user = JSON.parse(localStorage.getItem('user'));
  const selectedTestId = localStorage.getItem('selectedTestId');

  // Nếu chưa chọn đề
  // if (!selectedTestId) {
  //   return <div style={{ padding: 50 }}>⚠️ Bạn chưa chọn đề thi. Quay lại trang chọn đề.</div>;
  // }

  // 🧠 Tự động lưu vào localStorage mỗi lần thay đổi
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

  // 🔁 Lấy đề từ backend
  useEffect(() => {
    fetch(`http://localhost:5000/api/writing-tests/${selectedTestId}`)
      .then(res => res.json())
      .then(data => setTestData(data))
      .catch(err => console.error('Lỗi khi tải đề:', err));
  }, [selectedTestId]);

  // 📨 Nộp bài
  const handleSubmit = useCallback(async () => {
    setSubmitted(true);

    // ✅ Xoá cache
    localStorage.removeItem('writing_task1');
    localStorage.removeItem('writing_task2');
    localStorage.removeItem('writing_timeLeft');
    localStorage.removeItem('writing_started');

    const user = JSON.parse(localStorage.getItem('user'));
    const selectedTestId = localStorage.getItem('selectedTestId');

    try {
      const res = await fetch('http://localhost:5000/api/writing/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ task1, task2, timeLeft, user, testId: selectedTestId }),
      });
      const data = await res.json();
      setMessage(data.message || 'Đã nộp bài!');
    } catch (err) {
      console.error('Lỗi nộp bài:', err);
      setMessage('Lỗi khi gửi bài.');
    }
  }, [task1, task2, timeLeft]);

  // ⏳ Đếm ngược
  useEffect(() => {
    if (!started || submitted) return;
    if (timeLeft <= 0) {
      handleSubmit();
      return;
    }
    const timer = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
    return () => clearInterval(timer);
  }, [started, submitted, timeLeft, handleSubmit]);

  const formatTime = s => {
    const m = Math.floor(s / 60).toString().padStart(2, '0');
    const sec = (s % 60).toString().padStart(2, '0');
    return `${m}:${sec}`;
  };

  const countWords = text => text.trim().split(/\s+/).filter(Boolean).length;

  if (!testData) return <div style={{ padding: 50 }}>⏳ Đang tải đề...</div>;
  if (submitted) return <div style={{ padding: 50 }}>✅ Bài làm đã nộp. {message}</div>;

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
      {/* Header */}
      <div style={{ padding: 10, background: '#f0f0f0', borderBottom: '1px solid #ccc' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <div>
            ⏳ <b>Thời gian:</b> {formatTime(timeLeft)}<br />
            👤 {user?.name} — Đề {selectedTestId}
          </div>
          <button onClick={() => {
            localStorage.removeItem('user');
            window.location.href = '/login';
          }} style={{ background: '#f44', color: '#fff', border: 'none', padding: '6px 12px', borderRadius: 4 }}>
            🔓 Đăng xuất
          </button>
        </div>
      </div>

      {/* Nội dung */}
      <Split
  sizes={[50, 50]}
  minSize={200}
  gutterSize={8}
  direction="horizontal"
  style={{
    flexGrow: 1,
    overflow: 'hidden',        // ✅ không để Split tràn
    height: '100%',
    display: 'flex',
  }}
>

        {/* Panel trái */}
        {/* <div style={{ padding: 20, overflowY: 'auto' }}> */}
        <div
  style={{
    height: '100vh',
    overflow: 'hidden',         // ✅ chống tràn toàn trang
    display: 'flex',
    flexDirection: 'column',
    fontFamily: 'sans-serif',
  }}
>

          {activeTask === 'task1' && (
            <>
              <h2>WRITING TASK 1</h2>
              <p>{testData.task1}</p>
              {testData.task1Image && (
                <img src={`http://localhost:5000${testData.task1Image}`} alt="Task 1" style={{ maxWidth: '100%' }} />
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

        {/* Panel phải */}
        <div style={{ padding: 20 }}>
          <h3>Your Answer – {activeTask.toUpperCase()} ({countWords(activeTask === 'task1' ? task1 : task2)} từ)</h3>
          <textarea
            rows={25}
            style={{ width: '100%', padding: '10', boxSizing: 'border-box', fontSize: '18px' , fontFamily: 'sans-serif' }}
            value={activeTask === 'task1' ? task1 : task2}
            onChange={e => {
              if (activeTask === 'task1') setTask1(e.target.value);
              else setTask2(e.target.value);
            }}
          />
        </div>
      </Split>

      {/* Footer */}
      <div style={{
        display: 'flex', justifyContent: 'center', padding: 10,
        background: '#fafafa', borderTop: '1px solid #ccc'
      }}>
        <button onClick={() => setActiveTask('task1')} style={{ margin: '0 10px' }}>Task 1</button>
        <button onClick={() => setActiveTask('task2')} style={{ margin: '0 10px' }}>Task 2</button>
        <button onClick={handleSubmit} style={{ margin: '0 10px', background: '#007e86', color: '#fff' }}>
          📩 Nộp bài
        </button>
      </div>
    </div>
  );
};

export default WritingTest;
