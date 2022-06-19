import { StyleSheet, Text, View, SafeAreaView, Image, ScrollView } from 'react-native'
import React, { useEffect } from 'react'
import tw from 'twrnc';
import { useNavigation } from '@react-navigation/native';
import { Icon } from '@rneui/base';
import { Button } from '@rneui/themed';
import * as SecureStore from 'expo-secure-store';
import * as Updates from 'expo-updates';

const NotificationScreen = () => {
    const navigation = useNavigation()
    const signOut = async () => {
        await SecureStore.deleteItemAsync('userToken');
        Updates.reloadAsync()
        console.log('done')
    }
    return (
        <SafeAreaView
            style={tw.style('bg-white h-full pt-10 mt-2', {
            })}
        >
            {/* Notification Section */}
            <View
                style={tw.style('flex-row items-center', {
                    justifyContent: 'space-between',
                })}
            >
                <Text style={tw`text-4xl ml-5 font-semibold`}>Notification</Text>
            </View>
            <ScrollView>

            </ScrollView>

            {/* HomeIcons */}
            <View
                style={tw.style('flex-row p-3', {
                    justifyContent: 'space-between',
                    alignItems: 'flex-end'
                })}
            >
                <Icon
                    style={
                        tw.style('p-2 bg-white w-20', {
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
                        tw.style('p-2 bg-white w-20', {
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
                        tw.style('p-2 bg-white w-20', {
                            elevation: 3,
                        })
                    }
                    type='font-awesome-5'
                    name='bell'
                    color='#4A649F'
                />
                <Icon
                    style={
                        tw.style('p-2 bg-white w-20', {
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

export default NotificationScreen

const styles = StyleSheet.create({})