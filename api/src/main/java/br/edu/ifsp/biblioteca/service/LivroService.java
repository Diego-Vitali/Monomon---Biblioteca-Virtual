package br.edu.ifsp.biblioteca.service;

import br.edu.ifsp.biblioteca.model.Autor;
import br.edu.ifsp.biblioteca.model.Livro;
import br.edu.ifsp.biblioteca.repository.AutorRepository;
import br.edu.ifsp.biblioteca.repository.LivroRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class LivroService {

    private final LivroRepository livroRepository;
    private final AutorRepository autorRepository;

    @Autowired
    public LivroService(LivroRepository livroRepository, AutorRepository autorRepository) {
        this.livroRepository = livroRepository;
        this.autorRepository = autorRepository;
    }

    public List<Livro> listarTodos() {
        return livroRepository.findAll();
    }

    public List<Livro> listarRecomendados() {
        return livroRepository.findTop5ByOrderByEmprestimosTotaisDesc();
    }

    public Optional<Livro> buscarPorId(Integer id) {
        return livroRepository.findById(id);
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

    public Livro criar(Livro livro) {
        tratarAutor(livro);
        if (livro.getEmprestimosTotais() == null) {
            livro.setEmprestimosTotais(0);
        }
        return livroRepository.save(livro);
    }

    public Optional<Livro> atualizar(Integer id, Livro livroAtualizado) {
        Optional<Livro> existente = livroRepository.findById(id);
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
            
            return Optional.of(livroRepository.save(livro));
        }
        return Optional.empty();
    }

    public boolean excluir(Integer id) {
        if (livroRepository.findById(id).isPresent()) {
            livroRepository.deleteById(id);
            return true;
        }
        return false;
    }
}
