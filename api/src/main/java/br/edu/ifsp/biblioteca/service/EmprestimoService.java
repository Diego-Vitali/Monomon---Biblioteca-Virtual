package br.edu.ifsp.biblioteca.service;

import br.edu.ifsp.biblioteca.model.Emprestimo;
import br.edu.ifsp.biblioteca.model.Livro;
import br.edu.ifsp.biblioteca.repository.EmprestimoRepository;
import br.edu.ifsp.biblioteca.repository.LivroRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class EmprestimoService {

    private final EmprestimoRepository emprestimoRepository;
    private final LivroRepository livroRepository;

    @Autowired
    public EmprestimoService(EmprestimoRepository emprestimoRepository, LivroRepository livroRepository) {
        this.emprestimoRepository = emprestimoRepository;
        this.livroRepository = livroRepository;
    }

    public List<Emprestimo> listarTodos() {
        return emprestimoRepository.findAll();
    }

    public Emprestimo criar(Emprestimo emprestimo) {
        if (emprestimo.getLivroId() == null || emprestimo.getUsuarioId() == null) {
            throw new IllegalArgumentException("Livro ou Usuário não especificado");
        }

        Optional<Livro> livroOpt = livroRepository.findById(emprestimo.getLivroId());
        if (livroOpt.isEmpty()) {
            throw new IllegalArgumentException("Livro não encontrado");
        }

        Livro livro = livroOpt.get();
        if (livro.getQntd() != null && livro.getQntd() <= 0) {
            throw new IllegalStateException("Livro sem estoque");
        }

        // Verifica se o usuário já possui um empréstimo ativo para este livro
        List<Emprestimo> historico = emprestimoRepository.findAll();
        boolean jaPossui = historico.stream().anyMatch(e -> 
            e.getUsuarioId().equals(emprestimo.getUsuarioId()) && 
            e.getLivroId().equals(emprestimo.getLivroId()) && 
            !String.valueOf(e.getStatus()).equalsIgnoreCase("Devolvido")
        );
        if (jaPossui) {
            throw new SecurityException("Você já possui um pedido ou empréstimo ativo para este livro.");
        }

        int diasMaximos = (livro.getDiasMaximos() != null && livro.getDiasMaximos() > 0) ? livro.getDiasMaximos() : 15;
        int diasDesejados = (emprestimo.getDiasDesejados() != null && emprestimo.getDiasDesejados() > 0) ? emprestimo.getDiasDesejados() : diasMaximos;

        if (diasDesejados > diasMaximos) {
            throw new IllegalArgumentException("A quantidade de dias desejados (" + diasDesejados + ") excede o máximo permitido (" + diasMaximos + ").");
        }
        emprestimo.setDiasDesejados(diasDesejados);

        if (livro.getQntd() != null) {
            livro.setQntd(livro.getQntd() - 1);
        }
        livroRepository.save(livro);

        emprestimo.setDataEmprestimo(LocalDateTime.now());
        emprestimo.setStatus("PENDENTE");

        return emprestimoRepository.save(emprestimo);
    }

    public Emprestimo aceitar(Integer id) {
        Optional<Emprestimo> empOpt = emprestimoRepository.findById(id);
        if (empOpt.isEmpty()) {
            throw new RuntimeException("NOT_FOUND");
        }

        Emprestimo emprestimo = empOpt.get();
        if (!"PENDENTE".equalsIgnoreCase(emprestimo.getStatus())) {
            throw new IllegalArgumentException("Empréstimo não está PENDENTE");
        }

        emprestimo.setStatus("EMPRESTADO");
        if (emprestimo.getDiasDesejados() != null) {
            emprestimo.setDataMaximaDevolucao(LocalDateTime.now().plusDays(emprestimo.getDiasDesejados()));
        } else {
            emprestimo.setDataMaximaDevolucao(LocalDateTime.now().plusDays(15));
        }

        if (emprestimo.getLivroId() != null) {
            Optional<Livro> livroOpt = livroRepository.findById(emprestimo.getLivroId());
            if (livroOpt.isPresent()) {
                Livro livro = livroOpt.get();
                if (livro.getEmprestimosTotais() == null) livro.setEmprestimosTotais(0);
                livro.setEmprestimosTotais(livro.getEmprestimosTotais() + 1);
                livroRepository.save(livro);
            }
        }

        return emprestimoRepository.save(emprestimo);
    }

    public Emprestimo devolver(Integer id) {
        Optional<Emprestimo> empOpt = emprestimoRepository.findById(id);
        if (empOpt.isEmpty()) {
            throw new RuntimeException("NOT_FOUND");
        }

        Emprestimo emprestimo = empOpt.get();
        if ("Devolvido".equalsIgnoreCase(emprestimo.getStatus())) {
            throw new IllegalArgumentException("Empréstimo já devolvido");
        }

        emprestimo.setStatus("Devolvido");
        emprestimo.setDataDevolucao(LocalDateTime.now());

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

        return emprestimoRepository.save(emprestimo);
    }
}
