package br.edu.ifsp.biblioteca.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
public class Emprestimo {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;
    
    private Integer livroId;
    
    private Integer usuarioId;
    
    private LocalDateTime dataEmprestimo;
    private LocalDateTime dataMaximaDevolucao;
    private LocalDateTime dataDevolucao;
    
    private String status; // Pendente, Emprestado, Atrasado, Devolvido

    public Emprestimo() {}

    public Integer getId() { return id; }
    public void setId(Integer id) { this.id = id; }

    public Integer getLivroId() { return livroId; }
    public void setLivroId(Integer livroId) { this.livroId = livroId; }

    public Integer getUsuarioId() { return usuarioId; }
    public void setUsuarioId(Integer usuarioId) { this.usuarioId = usuarioId; }

    public LocalDateTime getDataEmprestimo() { return dataEmprestimo; }
    public void setDataEmprestimo(LocalDateTime dataEmprestimo) { this.dataEmprestimo = dataEmprestimo; }

    public LocalDateTime getDataMaximaDevolucao() { return dataMaximaDevolucao; }
    public void setDataMaximaDevolucao(LocalDateTime dataMaximaDevolucao) { this.dataMaximaDevolucao = dataMaximaDevolucao; }

    public LocalDateTime getDataDevolucao() { return dataDevolucao; }
    public void setDataDevolucao(LocalDateTime dataDevolucao) { this.dataDevolucao = dataDevolucao; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
}
