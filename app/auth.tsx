import React, { useState } from "react";
import { KeyboardAvoidingView, Platform, View } from "react-native";
import { Button, Text, TextInput } from "react-native-paper";

export default function AuthScreen() {
  const [isSignUp, setIsSignUp] = useState<boolean>(false);
  const handleSwithchMode = () => {
    setIsSignUp((prev) => !prev);
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      className="flex-1"
    >
      <View className="flex-1 justify-center p-3">
        <Text className="text-center">
          {isSignUp ? "Create Account" : "Welcome back "}
        </Text>
        <TextInput
          label="Email"
          keyboardType="email-address"
          placeholder="example@gmail.com"
          autoCapitalize="none"
          mode="outlined"
          className="mb-2"
        />
        <TextInput
          label="password"
          keyboardType="email-address"
          autoCapitalize="none"
          mode="outlined"
          className="mb-2"
        />

        <Button mode="contained" className="mt-4">
          {" "}
          {isSignUp ? "Sign up" : "Sign In"}
        </Button>
        <Button mode="text" onPress={handleSwithchMode} className="mt-4">
          {" "}
          {isSignUp
            ? "Already have an account? Sign In"
            : "Don't have an account? Sign Up"}
        </Button>
      </View>
    </KeyboardAvoidingView>
  );
}
