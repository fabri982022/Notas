package com.ensolvers.backend.service;

import com.ensolvers.backend.dto.CategoryDTO;
import com.ensolvers.backend.model.Note;
import com.ensolvers.backend.dto.NoteDTO;
import com.ensolvers.backend.exception.NoteException;
import com.ensolvers.backend.repository.CategoryRepository;
import com.ensolvers.backend.repository.NoteRepository;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@Slf4j
@Service
@RequiredArgsConstructor
public class NoteService {
    private final NoteRepository noteRepository;
    private final CategoryRepository categoryRepository;

    public List<NoteDTO> findAll(boolean archived, Long categoryId) {
        return noteRepository.findByArchivedOrderByIdDesc(archived).stream()
                .filter(note -> categoryId == null || note.getCategories().stream()
                        .anyMatch(category -> category.getId().equals(categoryId)))
                .map(this::toDto)
                .toList();
    }

    public NoteDTO create(NoteDTO.Request request) {
        validateRequest(request);
        Note note = new Note();
        note.setTitle(request.title().trim());
        note.setContent(request.content() == null ? "" : request.content().trim());
        note.setCategories(new HashSet<>(categoryRepository.findAllById(
                request.categoryIds() == null ? Set.of() : request.categoryIds())));
        log.info("Creando nota: {}", note.getTitle());

        Note savedNote = noteRepository.save(note);
        return toDto(savedNote);
    }

    public NoteDTO update(Long id, NoteDTO.Request request) {
        validateRequest(request);
        Note note = getNote(id);
        note.setTitle(request.title().trim());
        note.setContent(request.content() == null ? "" : request.content().trim());
        note.setCategories(new HashSet<>(categoryRepository.findAllById(
                request.categoryIds() == null ? Set.of() : request.categoryIds())));
        return toDto(noteRepository.save(note));
    }

    private void validateRequest(NoteDTO.Request request) {
        if (request == null || request.title() == null || request.title().isBlank()) {
            throw new NoteException("El título es obligatorio");
        }
    }

    public NoteDTO archive(Long id, boolean archived) {
        Note note = getNote(id);
        note.setArchived(archived);
        return toDto(noteRepository.save(note));
    }

    public void delete(Long id) {
        noteRepository.delete(getNote(id));
    }

    public Note getNote(Long id) {
        return noteRepository.findById(id)
                .orElseThrow(() -> new NoteException("Nota no encontrada"));
    }

    private NoteDTO toDto(Note note) {
        Set<CategoryDTO> categories = note.getCategories().stream()
                .map(category -> new CategoryDTO(category.getId(), category.getName()))
                .collect(Collectors.toSet());
        return new NoteDTO(note.getId(), note.getTitle(), note.getContent(), note.isArchived(), categories);
    }
}