package br.edu.ifsp.biblioteca.controller;

import br.edu.ifsp.biblioteca.model.Livro;
import br.edu.ifsp.biblioteca.repository.LivroRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/livros")
@CrossOrigin(origins = "*")
public class LivroController {

    @Autowired
    private LivroRepository repository;

    @GetMapping
    public List<Livro> listarTodos() {
        return repository.findAll();
    }

    @PostMapping
    public Livro criar(@RequestBody Livro livro) {
        return repository.save(livro);
    }
}
