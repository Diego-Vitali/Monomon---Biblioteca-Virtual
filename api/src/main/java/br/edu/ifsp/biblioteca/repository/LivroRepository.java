package br.edu.ifsp.biblioteca.repository;

import br.edu.ifsp.biblioteca.model.Livro;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface LivroRepository extends JpaRepository<Livro, Integer> {
    List<Livro> findTop5ByOrderByEmprestimosTotaisDesc();
}
