import { Image, StyleSheet, Text, View } from 'react-native'
import React, { useEffect } from 'react'
import tw from 'twrnc';
import { Button } from '@rneui/themed';
import { useNavigation } from '@react-navigation/native';
import * as SecureStore from 'expo-secure-store';

const TaskStarted = ({ route }) => {
    console.log(route.params.id)
    const navigation = useNavigation()
    const updateTask = useEffect(() => {
        const startTask = async () => {
            console.log(route.params.id)
            let token = await SecureStore.getItemAsync('userToken');
            const ress = await fetch(`http://10.0.3.67:8000/api/task/${route.params.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    started: true,
                })
            }).then((t) => t.json())
            console.log(ress)
        }
        startTask()
    }, [])
    return (
        <View>
            <Image
                source={require(`../images/success.png`)}
                style={tw.style('', {
                    width: '65%',
                    height: '65%',
                    resizeMode: 'contain',
                    marginRight: 'auto',
                    marginLeft: 'auto'
                })}
            />
            <Text
                style={tw.style('text-center text-4xl font-bold', {
                })}
            >Success</Text>
            <Text
                style={tw.style('text-center text-xl text-[#4A649F] mt-5', {
                })}
            >The task has started</Text>
            <View style=
                {tw.style('mb-5 mt-5', {
                    justifyContent: "center",
                })}>
                <Button title="Tracking" type="outline" buttonStyle={tw`ml-12 mr-12 pt-3 pb-3 rounded-lg`} />
            </View>
            <View style=
                {tw.style('', {
                    justifyContent: "center",
                })}>
                <Button title="Back to home" onPress={() => {
                    navigation.navigate('HomeScreen', {
                        refresh: 'paramPropValue'
                    })
                }} type="solid" buttonStyle={tw`bg-[#4A649F] ml-12 mr-12 pt-3 pb-3 rounded-lg`} />
            </View>
        </View>
    )
}

export default TaskStarted

const styles = StyleSheet.create({})