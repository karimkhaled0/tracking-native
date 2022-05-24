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
const Tab = createBottomTabNavigator();


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
  const [logged, setLogged] = useState(false)

  const finish = useEffect(() => {
    const data = async () => {
      let token = await SecureStore.getItemAsync('userToken');
      const res = await fetch(`http://192.168.1.7:8000/api/user/me`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'authorization': `Bearer ${token}`
        },
      }).then((t) => t.json())
      if (res.error) {
        setLogged(false)
      } else {
        setLogged(true)
      }
    }
    data()
  })

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
              <Tab.Screen
                name='HomeStack'
                component={HomeStack}
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
