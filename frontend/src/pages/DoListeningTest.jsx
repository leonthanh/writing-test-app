import React, { useEffect, useState } from 'react';

const DoListeningTest = () => {
  const [test, setTest] = useState(null);
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);

  // Tạm thời hardcode ID bài test (sau này truyền qua URL)
  const testId = 'your-test-id-here';

  useEffect(() => {
    const fetchTest = async () => {
      const res = await fetch(`${process.env.REACT_APP_API_URL}/api/listening-tests/${testId}`);
      const data = await res.json();
      setTest(data);
    };
    fetchTest();
  }, [testId]);

  const handleSelectAnswer = (sectionIndex, questionIndex, optionLetter) => {
    setAnswers({
      ...answers,
      [`${sectionIndex}-${questionIndex}`]: optionLetter
    });
  };

  const handleSubmit = () => {
    setSubmitted(true);
  };

  if (!test) return <p>Đang tải bài test...</p>;

  return (
    <div style={{ padding: 40, fontFamily: 'sans-serif' }}>
      <h1>{test.title}</h1>

      <audio controls src={`${process.env.REACT_APP_API_URL}/${test.audioPath}`} style={{ width: '100%', marginBottom: 30 }} />

      {test.sections.map((section, sectionIndex) => (
        <div key={sectionIndex} style={{ marginBottom: 30 }}>
          <h2>{section.title}</h2>

          {section.questions.map((q, qIndex) => {
            const key = `${sectionIndex}-${qIndex}`;
            const selected = answers[key];

            const correct = q.correctAnswer;
            const isCorrect = submitted && selected === correct;

            return (
              <div key={qIndex} style={{
                marginBottom: 15,
                backgroundColor: submitted ? (isCorrect ? '#d4edda' : '#f8d7da') : '#fff',
                padding: 10,
                borderRadius: 8,
              }}>
                <p><b>Câu {sectionIndex * 10 + qIndex + 1}:</b> {q.questionText}</p>
                <div>
                  {q.options.map((opt, i) => {
                    const letter = String.fromCharCode(65 + i);
                    const isSelected = selected === letter;

                    return (
                      <label key={i} style={{
                        display: 'block',
                        padding: 6,
                        backgroundColor: isSelected ? '#cce5ff' : '',
                        borderRadius: 6,
                        cursor: 'pointer'
                      }}>
                        <input
                          type="radio"
                          name={key}
                          value={letter}
                          checked={isSelected}
                          onChange={() => handleSelectAnswer(sectionIndex, qIndex, letter)}
                          disabled={submitted}
                        />
                        &nbsp; <b>{letter}</b>. {opt}
                        {submitted && correct === letter && (
                          <span style={{ color: 'green', marginLeft: 10 }}>✅ Đáp án đúng</span>
                        )}
                      </label>
                    );
                  })}
                </div>
                {submitted && selected && selected !== correct && (
                  <p style={{ color: 'red' }}>❌ Bạn chọn: {selected}</p>
                )}
              </div>
            );
          })}
        </div>
      ))}

      {!submitted ? (
        <button onClick={handleSubmit} style={{
          backgroundColor: '#007bff',
          color: '#fff',
          padding: '12px 24px',
          border: 'none',
          borderRadius: 8,
          fontSize: 18
        }}>
          📤 Nộp bài
        </button>
      ) : (
        <p style={{ fontSize: 20, color: 'green' }}>🎉 Bạn đã hoàn thành bài test!</p>
      )}
    </div>
  );
};

export default DoListeningTest;
