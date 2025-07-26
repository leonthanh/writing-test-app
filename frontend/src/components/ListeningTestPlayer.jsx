// src/pages/ListeningTestPlayer.jsx
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

const ListeningTestPlayer = () => {
  const { testId } = useParams();
  const [testData, setTestData] = useState(null);
  const [answers, setAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(30 * 60); // 30 phút

  // Fetch đề
  useEffect(() => {
    const fetchTest = async () => {
      const res = await fetch(`${process.env.REACT_APP_API_URL}/api/listening-tests/${testId}`);
      const data = await res.json();
      setTestData(data);
    };
    fetchTest();
  }, [testId]);

  // Countdown Timer
  useEffect(() => {
    if (timeLeft <= 0) return handleSubmit();
    const timer = setInterval(() => setTimeLeft(t => t - 1), 1000);
    return () => clearInterval(timer);
  }, [timeLeft]);

  const formatTime = (sec) => {
    const m = String(Math.floor(sec / 60)).padStart(2, '0');
    const s = String(sec % 60).padStart(2, '0');
    return `${m}:${s}`;
  };

  const handleAnswerChange = (secIdx, quesIdx, value) => {
    const key = `${secIdx}_${quesIdx}`;
    setAnswers({ ...answers, [key]: value });
  };

  const handleSubmit = () => {
    // Sau này gửi lên server tính điểm
    alert('📝 Bài làm đã được nộp!');
    console.log('Đáp án chọn:', answers);
    // redirect tới trang kết quả nếu muốn
  };

  if (!testData) return <div>⏳ Đang tải đề...</div>;

  return (
    <div style={{ padding: 30, fontFamily: 'sans-serif' }}>
      <h2>{testData.title}</h2>

      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20
      }}>
        <audio controls src={testData.audioUrl} style={{ width: '70%' }} />
        <div style={{ fontSize: 18 }}>
          ⏱️ Thời gian còn lại: <b style={{ color: timeLeft < 300 ? 'red' : 'black' }}>{formatTime(timeLeft)}</b>
        </div>
      </div>

      {testData.sections.map((section, secIdx) => (
        <div key={secIdx} style={{
          border: '1px solid #ccc', padding: 20, marginBottom: 30,
          borderRadius: 10, background: '#f9f9f9'
        }}>
          <h3>{section.title}</h3>

          {section.questions.map((q, qIdx) => {
            const key = `${secIdx}_${qIdx}`;
            return (
              <div key={key} style={{ marginBottom: 20 }}>
                <b>Câu {qIdx + 1}: </b> {q.questionText}<br />
                {q.options.map((opt, optIdx) => (
                  <label key={optIdx} style={{ display: 'block', marginLeft: 20 }}>
                    <input
                      type="radio"
                      name={key}
                      value={String.fromCharCode(65 + optIdx)}
                      checked={answers[key] === String.fromCharCode(65 + optIdx)}
                      onChange={e => handleAnswerChange(secIdx, qIdx, e.target.value)}
                    />
                    {' '} {String.fromCharCode(65 + optIdx)}. {opt}
                  </label>
                ))}
              </div>
            );
          })}
        </div>
      ))}

      <button onClick={handleSubmit} style={{
        padding: '10px 25px',
        background: '#27ae60',
        color: 'white',
        border: 'none',
        borderRadius: 6,
        fontSize: 16
      }}>📤 Nộp bài làm</button>
    </div>
  );
};

export default ListeningTestPlayer;
