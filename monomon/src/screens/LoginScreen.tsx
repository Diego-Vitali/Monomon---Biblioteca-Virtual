import React, { useState } from "react";
import { 
  Text, 
  View, 
  TextInput, 
  TouchableOpacity, 
  KeyboardAvoidingView,
  Platform, 
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { useRouter } from "expo-router";
import { COLORS, authStyles as styles } from "./authStyles";

import { api } from "../services/api";
import { GlobalStore } from "../services/store";

interface LoginScreenProps {
  onSwitchToRegister: () => void;
}

export default function LoginScreen({ onSwitchToRegister }: LoginScreenProps) {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  const handleLogin = async () => {
    if (!email || !senha) {
      alert("Por favor, preencha todos os campos.");
      return;
    }
    
    setLoading(true);
    try {
      const response = await api.post("/auth/login", { email, senha });
      if (response.data && response.data.token) {
        // Armazena em memória para não usar persistência local
        GlobalStore.user = response.data.usuario;
        GlobalStore.token = response.data.token;
        // Sucesso: Redireciona
        router.replace("/home");
      }
    } catch (error: any) {
      alert("Credenciais inválidas.");
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container} 
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <StatusBar style="light" />
      
      <View style={styles.header}>
        <Text style={styles.title}>MONOMON</Text>
        <Text style={styles.subtitle}>Gerencie suas leituras digitais e físicas</Text>
      </View>

      <View style={styles.tabsContainer}>
        <TouchableOpacity style={[styles.tab, styles.activeTab]}>
          <Text style={[styles.tabText, styles.activeTabText]}>ENTRAR</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.tab} onPress={onSwitchToRegister}>
          <Text style={styles.tabText}>CRIAR CONTA</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.formContainer}>
        <View style={styles.inputGroup}>
          <Text style={styles.label}>E-MAIL INSTITUCIONAL</Text>
          <TextInput
            style={styles.input}
            placeholder="nome@exemplo.com"
            placeholderTextColor={COLORS.textSecondary}
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>SUA SENHA</Text>
          <TextInput
            style={styles.input}
            placeholder="••••••••"
            placeholderTextColor={COLORS.textSecondary}
            value={senha}
            onChangeText={setSenha}
            secureTextEntry
          />
        </View>

        <TouchableOpacity style={styles.forgotPassword}>
          <Text style={styles.forgotPasswordText}>Esqueceu a senha?</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.primaryButton} onPress={handleLogin}>
          <Text style={styles.primaryButtonText}>CONECTAR CONTA</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}
