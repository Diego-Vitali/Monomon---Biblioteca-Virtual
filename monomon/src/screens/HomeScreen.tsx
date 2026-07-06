import React from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from "react-native";
import { StatusBar } from "expo-status-bar";
import { FontAwesome } from '@expo/vector-icons';
import { COLORS } from "./authStyles";
import BottomNav from "../components/BottomNav";
import { useRouter } from "expo-router";

export default function HomeScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>MONOMON</Text>
          <Text style={styles.subtitle}>Se inspire, relaxe e aprenda na Biblioteca</Text>
        </View>
        <Text style={styles.greeting}>Olá, Estudante</Text>
      </View>

      <ScrollView style={styles.main} contentContainerStyle={{ paddingBottom: 100 }} showsVerticalScrollIndicator={false}>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>RECOMENDADOS DA SEMANA</Text>
          
          <View style={styles.carouselContainer}>
            <TouchableOpacity style={styles.arrowButton}>
              <FontAwesome name="chevron-left" size={14} color={COLORS.primary} />
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.bookCard} onPress={() => router.push("/catalogo")}>
              <View style={styles.bookTag}>
                <Text style={styles.bookTagText}>SCI-FI</Text>
              </View>
              <FontAwesome name="space-shuttle" size={32} color="#5b2a86" style={styles.bookIcon} />
              <View style={styles.bookLines}>
                <View style={styles.lineFull} />
                <View style={styles.lineHalf} />
              </View>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.arrowButton}>
              <FontAwesome name="chevron-right" size={14} color={COLORS.primary} />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.loanCard}>
          <View style={styles.loanHeader}>
            <Text style={styles.loanNumber}>1</Text>
            <Text style={styles.loanText}>EMPRÉSTIMO ATIVO</Text>
          </View>
          <Text style={{ color: COLORS.container, fontSize: 10, fontWeight: 'bold' }}>
            Consulte a aba de Catálogo ou Conta para gerenciar seus empréstimos.
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
