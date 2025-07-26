import React, { useState } from 'react';

const AddListeningTest = () => {
  const [testTitle, setTestTitle] = useState('');
  const [audioFile, setAudioFile] = useState(null);
  const [sections, setSections] = useState(
    Array(4).fill(0).map((_, secIndex) => ({
      title: `Section ${secIndex + 1}`,
      questions: Array(10).fill(0).map(() => ({
        questionText: '',
        options: ['', '', '', ''],
        correctAnswer: '',
      }))
    }))
  );

  const handleAudioUpload = (e) => {
    setAudioFile(e.target.files[0]);
  };

  const handleQuestionChange = (sectionIndex, questionIndex, field, value) => {
    const updated = [...sections];
    if (field === 'questionText' || field === 'correctAnswer') {
      updated[sectionIndex].questions[questionIndex][field] = value;
    }
    setSections(updated);
  };

  const handleOptionChange = (sectionIndex, questionIndex, optionIndex, value) => {
    const updated = [...sections];
    updated[sectionIndex].questions[questionIndex].options[optionIndex] = value;
    setSections(updated);
  };

  const handleSubmit = async () => {
    const formData = new FormData();
    formData.append('title', testTitle);
    formData.append('audio', audioFile);
    formData.append('sections', JSON.stringify(sections));

    const res = await fetch(`${process.env.REACT_APP_API_URL}/api/listening-tests/create`, {
      method: 'POST',
      body: formData,
    });

    if (res.ok) {
      alert('✅ Bài test đã được tạo!');
    } else {
      alert('❌ Có lỗi xảy ra khi tạo bài test.');
    }
  };

  return (
    <div style={{ padding: '40px', fontFamily: 'sans-serif' }}>
      <h1>🎧 Tạo đề thi Listening IELTS (4 Sections - 40 câu)</h1>

      <label><b>📄 Tên đề thi:</b></label><br />
      <input
        type="text"
        value={testTitle}
        onChange={e => setTestTitle(e.target.value)}
        style={{ width: '60%', padding: 10, marginBottom: 20 }}
      /><br />

      <label><b>🔊 Tải file audio:</b></label><br />
      <input
        type="file"
        accept="audio/*"
        onChange={handleAudioUpload}
        style={{ marginBottom: 30 }}
      />

      {sections.map((section, sectionIndex) => (
        <div key={sectionIndex} style={{
          border: '1px solid #ccc',
          borderRadius: 10,
          padding: 20,
          marginBottom: 40,
          backgroundColor: '#f9f9f9'
        }}>
          <h2 style={{ color: '#2c3e50' }}>{section.title}</h2>

          {section.questions.map((q, qIndex) => (
            <div key={qIndex} style={{
              borderBottom: '1px solid #eee',
              marginBottom: 15,
              paddingBottom: 15
            }}>
              <label><b>Câu {qIndex + 1}</b></label><br />
              <input
                type="text"
                placeholder="Nội dung câu hỏi..."
                value={q.questionText}
                onChange={e => handleQuestionChange(sectionIndex, qIndex, 'questionText', e.target.value)}
                style={{ width: '95%', marginBottom: 10 }}
              /><br />
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                {q.options.map((opt, optIndex) => (
                  <input
                    key={optIndex}
                    type="text"
                    placeholder={`Đáp án ${String.fromCharCode(65 + optIndex)}`}
                    value={opt}
                    onChange={e => handleOptionChange(sectionIndex, qIndex, optIndex, e.target.value)}
                    style={{ width: '45%' }}
                  />
                ))}
              </div>
              <br />
              <label>✅ Đáp án đúng (A/B/C/D): </label>
              <input
                type="text"
                maxLength={1}
                value={q.correctAnswer}
                onChange={e => handleQuestionChange(sectionIndex, qIndex, 'correctAnswer', e.target.value.toUpperCase())}
                style={{ width: 50 }}
              />
            </div>
          ))}
        </div>
      ))}

      <button
        onClick={handleSubmit}
        style={{
          backgroundColor: '#2ecc71',
          color: 'white',
          padding: '12px 30px',
          border: 'none',
          borderRadius: 8,
          fontSize: 18
        }}
      >
        📤 Gửi bài test
      </button>
    </div>
  );
};

export default AddListeningTest;
