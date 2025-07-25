import React, { useState } from 'react';

const AddListeningTest = () => {
  const [testTitle, setTestTitle] = useState('');
  const [audioFile, setAudioFile] = useState(null);
  const [sections, setSections] = useState([
    { title: 'Section 1', questions: [] },
    { title: 'Section 2', questions: [] },
    { title: 'Section 3', questions: [] },
    { title: 'Section 4', questions: [] },
  ]);

  const handleAudioUpload = (e) => {
    setAudioFile(e.target.files[0]);
  };

  const handleAddQuestion = (sectionIndex) => {
    const updatedSections = [...sections];
    updatedSections[sectionIndex].questions.push({
      questionText: '',
      options: ['', '', '', ''],
      correctAnswer: '',
    });
    setSections(updatedSections);
  };

  const handleSubmit = async () => {
    const formData = new FormData();
    formData.append('title', testTitle);
    formData.append('audio', audioFile);
    formData.append('sections', JSON.stringify(sections));

    const res = await fetch(`${process.env.REACT_APP_API_URL}/api/listening-tests/create`, {
      method: 'POST',
      body: formData
    });

    if (res.ok) {
      alert('✅ Bài test đã được tạo!');
    } else {
      alert('❌ Có lỗi xảy ra khi tạo bài test.');
    }
  };

  return (
    <div style={{ padding: 40, fontFamily: 'sans-serif' }}>
      <h1>➕ Thêm bài Listening mới</h1>

      <label>🎓 Tên bài test:</label><br />
      <input
        type="text"
        value={testTitle}
        onChange={e => setTestTitle(e.target.value)}
        style={{ width: '60%', marginBottom: 20 }}
      />

      <br />
      <label>🎧 Upload audio file:</label><br />
      <input
        type="file"
        accept="audio/*"
        onChange={handleAudioUpload}
        style={{ marginBottom: 30 }}
      />

      {sections.map((section, sectionIndex) => (
        <div key={sectionIndex} style={{
          border: '1px solid #ddd',
          marginBottom: 30,
          padding: 20,
          borderRadius: 10,
          backgroundColor: '#f9f9f9'
        }}>
          <h3>{section.title}</h3>
          {section.questions.map((q, qIndex) => (
            <div key={qIndex} style={{ marginBottom: 15 }}>
              <label>Câu hỏi {qIndex + 1}:</label><br />
              <input
                type="text"
                placeholder="Nhập câu hỏi..."
                value={q.questionText}
                onChange={e => {
                  const updated = [...sections];
                  updated[sectionIndex].questions[qIndex].questionText = e.target.value;
                  setSections(updated);
                }}
                style={{ width: '90%' }}
              />
              <br />
              <label>🔘 Options:</label><br />
              {q.options.map((opt, i) => (
                <input
                  key={i}
                  type="text"
                  placeholder={`Đáp án ${String.fromCharCode(65 + i)}`}
                  value={opt}
                  onChange={e => {
                    const updated = [...sections];
                    updated[sectionIndex].questions[qIndex].options[i] = e.target.value;
                    setSections(updated);
                  }}
                  style={{ width: '40%', marginRight: 10 }}
                />
              ))}
              <br />
              <label>✅ Đáp án đúng (A/B/C/D): </label>
              <input
                type="text"
                value={q.correctAnswer}
                onChange={e => {
                  const updated = [...sections];
                  updated[sectionIndex].questions[qIndex].correctAnswer = e.target.value.toUpperCase();
                  setSections(updated);
                }}
                maxLength={1}
              />
            </div>
          ))}
          <button onClick={() => handleAddQuestion(sectionIndex)}>➕ Thêm câu hỏi</button>
        </div>
      ))}

      <button
        onClick={handleSubmit}
        style={{
          backgroundColor: '#28a745', color: 'white',
          padding: '12px 24px', border: 'none',
          borderRadius: 8, fontSize: 18
        }}
      >
        📤 Gửi bài test
      </button>
    </div>
  );
};

export default AddListeningTest;
