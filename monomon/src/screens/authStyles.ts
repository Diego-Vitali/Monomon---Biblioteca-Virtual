import { StyleSheet } from "react-native";

export const COLORS = {
  background: "#20033d", // indigo_ink-300
  container: "#2b0452", // indigo_ink-400
  primary: "#a5e6ba", // celadon
  textSecondary: "#929dbc", // glaucous-600
  inputBg: "#2b0452", // indigo_ink-400
  inputBorder: "#371a51", // indigo_velvet-300
  label: "#9ac6c5", // light_blue
  white: "#e4e7ee", // glaucous-900
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
    marginTop: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "900",
    color: COLORS.primary,
    letterSpacing: 2,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 12,
    color: COLORS.textSecondary,
  },
  tabsContainer: {
    flexDirection: "row",
    marginBottom: 24,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(55, 26, 81, 0.4)', // indigo_velvet-300/40
    backgroundColor: 'rgba(43, 4, 82, 0.3)', // indigo_ink-400/30
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: "center",
    borderBottomWidth: 2,
    borderBottomColor: "transparent",
  },
  activeTab: {
    borderBottomColor: COLORS.primary,
  },
  tabText: {
    color: "#adb6cd", // glaucous-700
    fontWeight: "900",
    fontSize: 12,
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  activeTabText: {
    color: COLORS.primary,
  },
  formContainer: {
    flex: 1,
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    color: COLORS.label,
    fontSize: 10,
    fontWeight: "bold",
    textTransform: "uppercase",
    letterSpacing: 1,
    marginBottom: 4,
  },
  input: {
    backgroundColor: COLORS.inputBg,
    borderColor: COLORS.inputBorder,
    borderWidth: 1,
    borderRadius: 12,
    padding: 12,
    color: COLORS.white,
    fontSize: 12,
  },
  forgotPassword: {
    alignItems: "flex-end",
    marginBottom: 24,
  },
  forgotPasswordText: {
    color: COLORS.textSecondary,
    fontSize: 10,
  },
  primaryButton: {
    backgroundColor: COLORS.primary,
    borderRadius: 12,
    padding: 12,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  primaryButtonText: {
    color: "#360568", // indigo_ink
    fontWeight: "900",
    fontSize: 12,
    textTransform: "uppercase",
    letterSpacing: 1,
  },
});
