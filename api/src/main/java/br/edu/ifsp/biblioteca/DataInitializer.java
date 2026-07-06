package br.edu.ifsp.biblioteca;

import br.edu.ifsp.biblioteca.model.Livro;
import br.edu.ifsp.biblioteca.model.Usuario;
import br.edu.ifsp.biblioteca.repository.UsuarioRepository;
import br.edu.ifsp.biblioteca.service.LivroService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.util.Optional;

@Component
public class DataInitializer implements CommandLineRunner {

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private LivroService livroService;

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

        // Criar livros padrões (que também criam os autores correspondentes)
        if (livroService.listarTodos().isEmpty()) {
            Livro l1 = new Livro();
            l1.setNome("Neuromancer");
            l1.setAutorNome("William Gibson");
            l1.setAno(1984);
            l1.setGeneros("Ficção Científica");
            l1.setQntd(5);
            l1.setDiasMaximos(14);
            l1.setCapaUrl("https://upload.wikimedia.org/wikipedia/pt/2/23/Neuromancer_Capa_Brasil.jpg");
            livroService.criar(l1);

            Livro l2 = new Livro();
            l2.setNome("Sapiens: Uma Breve História da Humanidade");
            l2.setAutorNome("Yuval Noah Harari");
            l2.setAno(2011);
            l2.setGeneros("História");
            l2.setQntd(10);
            l2.setDiasMaximos(21);
            l2.setCapaUrl("https://m.media-amazon.com/images/I/71R2cEhtX-L._AC_UF1000,1000_QL80_.jpg");
            livroService.criar(l2);
            
            Livro l3 = new Livro();
            l3.setNome("O Senhor dos Anéis: A Sociedade do Anel");
            l3.setAutorNome("J.R.R. Tolkien");
            l3.setAno(1954);
            l3.setGeneros("Fantasia");
            l3.setQntd(7);
            l3.setDiasMaximos(14);
            l3.setCapaUrl("https://m.media-amazon.com/images/I/81h9m6A6V-L._AC_UF1000,1000_QL80_.jpg");
            livroService.criar(l3);
            
            Livro l4 = new Livro();
            l4.setNome("1984");
            l4.setAutorNome("George Orwell");
            l4.setAno(1949);
            l4.setGeneros("Distopia");
            l4.setQntd(8);
            l4.setDiasMaximos(14);
            l4.setCapaUrl("https://m.media-amazon.com/images/I/819js3EQwbL._AC_UF1000,1000_QL80_.jpg");
            livroService.criar(l4);
        }
    }
}
