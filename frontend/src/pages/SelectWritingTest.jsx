import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const SelectWritingTest = () => {
  const [tests, setTests] = useState([]);
  const navigate = useNavigate();
  const API_URL = process.env.REACT_APP_API_URL;

  useEffect(() => {
    fetch(`${API_URL}/api/writing-tests`)
      .then(res => res.json())
      .then(data => setTests(data))
      .catch(err => console.error('Lỗi khi tải đề:', err));
  }, [API_URL]);

  const handleSelect = (id) => {
    localStorage.setItem('selectedTestId', id);
    navigate('/');
  };

  return (
    <div style={{ padding: '50px' }}>
      <h2>Chọn đề viết</h2>
      {tests.map(test => (
        <div key={test._id} style={{ marginBottom: '20px' }}>
          <strong>Đề số {test.index}</strong>
          <button onClick={() => handleSelect(test._id)} style={{ marginLeft: '10px' }}>
            Làm bài
          </button>
        </div>
      ))}
    </div>
  );
};

export default SelectWritingTest;
