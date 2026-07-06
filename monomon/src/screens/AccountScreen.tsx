import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert, KeyboardAvoidingView, Platform } from "react-native";
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

  useEffect(() => {
    carregarUsuario();
  }, []);

  const carregarUsuario = () => {
    if (GlobalStore.user && GlobalStore.user.tipo) {
      setUserRole(GlobalStore.user.tipo);
    }
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
      console.log(error);
    } finally {
      setLoading(false);
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

      <View style={styles.main}>
        {userRole === "ADMIN" ? (
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <FontAwesome name="shield" size={16} color={COLORS.primary} />
              <Text style={styles.cardTitle}>CRIAR NOVO ADMINISTRADOR</Text>
            </View>
            
            <Text style={styles.cardDesc}>
              Como administrador atual, você tem permissão para cadastrar novos funcionários.
            </Text>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>NOME DO NOVO ADMIN</Text>
              <TextInput
                style={styles.input}
                value={nome}
                onChangeText={setNome}
                placeholder="Ex: Ana Souza"
                placeholderTextColor={COLORS.textSecondary}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>E-MAIL DO ADMIN</Text>
              <TextInput
                style={styles.input}
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                placeholder="ana@biblioteca.com"
                placeholderTextColor={COLORS.textSecondary}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>SENHA INICIAL</Text>
              <TextInput
                style={styles.input}
                value={senha}
                onChangeText={setSenha}
                secureTextEntry
                placeholder="••••••••"
                placeholderTextColor={COLORS.textSecondary}
              />
            </View>

            <TouchableOpacity style={styles.primaryButton} onPress={handleCreateAdmin} disabled={loading}>
              <Text style={styles.primaryButtonText}>{loading ? "CRIANDO..." : "CONCEDER ACESSO ADMIN"}</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.card}>
             <View style={styles.cardHeader}>
              <FontAwesome name="user" size={16} color={COLORS.primary} />
              <Text style={styles.cardTitle}>MINHA CONTA</Text>
            </View>
            <Text style={styles.cardDesc}>Você está logado como Leitor. Aproveite o acervo!</Text>
          </View>
        )}
      </View>

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
  main: { flex: 1, padding: 16, justifyContent: "center" },
  card: { backgroundColor: COLORS.container, borderRadius: 16, padding: 20, borderWidth: 1, borderColor: COLORS.inputBorder },
  cardHeader: { flexDirection: "row", alignItems: "center", marginBottom: 8 },
  cardTitle: { color: COLORS.primary, fontSize: 12, fontWeight: "bold", marginLeft: 8, letterSpacing: 1 },
  cardDesc: { color: COLORS.textSecondary, fontSize: 10, marginBottom: 20, lineHeight: 14 },
  inputGroup: { marginBottom: 16 },
  label: { color: COLORS.label, fontSize: 10, fontWeight: "bold", marginBottom: 4 },
  input: { backgroundColor: COLORS.background, borderWidth: 1, borderColor: COLORS.inputBorder, borderRadius: 8, padding: 12, color: COLORS.white },
  primaryButton: { backgroundColor: COLORS.primary, borderRadius: 12, padding: 14, alignItems: "center", marginTop: 8 },
  primaryButtonText: { color: COLORS.background, fontWeight: "900", fontSize: 12, letterSpacing: 1 },
});
