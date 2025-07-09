import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import WritingTest from './pages/WritingTest';
import AdminSubmissions from './pages/AdminSubmissions';
import Login from './pages/Login';
import CreateWritingTest from './pages/CreateWritingTest';
import SelectTest from './pages/SelectTest';
import ProtectedRoute from './components/ProtectedRoute';

const isLoggedIn = () => {
  const user = localStorage.getItem('user');
  return !!user;
};

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />

        {/* ✅ Trang cho học sinh chọn đề */}
        <Route path="/" element={isLoggedIn() ? <SelectTest /> : <Navigate to="/login" replace />} />
        <Route path="/select-test" element={<SelectTest />} />
        {/* ✅ Trang làm bài viết */}
        <Route path="/writing" element={isLoggedIn() ? <WritingTest /> : <Navigate to="/login" replace />} />
        <Route path="/writing-test" element={<WritingTest />} />

        {/* ✅ Trang giáo viên tạo đề */}
        <Route path="/admin/create-writing" element={<CreateWritingTest />} />

        {/* ✅ Trang giáo viên xem bài làm */}
        <Route path="/admin" element={
          <ProtectedRoute role="teacher">
            <AdminSubmissions />
          </ProtectedRoute>
        } />
      </Routes>
    </Router>
  );
}

export default App;
