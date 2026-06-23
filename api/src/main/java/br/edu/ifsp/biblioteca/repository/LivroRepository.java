package br.edu.ifsp.biblioteca.repository;

import br.edu.ifsp.biblioteca.model.Livro;
import org.springframework.data.jpa.repository.JpaRepository;

public interface LivroRepository extends JpaRepository<Livro, Integer> {
}
