import { StyleSheet, Text, View, SafeAreaView, Image, Button, TouchableOpacity, FlatList, RefreshControl, SectionList } from 'react-native'
import React, { useCallback, useEffect, useState } from 'react'
import tw from 'twrnc';
import { NavigationContainer, useNavigation } from '@react-navigation/native';
import { Icon } from '@rneui/base';
import { ScrollView } from 'react-native-gesture-handler';
import TaskSections from '../components/TaskSections';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import TaskView from '../components/TaskView';


const HomeScreen = () => {
    const [progress, setProgress] = useState(true)
    const [review, setReview] = useState(false)
    const [completed, setCompleted] = useState(false)

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
            style={tw.style('bg-white h-full p-5 pt-10 mt-2', {
                justifyContent: "flex-start"
            })}
        >
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
            {/* Progress Task */}
            {
                progress ? (

                    <TaskSections
                        inProgress={progress}
                        inReview={review}
                        completed={completed}
                    />
                ) : null
            }
            {/* Review Task */}
            {
                review ? (
                    <TaskSections
                        inProgress={progress}
                        inReview={review}
                        completed={completed}
                    />
                ) : null
            }
            {/* Completed Task */}
            {
                completed ? (
                    <TaskSections
                        inProgress={progress}
                        inReview={review}
                        completed={completed}
                    />
                ) : null
            }
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

