package br.edu.ifsp.biblioteca.model;

import jakarta.persistence.*;
import java.util.List;

@Entity
public class Livro {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;
    
    private String nome;
    
    private Integer autorId;
    
    private Integer editoraId;
    
    private Integer ano;
    
    private String generos;
    
    private Integer qntd;

    private Integer emprestimosTotais = 0;

    public Livro() {}

    public Integer getId() { return id; }
    public void setId(Integer id) { this.id = id; }

    public String getNome() { return nome; }
    public void setNome(String nome) { this.nome = nome; }

    public Integer getAutorId() { return autorId; }
    public void setAutorId(Integer autorId) { this.autorId = autorId; }

    public Integer getEditoraId() { return editoraId; }
    public void setEditoraId(Integer editoraId) { this.editoraId = editoraId; }

    public Integer getAno() { return ano; }
    public void setAno(Integer ano) { this.ano = ano; }

    public String getGeneros() { return generos; }
    public void setGeneros(String generos) { this.generos = generos; }

    public Integer getQntd() { return qntd; }
    public void setQntd(Integer qntd) { this.qntd = qntd; }

    public Integer getEmprestimosTotais() { return emprestimosTotais; }
    public void setEmprestimosTotais(Integer emprestimosTotais) { this.emprestimosTotais = emprestimosTotais; }

    private Integer diasMaximos;
    public Integer getDiasMaximos() { return diasMaximos; }
    public void setDiasMaximos(Integer diasMaximos) { this.diasMaximos = diasMaximos; }

    private String capaUrl;
    public String getCapaUrl() { return capaUrl; }
    public void setCapaUrl(String capaUrl) { this.capaUrl = capaUrl; }

    @Transient
    private String autorNome;

    public String getAutorNome() { return autorNome; }
    public void setAutorNome(String autorNome) { this.autorNome = autorNome; }
}
