import { StyleSheet, Text, View, SafeAreaView, Image, Button, TouchableOpacity, FlatList, RefreshControl, SectionList } from 'react-native'
import React, { useCallback, useEffect, useState } from 'react'
import tw from 'twrnc';
import { NavigationContainer, useNavigation } from '@react-navigation/native';
import { BackgroundImage, Icon } from '@rneui/base';
import { ScrollView } from 'react-native-gesture-handler';
import TaskSections from '../components/TaskSections';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import TaskView from '../components/TaskView';
import * as SecureStore from 'expo-secure-store';
const wait = (timeout) => {
    return new Promise(resolve => setTimeout(resolve, timeout));
}

const HomeScreen = ({ route }) => {

    const [progress, setProgress] = useState(true)
    const [review, setReview] = useState(false)
    const [completed, setCompleted] = useState(false)

    const [userData, setUserData] = useState([])
    const [tasks, setTasks] = useState([])

    const [refreshing, setRefreshing] = useState(false);
    const [pendingTask, setPendingTask] = useState(true)

    // on refresh function
    const onRefresh = useCallback(() => {
        setRefreshing(true);
        wait(1000).then(() => setRefreshing(false));
    }, []);
    const [taskStarted, setTaskStarted] = useState([])
    // Fetch userData and tasks
    const getUser = useEffect(() => {
        setTasks([])
        setPendingTask(true)
        const data = async () => {
            let token = await SecureStore.getItemAsync('userToken');
            const res = await fetch('http://10.0.3.67:8000/api/user/me', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'authorization': `Bearer ${token}`
                },
            }).then((t) => t.json())
            setUserData(res.data)
            const ress = await fetch('http://10.0.3.67:8000/api/task', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'authorization': `Bearer ${token}`
                },
            }).then((t) => t.json())
            ress?.tasks?.map((item) => {
                if (ress?.tasks[0]?.techId._id === res.data._id) {
                    if (item.inProgress && !item.inReview && !item.finished) {
                        if (item.started) {
                            setPendingTask(false)
                        }
                    }
                    return setTasks(oldArray => [...oldArray, item])
                } else {
                    return
                }
            })
        }
        // tasks assigned to tasks var and stored in flat list 
        data()
        setTasks([])
    }, [refreshing, route])

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
    return (
        <SafeAreaView
            style={tw.style('bg-[#F8F8F8] h-full pt-10 mt-2', {
                justifyContent: "flex-start"
            })}
        >
            {/* Tasks Sections */}
            <View
                style={tw.style('flex-row pl-5 pr-5', {
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
            {/* Progress Task */}
            {
                progress ? (

                    <ScrollView
                        style={tw`pl-5 pr-5`}
                        refreshControl={
                            <RefreshControl
                                refreshing={refreshing}
                                onRefresh={onRefresh}
                            />
                        }
                    >
                        <Text style={tw.style('text-xl mt-5 text-[#4A649F]', {
                        })}
                        >Ongoing</Text>
                        {tasks?.map((item) => {
                            if (item.inProgress && item.started) {
                                return (
                                    <TaskSections
                                        key={item._id}
                                        item={item}
                                        location={item.location}
                                        endDate={item.endDate}
                                        description={item.description}
                                        id={item._id}
                                    />
                                )
                            }
                        })}
                        <Text style={tw.style('text-xl mt-5 text-gray-500', {
                        })}
                        >Pending</Text>
                        {tasks?.map((item) => {
                            if (item.inProgress && !item.started) {
                                return (
                                    <TaskSections
                                        key={item._id}
                                        item={item}
                                        location={item.location}
                                        endDate={item.endDate}
                                        description={item.description}
                                        id={item._id}
                                        pending={pendingTask}
                                    />
                                )
                            }
                        })}
                    </ScrollView>
                ) : null
            }
            {/* Review Task */}
            {
                review ? (
                    <ScrollView
                        style={tw`pl-5 pr-5`}
                        refreshControl={
                            <RefreshControl
                                refreshing={refreshing}
                                onRefresh={onRefresh}
                            />
                        }
                    >
                        {tasks?.map((item) => {
                            if (item.inReview) {
                                return (
                                    <TaskSections
                                        item={item}
                                        location={item.location}
                                        endDate={item.endDate}
                                        description={item.description}
                                        id={item._id}
                                        key={item._id}
                                    />
                                )
                            }
                        })}
                    </ScrollView>
                ) : null
            }
            {/* Completed Task */}
            {
                completed ? (
                    <ScrollView
                        style={tw`pl-5 pr-5`}
                        refreshControl={
                            <RefreshControl
                                refreshing={refreshing}
                                onRefresh={onRefresh}
                            />
                        }
                    >
                        {tasks?.map((item) => {
                            if (item.finished) {
                                return (
                                    <TaskSections
                                        item={item}
                                        location={item.location}
                                        endDate={item.endDate}
                                        description={item.description}
                                        id={item._id}
                                        key={item._id}
                                    />
                                )
                            }
                        })}
                    </ScrollView>
                ) : null
            }
            {/* HomeIcons */}
            <View
                style={tw.style('flex-row p-3', {
                    justifyContent: 'space-between',

                })}
            >
                <Icon
                    style={
                        tw.style('p-2 bg-[#F8F8F8] w-20 ', {
                            elevation: 3,
                        })
                    }
                    type='font-awesome-5'
                    name='tasks'
                    color='#4A649F'
                />
                <Icon
                    style={
                        tw.style('p-2 bg-[#F8F8F8] w-20 ', {
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
                    color='black'
                    onPress={() => navigation.navigate('ProfileScreen')}

                />
            </View>
        </SafeAreaView>
    )
}

export default HomeScreen

const styles = StyleSheet.create({})

