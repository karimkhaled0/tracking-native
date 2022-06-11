import { StyleSheet, Text, View, SafeAreaView, Image } from 'react-native'
import HomeScreen from './screens/HomeScreen';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import 'react-native-gesture-handler'
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
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
import tw from 'twrnc';
import React, { useState, useEffect, createContext, useContext, useReducer, useMemo } from 'react'
import { Button } from '@rneui/themed';
import { TextInput } from 'react-native-gesture-handler';
const Stack = createNativeStackNavigator()
const Tab = createBottomTabNavigator();
const AuthContext = createContext();

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

// Login Screen
function LoginScreen() {
  const [loginId, setloginId] = useState('');
  const [password, setPassword] = useState('');

  // handle errors
  const [loginIdErr, setloginIdErr] = useState('')
  const [passwordErr, setPasswordErr] = useState('')
  const { signIn } = useContext(AuthContext);
  const { changePass } = useContext(AuthContext);
  const { passChanged } = useContext(AuthContext);

  const submitForm = async () => {
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
      // here i got the token and check if user change his password
      // before or not
      let token = await SecureStore.getItemAsync('userToken');
      const res = await fetch(`http://192.168.43.101:8000/api/user/me`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'authorization': `Bearer ${token}`
        },
      }).then((t) => t.json())
      if (res.data.changePasswordCounter == 0) {
        // if not i give the signIn auth to continue 
        signIn({ loginId, password })
        // and the change pass auth will be true
        changePass()
      } else {
        // if he changed before signIn auth will continue
        signIn({ loginId, password })
        // and pass Changed will be false to not render the change pass screen
        passChanged()
        return
      }

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

  return (
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
              onChangeText={(text) => {
                setloginId(text)
                setloginIdErr('')
              }}
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
              onChangeText={(text) => {
                setPassword(text)
                setPasswordErr('')
              }}
            />
            <Text
              style={tw.style('text-lg text-red-500 ml-3', {
              })}
            >{passwordErr}</Text>
          </View>
          <Button title="Sign in" type="solid" onPress={submitForm} buttonStyle={tw`bg-[#4A649F] ml-15 mt-5 mr-15 pt-2 pb-2 rounded-lg`} />
        </View>
      </View>
    </SafeAreaView>
  );
}

// Change Password for first time
function ChangePasswordScreen() {

  const [shouldChange, setShouldChange] = useState(false)
  const [password1, setPassword1] = useState('')
  const [password2, setPassword2] = useState('')
  const { passChanged } = useContext(AuthContext);
  // handle errors
  const [passwordStateError, setPasswordStateError] = useState('')

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
      if (res.data.changePasswordCounter == 0) {
        setShouldChange(true)
      } else {
        setShouldChange(false)
      }
    }
    data()
  }, [])
  const changePassword = async () => {
    let token = await SecureStore.getItemAsync('userToken');
    if (shouldChange) {
      if (password1 == password2) {
        if ((password1.length > 8 && password1.length < 16) && (password2.length > 8 && password2.length < 16)) {
          const res = await fetch(`http://192.168.43.101:8000/api/user/changepassword`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              'authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
              password: password1
            })
          }).then((r) => r.json())
          // pass changed will be false when the user change his password
          passChanged()
        } else {
          setPasswordStateError('Password must be between 8 and 16 characters')
        }
      } else {
        setPasswordStateError('Passwords must match')
      }
    }
  }
  return (
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
          >Change your password</Text>
          <View
            style={tw.style('mt-3', {
            })}
          >
            <Text
              style={tw.style('text-lg text-gray-500', {
              })}
            >New password</Text>
            <TextInput
              value={password1}
              style={tw.style('bg-white rounded-lg p-3 text-lg border border-[#4A649F] mt-5 ml-3', {
                textAlignVertical: 'top'
              })}
              secureTextEntry={true}
              placeholder={'New password'}
              onChangeText={(text) => setPassword1(text)}
            />
          </View>
          <View
            style={tw.style('mt-3', {
            })}
          >
            <Text
              style={tw.style('text-lg text-gray-500', {
              })}
            >Confirm new password</Text>
            <TextInput
              value={password2}
              style={tw.style('bg-white rounded-lg p-3 text-lg border border-[#4A649F] mt-5 ml-3', {
                textAlignVertical: 'top'
              })}
              placeholder={'Confirm new password'}
              secureTextEntry={true}
              onChangeText={(text) => setPassword2(text)}
            />
            <Text
              style={tw.style('text-lg text-red-500 ml-3', {
              })}
            >{passwordStateError}</Text>
          </View>
          <Button title="Confirm" type="solid" onPress={changePassword} buttonStyle={tw`bg-[#4A649F] ml-15 mt-5 mr-15 pt-2 pb-2 rounded-lg`} />
        </View>
      </View>
    </SafeAreaView>
  );
}

// App Tabs bottom
export default function App() {
  // Use Reducer for tracking the user login or change his password for first time and also for sign out
  const [state, dispatch] = useReducer(
    (prevState, action) => {
      switch (action.type) {
        case 'RESTORE_TOKEN':
          return {
            ...prevState,
            userToken: action.token,
            isLoading: false,
          };
        case 'SIGN_IN':
          return {
            ...prevState,
            isSignout: false,
            userToken: action.token,
          };
        case 'CHANGE_PASS':
          return {
            ...prevState,
            shouldChange: true,
            isSignout: false,
          };
        case 'PASS_CHANGED':
          return {
            ...prevState,
            shouldChange: false,
            isSignout: false,
          };
      }
    },
    {
      isLoading: true,
      userToken: null,
      shouldChange: false
    }
  );
  // for checking if the user already signed in or not
  useEffect(() => {
    // Fetch the token from storage then navigate to our appropriate place
    const bootstrapAsync = async () => {
      let userToken;

      try {
        // Restore token stored in `SecureStore` or any other encrypted storage
        // userToken = await SecureStore.getItemAsync('userToken');
        userToken = await SecureStore.getItemAsync('userToken');
      } catch (e) {
        // Restoring token failed
      }

      // After restoring token, we may need to validate it in production apps

      // This will switch to the App screen or Auth screen and this loading
      // screen will be unmounted and thrown away.
      dispatch({ type: 'RESTORE_TOKEN', token: userToken });
    };

    bootstrapAsync();
  }, []);

  // dispatch all the reducers 
  const authContext = useMemo(
    () => ({
      signIn: async (data) => {
        let userToken;
        userToken = await SecureStore.getItemAsync('userToken');
        dispatch({ type: 'SIGN_IN', token: userToken });
      },
      changePass: () => dispatch({ type: 'CHANGE_PASS' }),
      passChanged: () => dispatch({ type: 'PASS_CHANGED' }),

    }),
    []
  );
  return (
    <AuthContext.Provider value={authContext}>
      <NavigationContainer>
        <SafeAreaProvider>
          {
            state.userToken == null ? (
              // No token found, user isn't signed in
              <Stack.Navigator>
                <Stack.Screen
                  name="SignIn"
                  component={LoginScreen}
                  options={{
                    headerShown: false,
                  }}
                />
              </Stack.Navigator>
            ) : (
              // User is signed in
              state.shouldChange == true ? (
                <Stack.Navigator>
                  <Stack.Screen
                    name="ChangePassword"
                    component={ChangePasswordScreen}
                    options={{
                      headerShown: false,
                    }}
                  />
                </Stack.Navigator>
              ) : (
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
              )

            )}
        </SafeAreaProvider>
      </NavigationContainer>
    </AuthContext.Provider>
  );
}
