import React, { useState } from 'react';

const CreateWritingTest = () => {
  const [task1, setTask1] = useState('');
  const [task2, setTask2] = useState('');
  const [image, setImage] = useState(null);
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('task1', task1);
    formData.append('task2', task2);
    if (image) formData.append('image', image);

    try {
      const res = await fetch('http://localhost:5000/api/writing-tests', {
        method: 'POST',
        body: formData
      });

      const data = await res.json();
      setMessage(data.message || 'Đã tạo đề');
    } catch (err) {
      setMessage('❌ Lỗi khi tạo đề');
    }
  };

  return (
    <div style={{ maxWidth: '600px', margin: '30px auto' }}>
      <h2>📝 Thêm đề Writing</h2>
      <form onSubmit={handleSubmit}>
        <textarea
          placeholder="Nội dung Task 1"
          rows={5}
          value={task1}
          onChange={e => setTask1(e.target.value)}
          style={{ width: '100%', marginBottom: '10px' }}
        />
        <textarea
          placeholder="Nội dung Task 2"
          rows={5}
          value={task2}
          onChange={e => setTask2(e.target.value)}
          style={{ width: '100%', marginBottom: '10px' }}
        />
        <input
          type="file"
          accept="image/*"
          onChange={e => setImage(e.target.files[0])}
          style={{ marginBottom: '10px' }}
        />
        <button type="submit">➕ Tạo đề</button>
      </form>
      <p>{message}</p>
    </div>
  );
};

export default CreateWritingTest;
