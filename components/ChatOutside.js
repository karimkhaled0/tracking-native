import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useState } from 'react'
import { Avatar } from '@rneui/themed';
import tw from 'twrnc';

const ChatOutside = ({ message, name, date }) => {

    return (
        <View
            style={tw.style('h-20 ml-5 mr-5 mt-5 flex-row', {
                justifyContent: "flex-start"
            })}
        >
            {/* Photo */}
            <View
                style={tw.style('ml-3 mt-2', {
                })}
            >
                <Avatar
                    size={64}
                    rounded
                    title={name[0]}
                    titleStyle={{ color: '#BDBDBD' }}
                    containerStyle={{ backgroundColor: 'white' }}
                />
            </View>
            {/* View */}
            <View
                style={tw.style('w-64 ml-5 mt-1', {
                })}
            >
                {/* Name --------- Date Message Arrived*/}
                <View
                    style={tw.style('flex-row items-center', {
                        justifyContent: "space-between"
                    })}
                >
                    {/* Name */}
                    <Text style={tw`text-lg font-semibold`}>{name}</Text>
                    {/* Date */}
                    <Text style={tw`font-light`}>{date}</Text>
                </View>
                {/* Last Message */}
                <Text style={tw`font-extralight mt-1 text-sm`}>{message.substring(0, 80) + '.....'}</Text>
            </View>
        </View>
    )
}

export default ChatOutside

const styles = StyleSheet.create({})