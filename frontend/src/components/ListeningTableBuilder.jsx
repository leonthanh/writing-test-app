import React, { useState } from 'react';

const ListeningTableBuilder = ({ onAddSection }) => {
  const [caption, setCaption] = useState('PERSONAL DETAILS FOR HOMESTAY APPLICATION');
  const [rows, setRows] = useState([
    ['First name', { qid: 1 }],
    ['Family name', 'Nguyen']
  ]);
  const [answers, setAnswers] = useState({ 1: 'Keiko' });

  const handleRowChange = (index, col, value) => {
    const newRows = [...rows];
    if (col === 1 && value === '[blank]') {
      const newQid = Object.keys(answers).length + 1;
      newRows[index][1] = { qid: newQid };
      setAnswers({ ...answers, [newQid]: '' });
    } else {
      newRows[index][col] = value;
    }
    setRows(newRows);
  };

  const handleAnswerChange = (qid, value) => {
    setAnswers({ ...answers, [qid]: value });
  };

  const handleAddRow = () => {
    setRows([...rows, ['', '']]);
  };

  const handleSubmit = () => {
    onAddSection({
      title: 'Section Table',
      type: 'table',
      table: { caption, rows },
      answers
    });
    // Reset form
    setCaption('');
    setRows([]);
    setAnswers({});
  };

  return (
    <div style={{ marginTop: 30, padding: 20, border: '1px solid #ddd', borderRadius: 10 }}>
      <h3>➕ Thêm Section dạng bảng (Table)</h3>
      <label>📄 Tiêu đề bảng:</label>
      <input
        type="text"
        value={caption}
        onChange={e => setCaption(e.target.value)}
        style={{ width: '100%', marginBottom: 15 }}
      />
      <table border="1" style={{ width: '100%', marginBottom: 20 }}>
        <thead>
          <tr><th>Column 1</th><th>Column 2</th></tr>
        </thead>
        <tbody>
          {rows.map((row, idx) => (
            <tr key={idx}>
              <td>
                <input
                  value={row[0]}
                  onChange={e => handleRowChange(idx, 0, e.target.value)}
                  style={{ width: '95%' }}
                />
              </td>
              <td>
                {typeof row[1] === 'string' ? (
                  <input
                    value={row[1]}
                    onChange={e => handleRowChange(idx, 1, e.target.value)}
                    style={{ width: '95%' }}
                  />
                ) : (
                  <>
                    <b>{`[Q${row[1].qid}]`}</b>{' '}
                    <input
                      type="text"
                      placeholder="Đáp án đúng"
                      value={answers[row[1].qid] || ''}
                      onChange={e => handleAnswerChange(row[1].qid, e.target.value)}
                      style={{ width: '70%' }}
                    />
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <button onClick={handleAddRow}>➕ Thêm dòng</button>{' '}
      <button onClick={handleSubmit} style={{ backgroundColor: '#28a745', color: 'white', padding: '8px 16px' }}>
        📤 Thêm Section bảng
      </button>
    </div>
  );
};

export default ListeningTableBuilder;
