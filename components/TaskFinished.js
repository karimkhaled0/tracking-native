import { Image, StyleSheet, Text, View } from 'react-native'
import React, { useEffect } from 'react'
import { Button } from '@rneui/themed'
import tw from 'twrnc';
import { useNavigation } from '@react-navigation/native';
import * as SecureStore from 'expo-secure-store';

const TaskFinished = ({ route }) => {
    const navigation = useNavigation()
    const finish = useEffect(() => {
        const data = async () => {
            let token = await SecureStore.getItemAsync('userToken');
            const ress = await fetch(`http://10.0.3.67:8000/api/task/${route.params.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    report: route.params.taskReport,
                    inReview: true,
                    inProgress: false
                })
            }).then((t) => t.json())
        }
        data()
    }, [])
    return (
        <View>
            <Image
                source={require(`../images/completed.png`)}
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
            >Great work</Text>
            <Text
                style={tw.style('text-center text-xl text-[#4A649F] mt-5', {
                })}
            >Your task is in review</Text>
            <View style=
                {tw.style('mb-5 mt-5', {
                    justifyContent: "center",
                })}>
                <Button title="Continue" type="outline" onPress={() => navigation.navigate('HomeScreen', {
                    refresh: 'paramPropValue'
                })} buttonStyle={tw`ml-12 mr-12 pt-3 pb-3 rounded-lg`} />
            </View>
        </View>
    )
}

export default TaskFinished

const styles = StyleSheet.create({})