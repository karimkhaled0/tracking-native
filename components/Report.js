import { Image, ScrollView, StyleSheet, Text, View } from 'react-native'
import React, { useState } from 'react'
import tw from 'twrnc';
import { BackgroundImage } from '@rneui/base';
import { TextInput } from 'react-native-gesture-handler';
import { Button, Input } from '@rneui/themed';
import { useNavigation } from '@react-navigation/native';

// need to fetch report and edit in review
const Report = ({ id, taskReport, route }) => {
    const navigation = useNavigation()
    const [report, setReport] = useState('')
    const [reportError, setReportError] = useState('')

    return (
        <View
            style={tw`bg-[#4A649F] h-full`}
        >
            {/* Text */}
            <Text style={tw`text-center mt-20 text-3xl font-bold text-white`}>Write a report</Text>
            {/* Image */}
            <Image
                source={require(`../images/report.png`)}
                style={tw.style('', {
                    width: 300,
                    height: 300,
                    resizeMode: 'contain',
                    marginRight: 'auto',
                    marginLeft: 'auto'
                })}
            />
            {/* View */}
            <View
                style={tw.style('bg-white rounded-lg w-96', {
                    marginRight: 'auto',
                    marginLeft: 'auto'
                })}
            >
                {/* TextArea */}
                <ScrollView>
                    <TextInput
                        value={report}
                        style={tw.style('bg-white rounded-lg w-96 p-3 h-80 text-lg', {
                            textAlignVertical: 'top'
                        })}
                        multiline={true}
                        placeholder={reportError}
                        onChangeText={(text) => setReport(text)}
                    />
                </ScrollView>
                {/* Button  */}
                <View style=
                    {tw.style('', {
                        justifyContent: "center",
                    })}>
                    <Button title="Finish" onPress={() => {
                        if (report == '') {
                            setReportError('You must write something')
                        } else {
                            navigation.navigate('TaskFinished', {
                                id: route.params.id,
                                taskReport: report
                            })
                        }

                    }} type="solid" buttonStyle={tw`bg-[#4A649F] ml-12 mr-12 pt-3 pb-3 mb-3 rounded-lg`} />
                </View>

            </View>
        </View>
    )
}

export default Report

const styles = StyleSheet.create({})