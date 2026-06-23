package br.edu.ifsp.biblioteca.controller;

import br.edu.ifsp.biblioteca.model.Emprestimo;
import br.edu.ifsp.biblioteca.repository.EmprestimoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/emprestimos")
@CrossOrigin(origins = "*")
public class EmprestimoController {

    @Autowired
    private EmprestimoRepository repository;

    @GetMapping
    public List<Emprestimo> listarTodos() {
        return repository.findAll();
    }

    @PostMapping
    public Emprestimo criar(@RequestBody Emprestimo emprestimo) {
        if (emprestimo.getDataEmprestimo() == null) {
            emprestimo.setDataEmprestimo(LocalDateTime.now());
        }
        if (emprestimo.getStatus() == null) {
            emprestimo.setStatus("Pendente");
        }
        return repository.save(emprestimo);
    }
}
