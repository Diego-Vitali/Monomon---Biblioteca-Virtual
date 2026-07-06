package br.edu.ifsp.biblioteca;

import br.edu.ifsp.biblioteca.model.Autor;
import br.edu.ifsp.biblioteca.model.Usuario;
import br.edu.ifsp.biblioteca.repository.AutorRepository;
import br.edu.ifsp.biblioteca.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.util.Optional;

@Component
public class DataInitializer implements CommandLineRunner {

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private AutorRepository autorRepository;

    @Override
    public void run(String... args) throws Exception {
        // Criar usuário admin padrão
        Optional<Usuario> adminOpt = usuarioRepository.findByEmail("admin@admin.com");
        if (adminOpt.isEmpty()) {
            Usuario admin = new Usuario();
            admin.setNome("Administrador do Sistema");
            admin.setEmail("admin@admin.com");
            admin.setSenha("admin123");
            admin.setTipo("ADMIN");
            usuarioRepository.save(admin);
        }

        // Criar alguns autores padrões para a busca
        if (autorRepository.count() == 0) {
            Autor a1 = new Autor();
            a1.setNome("William Gibson");
            autorRepository.save(a1);

            Autor a2 = new Autor();
            a2.setNome("Yuval Noah Harari");
            autorRepository.save(a2);
            
            Autor a3 = new Autor();
            a3.setNome("J.R.R. Tolkien");
            autorRepository.save(a3);
            
            Autor a4 = new Autor();
            a4.setNome("George Orwell");
            autorRepository.save(a4);
        }
    }
}
