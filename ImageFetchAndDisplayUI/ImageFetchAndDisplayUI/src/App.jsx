// App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import DisplayImage from './components/DisplayImage';
import UploadForm from './components/UploadForm';

function App() {
    return (
        <Router>
            <div>
                <h1>Image Uploader and Viewer</h1>
                <Routes>
                    <Route path="/upload" element={<UploadForm />} />
                    <Route path="/display" element={<DisplayImage />} />
                    <Route path="/" element={<Navigate to="/upload" />} />
                </Routes>
            </div>
        </Router>
    );
}

export default App;
