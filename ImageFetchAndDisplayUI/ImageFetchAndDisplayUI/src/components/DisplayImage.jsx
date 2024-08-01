import React, { useState, useEffect } from 'react';
import axios from 'axios';

function DisplayImage() {
    const [image, setImage] = useState(null);
    const imageId = 1; // Replace with the actual image ID you want to fetch

    useEffect(() => {
        axios.get(`http://localhost:8080/images/${imageId}`, { responseType: 'arraybuffer' })
            .then(response => {
                const imgBlob = new Blob([response.data], { type: response.headers['content-type'] });
                const imgUrl = URL.createObjectURL(imgBlob);
                setImage(imgUrl);
            })
            .catch(err => {
                alert('Error fetching image');
            });

        return () => {
            if (image) {
                URL.revokeObjectURL(image);
            }
        };
    }, [image, imageId]);

    return (
        <div>
            {image ? <img src={image} alt="Fetched" /> : <p>Loading image...</p>}
        </div>
    );
}

export default DisplayImage;
