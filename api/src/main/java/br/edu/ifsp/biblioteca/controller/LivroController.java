package br.edu.ifsp.biblioteca.controller;

import br.edu.ifsp.biblioteca.model.Livro;
import br.edu.ifsp.biblioteca.model.Autor;
import br.edu.ifsp.biblioteca.repository.LivroRepository;
import br.edu.ifsp.biblioteca.repository.AutorRepository;
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

    @Autowired
    private LivroRepository repository;

    @Autowired
    private AutorRepository autorRepository;

    @GetMapping
    public ResponseEntity<List<Livro>> listarTodos() {
        return ResponseEntity.ok(repository.findAll());
    }
    
    @GetMapping("/ranking/recomendados")
    public ResponseEntity<List<Livro>> listarRecomendados() {
        return ResponseEntity.ok(repository.findTop5ByOrderByEmprestimosTotaisDesc());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Livro> buscarPorId(@PathVariable Integer id) {
        Optional<Livro> livro = repository.findById(id);
        if (livro.isPresent()) {
            return ResponseEntity.ok(livro.get());
        }
        return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
    }
    
    private void tratarAutor(Livro livro) {
        if (livro.getAutorNome() != null && !livro.getAutorNome().trim().isEmpty()) {
            Optional<Autor> autorOpt = autorRepository.findByNome(livro.getAutorNome());
            if (autorOpt.isPresent()) {
                livro.setAutorId(autorOpt.get().getId());
            } else {
                Autor novoAutor = new Autor();
                novoAutor.setNome(livro.getAutorNome());
                Autor salvo = autorRepository.save(novoAutor);
                livro.setAutorId(salvo.getId());
            }
        }
    }

    @PostMapping
    public ResponseEntity<Livro> criar(@RequestBody Livro livro) {
        tratarAutor(livro);
        if (livro.getEmprestimosTotais() == null) livro.setEmprestimosTotais(0);
        Livro salvo = repository.save(livro);
        return ResponseEntity.status(HttpStatus.CREATED).body(salvo);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Livro> atualizar(@PathVariable Integer id, @RequestBody Livro livroAtualizado) {
        Optional<Livro> existente = repository.findById(id);
        if (existente.isPresent()) {
            Livro livro = existente.get();
            tratarAutor(livroAtualizado);
            
            livro.setNome(livroAtualizado.getNome());
            if (livroAtualizado.getAutorId() != null) {
                livro.setAutorId(livroAtualizado.getAutorId());
            }
            livro.setEditoraId(livroAtualizado.getEditoraId());
            livro.setAno(livroAtualizado.getAno());
            livro.setGeneros(livroAtualizado.getGeneros());
            livro.setQntd(livroAtualizado.getQntd());
            livro.setDiasMaximos(livroAtualizado.getDiasMaximos());
            livro.setCapaUrl(livroAtualizado.getCapaUrl());
            
            repository.save(livro);
            return ResponseEntity.ok(livro);
        }
        return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> excluir(@PathVariable Integer id) {
        Optional<Livro> existente = repository.findById(id);
        if (existente.isPresent()) {
            repository.deleteById(id);
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
    }
}
