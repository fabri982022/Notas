package com.ensolvers.backend.dto;

import java.util.Set;

public record NoteDTO(Long id, String title, String content, boolean archived, Set<CategoryDTO> categories) {
    public record Request(String title, String content, Set<Long> categoryIds) {
    }

}
