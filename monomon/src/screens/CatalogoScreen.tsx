import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Modal, Alert, FlatList } from "react-native";
import { StatusBar } from "expo-status-bar";
import { FontAwesome } from '@expo/vector-icons';
import { COLORS } from "./authStyles";
import BottomNav from "../components/BottomNav";
import { api } from "../services/api";
import { GlobalStore } from "../services/store";

export default function CatalogoScreen() {
  const [userRole, setUserRole] = useState("USER");
  const [livros, setLivros] = useState<any[]>([]);
  const [autores, setAutores] = useState<any[]>([]);
  
  const [detailsVisible, setDetailsVisible] = useState(false);
  const [adminVisible, setAdminVisible] = useState(false);
  const [selectedBook, setSelectedBook] = useState<any>(null);
  
  // Admin form state
  const [titulo, setTitulo] = useState("");
  const [autorBusca, setAutorBusca] = useState("");
  const [autorSelecionado, setAutorSelecionado] = useState<any>(null);
  const [genero, setGenero] = useState("");
  const [qtd, setQtd] = useState("");

  useEffect(() => {
    carregarDados();
  }, []);

  const carregarDados = async () => {
    try {
      if (GlobalStore.user && GlobalStore.user.tipo) {
        setUserRole(GlobalStore.user.tipo);
      }

      const resLivros = await api.get("/livros");
      setLivros(resLivros.data);

      const resAutores = await api.get("/autores");
      setAutores(resAutores.data);
    } catch (error) {
      console.log("Erro ao buscar dados", error);
    }
  };
  
  const handleOpenDetails = (livro: any) => {
    setSelectedBook(livro);
    setDetailsVisible(true);
  };
  const handleCloseDetails = () => setDetailsVisible(false);
  
  const handleOpenAdmin = (livro?: any) => {
    setDetailsVisible(false);
    if (livro && livro.id) {
      setSelectedBook(livro);
      setTitulo(livro.nome || "");
      
      // Encontra o autor pelo ID para preencher a busca
      const autorDoLivro = autores.find(a => a.id === livro.autorId);
      if (autorDoLivro) {
        setAutorSelecionado(autorDoLivro);
        setAutorBusca(autorDoLivro.nome);
      } else {
        setAutorSelecionado(null);
        setAutorBusca(livro.autorId ? livro.autorId.toString() : "");
      }
      
      setGenero(livro.generos || "");
      setQtd(livro.qntd ? livro.qntd.toString() : "");
    } else {
      setSelectedBook(null);
      setTitulo("");
      setAutorBusca("");
      setAutorSelecionado(null);
      setGenero("");
      setQtd("");
    }
    setAdminVisible(true);
  };

  const handleCloseAdmin = () => setAdminVisible(false);

  const handleSaveBook = async () => {
    if (!autorSelecionado) {
      Alert.alert("Erro", "Selecione um autor da lista.");
      return;
    }

    try {
      const payload = {
        nome: titulo,
        generos: genero,
        qntd: Number(qtd),
        autorId: autorSelecionado.id, 
      };

      if (selectedBook && selectedBook.id) {
        await api.put(`/livros/${selectedBook.id}`, payload);
        Alert.alert("Sucesso", "Livro atualizado!");
      } else {
        await api.post("/livros", payload);
        Alert.alert("Sucesso", "Livro cadastrado!");
      }
      handleCloseAdmin();
      carregarDados();
    } catch (error) {
      Alert.alert("Erro", "Não foi possível salvar o livro.");
      console.log(error);
    }
  };

  const handleDeleteBook = async () => {
    if (!selectedBook || !selectedBook.id) return;
    try {
      await api.delete(`/livros/${selectedBook.id}`);
      Alert.alert("Sucesso", "Livro removido do acervo.");
      handleCloseAdmin();
      carregarDados();
    } catch (error) {
      Alert.alert("Erro", "Não foi possível remover o livro.");
    }
  };

  // Filtra os autores baseado na digitação
  const autoresFiltrados = autorBusca && !autorSelecionado 
    ? autores.filter(a => a.nome.toLowerCase().includes(autorBusca.toLowerCase())) 
    : [];

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>ACERVO</Text>
          <Text style={styles.subtitle}>Selecione um livro para interagir</Text>
        </View>
        {userRole === "ADMIN" && (
          <TouchableOpacity style={styles.adminButton} onPress={() => handleOpenAdmin()}>
            <FontAwesome name="plus-circle" size={12} color={COLORS.primary} style={{ marginRight: 4 }} />
            <Text style={styles.adminButtonText}>PAINEL ADMIN</Text>
          </TouchableOpacity>
        )}
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
        
        {livros.map((livro) => {
          const autorNome = autores.find(a => a.id === livro.autorId)?.nome || `Autor ID: ${livro.autorId}`;
          return (
            <TouchableOpacity key={livro.id} style={styles.bookListItem} onPress={() => handleOpenDetails(livro)}>
              <View style={styles.bookListIconContainer}>
                <FontAwesome name="book" size={24} color={COLORS.primary} />
              </View>
              <View style={styles.bookListInfo}>
                <Text style={styles.bookListTitle} numberOfLines={1}>{livro.nome}</Text>
                <Text style={styles.bookListSubtitle}>{livro.generos} • {autorNome}</Text>
                <View style={styles.bookListMeta}>
                  <Text style={styles.bookListQty}>Qtd: {livro.qntd} exemplares</Text>
                </View>
              </View>
              <FontAwesome name="chevron-right" size={14} color={COLORS.textSecondary} />
            </TouchableOpacity>
          );
        })}

        {livros.length === 0 && (
          <Text style={{color: COLORS.textSecondary, textAlign: 'center', marginTop: 20}}>
            Nenhum livro cadastrado no acervo.
          </Text>
        )}

      </ScrollView>

      {/* Drawer Details */}
      {detailsVisible && selectedBook && (
        <View style={styles.drawer}>
          <View style={styles.drawerHeader}>
            <View style={{ flex: 1 }}>
              <View style={styles.drawerTag}><Text style={styles.drawerTagText}>{selectedBook.generos || "GÊNERO"}</Text></View>
              <Text style={styles.drawerTitle}>{selectedBook.nome}</Text>
              <Text style={styles.drawerAuthor}>
                {autores.find(a => a.id === selectedBook.autorId)?.nome || `Autor ID: ${selectedBook.autorId}`}
              </Text>
            </View>
            <TouchableOpacity style={styles.closeButton} onPress={handleCloseDetails}>
              <FontAwesome name="times" size={14} color={COLORS.textSecondary} />
            </TouchableOpacity>
          </View>
          
          <Text style={styles.drawerDesc}>Sinopse: Livro do acervo.</Text>
          
          <View style={styles.drawerStats}>
            <Text style={styles.drawerStatsText}>Disponíveis: <Text style={{ color: COLORS.primary }}>{selectedBook.qntd}</Text></Text>
          </View>

          <View style={styles.drawerActions}>
            <TouchableOpacity style={styles.reserveButton} onPress={() => { Alert.alert("Sucesso", "Reserva solicitada!"); handleCloseDetails(); }}>
              <Text style={styles.reserveButtonText}>SOLICITAR RESERVA</Text>
            </TouchableOpacity>
            
            {userRole === "ADMIN" && (
              <TouchableOpacity style={styles.editButton} onPress={() => handleOpenAdmin(selectedBook)}>
                <FontAwesome name="edit" size={14} color={COLORS.primary} style={{ marginRight: 6 }} />
                <Text style={styles.editButtonText}>EDITAR</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      )}

      {/* Admin Modal */}
      <Modal visible={adminVisible} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <ScrollView contentContainerStyle={{flexGrow:1, justifyContent:'center'}} style={{width:'100%'}}>
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>
                  {selectedBook?.id ? "EDITAR LIVRO" : "CADASTRAR NOVO LIVRO"}
                </Text>
                <TouchableOpacity onPress={handleCloseAdmin}>
                  <FontAwesome name="times" size={16} color={COLORS.textSecondary} />
                </TouchableOpacity>
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>TÍTULO DO LIVRO</Text>
                <TextInput style={styles.input} value={titulo} onChangeText={setTitulo} placeholder="Ex: Sapiens" placeholderTextColor={COLORS.textSecondary} />
              </View>

              <View style={[styles.inputGroup, { zIndex: 10 }]}>
                <Text style={styles.label}>AUTOR (Buscar na base)</Text>
                <TextInput 
                  style={styles.input} 
                  value={autorBusca} 
                  onChangeText={(text) => {
                    setAutorBusca(text);
                    setAutorSelecionado(null); // Se o usuário voltar a digitar, limpa a seleção
                  }} 
                  placeholder="Ex: William Gibson" 
                  placeholderTextColor={COLORS.textSecondary} 
                />
                
                {/* Search Suggestions */}
                {autoresFiltrados.length > 0 && (
                  <View style={styles.suggestionsContainer}>
                    {autoresFiltrados.slice(0,4).map(autor => (
                      <TouchableOpacity 
                        key={autor.id} 
                        style={styles.suggestionItem} 
                        onPress={() => {
                          setAutorSelecionado(autor);
                          setAutorBusca(autor.nome);
                        }}
                      >
                        <Text style={styles.suggestionText}>{autor.nome}</Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                )}
                {autorBusca.length > 0 && autoresFiltrados.length === 0 && !autorSelecionado && (
                  <View style={styles.suggestionsContainer}>
                    <Text style={styles.suggestionText}>Nenhum autor encontrado.</Text>
                  </View>
                )}
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>GÊNERO</Text>
                <TextInput style={styles.input} value={genero} onChangeText={setGenero} placeholder="Ex: História" placeholderTextColor={COLORS.textSecondary} />
              </View>
              <View style={styles.inputGroup}>
                <Text style={styles.label}>QUANTIDADE</Text>
                <TextInput style={styles.input} value={qtd} onChangeText={setQtd} keyboardType="numeric" placeholder="Ex: 5" placeholderTextColor={COLORS.textSecondary} />
              </View>

              <TouchableOpacity style={styles.saveButton} onPress={handleSaveBook}>
                <Text style={styles.saveButtonText}>SALVAR NO SISTEMA</Text>
              </TouchableOpacity>

              {selectedBook?.id && (
                <TouchableOpacity style={styles.deleteButton} onPress={handleDeleteBook}>
                  <Text style={styles.deleteButtonText}>EXCLUIR LIVRO</Text>
                </TouchableOpacity>
              )}
            </View>
          </ScrollView>
        </View>
      </Modal>

      <BottomNav />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  header: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", backgroundColor: COLORS.container, paddingTop: 50, paddingBottom: 16, paddingHorizontal: 16, borderBottomWidth: 1, borderBottomColor: COLORS.inputBorder },
  title: { fontSize: 20, fontWeight: "900", color: COLORS.primary, letterSpacing: 2 },
  subtitle: { fontSize: 10, color: COLORS.textSecondary },
  adminButton: { flexDirection: "row", backgroundColor: "#5b2a86", paddingHorizontal: 10, paddingVertical: 6, borderRadius: 8, alignItems: "center" },
  adminButtonText: { color: COLORS.primary, fontWeight: "bold", fontSize: 10 },
  searchContainer: { flexDirection: "row", alignItems: "center", backgroundColor: COLORS.container, margin: 16, paddingHorizontal: 12, borderRadius: 12, borderWidth: 1, borderColor: COLORS.inputBorder },
  searchInput: { flex: 1, padding: 12, color: COLORS.white, fontSize: 12 },
  main: { flex: 1, paddingHorizontal: 16 },
  bookListItem: { flexDirection: "row", backgroundColor: "rgba(43, 4, 82, 0.8)", padding: 12, borderRadius: 12, alignItems: "center", borderWidth: 1, borderColor: COLORS.inputBorder, marginBottom: 10 },
  bookListIconContainer: { width: 48, height: 64, backgroundColor: "#371a51", borderRadius: 8, justifyContent: "center", alignItems: "center", marginRight: 12 },
  bookListInfo: { flex: 1, marginRight: 8 },
  bookListTitle: { fontSize: 14, fontWeight: "bold", color: COLORS.white },
  bookListSubtitle: { fontSize: 10, color: COLORS.label, marginBottom: 4 },
  bookListMeta: { flexDirection: "row", justifyContent: "space-between" },
  bookListQty: { fontSize: 10, color: COLORS.primary, fontWeight: "bold" },
  drawer: { position: "absolute", bottom: 70, left: 0, right: 0, backgroundColor: COLORS.container, borderTopWidth: 2, borderTopColor: "#5b2a86", borderTopLeftRadius: 32, borderTopRightRadius: 32, padding: 20, zIndex: 10 },
  drawerHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 },
  drawerTag: { backgroundColor: "#5b2a86", paddingHorizontal: 8, paddingVertical: 2, borderRadius: 4, alignSelf: "flex-start" },
  drawerTagText: { color: COLORS.primary, fontSize: 10, fontWeight: "bold" },
  drawerTitle: { fontSize: 16, fontWeight: "bold", color: COLORS.white, marginTop: 4 },
  drawerAuthor: { fontSize: 12, color: COLORS.label },
  closeButton: { width: 24, height: 24, borderRadius: 12, backgroundColor: COLORS.background, justifyContent: "center", alignItems: "center" },
  drawerDesc: { fontSize: 12, color: COLORS.textSecondary, marginBottom: 12 },
  drawerStats: { flexDirection: "row", justifyContent: "space-between", backgroundColor: "rgba(32, 3, 61, 0.5)", padding: 12, borderRadius: 12, marginBottom: 16, borderWidth: 1, borderColor: "rgba(55, 26, 81, 0.3)" },
  drawerStatsText: { fontSize: 12, color: COLORS.white },
  drawerActions: { flexDirection: "row", justifyContent: "space-between" },
  reserveButton: { flex: 1, backgroundColor: COLORS.primary, padding: 12, borderRadius: 12, alignItems: "center", marginRight: 8 },
  reserveButtonText: { color: COLORS.background, fontWeight: "bold", fontSize: 12 },
  editButton: { flex: 1, flexDirection: "row", backgroundColor: "#5b2a86", padding: 12, borderRadius: 12, alignItems: "center", justifyContent: "center" },
  editButtonText: { color: COLORS.primary, fontWeight: "bold", fontSize: 12 },
  modalOverlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.8)", justifyContent: "center", alignItems: "center", padding: 16 },
  modalContent: { width: "100%", backgroundColor: COLORS.background, borderRadius: 24, padding: 20, borderWidth: 1, borderColor: "#5b2a86" },
  modalHeader: { flexDirection: "row", justifyContent: "space-between", marginBottom: 20, borderBottomWidth: 1, borderBottomColor: "rgba(55, 26, 81, 0.4)", paddingBottom: 8 },
  modalTitle: { color: COLORS.primary, fontWeight: "bold", fontSize: 14 },
  inputGroup: { marginBottom: 16 },
  label: { color: COLORS.label, fontSize: 10, fontWeight: "bold", marginBottom: 4 },
  input: { backgroundColor: COLORS.container, borderWidth: 1, borderColor: COLORS.inputBorder, borderRadius: 8, padding: 12, color: COLORS.white },
  saveButton: { backgroundColor: COLORS.primary, padding: 12, borderRadius: 12, alignItems: "center", marginTop: 8 },
  saveButtonText: { color: COLORS.background, fontWeight: "bold", fontSize: 12 },
  deleteButton: { backgroundColor: "transparent", borderWidth: 1, borderColor: "#f87171", padding: 12, borderRadius: 12, alignItems: "center", marginTop: 8 },
  deleteButtonText: { color: "#f87171", fontWeight: "bold", fontSize: 12 },
  suggestionsContainer: { backgroundColor: COLORS.background, borderWidth: 1, borderColor: COLORS.inputBorder, borderRadius: 8, marginTop: 4, maxHeight: 120, position: 'absolute', top: 60, left: 0, right: 0, zIndex: 20 },
  suggestionItem: { padding: 12, borderBottomWidth: 1, borderBottomColor: COLORS.inputBorder },
  suggestionText: { color: COLORS.white, fontSize: 12 }
});
