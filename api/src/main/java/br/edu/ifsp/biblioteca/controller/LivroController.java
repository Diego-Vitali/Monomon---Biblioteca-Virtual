package br.edu.ifsp.biblioteca.controller;

import br.edu.ifsp.biblioteca.model.Livro;
import br.edu.ifsp.biblioteca.service.LivroService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/livros")
@CrossOrigin(origins = "*")
public class LivroController {

    private final LivroService service;

    @Autowired
    public LivroController(LivroService service) {
        this.service = service;
    }

    @GetMapping
    public ResponseEntity<List<Livro>> listarTodos() {
        return ResponseEntity.ok(service.listarTodos());
    }
    
    @GetMapping("/ranking/recomendados")
    public ResponseEntity<List<Livro>> listarRecomendados() {
        return ResponseEntity.ok(service.listarRecomendados());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Livro> buscarPorId(@PathVariable Integer id) {
        Optional<Livro> livro = service.buscarPorId(id);
        return livro.map(ResponseEntity::ok)
                    .orElseGet(() -> ResponseEntity.status(HttpStatus.NOT_FOUND).build());
    }
    
    @PostMapping
    public ResponseEntity<Livro> criar(@RequestBody Livro livro) {
        Livro salvo = service.criar(livro);
        return ResponseEntity.status(HttpStatus.CREATED).body(salvo);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Livro> atualizar(@PathVariable Integer id, @RequestBody Livro livroAtualizado) {
        Optional<Livro> atualizado = service.atualizar(id, livroAtualizado);
        return atualizado.map(ResponseEntity::ok)
                         .orElseGet(() -> ResponseEntity.status(HttpStatus.NOT_FOUND).build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> excluir(@PathVariable Integer id) {
        boolean excluido = service.excluir(id);
        if (excluido) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
    }
}
