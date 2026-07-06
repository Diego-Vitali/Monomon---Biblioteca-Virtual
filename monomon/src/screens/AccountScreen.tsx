import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert, KeyboardAvoidingView, Platform, ScrollView } from "react-native";
import { StatusBar } from "expo-status-bar";
import { FontAwesome } from '@expo/vector-icons';
import { useRouter } from "expo-router";
import { COLORS } from "./authStyles";
import BottomNav from "../components/BottomNav";
import { api } from "../services/api";
import { GlobalStore } from "../services/store";

export default function AccountScreen() {
  const router = useRouter();

  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [loading, setLoading] = useState(false);
  const [userRole, setUserRole] = useState("USER");
  
  const [meusEmprestimos, setMeusEmprestimos] = useState<any[]>([]);
  const [pendentes, setPendentes] = useState<any[]>([]);
  const [todosEmprestimos, setTodosEmprestimos] = useState<any[]>([]);
  
  const [livros, setLivros] = useState<any[]>([]);
  const [usuarios, setUsuarios] = useState<any[]>([]);

  useEffect(() => {
    carregarUsuarioEEprestimos();
  }, []);

  const carregarUsuarioEEprestimos = async () => {
    if (GlobalStore.user && GlobalStore.user.tipo) {
      setUserRole(GlobalStore.user.tipo);
    }
    
    if (!GlobalStore.user) return;
    
    try {
      const [resEmp, resLivros, resUsers] = await Promise.all([
        api.get("/emprestimos"),
        api.get("/livros"),
        api.get("/auth/usuarios").catch(() => ({ data: [] }))
      ]);

      const todos = resEmp.data || [];
      setLivros(resLivros.data || []);
      setUsuarios(resUsers.data || []);
      
      const meus = todos.filter((e: any) => e.usuarioId === GlobalStore.user.id);
      setMeusEmprestimos(meus);

      if (GlobalStore.user.tipo === "ADMIN") {
         const pend = todos.filter((e: any) => String(e.status).toUpperCase() === "PENDENTE");
         setPendentes(pend);
         
         const ativosDeOutros = todos.filter((e: any) => String(e.status).toUpperCase() !== "DEVOLVIDO");
         setTodosEmprestimos(ativosDeOutros);
      }
    } catch (error) {
      console.log("Erro ao carregar dados na conta", error);
    }
  };

  const getLivroNome = (id: number) => {
    const l = livros.find(x => x.id === id);
    return l ? l.nome : `Livro ID: ${id}`;
  };

  const getUsuarioNome = (id: number) => {
    const u = usuarios.find(x => x.id === id);
    return u ? u.nome : `Usuário ID: ${id}`;
  };
  
  const getStatusBadge = (emp: any) => {
    let statusText = String(emp.status).toUpperCase();
    let bgColor = "#6b7280"; // Gray default (Devolvido)
    
    if (statusText === "PENDENTE") bgColor = "#eab308";
    if (statusText === "EMPRESTADO") {
       bgColor = "#22c55e"; // Green
       if (emp.dataMaximaDevolucao && new Date(emp.dataMaximaDevolucao) < new Date()) {
           statusText = "ATRASADO";
           bgColor = "#ef4444"; // Red
       }
    }
    
    return (
      <View style={{ backgroundColor: bgColor, paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4, alignSelf: 'flex-start', marginTop: 4 }}>
         <Text style={{ color: "#fff", fontSize: 8, fontWeight: "bold" }}>{statusText}</Text>
      </View>
    );
  };

  const handleCreateAdmin = async () => {
    if (!nome || !email || !senha) {
      Alert.alert("Erro", "Preencha todos os campos.");
      return;
    }

    setLoading(true);
    try {
      await api.post("/auth/register", {
        nome,
        email,
        senha,
        tipo: "ADMIN",
      });
      Alert.alert("Sucesso", "Novo Administrador criado com sucesso!");
      setNome("");
      setEmail("");
      setSenha("");
    } catch (error) {
      Alert.alert("Erro", "Não foi possível criar o administrador.");
    } finally {
      setLoading(false);
    }
  };

  const handleDevolver = async (id: number) => {
    try {
      await api.put(`/emprestimos/${id}/devolver`);
      Alert.alert("Sucesso", "Livro devolvido com sucesso!");
      carregarUsuarioEEprestimos();
    } catch (error) {
      Alert.alert("Erro", "Não foi possível devolver o livro.");
    }
  };

  const handleAceitar = async (id: number) => {
    try {
      await api.put(`/emprestimos/${id}/aceitar`);
      Alert.alert("Sucesso", "Empréstimo aprovado e livro entregue!");
      carregarUsuarioEEprestimos();
    } catch (error) {
      Alert.alert("Erro", "Não foi possível aprovar o empréstimo.");
    }
  };

  const handleLogout = () => {
    GlobalStore.user = null;
    GlobalStore.token = null;
    router.replace("/");
  };

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === "ios" ? "padding" : "height"}>
      <StatusBar style="light" />

      <View style={styles.header}>
        <View>
          <Text style={styles.title}>GERENCIAMENTO</Text>
          <Text style={styles.subtitle}>Painel de Conta e Administração</Text>
        </View>
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <FontAwesome name="sign-out" size={12} color="#f87171" style={{ marginRight: 4 }} />
          <Text style={styles.logoutButtonText}>SAIR</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.main} contentContainerStyle={{ paddingBottom: 100 }}>
        
        {/* Meus Empréstimos */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <FontAwesome name="book" size={16} color={COLORS.primary} />
            <Text style={styles.cardTitle}>MEU HISTÓRICO DE EMPRÉSTIMOS</Text>
          </View>
          <Text style={styles.cardDesc}>
            {meusEmprestimos.length === 0 
              ? "Você não possui histórico de livros." 
              : "Estes são os livros que você solicitou:"}
          </Text>

          {meusEmprestimos.map(emp => {
            const isAtivo = String(emp.status).toUpperCase() === "EMPRESTADO" || 
                            (String(emp.status).toUpperCase() === "EMPRESTADO" && emp.dataMaximaDevolucao && new Date(emp.dataMaximaDevolucao) < new Date());
            
            return (
              <View key={emp.id} style={styles.loanItem}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.loanTitle}>{getLivroNome(emp.livroId)}</Text>
                  <Text style={styles.loanDate}>Retirada: {new Date(emp.dataEmprestimo).toLocaleDateString()}</Text>
                  {emp.dataMaximaDevolucao && <Text style={styles.loanDate}>Prazo: {new Date(emp.dataMaximaDevolucao).toLocaleDateString()}</Text>}
                  {getStatusBadge(emp)}
                </View>
                {isAtivo && (
                  <TouchableOpacity style={styles.returnButton} onPress={() => handleDevolver(emp.id)}>
                    <Text style={styles.returnButtonText}>Devolver</Text>
                  </TouchableOpacity>
                )}
              </View>
            );
          })}
        </View>

        {/* Formulário Admin */}
        {userRole === "ADMIN" && (
          <View>
            <View style={[styles.card, { marginTop: 16 }]}>
              <View style={styles.cardHeader}>
                <FontAwesome name="check-circle" size={16} color={COLORS.primary} />
                <Text style={styles.cardTitle}>EMPRÉSTIMOS PENDENTES (APROVAÇÃO)</Text>
              </View>
              <Text style={styles.cardDesc}>
                {pendentes.length === 0 
                  ? "Não há solicitações de empréstimo aguardando." 
                  : "Aprove os empréstimos solicitados pelos leitores:"}
              </Text>

              {pendentes.map(emp => (
                <View key={emp.id} style={styles.loanItem}>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.loanTitle}>{getLivroNome(emp.livroId)}</Text>
                    <Text style={styles.loanDate}>Leitor: {getUsuarioNome(emp.usuarioId)}</Text>
                    <Text style={styles.loanDate}>Dias solicitados: {emp.diasDesejados || 15} dias</Text>
                  </View>
                  <TouchableOpacity style={[styles.returnButton, { backgroundColor: COLORS.primary }]} onPress={() => handleAceitar(emp.id)}>
                    <Text style={[styles.returnButtonText, { color: COLORS.background }]}>ACEITAR</Text>
                  </TouchableOpacity>
                </View>
              ))}
            </View>

            <View style={[styles.card, { marginTop: 16 }]}>
              <View style={styles.cardHeader}>
                <FontAwesome name="users" size={16} color={COLORS.primary} />
                <Text style={styles.cardTitle}>VISÃO GERAL DOS LEITORES</Text>
              </View>
              <Text style={styles.cardDesc}>
                Acompanhe o que os usuários estão lendo (Empréstimos Ativos):
              </Text>
              {todosEmprestimos.map(emp => (
                <View key={emp.id} style={styles.loanItem}>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.loanTitle}>{getLivroNome(emp.livroId)}</Text>
                    <Text style={styles.loanDate}>Leitor: {getUsuarioNome(emp.usuarioId)}</Text>
                    {getStatusBadge(emp)}
                  </View>
                </View>
              ))}
              {todosEmprestimos.length === 0 && <Text style={styles.loanDate}>Nenhum livro alugado no momento.</Text>}
            </View>

            <View style={[styles.card, { marginTop: 16 }]}>
              <View style={styles.cardHeader}>
                <FontAwesome name="shield" size={16} color={COLORS.primary} />
                <Text style={styles.cardTitle}>CRIAR NOVO ADMINISTRADOR</Text>
              </View>
              
              <Text style={styles.cardDesc}>
                Como administrador atual, você tem permissão para cadastrar novos funcionários.
              </Text>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>NOME DO NOVO ADMIN</Text>
                <TextInput style={styles.input} value={nome} onChangeText={setNome} placeholder="Ex: Ana Souza" placeholderTextColor={COLORS.textSecondary} />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>E-MAIL DO ADMIN</Text>
                <TextInput style={styles.input} value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" placeholder="ana@biblioteca.com" placeholderTextColor={COLORS.textSecondary} />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>SENHA INICIAL</Text>
                <TextInput style={styles.input} value={senha} onChangeText={setSenha} secureTextEntry placeholder="••••••••" placeholderTextColor={COLORS.textSecondary} />
              </View>

              <TouchableOpacity style={styles.primaryButton} onPress={handleCreateAdmin} disabled={loading}>
                <Text style={styles.primaryButtonText}>{loading ? "CRIANDO..." : "CONCEDER ACESSO ADMIN"}</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </ScrollView>

      <BottomNav />
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  header: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", backgroundColor: COLORS.container, paddingTop: 50, paddingBottom: 16, paddingHorizontal: 16, borderBottomWidth: 1, borderBottomColor: COLORS.inputBorder },
  title: { fontSize: 20, fontWeight: "900", color: COLORS.primary, letterSpacing: 2 },
  subtitle: { fontSize: 10, color: COLORS.textSecondary },
  logoutButton: { flexDirection: "row", backgroundColor: "transparent", borderWidth: 1, borderColor: "#f87171", paddingHorizontal: 10, paddingVertical: 6, borderRadius: 8, alignItems: "center" },
  logoutButtonText: { color: "#f87171", fontWeight: "bold", fontSize: 10 },
  main: { flex: 1, padding: 16 },
  card: { backgroundColor: COLORS.container, borderRadius: 16, padding: 20, borderWidth: 1, borderColor: COLORS.inputBorder },
  cardHeader: { flexDirection: "row", alignItems: "center", marginBottom: 8 },
  cardTitle: { color: COLORS.primary, fontSize: 12, fontWeight: "bold", marginLeft: 8, letterSpacing: 1 },
  cardDesc: { color: COLORS.textSecondary, fontSize: 10, marginBottom: 20, lineHeight: 14 },
  inputGroup: { marginBottom: 16 },
  label: { color: COLORS.label, fontSize: 10, fontWeight: "bold", marginBottom: 4 },
  input: { backgroundColor: COLORS.background, borderWidth: 1, borderColor: COLORS.inputBorder, borderRadius: 8, padding: 12, color: COLORS.white },
  primaryButton: { backgroundColor: COLORS.primary, borderRadius: 12, padding: 14, alignItems: "center", marginTop: 8 },
  primaryButtonText: { color: COLORS.background, fontWeight: "900", fontSize: 12, letterSpacing: 1 },
  loanItem: { flexDirection: "row", alignItems: "center", backgroundColor: COLORS.background, padding: 12, borderRadius: 12, borderWidth: 1, borderColor: COLORS.inputBorder, marginBottom: 8 },
  loanTitle: { color: COLORS.white, fontWeight: "bold", fontSize: 12, marginBottom: 4 },
  loanDate: { color: COLORS.textSecondary, fontSize: 10 },
  returnButton: { backgroundColor: "#f87171", paddingHorizontal: 12, paddingVertical: 8, borderRadius: 8, justifyContent: "center", alignItems: "center", alignSelf: "center", height: 32 },
  returnButtonText: { color: COLORS.white, fontWeight: "bold", fontSize: 10 }
});
