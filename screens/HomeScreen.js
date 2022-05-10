import { StyleSheet, Text, View, SafeAreaView, Image, Button, TouchableOpacity, FlatList } from 'react-native'
import React, { useState } from 'react'
import tw from 'twrnc';
import NavOptions from '../components/NavOptions';
import { useNavigation } from '@react-navigation/native';
import { Icon } from '@rneui/base';
import { ScrollView } from 'react-native-gesture-handler';

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
            <ScrollView
                style={tw.style('mt-2', {
                })}
            >
                {/* Progress Task */}
                {
                    progress ? (
                        <View>
                            <View style={tw.style('h-40 w-full mt-5 mr-2 ml-2 border-b border-[#4A649F]', {
                            })}>
                                <View
                                    style={tw.style('flex-row mr-2 text-center', {
                                    })}
                                >
                                    <Icon
                                        style={
                                            tw.style('p-2  bg-white', {
                                                elevation: 3,
                                            })
                                        }
                                        type='feather'
                                        name='map-pin'
                                        color='#4A649F'
                                        size={20}
                                    />
                                    <Text style={
                                        tw.style('p-2 w-20  ', {
                                            elevation: 3,
                                        })
                                    }>Location</Text>
                                </View>
                                <View
                                    style={tw.style('flex-row mr-2 text-center', {
                                    })}
                                >
                                    <Icon
                                        style={
                                            tw.style('p-2  bg-white', {
                                                elevation: 3,
                                            })
                                        }
                                        type='feather'
                                        name='calendar'
                                        color='#4A649F'
                                        size={20}
                                    />
                                    <Text style={
                                        tw.style('p-2 w-20  ', {
                                            elevation: 3,
                                        })
                                    }>Date</Text>
                                </View>
                                <View
                                    style={tw.style('flex-row mr-2 text-center', {
                                    })}
                                >
                                    <Icon
                                        style={
                                            tw.style('p-2 bg-white', {
                                                elevation: 3,
                                            })
                                        }
                                        type='feather'
                                        name='align-left'
                                        color='#4A649F'
                                        size={20}
                                    />
                                    <ScrollView style={
                                        tw.style('p-2 pb-2 h-20', {
                                            elevation: 3,
                                        })
                                    }>
                                        <Text>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.</Text>

                                    </ScrollView>
                                </View>
                            </View>

                        </View>
                    ) : null
                }
            </ScrollView>
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

