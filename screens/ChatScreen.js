import { Text, View, SafeAreaView, TouchableOpacity, ScrollView, FlatList } from 'react-native'
import React, { useEffect, useRef } from 'react'
import tw from 'twrnc';
import { useNavigation } from '@react-navigation/native';
import { Icon } from '@rneui/base';
import { TextInput } from 'react-native-gesture-handler';
import { Avatar } from '@rneui/themed';
import { useState } from 'react';
import ChatOutside from '../components/ChatOutside';
import { faker } from '@faker-js/faker';
import { format, parseISO } from 'date-fns'
import { io } from "socket.io-client";
import * as SecureStore from 'expo-secure-store';

const socket = io("http://10.0.3.67:8000");
let allChat = []
const ChatScreen = () => {
    socket.on("msg:get", (data) => {
        for (let index = 0; index < data.msg.messages.length; index++) {
            allChat[index] = data.msg.messages[index]
        }
    });
    const [allRooms, setAllRooms] = useState([])
    const navigation = useNavigation()
    const [menu, setMenu] = useState(false)
    const [userData, setUserData] = useState('')

    const getRooms = useEffect(() => {
        const getRoom = async () => {
            let token = await SecureStore.getItemAsync('userToken');
            const ress = await fetch(`http://10.0.3.67:8000/api/user/me`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'authorization': `Bearer ${token}`
                },
            }).then((t) => t.json())
            setUserData(ress.data)
            const res = await fetch('http://10.0.3.67:8000/api/chat', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'authorization': `Bearer ${token}`
                },
            }).then((t) => t.json())
            res.rooms.map((item) => {
                if (item.members[1].name == ress.data.name) {
                    return setAllRooms([item])
                }
            })
        }
        getRoom()
    }, [])
    console.log(allRooms)
    return (
        <SafeAreaView
            style={tw.style('bg-[#F8F8F8] h-full pt-10 mt-2', {
            })}
        >
            {/* Chat */}
            {
                menu ?
                    (
                        <View
                            style={tw.style('flex-row items-center border-b border-gray-200 pb-4', {
                                justifyContent: 'space-between',
                            })}
                        >
                            <View
                                style={tw.style('flex-row items-center', {
                                    justifyContent: 'space-between',
                                })}
                            >
                                <Icon
                                    style={
                                        tw.style('ml-5 mr-10 bg-[#F8F8F8]', {
                                        })
                                    }
                                    type='font-awesome-5'
                                    name='times'
                                    size={25}
                                    color='gray'
                                    onPress={() => setMenu(!menu)}
                                />
                                <Text style={tw`text-2xl `}>1</Text>
                            </View>

                            <View
                                style={tw.style('flex-row items-center', {
                                    justifyContent: 'space-between',
                                })}
                            >
                                <Icon
                                    style={
                                        tw.style('ml-5 bg-[#F8F8F8]', {
                                        })
                                    }
                                    type='font-awesome-5'
                                    name='trash'
                                    size={20}
                                    color='gray'
                                    onPress={() => {
                                        console.log('h')
                                    }}
                                />
                                <Icon
                                    style={
                                        tw.style('ml-5 mr-5 bg-[#F8F8F8]', {
                                        })
                                    }
                                    type='font-awesome-5'
                                    name='user'
                                    size={20}
                                    color='gray'
                                />
                            </View>
                        </View>
                    ) : (
                        <View
                            style={tw.style('flex-row items-center pb-4', {
                                justifyContent: 'space-between',
                            })}
                        >
                            <Text style={tw`text-4xl ml-5 font-semibold`}>Messages</Text>
                            {/*  new Message */}
                            <TouchableOpacity>
                                <Text style={tw`text-2xl mr-5  text-blue-500 font-semibold`}>New Message</Text>
                            </TouchableOpacity>
                        </View>
                    )
            }


            {/* Search */}
            <View
                style={tw.style('', {
                })}
            >
                <View
                    style={
                        tw.style('flex-row bg-white rounded-full mt-5 ml-5 mr-5 items-center', {
                            justifyContent: "flex-start"
                        })
                    }
                >
                    <Icon
                        style={
                            tw.style('pl-5', {
                            })
                        }
                        type='feather'
                        name='search'
                        color='gray'
                    />
                    <TextInput
                        returnKeyType='search'
                        style={tw.style('w-full pt-3 pb-2 pl-3 text-lg ', {
                            textAlignVertical: 'top'
                        })}
                        placeholder={'Search'}
                    />
                </View>
            </View>


            {/* User chat */}
            <FlatList
                data={allRooms}
                renderItem={({ item }) => {
                    return (
                        <TouchableOpacity
                            onLongPress={() => {
                                setMenu(!menu)
                            }}
                            delayLongPress={600}
                            key={item.name}
                            onPress={() => {
                                navigation.navigate('ChatInside', {
                                    name: item.members[0].name,
                                    roomId: item._id,
                                    myId: userData._id
                                })
                            }}
                        >
                            <ChatOutside
                                name={item.members[0].name}
                                message={item.lastMessage ? item.lastMessage : ''}
                            />
                        </TouchableOpacity>
                    )
                }}
            />


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
                    color='#4A649F'
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
                    color='black'
                    onPress={() => navigation.navigate('ProfileScreen')}

                />
            </View>


        </SafeAreaView >
    )
}

export default ChatScreen
