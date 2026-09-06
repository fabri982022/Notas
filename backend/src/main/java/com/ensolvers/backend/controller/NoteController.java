package com.ensolvers.backend.controller;

import com.ensolvers.backend.dto.NoteDTO;
import com.ensolvers.backend.service.NoteService;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.CrossOrigin;

@RestController
@RequestMapping("/api/notes")
@CrossOrigin(origins = "${FRONTEND_URL:http://localhost:5173}")
@RequiredArgsConstructor
public class NoteController {
    private final NoteService noteService;

    @GetMapping
    public List<NoteDTO> findAll(@RequestParam(defaultValue = "false") boolean archived,
            @RequestParam(required = false) Long categoryId) {
        return noteService.findAll(archived, categoryId);
    }

    @PostMapping
    public NoteDTO create(@RequestBody NoteDTO.Request request) {
        return noteService.create(request);
    }

    @PutMapping("/{id}")
    public NoteDTO update(@PathVariable Long id, @RequestBody NoteDTO.Request request) {
        return noteService.update(id, request);
    }

    @PatchMapping("/{id}/archive")
    public NoteDTO archive(@PathVariable Long id, @RequestParam boolean archived) {
        return noteService.archive(id, archived);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Long id) {
        noteService.delete(id);
    }
}
