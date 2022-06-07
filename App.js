import { Text, View, SafeAreaView, Image } from 'react-native';
import HomeScreen from './screens/HomeScreen';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import 'react-native-gesture-handler'
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Login from './screens/Login';
import { useEffect, useState } from 'react';
import tw from 'twrnc';
import ChatScreen from './screens/ChatScreen';
import ProfileScreen from './screens/ProfileScreen';
import NotificationScreen from './screens/NotificationScreen';
import * as SecureStore from 'expo-secure-store';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import TaskView from './components/TaskView';
import TaskStarted from './components/TaskStarted';
import Report from './components/Report';
import TaskFinished from './components/TaskFinished';
import TaskMap from './components/TaskMap';
import { Button } from '@rneui/themed';
import { TextInput } from 'react-native-gesture-handler';
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
      <Stack.Screen
        name="TaskMap"
        component={TaskMap}
        options={{
          headerShown: false,
        }}
      />
    </Stack.Navigator>
  )
}
// App Tabs bottom
export default function App() {
  // Loggin functions
  const [loginId, setloginId] = useState('');
  const [password, setPassword] = useState('');
  const [clicked, setClicked] = useState(false); // for checking if user or not and redirect to home screen
  // handle errors
  const [loginIdErr, setloginIdErr] = useState('')
  const [passwordErr, setPasswordErr] = useState('')
  const loginSubmit = async () => {
    setloginIdErr('')
    setPasswordErr('')
    const res = await fetch('http://192.168.43.101:8000/signin', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'authorization': `Bearer ${process.env.LOGTAIL_TOKEN}`
      },
      body: JSON.stringify({
        loginId,
        password
      })

    }).then((t) => t.json())
    if (res.token) {
      await SecureStore.setItemAsync('userToken', res.token);
    }

    const error = res.errors
    if (!error) {
      setClicked(true)
      console.log('done')
      return
    } else {
      console.log(error)
      if (error.loginId) {
        setloginIdErr(error.loginId)
      }
      if (error.password) {
        setPasswordErr(error.password)
      }
    }
  }

  // Logged check
  const [logged, setLogged] = useState(false)
  const loginHandler = useEffect(() => {
    const data = async () => {
      let token = await SecureStore.getItemAsync('userToken');
      const res = await fetch(`http://192.168.43.101:8000/api/user/me`, {
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
  }, [clicked])
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
            // Loggin page
            <SafeAreaView style={tw`bg-white h-full`}>
              <View style={tw`p-5`}>
                <Image
                  source={require(`./images/logo.png`)}
                  style={tw.style('mt-20', {
                    width: '20%',
                    height: '20%',
                    resizeMode: 'contain',
                    marginRight: 'auto',
                    marginLeft: 'auto'
                  })}
                />
                <View style=
                  {tw.style('mt-15 mb-10 ml-5', {
                    justifyContent: "center",
                    zIndex: 3

                  })}>
                  <Text
                    style={tw.style('text-xl text-[#4A649F] mt-2', {
                    })}
                  >Login to your account</Text>
                  <View
                    style={tw.style('mt-3', {
                    })}
                  >
                    <Text
                      style={tw.style('text-lg text-gray-500', {
                      })}
                    >Login Id</Text>
                    <TextInput
                      value={loginId}
                      keyboardType='number-pad'
                      style={tw.style('bg-white rounded-lg p-3 text-lg border border-[#4A649F] mt-5 ml-3', {
                        textAlignVertical: 'top'
                      })}
                      placeholder={'Login Id'}
                      onChangeText={(text) => setloginId(text)}
                    />
                    <Text
                      style={tw.style('text-lg text-red-500 ml-3', {
                      })}
                    >{loginIdErr}</Text>
                  </View>
                  <View
                    style={tw.style('mt-3', {
                    })}
                  >
                    <Text
                      style={tw.style('text-lg text-gray-500', {
                      })}
                    >Password</Text>
                    <TextInput
                      value={password}
                      style={tw.style('bg-white rounded-lg p-3 text-lg border border-[#4A649F] mt-5 ml-3', {
                        textAlignVertical: 'top'
                      })}
                      placeholder={'Password'}
                      secureTextEntry={true}
                      onChangeText={(text) => setPassword(text)}
                    />
                    <Text
                      style={tw.style('text-lg text-red-500 ml-3', {
                      })}
                    >{passwordErr}</Text>
                  </View>
                  <Button title="Sign in" type="solid" onPress={loginSubmit} buttonStyle={tw`bg-[#4A649F] ml-15 mt-5 mr-15 pt-2 pb-2 rounded-lg`} />
                </View>
              </View>
            </SafeAreaView>
          )
        }
      </SafeAreaProvider>
    </NavigationContainer>
  );
}
