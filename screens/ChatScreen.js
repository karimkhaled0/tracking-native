import { StyleSheet, Text, View, SafeAreaView, Image, Button } from 'react-native'
import React from 'react'
import tw from 'twrnc';
import { useNavigation } from '@react-navigation/native';
import { Icon } from '@rneui/base';

const ChatScreen = () => {
    const navigation = useNavigation()
    return (
        <SafeAreaView
            style={tw.style('bg-white h-full p-5', {
            })}
        >
            <Text style={tw`text-center text-xl mt-10 mb-5`}>Chat</Text>
            {/* Chat */}
            <View
                style={tw.style('flex-row h-5/6 ', {
                    justifyContent: 'space-between'
                })}
            >

            </View>
            {/* HomeIcons */}
            <View
                style={tw.style('flex-row ', {
                    justifyContent: 'space-between',
                    alignItems: 'flex-end'
                })}
            >
                <Icon
                    style={
                        tw.style('p-2 bg-white w-20 mt-4', {
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
                        tw.style('p-2 bg-white w-20 mt-4', {
                            elevation: 3,
                        })
                    }
                    type='font-awesome-5'
                    name='headset'
                    color='#4A649F'
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

export default ChatScreen

const styles = StyleSheet.create({})