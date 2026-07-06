package br.edu.ifsp.biblioteca.controller;

import br.edu.ifsp.biblioteca.model.Usuario;
import br.edu.ifsp.biblioteca.repository.UsuarioRepository;
import br.edu.ifsp.biblioteca.service.JwtService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/auth")
@CrossOrigin(origins = "*")
public class AuthController {

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private JwtService jwtService;

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> credenciais) {
        String email = credenciais.get("email");
        String senha = credenciais.get("senha");

        Optional<Usuario> usuarioOpt = usuarioRepository.findByEmail(email);

        if (usuarioOpt.isPresent()) {
            Usuario usuario = usuarioOpt.get();
            // Validação de senha simples e direta para fins didáticos (sem Bcrypt)
            if (usuario.getSenha().equals(senha)) {
                String token = jwtService.generateToken(usuario.getId(), usuario.getTipo());
                Map<String, Object> response = new HashMap<>();
                response.put("token", token);
                response.put("usuario", usuario);
                return ResponseEntity.ok(response);
            }
        }
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Credenciais inválidas");
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody Usuario novoUsuario) {
        Optional<Usuario> existente = usuarioRepository.findByEmail(novoUsuario.getEmail());
        if (existente.isPresent()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("E-mail já cadastrado");
        }

        // Se o tipo não for passado, assume USER
        if (novoUsuario.getTipo() == null || novoUsuario.getTipo().isEmpty()) {
            novoUsuario.setTipo("USER");
        }

        Usuario salvo = usuarioRepository.save(novoUsuario);
        String token = jwtService.generateToken(salvo.getId(), salvo.getTipo());
        
        Map<String, Object> response = new HashMap<>();
        response.put("token", token);
        response.put("usuario", salvo);

        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping("/usuarios")
    public ResponseEntity<?> listarUsuarios() {
        return ResponseEntity.ok(usuarioRepository.findAll());
    }
}
