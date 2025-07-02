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
import { useEffect, useRef, useState } from "react";
import { View } from "react-native";
import { Query } from "react-native-appwrite";
import { ScrollView } from "react-native-gesture-handler";
import Swipeable from "react-native-gesture-handler/Swipeable";
import { Card, Text } from "react-native-paper";
export default function streaksScreen() {
  const { user } = useAuth();
  const [habits, setHabits] = useState<Habit[]>([]);
  const [completedHabit, setCompletedHabit] = useState<HabitCompletion[]>([]);

  useEffect(() => {
    if (user) {
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
            fetchCompletions();
          }
        }
      );

      fetchHabits();
      fetchCompletions();
      return () => {
        habitsSubscription();
        completionsSubscription();
      };
    }
  }, [user]);
  const fetchCompletions = async () => {
    try {
      const response = await databases.listDocuments(
        DATABASE_ID,
        HABITS_COMPLETION_COLLECTION_ID,
        [Query.equal("user_id", user?.$id ?? "")]
      );
      const completions = response.documents as HabitCompletion[];
      setCompletedHabit(completions);
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
  interface StreakData {
    streak: number;
    bestStreak: number;
    total: number;
  }

  const getSteakData = (habitId: string) => {
    const habitCompletions = completedHabit
      ?.filter((c) => c.habit_id === habitId)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    if (habitCompletions?.length === 0) {
      return { streak: 0, bestStreak: 0, total: 0 };
    }

    let streak = 0;
    let bestStreak = 0;
    let total = habitCompletions.length;

    let lastDate: Date | null = null;
    let currentStreak = 0;
    habitCompletions?.forEach((c) => {
      const date = new Date(c.completed_at);
      if (lastDate) {
        const diff =
          (date.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24);
        if (diff <= 1.5) {
          currentStreak += 1;
        } else {
          currentStreak = 1;
        }
      } else {
        currentStreak = 1;
      }
      if (currentStreak > bestStreak) bestStreak = currentStreak;
      streak = currentStreak;
      lastDate = date;
    });

    return { streak, bestStreak, total };
  };
  const habitStreaks = habits.map((habit) => {
    const { streak, bestStreak, total } = getSteakData(habit.$id);
    return { habit, bestStreak, streak, total };
  });
  const rankedHabits = habitStreaks.sort((a, b) => b.bestStreak - a.bestStreak);
  return (
    <View className="flex-1 background-white p-4 text-center">
      <Text className="mb-4" variant="headlineSmall">
        Habit Streaks
      </Text>
      {rankedHabits.length > 0 && (
        <View
          className="mb-6 rounded-2xl bg-[#fff] shadow-[#000]  p-2  "
          style={{
            elevation: 2,
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.08,
          }}
        >
          <Text className="text-center font-bold mb-4" variant="titleMedium">
            🥇 Top Streaks
          </Text>
          {""}
          {rankedHabits.slice(0, 3).map((item, key) => (
            <View
              key={key}
              className="flex-row items-center mb-2 pb-2 border-b-1px border-white"
            >
              <View
                className={`rounded-full w-8 h-8 items-center justify-center mr-4 ${
                  key + 1 === 1
                    ? "bg-[#FFD700]" // Gold
                    : key + 1 === 2
                      ? "bg-[#C0C0C0]" // Silver
                      : key + 1 === 3
                        ? "bg-[#CD7F32]" // Bronze
                        : "bg-[#e0e0e0]" // Default
                }`}
              >
                <Text className="text-sm color-white ">{key + 1}</Text>
              </View>

              <Text className="flex-1 font color-[#333] text-[15px] font-semibold">
                {item.habit.title}
              </Text>
              <Text className="text-[15px] color-[#7c4dff] font-bold">
                {item.bestStreak}
              </Text>
            </View>
          ))}
        </View>
      )}

      {habits?.length == 0 ? (
        <View>
          {""}
          <Text className="text-center text-gray-500">
            No habits Yet. Add your first Habit
          </Text>
        </View>
      ) : (
        <ScrollView
          className="flex-1 bg-[#f0f0f0]"
          showsVerticalScrollIndicator={false}
        >
          {rankedHabits.map(({ habit, streak, bestStreak, total }, key) => (
            <Card
              key={key}
              className={`w-[90%] self-center mb-6  rounded-2xl bg-[#fff] shadow-[#000] border p-8 ${
                key === 0 ? "border-[#7c4dff]" : "border-[#f0f0f0]"
              }`}
              style={{
                elevation: 3,
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.08,
              }}
            >
              <Card.Content>
                <Text variant="titleMedium" className="mb-2 text-lg font-bold">
                  {habit.title}
                </Text>
                <Text className="text-[#6c6c80] mb-2 ">
                  {habit.description}
                </Text>
                <View className="flex-row justify-between items-center mb-3 mt-2">
                  <View className="bg-[#fff3e0] rounded-xl items-center w-md py-4 px-6 min-w-lg">
                    <Text className="font-bold color-[#22223b]">
                      🔥 {streak}
                    </Text>
                    <Text className="color-[#22223b]">Current</Text>
                  </View>
                  <View className="bg-[#fffde7] rounded-xl items-center w-md py-4 px-6 min-w-lg">
                    <Text className="font-bold  color-[#22223b] ">
                      🏆 {bestStreak}
                    </Text>
                    <Text className=" color-[#22223b]">Best</Text>
                  </View>
                  <View className="bg-[#e8f5e9] rounded-xl items-center w-md py-4 px-6 min-w-lg">
                    <Text className="font-bold  color-[#22223b]">
                      ✅{total}
                    </Text>
                    <Text className="color-[#22223b]">Total</Text>
                  </View>
                </View>
              </Card.Content>
            </Card>
          ))}
        </ScrollView>
      )}
    </View>
  );
}
