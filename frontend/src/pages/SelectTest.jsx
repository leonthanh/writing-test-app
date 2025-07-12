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
    navigate('/writing-test');
  };

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      padding: '50px 20px',
      fontFamily: 'sans-serif',
      backgroundColor: '#f4f8ff',
      minHeight: '100vh'
    }}>
      <div style={{
        maxWidth: '600px',
        width: '100%',
        backgroundColor: 'white',
        borderRadius: '12px',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
        padding: '30px'
      }}>
        
        <div style={{ textAlign: 'center', marginBottom: 30 }}>
          <img src="http://localhost:5000/uploads/staredu.jpg" alt="StarEdu" style={{ height: 60, marginBottom: 10 }} />
          <h2 style={{ margin: 0 }}>📋 IX Writing's BRAD Teacher</h2>
        </div>


        {tests.length === 0 ? (
          <p style={{ textAlign: 'center', fontStyle: 'italic', color: '#666' }}>⏳ Đang tải đề...</p>
        ) : (
          tests.map((test, index) => (
            <div key={test._id} style={{
              border: '1px solid #eee',
              padding: '10px',
              borderRadius: '10px',
              marginBottom: '15px',
              backgroundColor: '#f9f9f9'
            }}>
              
              <button
                onClick={() => handleSelect(test._id)}
                style={{
                  backgroundColor: '#007bff',
                  color: 'white',
                  border: 'none',
                  padding: '10px 20px',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontSize: '16px',
                  width: '100%'
                }}
              >
                <h3 style={{ margin: '0px' }}>
                📝 Writing {test.index || index + 1}
              </h3>
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default SelectTest;
