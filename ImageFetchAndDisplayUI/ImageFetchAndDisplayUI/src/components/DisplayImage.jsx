import React, { useState, useEffect } from 'react';
import axios from 'axios';

function DisplayImages() {
    const [images, setImages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchImages = async () => {
            try {
                // Fetch list of image URLs from your API
                const response = await axios.get('http://localhost:8080/images');
                console.log('Fetched image data:', response.data); // Log the data

                const imageData = response.data; // Assuming the API returns an array of image info

                // Create image URLs for the fetched images
                const imageUrls = await Promise.all(imageData.map(async (image) => {
                    try {
                        const imgResponse = await axios.get(`http://localhost:8080/images/${image.id}`, { responseType: 'arraybuffer' });
                        const imgBlob = new Blob([imgResponse.data], { type: imgResponse.headers['content-type'] });
                        return URL.createObjectURL(imgBlob);
                    } catch (imgErr) {
                        console.error('Error fetching individual image:', imgErr);
                        return null; // Handle or skip the image if there is an error
                    }
                }));

                // Filter out null values in case of errors in fetching individual images
                setImages(imageUrls.filter(url => url !== null));
                setLoading(false);
            } catch (err) {
                console.error('Error fetching images:', err.response ? err.response.data : err.message);
                setError('Error fetching images');
                setLoading(false);
            }
        };

        fetchImages();

        // Cleanup function to revoke object URLs
        return () => {
            images.forEach(url => URL.revokeObjectURL(url));
        };
    }, [images]);

    if (loading) {
        return <p>Loading images...</p>;
    }

    if (error) {
        return <p>{error}</p>;
    }

    return (
        <div>
            {images.length > 0 ? (
                images.map((imageUrl, index) => (
                    <img key={index} src={imageUrl} alt={`Fetched ${index}`} />
                ))
            ) : (
                <p>No images available</p>
            )}
        </div>
    );
}

export default DisplayImages;
