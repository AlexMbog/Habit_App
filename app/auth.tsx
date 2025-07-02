import { useAuth } from "@/lib/auth-context";
import { useRouter } from "expo-router";
import { useState } from "react";
import { KeyboardAvoidingView, Platform, View } from "react-native";
import { Button, Text, TextInput } from "react-native-paper";

export default function AuthScreen() {
  const router = useRouter();

  const [isSignUp, setIsSignUp] = useState<boolean>(false);
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const [error, setError] = useState<string | null>(null);
  const { signIn, signUp } = useAuth();

  const handleAuth = async () => {
    if (!email || !password) {
      setError("Please fill in all fields");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters long");
      return;
    }
    setError(null);

    if (isSignUp) {
      const error = await signUp(email, password);
      if (error) {
        setError(error);
        return;
      }
    } else {
      const error = await signIn(email, password);
      if (error) {
        setError(error);
        return;
      }

      router.replace("/");
    }
  };

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
          onChangeText={setEmail}
        />
        <TextInput
          label="password"
          autoCapitalize="none"
          mode="outlined"
          className="mb-2"
          onChangeText={setPassword}
        />
        {error && <Text className="text-red-500">{error}</Text>}

        <Button mode="contained" className="mt-4" onPress={handleAuth}>
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
