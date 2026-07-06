package br.edu.ifsp.biblioteca.controller;

import br.edu.ifsp.biblioteca.model.Emprestimo;
import br.edu.ifsp.biblioteca.service.EmprestimoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/emprestimos")
@CrossOrigin(origins = "*")
public class EmprestimoController {

    private final EmprestimoService service;

    @Autowired
    public EmprestimoController(EmprestimoService service) {
        this.service = service;
    }

    @GetMapping
    public List<Emprestimo> listarTodos() {
        return service.listarTodos();
    }

    @PostMapping
    public ResponseEntity<?> criar(@RequestBody Emprestimo emprestimo) {
        try {
            Emprestimo salvo = service.criar(emprestimo);
            return ResponseEntity.status(HttpStatus.CREATED).body(salvo);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (IllegalStateException e) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(e.getMessage());
        } catch (SecurityException e) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(e.getMessage());
        }
    }
    
    @PutMapping("/{id}/aceitar")
    public ResponseEntity<?> aceitar(@PathVariable Integer id) {
        try {
            Emprestimo aceito = service.aceitar(id);
            return ResponseEntity.ok(aceito);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (RuntimeException e) {
            if ("NOT_FOUND".equals(e.getMessage())) {
                return ResponseEntity.notFound().build();
            }
            throw e;
        }
    }
    
    @PutMapping("/{id}/devolver")
    public ResponseEntity<?> devolver(@PathVariable Integer id) {
        try {
            Emprestimo devolvido = service.devolver(id);
            return ResponseEntity.ok(devolvido);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (RuntimeException e) {
            if ("NOT_FOUND".equals(e.getMessage())) {
                return ResponseEntity.notFound().build();
            }
            throw e;
        }
    }
}
