import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useRouter, usePathname } from "expo-router";
import { COLORS } from "../screens/authStyles";
import { FontAwesome } from '@expo/vector-icons'; // Assuming @expo/vector-icons is available in expo

export default function BottomNav() {
  const router = useRouter();
  const pathname = usePathname();

  return (
    <View style={styles.navContainer}>
      <TouchableOpacity 
        style={styles.navItem} 
        onPress={() => router.replace("/home")}
      >
        <FontAwesome 
          name="home" 
          size={20} 
          color={pathname === "/home" ? COLORS.primary : COLORS.textSecondary} 
        />
        <Text style={[styles.navText, pathname === "/home" && styles.activeNavText]}>Início</Text>
      </TouchableOpacity>

      <TouchableOpacity 
        style={styles.navItem} 
        onPress={() => router.replace("/catalogo")}
      >
        <FontAwesome 
          name="book" 
          size={20} 
          color={pathname === "/catalogo" ? COLORS.primary : COLORS.textSecondary} 
        />
        <Text style={[styles.navText, pathname === "/catalogo" && styles.activeNavText]}>Catálogo</Text>
      </TouchableOpacity>

      <TouchableOpacity 
        style={styles.navItem} 
        onPress={() => router.replace("/conta")}
      >
        <FontAwesome 
          name="user-circle" 
          size={20} 
          color={pathname === "/conta" ? COLORS.primary : COLORS.textSecondary} 
        />
        <Text style={[styles.navText, pathname === "/conta" && styles.activeNavText]}>Conta</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  navContainer: {
    flexDirection: "row",
    backgroundColor: COLORS.container,
    borderTopWidth: 1,
    borderTopColor: "rgba(55, 26, 81, 0.8)",
    paddingHorizontal: 24,
    paddingVertical: 12,
    justifyContent: "space-between",
    alignItems: "center",
    borderBottomLeftRadius: 44,
    borderBottomRightRadius: 44,
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 70,
  },
  navItem: {
    alignItems: "center",
    justifyContent: "center",
  },
  navText: {
    fontSize: 10,
    fontWeight: "bold",
    color: COLORS.textSecondary,
    marginTop: 4,
  },
  activeNavText: {
    color: COLORS.primary,
  },
});
