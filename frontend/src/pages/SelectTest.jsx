import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const SelectTest = () => {
  const [tests, setTests] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetch('http://localhost:5000/api/writing-tests')
      .then(res => res.json())
      .then(data => setTests(data))
      .catch(err => console.error('Lỗi khi tải đề:', err));
  }, []);

  const handleSelect = (testId) => {
    localStorage.setItem('selectedTestId', testId);
    navigate('/writing-test'); // chuyển đến trang làm bài
  };

  return (
    <div style={{ maxWidth: 600, margin: '50px auto', fontFamily: 'sans-serif' }}>
      <h2>📋 Chọn đề Writing</h2>
      {tests.length === 0 ? (
        <p>⏳ Đang tải đề...</p>
      ) : (
        tests.map(test => (
          <div
            key={test._id}
            style={{
              border: '1px solid #ccc',
              padding: '15px',
              borderRadius: '8px',
              marginBottom: '15px',
              backgroundColor: '#f9f9f9'
            }}
          >
            <h4>{test.name || `Đề số ${test.index || test._id}`}</h4>
            <button onClick={() => handleSelect(test._id)} style={{ marginTop: '10px' }}>
              📝 Chọn đề này
            </button>
          </div>
        ))
      )}
    </div>
  );
};

export default SelectTest;
