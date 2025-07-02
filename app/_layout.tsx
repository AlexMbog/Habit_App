import { AuthProvider, useAuth } from "@/lib/auth-context";
import { Stack, useRouter, useSegments } from "expo-router";
import { useEffect } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { MD3LightTheme, PaperProvider } from "react-native-paper";
import { SafeAreaProvider } from "react-native-safe-area-context";
import "./globals.css";

const theme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    primary: "coral",
    background: "#ffffff",
    surface: "#ffffff", // ✅ Set to solid white
    text: "#000000",
    onSurface: "#000000",
    outline: "#d1d5db", // Tailwind's slate-300
  },
};

function RouteGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { user, isLoadingUser } = useAuth();
  const segments = useSegments();

  useEffect(() => {
    const inAuthGroup = segments[0] === "auth";

    if (!user && !inAuthGroup && !isLoadingUser) {
      router.replace("/auth");
    } else if (user && inAuthGroup && !isLoadingUser) {
      router.replace("/");
    }
  }, [user, segments]);
  return <>{children}</>;
}
export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <AuthProvider>
        <PaperProvider theme={theme}>
          <SafeAreaProvider>
            <RouteGuard>
              <Stack>
                <Stack.Screen
                  name="(tabs)"
                  options={{
                    headerShown: false,
                  }}
                />
              </Stack>
            </RouteGuard>
          </SafeAreaProvider>
        </PaperProvider>
      </AuthProvider>
    </GestureHandlerRootView>
  );
}
