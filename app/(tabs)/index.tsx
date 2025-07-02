import {
  client,
  DATABASE_ID,
  databases,
  HABITS_COLLECTION_ID,
  HABITS_COMPLETION_COLLECTION_ID,
  RealTimeResponse,
} from "@/lib/appwrite";
import { useAuth } from "@/lib/auth-context";
import { Habit, HabitCompletion } from "@/types/database.type";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { useEffect, useRef, useState } from "react";
import { ScrollView, View } from "react-native";
import { ID, Query } from "react-native-appwrite";
import Swipeable from "react-native-gesture-handler/Swipeable";
import { Text } from "react-native-paper";
export default function HomeScreen() {
  const { user } = useAuth();
  const [habits, setHabits] = useState<Habit[]>();
  const [completedHabit, setCompletedHabit] = useState<string[]>();
  const swipeableRefs = useRef<{ [key: string]: Swipeable | null }>({});
  useEffect(() => {
    if (user) {
      fetchHabits();
      const habitsChannel = `databases.${DATABASE_ID}.collections.${HABITS_COLLECTION_ID}.documents`;
      const habitsSubscription = client.subscribe(
        habitsChannel,
        (response: RealTimeResponse) => {
          if (
            response.events.includes(
              "databases.*.collections.*.documents.*.create"
            )
          ) {
            fetchHabits();
          } else if (
            response.events.includes(
              "databases.*.collections.*.documents.*.update"
            )
          ) {
            fetchHabits();
          } else if (
            response.events.includes(
              "databases.*.collections.*.documents.*.delete"
            )
          ) {
            fetchHabits();
          }
        }
      );
      const completionsChannel = `databases.${DATABASE_ID}.collections.${HABITS_COMPLETION_COLLECTION_ID}.documents`;
      const completionsSubscription = client.subscribe(
        completionsChannel,
        (response: RealTimeResponse) => {
          if (
            response.events.includes(
              "databases.*.collections.*.documents.*.create"
            )
          ) {
            fetchTodaysCompletion();
          }
        }
      );

      fetchHabits();
      fetchTodaysCompletion();
      return () => {
        habitsSubscription();
        completionsSubscription();
      };
    }
  }, [user]);
  const fetchTodaysCompletion = async () => {
    try {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const response = await databases.listDocuments(
        DATABASE_ID,
        HABITS_COMPLETION_COLLECTION_ID,
        [
          Query.equal("user_id", user?.$id ?? ""),
          Query.greaterThanEqual("completed_at", today.toISOString()),
        ]
      );
      const completions = response.documents as HabitCompletion[];
      setCompletedHabit(completions.map((c) => c.habit_id));
    } catch (error) {
      console.error(error);
    }
  };
  const fetchHabits = async () => {
    try {
      const response = await databases.listDocuments(
        DATABASE_ID,
        HABITS_COLLECTION_ID,
        [Query.equal("user_id", user?.$id ?? "")]
      );
      setHabits(response.documents as Habit[]);
    } catch (error) {
      console.error(error);
    }
  };
  const handleDeleteHabit = async (id: string) => {
    try {
      await databases.deleteDocument(DATABASE_ID, HABITS_COLLECTION_ID, id);
    } catch (error) {
      console.error(error);
    }
  };
  const handleCompleteHabit = async (id: string) => {
    if (!user || completedHabit?.includes(id)) return;
    try {
      const currentDate = new Date().toISOString();
      await databases.createDocument(
        DATABASE_ID,
        HABITS_COMPLETION_COLLECTION_ID,
        ID.unique(),
        {
          habit_id: id,
          user_id: user?.$id,
          completed_at: currentDate,
        }
      );
      const habit = habits?.find((h) => h.$id === id);
      if (!habit) return;

      await databases.updateDocument(DATABASE_ID, HABITS_COLLECTION_ID, id, {
        streak_count: habit.streak_count + 1,
        last_completed: currentDate,
      });
    } catch (error) {
      console.error(error);
    }
  };
  const isHabitCompleted = (habitId: string) =>
    completedHabit?.includes(habitId);

  const renderRightActions = (habitId: string) => (
    <View className="justify-center items-flex-start, flex-1 bg-cyan-900 mb-4 mt-2 rounded-2xl pl-4">
      {isHabitCompleted(habitId) ? (
        <Text className="text-white text-sm">Completed! </Text>
      ) : (
        <MaterialCommunityIcons
          name="check-circle-outline"
          size={24}
          color={"#ffffff"}
        />
      )}
    </View>
  );
  const renderLeftActions = () => (
    <View className="justify-center items-flex-end, flex-1 bg-red-500 mb-4 mt-2 rounded-2xl pr-4">
      <MaterialCommunityIcons
        name="trash-can-outline"
        size={24}
        color={"#ffffff"}
      />
    </View>
  );

  return (
    <View className="flex-1 p-4">
      <View className="mb-4 justify-center items-center">
        <Text variant="titleMedium">Todays Habits</Text>
      </View>
      <ScrollView showsVerticalScrollIndicator={false}>
        {habits?.length === 0 ? (
          <View>
            {""}
            <Text className="text-center text-gray-500">
              No habits Yet. Add your first Habit
            </Text>
          </View>
        ) : (
          habits?.map((habit, key) => (
            <Swipeable
              ref={(ref) => {
                swipeableRefs.current[habit.$id] = ref;
              }}
              key={key}
              overshootLeft={false}
              overshootRight={false}
              renderRightActions={() => renderRightActions(habit.$id)}
              renderLeftActions={renderLeftActions}
              onSwipeableOpen={(direction) => {
                if (direction === "left") {
                  handleDeleteHabit(habit.$id);
                } else if (direction === "right") {
                  handleCompleteHabit(habit.$id);
                  // Handle right swipe action if needed
                }
                swipeableRefs.current[habit.$id]?.close();
              }}
            >
              <View
                key={habit.$id}
                className={`w-full bg-violet-50 rounded-2xl p-4 shadow-sm mb-4 ${
                  isHabitCompleted(habit.$id)
                    ? "opacity-50 border border-[#7c4dff]"
                    : ""
                }`}
              >
                <Text
                  variant="titleMedium"
                  className="text-base font-bold text-black"
                >
                  {habit.title}
                </Text>
                <Text className="text-sm text-gray-600 mb-2">
                  {habit.description}
                </Text>

                <View className="flex-row justify-between items-center">
                  <View className="flex-row items-center space-x-1 bg-orange-100 px-2 py-1 rounded-full">
                    <MaterialCommunityIcons
                      name="fire"
                      size={14}
                      color="#fb923c"
                    />
                    <Text className="text-sm font-medium text-orange-600">
                      {habit.streak_count} day streak
                    </Text>
                  </View>

                  <View className="bg-violet-100 px-3 py-1 rounded-full">
                    <Text className="text-sm font-semibold text-violet-700">
                      {habit.frequency.charAt(0).toUpperCase() +
                        habit.frequency.slice(1)}
                    </Text>
                  </View>
                </View>
              </View>
            </Swipeable>
          ))
        )}
      </ScrollView>
    </View>
  );
}
