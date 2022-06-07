import { StyleSheet, Text, View, SafeAreaView, Image } from 'react-native'
import React, { useState, useEffect } from 'react'
import tw from 'twrnc';
import * as SecureStore from 'expo-secure-store';
import { useNavigation } from '@react-navigation/native';
import { Button } from '@rneui/themed';
import { TextInput } from 'react-native-gesture-handler';
import * as Updates from 'expo-updates';

const Login = ({ log }) => {
    const navigation = useNavigation()
    const [loginId, setloginId] = useState('');
    const [password, setPassword] = useState('');

    // handle errors
    const [loginIdErr, setloginIdErr] = useState('')
    const [passwordErr, setPasswordErr] = useState('')
    const submitForm = async () => {
        setloginIdErr('')
        setPasswordErr('')
        const res = await fetch('http://192.168.43.101:8000/signin', {
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
            let token = await SecureStore.getItemAsync('userToken');
            log = true
            console.log(token)
            return
        } else {
            log = false
            console.log(error)
            if (error.loginId) {
                setloginIdErr(error.loginId)
                setloginIdErrIcon(true)
            }
            if (error.password) {
                setPasswordErr(error.password)
                setPasswordErrIcon(true)
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
                            onChangeText={(text) => setloginId(text)}
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
                            onChangeText={(text) => setPassword(text)}
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
    )
}

export default Login

const styles = StyleSheet.create({})