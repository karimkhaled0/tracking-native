import { StyleSheet, Text, View } from 'react-native';
import HomeScreen from './screens/HomeScreen';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import 'react-native-gesture-handler'
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Login from './screens/Login';
import { useEffect, useState } from 'react';
import ChatScreen from './screens/ChatScreen';
import ProfileScreen from './screens/ProfileScreen';
import NotificationScreen from './screens/NotificationScreen';
import * as SecureStore from 'expo-secure-store';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import TaskView from './components/TaskView';
import TaskStarted from './components/TaskStarted';
import Report from './components/Report';
import TaskFinished from './components/TaskFinished';
const Stack = createNativeStackNavigator()


// Home Stacks
function HomeStack() {
  return (
    <Stack.Navigator screenOptions={{ animationEnabled: false }}>
      <Stack.Screen
        name="HomeScreen"
        component={HomeScreen}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="TaskView"
        component={TaskView}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="TaskStarted"
        component={TaskStarted}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="Report"
        component={Report}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="TaskFinished"
        component={TaskFinished}
        options={{
          headerShown: false,
        }}
      />
    </Stack.Navigator>
  )
}
// App Tabs bottom
export default function App() {
  const Tab = createBottomTabNavigator();
  const [logged, setLogged] = useState(false)

  const loginHandler = useEffect(() => {
    const data = async () => {
      const res = await fetch('http://192.168.1.2:8000/signin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'authorization': `Bearer ${process.env.LOGTAIL_TOKEN}`
        },
        body: JSON.stringify({
          loginId: '201910115',
          password: '123456789'
        })

      }).then((t) => t.json())
      await SecureStore.setItemAsync('userToken', res.token);
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
        {
          logged ? (
            <Tab.Navigator>
              <Tab.Screen
                name='HomeStack'
                component={HomeStack}
                options={{
                  headerShown: false,
                  title: '',
                  tabBarStyle: { display: 'none' },

                }}
              />
              <Tab.Screen
                name='ChatScreen'
                component={ChatScreen}
                options={{
                  headerShown: false,
                  title: '',
                  tabBarStyle: { display: 'none' },
                }}

              />
              <Tab.Screen
                name='NotificationScreen'
                component={NotificationScreen}
                options={{
                  headerShown: false,
                  title: '',
                  tabBarStyle: { display: 'none' },
                }}
              />
              <Tab.Screen
                name='ProfileScreen'
                component={ProfileScreen}
                options={{
                  headerShown: false,
                  title: '',
                  tabBarStyle: { display: 'none' },
                }}
              />
            </Tab.Navigator>
          ) : (
            <Tab.Navigator>
              <Tab.Screen
                name='loginScreen'
                component={Login}
                options={{
                  headerShown: false,
                  title: '',
                  tabBarStyle: { display: 'none' },

                }}
              />
            </Tab.Navigator>
          )
        }
      </SafeAreaProvider>
    </NavigationContainer>
  );
}
