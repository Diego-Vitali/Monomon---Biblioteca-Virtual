import React, { useState } from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Modal } from "react-native";
import { StatusBar } from "expo-status-bar";
import { FontAwesome } from '@expo/vector-icons';
import { COLORS } from "./authStyles";
import BottomNav from "../components/BottomNav";

export default function CatalogoScreen() {
  const [detailsVisible, setDetailsVisible] = useState(false);
  const [adminVisible, setAdminVisible] = useState(false);
  
  // Basic state for forms to keep it simple for students
  const [titulo, setTitulo] = useState("");
  const [autor, setAutor] = useState("");
  
  const handleOpenDetails = () => setDetailsVisible(true);
  const handleCloseDetails = () => setDetailsVisible(false);
  
  const handleOpenAdmin = () => {
    setDetailsVisible(false);
    setAdminVisible(true);
  };
  const handleCloseAdmin = () => setAdminVisible(false);

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>ACERVO</Text>
          <Text style={styles.subtitle}>Selecione um livro para interagir</Text>
        </View>
        <TouchableOpacity style={styles.adminButton} onPress={handleOpenAdmin}>
          <FontAwesome name="plus-circle" size={12} color={COLORS.primary} style={{ marginRight: 4 }} />
          <Text style={styles.adminButtonText}>PAINEL ADMIN</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.searchContainer}>
        <FontAwesome name="search" size={14} color={COLORS.textSecondary} />
        <TextInput 
          style={styles.searchInput}
          placeholder="Buscar por título ou autor..."
          placeholderTextColor={COLORS.textSecondary}
        />
      </View>

      <ScrollView style={styles.main} contentContainerStyle={{ paddingBottom: 120 }} showsVerticalScrollIndicator={false}>
        
        <TouchableOpacity style={styles.bookListItem} onPress={handleOpenDetails}>
          <View style={styles.bookListIconContainer}>
            <FontAwesome name="book" size={24} color={COLORS.primary} />
          </View>
          <View style={styles.bookListInfo}>
            <Text style={styles.bookListTitle}>Livro Número Um</Text>
            <Text style={styles.bookListSubtitle}>Sci-Fi • Autor Exemplo</Text>
            <View style={styles.bookListMeta}>
              <Text style={styles.bookListQty}>Qtd: 4 exemplares</Text>
              <Text style={styles.bookListDays}>Prazo: Máx 15 dias</Text>
            </View>
          </View>
          <FontAwesome name="chevron-right" size={14} color={COLORS.textSecondary} />
        </TouchableOpacity>

      </ScrollView>

      {/* Basic Custom Drawer/Modal for Details */}
      {detailsVisible && (
        <View style={styles.drawer}>
          <View style={styles.drawerHeader}>
            <View>
              <View style={styles.drawerTag}><Text style={styles.drawerTagText}>GÊNERO</Text></View>
              <Text style={styles.drawerTitle}>Livro Número Um</Text>
              <Text style={styles.drawerAuthor}>Autor Exemplo</Text>
            </View>
            <TouchableOpacity style={styles.closeButton} onPress={handleCloseDetails}>
              <FontAwesome name="times" size={14} color={COLORS.textSecondary} />
            </TouchableOpacity>
          </View>
          
          <Text style={styles.drawerDesc}>Sinopse estendida do livro selecionado.</Text>
          
          <View style={styles.drawerStats}>
            <Text style={styles.drawerStatsText}>Disponíveis: <Text style={{ color: COLORS.primary }}>4</Text></Text>
            <Text style={styles.drawerStatsText}>Tempo Limite: <Text style={{ color: COLORS.label }}>15 dias</Text></Text>
          </View>

          <View style={styles.drawerActions}>
            <TouchableOpacity style={styles.reserveButton} onPress={handleCloseDetails}>
              <Text style={styles.reserveButtonText}>SOLICITAR RESERVA</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.editButton} onPress={handleOpenAdmin}>
              <FontAwesome name="edit" size={14} color={COLORS.primary} style={{ marginRight: 6 }} />
              <Text style={styles.editButtonText}>EDITAR</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* Admin Modal */}
      <Modal visible={adminVisible} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>CADASTRAR NOVO LIVRO</Text>
              <TouchableOpacity onPress={handleCloseAdmin}>
                <FontAwesome name="times" size={16} color={COLORS.textSecondary} />
              </TouchableOpacity>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>TÍTULO DO LIVRO</Text>
              <TextInput style={styles.input} value={titulo} onChangeText={setTitulo} placeholder="Ex: Sapiens" placeholderTextColor={COLORS.textSecondary} />
            </View>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>AUTOR</Text>
              <TextInput style={styles.input} value={autor} onChangeText={setAutor} placeholder="Ex: Yuval Noah" placeholderTextColor={COLORS.textSecondary} />
            </View>

            <TouchableOpacity style={styles.saveButton} onPress={handleCloseAdmin}>
              <Text style={styles.saveButtonText}>SALVAR NO SISTEMA</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

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
    fontSize: 10,
    color: COLORS.textSecondary,
  },
  adminButton: {
    flexDirection: "row",
    backgroundColor: "#5b2a86",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    alignItems: "center",
  },
  adminButtonText: {
    color: COLORS.primary,
    fontWeight: "bold",
    fontSize: 10,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.container,
    margin: 16,
    paddingHorizontal: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.inputBorder,
  },
  searchInput: {
    flex: 1,
    padding: 12,
    color: COLORS.white,
    fontSize: 12,
  },
  main: {
    flex: 1,
    paddingHorizontal: 16,
  },
  bookListItem: {
    flexDirection: "row",
    backgroundColor: "rgba(43, 4, 82, 0.8)",
    padding: 12,
    borderRadius: 12,
    alignItems: "center",
    borderWidth: 1,
    borderColor: COLORS.inputBorder,
    marginBottom: 10,
  },
  bookListIconContainer: {
    width: 48,
    height: 64,
    backgroundColor: "#371a51",
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  bookListInfo: {
    flex: 1,
  },
  bookListTitle: {
    fontSize: 14,
    fontWeight: "bold",
    color: COLORS.white,
  },
  bookListSubtitle: {
    fontSize: 10,
    color: COLORS.label,
    marginBottom: 4,
  },
  bookListMeta: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingRight: 16,
  },
  bookListQty: {
    fontSize: 10,
    color: COLORS.primary,
    fontWeight: "bold",
  },
  bookListDays: {
    fontSize: 10,
    color: COLORS.textSecondary,
    fontWeight: "bold",
  },
  drawer: {
    position: "absolute",
    bottom: 70,
    left: 0,
    right: 0,
    backgroundColor: COLORS.container,
    borderTopWidth: 2,
    borderTopColor: "#5b2a86",
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    padding: 20,
    zIndex: 10,
  },
  drawerHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 12,
  },
  drawerTag: {
    backgroundColor: "#5b2a86",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
    alignSelf: "flex-start",
  },
  drawerTagText: {
    color: COLORS.primary,
    fontSize: 10,
    fontWeight: "bold",
  },
  drawerTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: COLORS.white,
    marginTop: 4,
  },
  drawerAuthor: {
    fontSize: 12,
    color: COLORS.label,
  },
  closeButton: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: COLORS.background,
    justifyContent: "center",
    alignItems: "center",
  },
  drawerDesc: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginBottom: 12,
  },
  drawerStats: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "rgba(32, 3, 61, 0.5)",
    padding: 12,
    borderRadius: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "rgba(55, 26, 81, 0.3)",
  },
  drawerStatsText: {
    fontSize: 12,
    color: COLORS.white,
  },
  drawerActions: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  reserveButton: {
    flex: 1,
    backgroundColor: COLORS.primary,
    padding: 12,
    borderRadius: 12,
    alignItems: "center",
    marginRight: 8,
  },
  reserveButtonText: {
    color: COLORS.background,
    fontWeight: "bold",
    fontSize: 12,
  },
  editButton: {
    flex: 1,
    flexDirection: "row",
    backgroundColor: "#5b2a86",
    padding: 12,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  editButtonText: {
    color: COLORS.primary,
    fontWeight: "bold",
    fontSize: 12,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.8)",
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
  },
  modalContent: {
    width: "100%",
    backgroundColor: COLORS.background,
    borderRadius: 24,
    padding: 20,
    borderWidth: 1,
    borderColor: "#5b2a86",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(55, 26, 81, 0.4)",
    paddingBottom: 8,
  },
  modalTitle: {
    color: COLORS.primary,
    fontWeight: "bold",
    fontSize: 14,
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    color: COLORS.label,
    fontSize: 10,
    fontWeight: "bold",
    marginBottom: 4,
  },
  input: {
    backgroundColor: COLORS.container,
    borderWidth: 1,
    borderColor: COLORS.inputBorder,
    borderRadius: 8,
    padding: 12,
    color: COLORS.white,
  },
  saveButton: {
    backgroundColor: COLORS.primary,
    padding: 12,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 8,
  },
  saveButtonText: {
    color: COLORS.background,
    fontWeight: "bold",
    fontSize: 12,
  },
});
