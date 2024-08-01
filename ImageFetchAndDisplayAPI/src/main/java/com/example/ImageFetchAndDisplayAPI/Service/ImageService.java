package com.example.ImageFetchAndDisplayAPI.Service;

import com.example.ImageFetchAndDisplayAPI.Models.Image;
import com.example.ImageFetchAndDisplayAPI.Repository.ImageRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Optional;

@Service
public class ImageService {

    private static final Logger logger = LoggerFactory.getLogger(ImageService.class);

    @Autowired
    private ImageRepository imageRepository;

    public Image saveImage(MultipartFile file) throws IOException {
        logger.info("Saving image: {}", file.getOriginalFilename());
        logger.info("File size: {} bytes", file.getSize());

        if (file.getSize() > 50 * 1024 * 1024) { // Example limit of 50 MB
            logger.warn("File size exceeds the maximum limit: {} bytes", file.getSize());
            throw new IOException("File size exceeds the maximum limit.");
        }

        Image image = new Image();
        image.setName(file.getOriginalFilename());
        image.setType(file.getContentType());

        byte[] imageBytes = file.getBytes();
        logger.info("Byte array length: {}", imageBytes.length);

        image.setImage(imageBytes);

        try {
            Image savedImage = imageRepository.save(image);
            logger.info("Image saved successfully with ID: {}", savedImage.getId());
            return savedImage;
        } catch (Exception e) {
            logger.error("Failed to save image: {}", file.getOriginalFilename(), e);
            throw new IOException("Failed to save image: " + e.getMessage(), e);
        }
    }

    public Optional<Image> getImage(Long id) {
        logger.info("Retrieving image with ID: {}", id);
        try {
            Optional<Image> image = imageRepository.findById(id);
            if (image.isPresent()) {
                logger.info("Image found with ID: {}", id);
            } else {
                logger.warn("No image found with ID: {}", id);
            }
            return image;
        } catch (Exception e) {
            logger.error("Error retrieving image with ID: {}", id, e);
            throw new RuntimeException("Failed to retrieve image", e);
        }
    }
}
