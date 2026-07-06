package br.edu.ifsp.biblioteca.controller;

import br.edu.ifsp.biblioteca.model.Emprestimo;
import br.edu.ifsp.biblioteca.model.Livro;
import br.edu.ifsp.biblioteca.repository.EmprestimoRepository;
import br.edu.ifsp.biblioteca.repository.LivroRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/emprestimos")
@CrossOrigin(origins = "*")
public class EmprestimoController {

    @Autowired
    private EmprestimoRepository repository;
    
    @Autowired
    private LivroRepository livroRepository;

    @GetMapping
    public List<Emprestimo> listarTodos() {
        return repository.findAll();
    }

    @PostMapping
    public ResponseEntity<?> criar(@RequestBody Emprestimo emprestimo) {
        if (emprestimo.getLivroId() == null || emprestimo.getUsuarioId() == null) {
            return ResponseEntity.badRequest().body("Livro ou Usuário não especificado");
        }
        
        Optional<Livro> livroOpt = livroRepository.findById(emprestimo.getLivroId());
        if (livroOpt.isEmpty()) {
            return ResponseEntity.badRequest().body("Livro não encontrado");
        }
        
        Livro livro = livroOpt.get();
        if (livro.getQntd() != null && livro.getQntd() <= 0) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body("Livro sem estoque");
        }

        // 1. Um usuário só pode pegar um livro especifico emprestado uma única vez (se não devolveu ainda)
        List<Emprestimo> historico = repository.findAll();
        boolean jaPossui = historico.stream().anyMatch(e -> 
            e.getUsuarioId().equals(emprestimo.getUsuarioId()) && 
            e.getLivroId().equals(emprestimo.getLivroId()) && 
            !String.valueOf(e.getStatus()).equalsIgnoreCase("Devolvido")
        );
        if (jaPossui) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Você já possui um pedido ou empréstimo ativo para este livro.");
        }

        // 2. A quantidade máxima de dias deve ser respeitada
        int diasMaximos = (livro.getDiasMaximos() != null && livro.getDiasMaximos() > 0) ? livro.getDiasMaximos() : 15; // default 15 if not set
        int diasDesejados = (emprestimo.getDiasDesejados() != null && emprestimo.getDiasDesejados() > 0) ? emprestimo.getDiasDesejados() : diasMaximos;
        
        if (diasDesejados > diasMaximos) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("A quantidade de dias desejados (" + diasDesejados + ") excede o máximo permitido (" + diasMaximos + ").");
        }
        emprestimo.setDiasDesejados(diasDesejados);
        
        // Diminui o estoque (reservado no PENDENTE)
        if (livro.getQntd() != null) {
            livro.setQntd(livro.getQntd() - 1);
        }
        livroRepository.save(livro);

        emprestimo.setDataEmprestimo(LocalDateTime.now());
        emprestimo.setStatus("PENDENTE");
        
        return ResponseEntity.status(HttpStatus.CREATED).body(repository.save(emprestimo));
    }
    
    @PutMapping("/{id}/aceitar")
    public ResponseEntity<?> aceitar(@PathVariable Integer id) {
        Optional<Emprestimo> empOpt = repository.findById(id);
        if (empOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        
        Emprestimo emprestimo = empOpt.get();
        if (!"PENDENTE".equalsIgnoreCase(emprestimo.getStatus())) {
            return ResponseEntity.badRequest().body("Empréstimo não está PENDENTE");
        }
        
        emprestimo.setStatus("EMPRESTADO");
        if (emprestimo.getDiasDesejados() != null) {
            emprestimo.setDataMaximaDevolucao(LocalDateTime.now().plusDays(emprestimo.getDiasDesejados()));
        } else {
            emprestimo.setDataMaximaDevolucao(LocalDateTime.now().plusDays(15));
        }

        // Aumenta o ranking do livro quando for realmente aceito
        if (emprestimo.getLivroId() != null) {
            Optional<Livro> livroOpt = livroRepository.findById(emprestimo.getLivroId());
            if (livroOpt.isPresent()) {
                Livro livro = livroOpt.get();
                if (livro.getEmprestimosTotais() == null) livro.setEmprestimosTotais(0);
                livro.setEmprestimosTotais(livro.getEmprestimosTotais() + 1);
                livroRepository.save(livro);
            }
        }
        
        return ResponseEntity.ok(repository.save(emprestimo));
    }
    
    @PutMapping("/{id}/devolver")
    public ResponseEntity<?> devolver(@PathVariable Integer id) {
        Optional<Emprestimo> empOpt = repository.findById(id);
        if (empOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        
        Emprestimo emprestimo = empOpt.get();
        if ("Devolvido".equals(emprestimo.getStatus())) {
            return ResponseEntity.badRequest().body("Empréstimo já devolvido");
        }
        
        emprestimo.setStatus("Devolvido");
        emprestimo.setDataDevolucao(LocalDateTime.now());
        
        // Devolve o livro ao estoque
        if (emprestimo.getLivroId() != null) {
            Optional<Livro> livroOpt = livroRepository.findById(emprestimo.getLivroId());
            if (livroOpt.isPresent()) {
                Livro livro = livroOpt.get();
                if (livro.getQntd() != null) {
                    livro.setQntd(livro.getQntd() + 1);
                    livroRepository.save(livro);
                }
            }
        }
        
        return ResponseEntity.ok(repository.save(emprestimo));
    }
}
