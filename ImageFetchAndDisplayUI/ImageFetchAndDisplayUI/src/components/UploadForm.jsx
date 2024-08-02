import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function UploadForm() {
    const [file, setFile] = useState(null);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const onFileChange = event => {
        setFile(event.target.files[0]);
    };

    const onFileUpload = () => {
        if (!file) {
            setError('Please choose a file to upload.');
            return;
        }

        const formData = new FormData();
        formData.append('file', file);

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
        <div>
            <input type="file" onChange={onFileChange} />
            <button onClick={onFileUpload}>Upload!</button>
            {error && <p style={{ color: 'red' }}>{error}</p>}
        </div>
    );
}

export default UploadForm;
