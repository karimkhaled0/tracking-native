import { StyleSheet, Text, View, SafeAreaView, Image, RefreshControl } from 'react-native'
import HomeScreen from './screens/HomeScreen';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import 'react-native-gesture-handler'
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import ChatScreen from './screens/ChatScreen';
import NotificationScreen from './screens/NotificationScreen';
import * as SecureStore from 'expo-secure-store';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import TaskView from './components/TaskView';
import TaskStarted from './components/TaskStarted';
import Report from './components/Report';
import TaskFinished from './components/TaskFinished';
import TaskMap from './components/TaskMap';
import tw from 'twrnc';
import React, { useState, useEffect, createContext, useContext, useReducer, useMemo, useCallback } from 'react'
import { Icon } from '@rneui/base';
import { Button, Avatar } from '@rneui/themed';
import { ScrollView, TextInput } from 'react-native-gesture-handler';
import { useNavigation } from '@react-navigation/native';
import ChatInside from './components/ChatInside';
import * as Location from 'expo-location';
const Stack = createNativeStackNavigator()
const Tab = createBottomTabNavigator();
const AuthContext = createContext();
import { io } from "socket.io-client";
const wait = timeout => {
  return new Promise(resolve => setTimeout(resolve, timeout));
};
// Home Screens
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

// Chat Screens
function ChatStack() {
  return (
    <Stack.Navigator screenOptions={{ animationEnabled: false }}>
      <Stack.Screen
        name="ChatScreen"
        component={ChatScreen}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="ChatInside"
        component={ChatInside}
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
    const res = await fetch('http://10.0.3.67:8000/signin', {
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
      const res = await fetch(`http://10.0.3.67:8000/api/user/me`, {
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
      const res = await fetch(`http://10.0.3.67:8000/api/user/me`, {
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
          const res = await fetch(`http://10.0.3.67:8000/api/user/changepassword`, {
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

// Profile Screen
function ProfileScreen() {
  const navigation = useNavigation()
  // Refresh Control
  const [refreshing, setRefreshing] = useState(false);
  const onRefresh = useCallback(() => {
    setRefreshing(true);
    wait(2000).then(() => {
      setRefreshing(false)
    });
  }, []);
  const [userData, setUserData] = useState([])
  // Get user DATA
  const getUserData = useEffect(() => {
    const data = async () => {
      let token = await SecureStore.getItemAsync('userToken');
      const res = await fetch('http://10.0.3.67:8000/api/user/me', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'authorization': `Bearer ${token}`
        },
      }).then((t) => t.json())
      setUserData([res.data])
    }
    data()
  }, [refreshing])

  // Update User Data
  const [edit, setEdit] = useState(false)
  const [editedPhone, setEditedPhone] = useState(userData[0]?.phonenumber)
  const [editAddress, setEditAddress] = useState(userData[0]?.address)
  const [editName, setEditName] = useState(userData[0]?.name)

  console.log(userData)
  const updateUser = async () => {
    let token = await SecureStore.getItemAsync('userToken');
    const res = await fetch(`http://10.0.3.67:8000/api/user/${userData[0]._id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        phonenumber: editedPhone,
        address: editAddress,
        name: editName
      })
    }).then((t) => t.json()).catch((e) => console.log(e))
    setEdit(!edit)

  }

  const { signOut } = useContext(AuthContext);

  return (
    <SafeAreaView
      style={tw.style('bg-[#F8F8F8] h-full pt-10 mt-2', {
      })}
    >
      <View
        style={tw.style('', {
        })}
      >
        <Text style={tw`text-4xl ml-5 font-semibold mb-5 text-[#4A649F]`}>My profile</Text>
        <ScrollView
          style={tw.style('p-3', {
          })}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
            />
          }
        >
          {/* Profile section */}
          {
            userData?.map((item) => (
              <View
                style={tw.style('', {
                })}
                key={item._id}
              >
                {/* Name and Photo */}
                <View
                  style={tw.style('h-36 bg-[#4A649F] rounded-lg flex items-center justify-center mb-10', {

                  })}
                >
                  <Avatar
                    size={64}
                    rounded
                    title={item.name[0]}
                    titleStyle={{ color: '#BDBDBD' }}
                    containerStyle={{ backgroundColor: 'white' }}
                  />
                  {
                    edit ? (
                      <TextInput
                        placeholder='Change Your name'
                        value={editName}
                        style={tw.style('bg-white rounded-lg w-52 mt-3 p-1 text-xl', {
                        })}
                        onChangeText={(text) => setEditName(text)}
                      />
                    ) : (
                      <Text style={tw`text-2xl text-white font-semibold mt-3`}>{item.name}</Text>
                    )
                  }

                </View>
                {/* Login Id */}
                <View
                  style={tw.style('h-18 bg-white rounded-lg shadow-md flex-row items-center', {
                    justifyContent: "space-between"
                  })}
                >
                  <Icon
                    style={
                      tw.style('p-2 bg-white w-11', {
                        elevation: 3,
                      })
                    }
                    type='font-awesome-5'
                    name='id-card'
                    size={20}
                    color='#4A649F'

                  />
                  <Text style={tw`text-xl text-black`}>{item.loginId}</Text>
                  <Icon
                    style={
                      tw.style('p-2 bg-white w-11', {
                        elevation: 3,
                      })
                    }
                  />
                </View>
                {/* Phone number */}
                <View
                  style={tw.style('h-18 bg-white rounded-lg shadow-md flex-row items-center mt-5', {
                    justifyContent: "space-between"
                  })}
                >
                  <Icon
                    style={
                      tw.style('p-2 bg-white w-11', {
                        elevation: 3,
                      })
                    }
                    type='font-awesome-5'
                    name='phone-alt'
                    color='#4A649F'
                    size={20}
                  />
                  {
                    edit ? (
                      <TextInput
                        placeholder='Change Your phone'
                        value={editedPhone}
                        style={tw.style('bg-white rounded-lg h-18 text-xl', {
                        })}
                        onChangeText={(text) => setEditedPhone(text)}
                      />
                    ) : (
                      <Text style={tw`text-xl text-black`}>{item.phonenumber}</Text>
                    )
                  }
                  <Icon
                    style={
                      tw.style('p-2 bg-white w-11', {
                        elevation: 3,
                      })
                    }
                  />
                </View>
                {/* Address */}
                <View
                  style={tw.style('h-18 bg-white rounded-lg shadow-md flex-row items-center mt-5', {
                    justifyContent: "space-between"
                  })}
                >
                  <View>
                    <Icon
                      style={
                        tw.style('p-2 bg-white w-11', {
                          elevation: 3,
                        })
                      }
                      type='font-awesome-5'
                      name='map-marker-alt'
                      color='#4A649F'
                      size={20}

                    />
                  </View>
                  {
                    edit ? (
                      <TextInput
                        placeholder='Change Your address'
                        value={editAddress}
                        style={tw.style('bg-white rounded-lg h-18 text-xl', {
                        })}
                        onChangeText={(text) => setEditAddress(text)}
                      />
                    ) : (
                      <Text style={tw`text-xl text-black`}>{item.address}</Text>
                    )
                  }
                  <Icon
                    style={
                      tw.style('p-2 bg-white w-11', {
                        elevation: 3,
                      })
                    }
                  />
                </View>
                {/* Password */}
                <View
                  style={tw.style('h-18 bg-white rounded-lg shadow-md flex-row items-center mt-5', {
                    justifyContent: "space-between"
                  })}
                >
                  <View>
                    <Icon
                      style={
                        tw.style('p-2 bg-white w-11', {
                          elevation: 3,
                        })
                      }
                      type='font-awesome-5'
                      name='lock'
                      size={20}
                      color='#4A649F'
                    />
                  </View>
                  <Text style={tw`text-xl text-black ml-2`}>**********</Text>
                  <Button title="Change" type="solid" buttonStyle={tw`bg-[#4A649F] pt-2 pb-2 rounded-lg mr-2`} />
                </View>

                {
                  edit ? (
                    <View
                      style={tw.style('flex-row mt-10', {
                        justifyContent: "space-evenly"
                      })}
                    >
                      <Button title="Update" onPress={updateUser} type="solid" titleStyle={{ color: 'white' }} buttonStyle={tw`bg-[#4A649F] w-40 pt-2 pb-2 rounded-lg mr-2 mt-10`} />
                      <Button title="Cancel" onPress={() => setEdit(!edit)} titleStyle={{ color: 'red' }} type="outline" buttonStyle={tw`w-40 pt-2 pb-2 rounded-lg mr-2 mt-10`} />
                    </View>

                  ) : (
                    <View
                      style={tw.style('flex-row mt-10', {
                        justifyContent: "space-evenly"
                      })}
                    >
                      <Button title="Edit" onPress={() => setEdit(!edit)} titleStyle={{ color: 'white' }} type="solid" buttonStyle={tw`bg-[#4A649F] w-40 pt-2 pb-2 rounded-lg mr-2 mt-10`} />
                      <Button title="Log out" onPress={signOut} titleStyle={{ color: 'red' }} type="outline" buttonStyle={tw`w-40 pt-2 pb-2 rounded-lg mr-2 mt-10`} />
                    </View>
                  )
                }

              </View>
            ))
          }

        </ScrollView>
      </View>
      <ScrollView></ScrollView>

      {/* HomeIcons */}
      <View
        style={tw.style('flex-row p-3', {
          justifyContent: 'space-between',
          alignItems: 'flex-end'
        })}
      >
        <Icon
          style={
            tw.style('p-2 bg-[#F8F8F8] w-20', {
              elevation: 3,
            })
          }
          type='font-awesome-5'
          name='tasks'
          color='black'
          onPress={() => navigation.navigate('HomeStack')}

        />
        <Icon
          style={
            tw.style('p-2 bg-[#F8F8F8] w-20', {
              elevation: 3,
            })
          }
          type='font-awesome-5'
          name='headset'
          color='black'
          onPress={() => navigation.navigate('ChatStack')}

        />
        <Icon
          style={
            tw.style('p-2 bg-[#F8F8F8] w-20', {
              elevation: 3,
            })
          }
          type='font-awesome-5'
          name='bell'
          color='black'
          onPress={() => navigation.navigate('NotificationScreen')}

        />
        <Icon
          style={
            tw.style('p-2 bg-[#F8F8F8] w-20', {
              elevation: 3,
            })
          }
          type='font-awesome-5'
          name='user'
          color='#4A649F'
        />
      </View>
    </SafeAreaView >
  )
}

// App Tabs bottom
export default function App() {
  const socket = io("http://10.0.3.67:8000");

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
        case 'SIGN_OUT':
          return {
            ...prevState,
            isSignout: true,
            userToken: null,
          };
      }
    },
    {
      isSignout: false,
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
        const res = await fetch('http://10.0.3.67:8000/api/user/me', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'authorization': `Bearer ${userToken}`
          },
        }).then((t) => t.json())
        if (res.error == 'Not Authorized') {
          throw 'SignOut'
        }
      } catch (e) {
        // Restoring token failed
        return dispatch({ type: 'SIGN_OUT' })
      }

      // After restoring token, we may need to validate it in production apps

      // This will switch to the App screen or Auth screen and this loading
      // screen will be unmounted and thrown away.
      dispatch({ type: 'RESTORE_TOKEN', token: userToken });
    };

    bootstrapAsync();
  }, []);

  // dispatch all the reducers (Dispatch means to call it )
  const authContext = useMemo(
    () => ({
      signIn: async (data) => {
        let userToken;
        userToken = await SecureStore.getItemAsync('userToken');
        dispatch({ type: 'SIGN_IN', token: userToken });
      },
      changePass: () => dispatch({ type: 'CHANGE_PASS' }),
      passChanged: () => dispatch({ type: 'PASS_CHANGED' }),
      signOut: () => dispatch({ type: 'SIGN_OUT' }),

    }),
    []
  );

  // Get location of user
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        console.log('hi')
      }

      let location = await Location.getCurrentPositionAsync({});
      setLocation(location);
    })();
  }, []);
  socket.emit('location:get', location)


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
                    name='ChatStack'
                    component={ChatStack}
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
