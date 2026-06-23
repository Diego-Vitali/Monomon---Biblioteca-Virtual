package br.edu.ifsp.biblioteca.model;

import jakarta.persistence.*;
import java.util.List;

@Entity
public class Livro {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;
    
    private String nome;
    private String autor;
    private Integer ano;
    
    @ElementCollection
    private List<String> generos;
    
    private Integer qntd;

    public Livro() {}

    public Integer getId() { return id; }
    public void setId(Integer id) { this.id = id; }

    public String getNome() { return nome; }
    public void setNome(String nome) { this.nome = nome; }

    public String getAutor() { return autor; }
    public void setAutor(String autor) { this.autor = autor; }

    public Integer getAno() { return ano; }
    public void setAno(Integer ano) { this.ano = ano; }

    public List<String> getGeneros() { return generos; }
    public void setGeneros(List<String> generos) { this.generos = generos; }

    public Integer getQntd() { return qntd; }
    public void setQntd(Integer qntd) { this.qntd = qntd; }
}
