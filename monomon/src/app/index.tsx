import React, { useState } from "react";
import LoginScreen from "../screens/LoginScreen";
import RegisterScreen from "../screens/RegisterScreen";

export default function AuthScreen() {
  const [activeTab, setActiveTab] = useState<"login" | "register">("login");

  if (activeTab === "login") {
    return <LoginScreen onSwitchToRegister={() => setActiveTab("register")} />;
  }

  return <RegisterScreen onSwitchToLogin={() => setActiveTab("login")} />;
}
