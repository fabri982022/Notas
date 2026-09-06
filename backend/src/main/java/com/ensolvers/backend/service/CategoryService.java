package com.ensolvers.backend.service;

import com.ensolvers.backend.dto.CategoryDTO;
import com.ensolvers.backend.exception.NoteException;
import com.ensolvers.backend.model.Category;
import com.ensolvers.backend.repository.CategoryRepository;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class CategoryService {
    private final CategoryRepository categoryRepository;

    public List<CategoryDTO> findAll() {
        return categoryRepository.findAll().stream()
                .map(category -> new CategoryDTO(category.getId(), category.getName()))
                .toList();
    }

    public CategoryDTO create(String name) {
        if (name == null || name.isBlank()) {
            throw new NoteException("El nombre es obligatorio");
        }

        String normalizedName = name.trim();
        if (categoryRepository.findByNameIgnoreCase(normalizedName).isPresent()) {
            throw new NoteException("La categoría ya existe");
        }

        Category category = new Category();
        category.setName(normalizedName);
        Category saved = categoryRepository.save(category);

        return new CategoryDTO(saved.getId(), saved.getName());
    }
}