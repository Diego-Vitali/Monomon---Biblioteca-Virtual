import { StyleSheet } from "react-native";

export const COLORS = {
  background: "#120524",
  container: "#1A0B2E",
  primary: "#A5E0B4",
  textSecondary: "#8F7B9E",
  inputBg: "#24113A",
  white: "#FFFFFF",
};

export const authStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    paddingHorizontal: 24,
    justifyContent: "center",
  },
  header: {
    alignItems: "center",
    marginBottom: 40,
    marginTop: 60,
  },
  title: {
    fontSize: 28,
    fontWeight: "900",
    color: COLORS.primary,
    letterSpacing: 2,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: COLORS.textSecondary,
  },
  tabsContainer: {
    flexDirection: "row",
    marginBottom: 32,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.inputBg,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: "center",
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: COLORS.primary,
  },
  tabText: {
    color: COLORS.textSecondary,
    fontWeight: "bold",
    fontSize: 14,
  },
  activeTabText: {
    color: COLORS.white,
  },
  formContainer: {
    flex: 1,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    color: COLORS.white,
    fontSize: 12,
    fontWeight: "bold",
    marginBottom: 8,
  },
  input: {
    backgroundColor: COLORS.inputBg,
    borderRadius: 8,
    padding: 16,
    color: COLORS.white,
    fontSize: 14,
  },
  forgotPassword: {
    alignItems: "flex-end",
    marginBottom: 24,
  },
  forgotPasswordText: {
    color: COLORS.textSecondary,
    fontSize: 12,
  },
  primaryButton: {
    backgroundColor: COLORS.primary,
    borderRadius: 8,
    padding: 16,
    alignItems: "center",
  },
  primaryButtonText: {
    color: COLORS.background,
    fontWeight: "bold",
    fontSize: 14,
  },
});
