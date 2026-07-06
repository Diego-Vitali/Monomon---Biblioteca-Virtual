import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from "react-native";
import { StatusBar } from "expo-status-bar";
import { FontAwesome } from '@expo/vector-icons';
import { COLORS } from "./authStyles";
import BottomNav from "../components/BottomNav";
import { useRouter } from "expo-router";
import { GlobalStore } from "../services/store";
import { api } from "../services/api";

export default function HomeScreen() {
  const router = useRouter();
  const [isAdmin, setIsAdmin] = useState(false);
  const [qtdEmprestimos, setQtdEmprestimos] = useState(0);
  const [recomendados, setRecomendados] = useState<any[]>([]);

  useEffect(() => {
    if (GlobalStore.user && GlobalStore.user.tipo === "ADMIN") {
      setIsAdmin(true);
    }
    
    carregarDados();
  }, []);

  const carregarDados = async () => {
    if (!GlobalStore.user) return;
    
    try {
      // Carrega Empréstimos Ativos ou Pendentes (Admin)
      const resEmp = await api.get("/emprestimos");
      const emprestimos = resEmp.data || [];
      
      if (GlobalStore.user.tipo === "ADMIN") {
         const pendentes = emprestimos.filter((e: any) => String(e.status).toUpperCase() === "PENDENTE");
         setQtdEmprestimos(pendentes.length);
      } else {
         const ativos = emprestimos.filter(
           (e: any) => e.usuarioId === GlobalStore.user.id && !String(e.status).toUpperCase().includes("DEVOLVIDO")
         );
         setQtdEmprestimos(ativos.length);
      }

      // Carrega Ranking de Recomendados
      const resRec = await api.get("/livros/ranking/recomendados");
      setRecomendados(resRec.data || []);
    } catch (error) {
      console.log("Erro ao carregar dados da Home:", error);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>MONOMON</Text>
          <Text style={styles.subtitle}>Se inspire, relaxe e aprenda na Biblioteca</Text>
        </View>
        <Text style={styles.greeting}>{isAdmin ? "Olá, Bibliotecário" : "Olá, Estudante"}</Text>
      </View>

      <ScrollView style={styles.main} contentContainerStyle={{ paddingBottom: 100 }} showsVerticalScrollIndicator={false}>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>MAIS EMPRESTADOS DA SEMANA</Text>
          
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 12 }}>
            {recomendados.length > 0 ? (
              recomendados.map(livro => (
                <TouchableOpacity key={livro.id} style={styles.bookCard} onPress={() => router.push("/catalogo")}>
                  <View style={styles.bookTag}>
                    <Text style={styles.bookTagText}>{livro.generos?.substring(0, 8) || "LIVRO"}</Text>
                  </View>
                  <FontAwesome name="book" size={32} color="#5b2a86" style={styles.bookIcon} />
                  <View style={styles.bookLines}>
                    <Text style={{color: COLORS.white, fontSize: 10, fontWeight: 'bold'}} numberOfLines={1}>{livro.nome}</Text>
                    <Text style={{color: COLORS.primary, fontSize: 8}}>Rank: {livro.emprestimosTotais} pts</Text>
                  </View>
                </TouchableOpacity>
              ))
            ) : (
              <View style={[styles.bookCard, { width: 200, justifyContent: 'center' }]}>
                <Text style={{color: COLORS.textSecondary, fontSize: 10, textAlign: 'center'}}>Nenhum livro registrado ainda.</Text>
              </View>
            )}
          </ScrollView>
        </View>

        <View style={[styles.loanCard, qtdEmprestimos === 0 && { backgroundColor: "rgba(76, 135, 134, 0.4)" }]}>
          <View style={styles.loanHeader}>
            <Text style={styles.loanNumber}>{qtdEmprestimos}</Text>
            <Text style={styles.loanText}>
              {isAdmin ? "APROVAÇÕES PENDENTES" : (qtdEmprestimos === 1 ? "EMPRÉSTIMO ATIVO" : "EMPRÉSTIMOS ATIVOS")}
            </Text>
          </View>
          <Text style={{ color: qtdEmprestimos === 0 ? COLORS.white : COLORS.container, fontSize: 10, fontWeight: 'bold' }}>
            {isAdmin 
              ? (qtdEmprestimos === 0 ? "Nenhuma solicitação aguardando no momento." : "Acesse a aba Gerenciamento para aprovar.")
              : (qtdEmprestimos === 0 ? "Você não possui empréstimos no momento. Visite o catálogo!" : "Consulte a aba de Catálogo ou Conta para gerenciar seus empréstimos.")}
          </Text>
        </View>

        <TouchableOpacity style={styles.catalogButton} onPress={() => router.push("/catalogo")}>
          <FontAwesome name="search" size={14} color={COLORS.primary} style={{ marginRight: 8 }} />
          <Text style={styles.catalogButtonText}>EXPLORAR CATÁLOGO COMPLETO</Text>
        </TouchableOpacity>

        <View style={styles.actionRow}>
          <TouchableOpacity style={styles.actionButton}>
            <FontAwesome name="heart" size={14} color="#f87171" style={{ marginRight: 6 }} />
            <Text style={styles.actionButtonText}>Doar Livro</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton}>
            <FontAwesome name="comment" size={14} color="#9ac6c5" style={{ marginRight: 6 }} />
            <Text style={styles.actionButtonText}>Sugestões</Text>
          </TouchableOpacity>
        </View>

      </ScrollView>

      <BottomNav />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: COLORS.container,
    paddingTop: 50,
    paddingBottom: 16,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.inputBorder,
  },
  title: {
    fontSize: 20,
    fontWeight: "900",
    color: COLORS.primary,
    letterSpacing: 2,
  },
  subtitle: {
    fontSize: 12,
    color: COLORS.textSecondary,
    fontWeight: "500",
  },
  greeting: {
    fontSize: 10,
    fontWeight: "bold",
    color: COLORS.label,
  },
  main: {
    flex: 1,
    padding: 16,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: "bold",
    color: COLORS.label,
    marginBottom: 12,
    letterSpacing: 1,
  },
  carouselContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "rgba(43, 4, 82, 0.5)",
    padding: 12,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "rgba(55, 26, 81, 0.4)",
  },
  arrowButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#5b2a86",
    justifyContent: "center",
    alignItems: "center",
  },
  bookCard: {
    width: 100,
    height: 140,
    backgroundColor: "#150229",
    borderRadius: 12,
    borderWidth: 2,
    borderColor: COLORS.primary,
    padding: 8,
    justifyContent: "space-between",
  },
  bookTag: {
    position: "absolute",
    top: 4,
    right: 4,
    backgroundColor: COLORS.primary,
    paddingHorizontal: 4,
    borderRadius: 4,
  },
  bookTagText: {
    fontSize: 8,
    fontWeight: "bold",
    color: COLORS.background,
  },
  bookIcon: {
    alignSelf: "center",
    marginTop: 20,
  },
  bookLines: {
    marginTop: 10,
  },
  lineFull: {
    height: 6,
    backgroundColor: COLORS.primary,
    borderRadius: 4,
    marginBottom: 4,
  },
  lineHalf: {
    height: 6,
    width: "50%",
    backgroundColor: COLORS.textSecondary,
    borderRadius: 4,
  },
  loanCard: {
    backgroundColor: "#4c8786", // light_blue shade
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
  },
  loanHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  loanNumber: {
    fontSize: 28,
    fontWeight: "900",
    color: COLORS.background,
    marginRight: 8,
  },
  loanText: {
    fontSize: 12,
    fontWeight: "bold",
    color: COLORS.container,
    letterSpacing: 1,
  },
  returnButton: {
    flexDirection: "row",
    backgroundColor: COLORS.background,
    padding: 12,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: COLORS.inputBorder,
  },
  returnButtonText: {
    color: "#6dadac",
    fontWeight: "bold",
    fontSize: 12,
    letterSpacing: 1,
  },
  catalogButton: {
    flexDirection: "row",
    backgroundColor: "#5b2a86", // indigo_velvet
    padding: 16,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },
  catalogButtonText: {
    color: COLORS.primary,
    fontWeight: "bold",
    fontSize: 12,
  },
  actionRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  actionButton: {
    flexDirection: "row",
    flex: 1,
    backgroundColor: COLORS.container,
    padding: 12,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 4,
    borderWidth: 1,
    borderColor: COLORS.inputBorder,
  },
  actionButtonText: {
    color: COLORS.textSecondary,
    fontWeight: "bold",
    fontSize: 12,
  },
});
