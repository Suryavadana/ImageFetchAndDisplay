package com.example.ImageFetchAndDisplayAPI.Repository;

import com.example.ImageFetchAndDisplayAPI.Models.Image;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ImageRepository extends JpaRepository<Image, Long> {
}
