import { DATABASE_ID, databases, HABITS_COLLECTION_ID } from "@/lib/appwrite";
import { useAuth } from "@/lib/auth-context";
import { useRouter } from "expo-router";
import { useState } from "react";
import { View } from "react-native";
import { ID } from "react-native-appwrite";
import { Button, SegmentedButtons, Text, TextInput } from "react-native-paper";

const FREQUENCIES = ["daily", "weekly", "monthly"];

type Frequency = (typeof FREQUENCIES)[number];

export default function addHabitScreen() {
  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [frequency, setFrequency] = useState<string>("daily");
  const [error, setError] = useState<string>("");
  const { user } = useAuth();
  const router = useRouter();

  const handleSubmit = async () => {
    if (!user) return;

    try {
      await databases.createDocument(
        DATABASE_ID,
        HABITS_COLLECTION_ID,
        ID.unique(),
        {
          user_id: user.$id,
          title,
          description,
          frequency,
          streak_count: 0,
          last_completed: new Date().toISOString(),
          created_at: new Date().toISOString(),
        }
      );
      router.back();
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
        return;
      }

      setError("There was an error creating the habit");
    }
  };

  return (
    <View className="flex-1 justify-center mt-4 p-4">
      <TextInput
        label="Title"
        mode="outlined"
        onChangeText={setTitle}
        theme={{
          colors: {
            primary: "coral", // Cyan-500
            text: "black",
            placeholder: "#94a3b8", // Slate-400
            background: "#ffffff",
          },
        }}
      />
      <TextInput
        label=" Description"
        mode="outlined"
        onChangeText={setDescription}
        multiline
        theme={{
          colors: {
            primary: "coral",
            text: "#000000",
            placeholder: "#94a3b8",
            background: "#ffffff",
          },
        }}
      />
      <View className="mt-4 ">
        <SegmentedButtons
          value={frequency}
          onValueChange={(value) => setFrequency(value as Frequency)}
          buttons={FREQUENCIES.map((freq) => ({
            value: freq,
            label: freq.charAt(0).toUpperCase() + freq.slice(1),
          }))}
          theme={{
            colors: {
              primary: "coral", // Cyan-500
              onSurfaceVariant: "black", // Text color
              surface: "#ffffff", // Background color
            },
          }}
        />
      </View>
      <Button
        mode="contained"
        disabled={!title || !description}
        onPress={handleSubmit}
        buttonColor="coral" // Tailwind 'cyan-500'
        textColor="#ffffff"
        className="mt-4"
      >
        Add Habit
      </Button>
      {error && <Text className="text-red-500">{error}</Text>}
    </View>
  );
}
