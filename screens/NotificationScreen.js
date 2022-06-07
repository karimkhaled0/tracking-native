import { StyleSheet, Text, View, SafeAreaView, Image } from 'react-native'
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
            style={tw.style('bg-white h-full p-5', {
            })}
        >
            <Text style={tw`text-center text-xl mt-10 mb-5`}>Notifications</Text>
            {/* Notification Section */}
            <View
                style={tw.style('flex-row h-5/6 ', {
                    justifyContent: 'space-between'
                })}
            >
                <Button title="Sign in" type="solid" onPress={signOut} buttonStyle={tw`bg-[#4A649F] ml-15 mt-5 mr-15 pt-2 pb-2 rounded-lg`} />

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
                    color='#4A649F'
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

export default NotificationScreen

const styles = StyleSheet.create({})