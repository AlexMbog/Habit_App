import { useAuth } from "@/lib/auth-context";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { useRouter, useSegments } from "expo-router";
import { useEffect } from "react";
import { Text, View } from "react-native";
import { Button } from "react-native-paper";

function useProtectedRoute() {
  const segments = useSegments();
  const { user, isLoadingUser } = useAuth();
  const router = useRouter();

  const inAuthGroup = segments[0] === "auth";

  useEffect(() => {
    if (!user && !inAuthGroup && !isLoadingUser) {
      router.replace("/auth");
    }
  }, [user, isLoadingUser, inAuthGroup]);
}

export default function User() {
  useProtectedRoute();
  const { user, signOut } = useAuth();

  return (
    <View className="flex-1 px-4 bg-white pt-4 ">
      <View className=" items-center justify-center mb-4 p-4 rounded-lg shadow-lg  color-[#7c4dff]">
        <FontAwesome name="user-circle" size={48} color="" className="pt-4" />

        {user && (
          <>
            <Text className="text-lg mb-1 p-2">
              Username: {user.email.split("@")[0]}
            </Text>
            <Text className="text-lg mb-4">Email: {user.email}</Text>
          </>
        )}
      </View>
      <Button
        mode="contained"
        onPress={signOut}
        className="justify-center items-center"
      >
        Sign Out
      </Button>
    </View>
  );
}
