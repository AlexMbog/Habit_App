import AntDesign from '@expo/vector-icons/AntDesign';
import { Tabs } from "expo-router";

export default function TabsLayout() {
  return (
  
  <Tabs screenOptions={{tabBarActiveTintColor: 'coral'}} >
    <Tabs.Screen name="index" 
    
    options={{  title: "home",
    
      tabBarIcon:({color}) => (<AntDesign name="home" size={24} color={color} />)
    }} />
    <Tabs.Screen name="login" options={{  title: "login",
      tabBarIcon:() => (<AntDesign name="login" size={24} color="black" />)

    }} />
    </Tabs>
    
  )
}
// This file is used to define the layout for the tabs in the app.