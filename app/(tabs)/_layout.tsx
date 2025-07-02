import AntDesign from "@expo/vector-icons/AntDesign";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Tabs } from "expo-router";
export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: "coral",
        tabBarInactiveTintColor: "gray",
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Todays Habit",

          tabBarIcon: ({ color }) => (
            <Ionicons name="calendar-outline" size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="streaks"
        options={{
          title: "Streaks",

          tabBarIcon: ({ color }) => (
            <FontAwesome5 name="chart-bar" size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="add_habit"
        options={{
          title: "Add Habit",

          tabBarIcon: ({ color }) => (
            <AntDesign name="pluscircle" size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="user"
        options={{
          title: "Profile",
          tabBarIcon: ({ color }) => (
            <AntDesign name="user" size={24} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
// This file is used to define the layout for the tabs in the app.
