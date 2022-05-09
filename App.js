import { StyleSheet, Text, View } from 'react-native';
import HomeScreen from './screens/HomeScreen';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import 'react-native-gesture-handler'
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Login from './screens/Login';
import { useEffect, useState } from 'react';

export default function App() {
  const Stack = createNativeStackNavigator()
  const [logged, setLogged] = useState(false)

  const loginHandler = useEffect(() => {
    const data = async () => {
      const res = await fetch('http://192.168.1.8:8000/signin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'authorization': `Bearer ${process.env.LOGTAIL_TOKEN}`
        },
        body: JSON.stringify({
          loginId: '201910112',
          password: '123456789'
        })

      }).then((t) => t.json())
      if (res.token) {
        setLogged(true)
      } else {
        setLogged(false)
      }
    }
    data()
  }, [])
  return (
    <NavigationContainer>
      <SafeAreaProvider>
        <Stack.Navigator>
          {
            logged ? (<Stack.Screen
              name='HomeScreen'
              component={HomeScreen}
              options={{
                headerShown: false
              }}
            />) : (<Stack.Screen
              name='Login'
              component={Login}
              options={{
                headerShown: false
              }}
            />)
          }


        </Stack.Navigator>
      </SafeAreaProvider>
    </NavigationContainer>
  );
}
