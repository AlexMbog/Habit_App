import { View, Text } from 'react-native'
import React from 'react'
import { Link } from 'expo-router';

const Login = () => {
  return (
    <View>
      <Text>

        <Link href="/auth" >
        
          Login
        </Link>
      </Text>
    </View>
  )
}

export default Login;