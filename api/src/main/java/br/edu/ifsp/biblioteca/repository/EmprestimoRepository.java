package br.edu.ifsp.biblioteca.repository;

import br.edu.ifsp.biblioteca.model.Emprestimo;
import org.springframework.data.jpa.repository.JpaRepository;

public interface EmprestimoRepository extends JpaRepository<Emprestimo, Integer> {
}
