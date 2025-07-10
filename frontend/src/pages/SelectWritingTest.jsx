import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const SelectWritingTest = () => {
  const [tests, setTests] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetch('http://localhost:5000/api/writing-tests')
      .then(res => res.json())
      .then(data => setTests(data));
  }, []);

  const handleSelect = (id) => {
    localStorage.setItem('selectedTestId', id);
    navigate('/');
  };

  return (
    <div style={{ padding: '50px' }}>
      <h2>Chọn đề viết</h2>
      {tests.map(test => (
        <div key={test.id} style={{ marginBottom: '20px' }}>
          <strong>{test.name}</strong>
          <button onClick={() => handleSelect(test.id)} style={{ marginLeft: '10px' }}>
            Làm bài
          </button>
        </div>
      ))}
    </div>
  );
};

export default SelectWritingTest;
