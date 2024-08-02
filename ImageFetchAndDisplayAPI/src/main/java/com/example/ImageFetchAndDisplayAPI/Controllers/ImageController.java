package com.example.ImageFetchAndDisplayAPI.Controllers;

import com.example.ImageFetchAndDisplayAPI.Models.Image;
import com.example.ImageFetchAndDisplayAPI.Service.ImageService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Optional;

@RestController
@RequestMapping("/images")
public class ImageController {

    private static final Logger logger = LoggerFactory.getLogger(ImageController.class);

    @Autowired
    private ImageService imageService;

    @PostMapping("/upload")
    public ResponseEntity<String> uploadImage(
            @RequestParam("file") MultipartFile file,
            @RequestParam("name") String name,
            @RequestParam("type") String type) {

        if (file.isEmpty() || name.isEmpty() || type.isEmpty()) {
            logger.warn("File, name, or type is empty");
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("File, name, or type is empty");
        }

        try {
            imageService.saveImage(file, name, type);
            logger.info("Image uploaded successfully");
            return ResponseEntity.ok("Image uploaded successfully");
        } catch (IOException e) {
            logger.error("Image upload failed: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Image upload failed: " + e.getMessage());
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<ByteArrayResource> getImage(@PathVariable Long id) {
        logger.info("Fetching image with ID: {}", id);
        Optional<Image> image = imageService.getImage(id);
        if (image.isPresent()) {
            Image img = image.get();
            return ResponseEntity.ok()
                    .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + img.getName() + "\"")
                    .body(new ByteArrayResource(img.getImage()));
        } else {
            logger.warn("Image not found with ID: {}", id);
            return ResponseEntity.notFound().build();
        }
    }
}
