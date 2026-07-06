package br.edu.ifsp.biblioteca.repository;

import br.edu.ifsp.biblioteca.model.Autor;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface AutorRepository extends JpaRepository<Autor, Integer> {
    Optional<Autor> findByNome(String nome);
}
