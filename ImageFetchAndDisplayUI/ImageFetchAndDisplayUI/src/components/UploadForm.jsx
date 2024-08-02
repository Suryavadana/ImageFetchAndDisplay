import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../styles/Uploadform.css'; // Import the CSS file

function UploadForm() {
    const [file, setFile] = useState(null);
    const [name, setName] = useState('');
    const [type, setType] = useState('');
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const onFileChange = event => {
        setFile(event.target.files[0]);
        setError(null); // Clear error on file change
    };

    const onNameChange = event => {
        setName(event.target.value);
    };

    const onTypeChange = event => {
        setType(event.target.value);
    };

    const onFileUpload = () => {
        if (!file || !name || !type) {
            setError('Please complete all fields before uploading.');
            return;
        }

        const formData = new FormData();
        formData.append('file', file);
        formData.append('name', name);
        formData.append('type', type);

        axios.post("http://localhost:8080/images/upload", formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        })
        .then(response => {
            alert('File uploaded successfully');
            navigate('/display');
        })
        .catch(err => {
            console.error('Error uploading file:', err.response || err.message);
            setError('Error uploading file: ' + (err.response?.data || err.message));
        });
    };

    return (
        <div className="upload-form-container">
            <h2>Upload Your Image</h2>
            <input type="file" onChange={onFileChange} />
            <input type="text" value={name} onChange={onNameChange} placeholder="Image Name" />
            <input type="text" value={type} onChange={onTypeChange} placeholder="Image Type" />
            <button onClick={onFileUpload}>Upload!</button>
            {error && <p>{error}</p>}
        </div>
    );
}

export default UploadForm;
