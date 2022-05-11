import { StyleSheet, Text, View, SafeAreaView, Image, Button, TouchableOpacity, FlatList } from 'react-native'
import React, { useEffect, useState } from 'react'
import tw from 'twrnc';
import NavOptions from '../components/NavOptions';
import { useNavigation } from '@react-navigation/native';
import { Icon } from '@rneui/base';
import { ScrollView } from 'react-native-gesture-handler';
import * as SecureStore from 'expo-secure-store';
import moment from 'moment';

const HomeScreen = () => {
    const [progress, setProgress] = useState(true)
    const [review, setReview] = useState(false)
    const [completed, setCompleted] = useState(false)
    const [userData, setUserData] = useState([])
    const [tasks, setTasks] = useState([])
    const getUser = useEffect(() => {
        const data = async () => {
            let token = await SecureStore.getItemAsync('userToken');
            const res = await fetch('http://192.168.1.7:8000/api/user/me', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'authorization': `Bearer ${token}`
                },
            }).then((t) => t.json())
            setUserData(res.data)
            const ress = await fetch('http://192.168.1.7:8000/api/task', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'authorization': `Bearer ${token}`
                },
            }).then((t) => t.json())
            ress?.tasks?.map((item) => {
                if (item.techId._id === res.data._id) {
                    return setTasks(oldArray => [...oldArray, item])
                } else {
                    return
                }
            })
        }
        data()
    }, [])

    const updateReview = async () => {

        const res = await fetch('http://192.168.1.7:8000/api/task/627ba5caa968fd84da935ea6', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'authorization': `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYyNTExYjVhZTFjNzIyMmUwMzY0ZjNhMiIsImlhdCI6MTY1MjI3MDQzNSwiZXhwIjoxNjUyMzU2ODM1fQ.6nTI9oLMFdMJ4avDpJHoxJpu6T5HiUzPjNSUU4V9hhg`
            },
            body: JSON.stringify({
                inReview: true,
                inProgress: false
            })
        }).then((t) => t.json())
    }

    const progressHandler = () => {
        setProgress(true)
        setReview(false)
        setCompleted(false)
    }
    const reviewHandler = () => {
        setProgress(false)
        setReview(true)
        setCompleted(false)
    }
    const completedHandler = () => {
        setProgress(false)
        setReview(false)
        setCompleted(true)
    }
    const navigation = useNavigation()
    console.log(tasks)
    return (
        <SafeAreaView
            style={tw.style('bg-white h-full p-5', {
                justifyContent: "flex-start"
            })}
        >
            <Text style={tw`text-center text-xl mt-10 mb-5`}>Tasks</Text>
            {/* Tasks Sections */}
            <View
                style={tw.style('flex-row', {
                    justifyContent: 'space-between'
                })}
            >
                <TouchableOpacity
                    onPress={progressHandler}
                >
                    {/* Title */}
                    <Text style={progress ? tw`text-lg mt-2 font-semibold bg-[#4A649F] text-white pl-4 pr-4 pt-2 pb-2 rounded-lg text-center` : tw`text-lg mt-2 font-semibold bg-white text-[#4A649F] pl-4 pr-4 pt-2 pb-2 rounded-lg text-center`}>In progress</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={reviewHandler}
                >
                    {/* Title */}
                    <Text style={review ? tw`text-lg mt-2 font-semibold bg-[#4A649F] text-white pl-4 pr-4 pt-2 pb-2 rounded-lg text-center` : tw`text-lg mt-2 font-semibold bg-white text-[#4A649F] pl-4 pr-4 pt-2 pb-2 rounded-lg text-center`}>In review</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={completedHandler}
                >
                    {/* Title */}
                    <Text style={completed ? tw`text-lg mt-2 font-semibold bg-[#4A649F] text-white pl-4 pr-4 pt-2 pb-2 rounded-lg text-center` : tw`text-lg mt-2 font-semibold bg-white text-[#4A649F] pl-4 pr-4 pt-2 pb-2 rounded-lg text-center`}>Completed</Text>
                </TouchableOpacity>
            </View>
            {/* Tasks */}
            {/* Progress Task */}
            {
                progress ? (

                    <FlatList // loop on data 
                        data={tasks} // data 
                        keyExtractor={(item) => item._id} // key
                        renderItem={({ item }) => {
                            if (item.inProgress) {
                                return ( // render items implement
                                    //   make click opacity animation
                                    // Component
                                    <View
                                        style={tw.style('h-40 w-full mt-5 mr-2 ml-2 border-b border-[#4A649F]', {
                                        })}>
                                        {/* Location */}
                                        <View
                                            style={tw.style('flex-row mr-2 text-center', {
                                            })}
                                        >
                                            <Icon
                                                style={
                                                    tw.style('p-2  bg-white', {
                                                    })
                                                }
                                                type='feather'
                                                name='map-pin'
                                                color='#4A649F'
                                                size={20}
                                            />
                                            <Text style={
                                                tw.style('p-2 w-72  ', {
                                                })
                                            }>{item.location}</Text>
                                        </View>
                                        {/* Date */}
                                        <View
                                            style={tw.style('flex-row mr-2 text-center', {
                                            })}
                                        >
                                            <Icon
                                                style={
                                                    tw.style('p-2  bg-white', {
                                                    })
                                                }
                                                type='feather'
                                                name='calendar'
                                                color='#4A649F'
                                                size={20}
                                            />
                                            <Text style={
                                                tw.style('p-2 w-72  ', {
                                                })
                                            }>{moment(item.endDate).format('DD/MM/yyyy')}</Text>
                                        </View>
                                        {/* Description */}
                                        <View
                                            style={tw.style('flex-row mr-2 text-center', {
                                            })}
                                        >
                                            <Icon
                                                style={
                                                    tw.style('p-2 bg-white', {
                                                    })
                                                }
                                                type='feather'
                                                name='align-left'
                                                color='#4A649F'
                                                size={20}
                                            />
                                            <ScrollView style={
                                                tw.style('p-2 pb-2 w-72 h-15', {
                                                })
                                            }>
                                                <Text>{item.description}</Text>

                                            </ScrollView>
                                        </View>
                                    </View>
                                )
                            }
                        }}
                    />
                ) : null
            }
            {/* Review Task */}
            {
                review ? (
                    <Button
                        title='hi'
                        onPress={updateReview}
                    />
                ) : null
            }
            {/* Completed Task */}
            {/* HomeIcons */}
            <View
                style={tw.style('flex-row', {
                    justifyContent: 'space-between',

                })}
            >
                <Icon
                    style={
                        tw.style('p-2 bg-white w-20 mt-4 ', {
                            elevation: 3,
                        })
                    }
                    type='font-awesome-5'
                    name='tasks'
                    color='#4A649F'
                />
                <Icon
                    style={
                        tw.style('p-2 bg-white w-20 mt-4 ', {
                            elevation: 3,
                        })
                    }
                    type='font-awesome-5'
                    name='headset'
                    color='black'
                    onPress={() => navigation.navigate('ChatScreen')}
                />
                <Icon
                    style={
                        tw.style('p-2 bg-white w-20 mt-4', {
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
                        tw.style('p-2 bg-white w-20 mt-4', {
                            elevation: 3,
                        })
                    }
                    type='font-awesome-5'
                    name='user'
                    color='black'
                    onPress={() => navigation.navigate('ProfileScreen')}

                />
            </View>
        </SafeAreaView>
    )
}

export default HomeScreen

const styles = StyleSheet.create({})

