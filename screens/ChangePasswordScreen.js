import { StyleSheet, Text, View, SafeAreaView, Image } from 'react-native'
import React, { useState, useEffect } from 'react'
import tw from 'twrnc';
import * as SecureStore from 'expo-secure-store';
import { useNavigation } from '@react-navigation/native';
import { Button } from '@rneui/themed';
import { TextInput } from 'react-native-gesture-handler';
import * as Updates from 'expo-updates';

const ChangePasswordScreen = () => {
    const navigation = useNavigation()

    const [shouldChange, setShouldChange] = useState('')
    const [password1, setPassword1] = useState('')
    const [password2, setPassword2] = useState('')
    // handle errors
    const [passwordStateError, setPasswordStateError] = useState('')
    // Logged check
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
                    await Updates.reloadAsync()
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
                    source={require(`../images/logo.png`)}
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
    )
}

export default ChangePasswordScreen

const styles = StyleSheet.create({})