package com.ensolvers.backend.repository;

import com.ensolvers.backend.model.Note;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;

public interface NoteRepository extends JpaRepository<Note, Long> {
    @EntityGraph(attributePaths = "categories")
    List<Note> findByArchivedOrderByIdDesc(boolean archived);

    @EntityGraph(attributePaths = "categories")
    Optional<Note> findById(Long id);
}
