package br.edu.ifsp.biblioteca.repository;

import br.edu.ifsp.biblioteca.model.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UsuarioRepository extends JpaRepository<Usuario, Integer> {
}
