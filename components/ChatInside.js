import { FlatList, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useMemo } from 'react'
import tw from 'twrnc';
import { Avatar } from '@rneui/themed';
import { Icon } from '@rneui/base';
import { useNavigation } from '@react-navigation/native';
import { faker } from '@faker-js/faker';
import { TextInput } from 'react-native-gesture-handler';
import EmojiPicker from 'rn-emoji-keyboard';
import { useState } from 'react';
import { useRef } from 'react';

const ChatInside = ({ route }) => {
    // Emoji Handler
    const [isOpen, setIsOpen] = useState(false)
    const flatList = useRef(null)
    // Type a message
    const [typeMessage, setTypeMessage] = useState('')
    const [typeEmoji, setTypeEmoji] = useState('')

    const navigation = useNavigation()
    const mockWhatsAppData = (count = 50) => {
        return Array(count)
            .fill(0)
            .map((_, index) => ({
                id: index + 1,
                pastMessages: faker.lorem.sentence(10),
                fromMe: Math.random() < 0.5,

            }))
    }
    const data = useMemo(() => mockWhatsAppData(50), []);
    // Push last message To Chat
    data[50] = {
        id: 51,
        fromMe: true,
        pastMessages: route.params.message
    }
    const handleSend = () => {
        data.push({
            id: faker.datatype.number(),
            fromMe: true,
            pastMessages: typeMessage + typeEmoji
        })
        console.log(data)
        setTypeMessage('')
    }
    return (
        <SafeAreaView
            style={tw.style(`bg-white h-full pt-10 bg-[#1874ba]`, {
            })}
        >
            {/* Header */}
            <View
                style={tw.style('flex-row items-center pb-5', {
                    justifyContent: "space-between",
                })}
            >
                {/* Avater and Back Buttom */}
                <TouchableOpacity
                    style={tw.style('flex-row items-center', {
                        justifyContent: 'flex-start',
                    })}
                    onPress={() => navigation.goBack()}
                >
                    <Icon
                        style={
                            tw.style('w-10', {
                            })
                        }
                        type='font-awesome-5'
                        name='arrow-left'
                        color='white'
                        size={23}
                    />
                    <Avatar
                        size={38}
                        rounded
                        title={route.params.name[0]}
                        titleStyle={{ color: 'black' }}
                        containerStyle={{ backgroundColor: 'white' }}
                    />
                    {/* Name */}
                    <Text style={tw`text-2xl ml-5 font-semibold text-white`}>{route.params.name}</Text>
                </TouchableOpacity>
                {/* call and dropDown Menu */}
                <View
                    style={tw.style('flex-row items-center', {
                        justifyContent: "flex-start",
                    })}
                >
                    <TouchableOpacity>
                        <Icon
                            style={
                                tw.style('mr-5', {
                                })
                            }
                            type='font-awesome-5'
                            name='phone'
                            color='white'
                            size={20}
                        />
                    </TouchableOpacity>
                    <TouchableOpacity>
                        <Icon
                            style={
                                tw.style('mr-5', {
                                })
                            }
                            type='font-awesome-5'
                            name='ellipsis-h'
                            color='white'
                            size={20}
                        />
                    </TouchableOpacity>
                </View>
            </View>
            {/* Messages */}
            <View
                style={tw.style('bg-white', {
                    justifyContent: 'flex-start',
                    height: '94%'
                })}
            >
                {/* Fetch Older Messages */}
                <FlatList
                    style={tw.style('', {
                    })}
                    data={data}
                    keyExtractor={(item) => item.id}
                    renderItem={({ item }) => {
                        return (
                            item.fromMe ? (
                                // My Message
                                <View
                                    style={tw.style('mb-2', styles.containerFromMe, {
                                        alignItems: item.fromMe ? 'flex-end' : 'flex-start'
                                    })}
                                >
                                    <View
                                        style={tw.style('bg-[#1874ba] rounded-xl mr-4', styles.messageContainer, {
                                            maxWidth: '80%'
                                        })}
                                    >
                                        <Text
                                            style={tw.style('text-white', styles.msessage)}
                                        >{item.pastMessages}</Text>
                                    </View>
                                </View>
                            ) : (
                                // Other Message
                                <View
                                    style={tw.style('ml-2 mb-2', styles.containerFromOther)}
                                >
                                    <Avatar
                                        size={30}
                                        rounded
                                        title={route.params.name[0]}
                                        titleStyle={{ color: 'black' }}
                                        containerStyle={{ backgroundColor: 'gray' }}
                                    />
                                    <View
                                        style={tw.style('bg-gray-200 rounded-xl ml-2', styles.messageContainer, {
                                            maxWidth: '80%'
                                        })}
                                    >
                                        <Text
                                            style={tw.style('', styles.msessage)}
                                        >{item.pastMessages}</Text>
                                    </View>
                                </View>
                            )
                        )
                    }}
                />

                {/* KeyBoard */}
                <View
                    style={
                        tw.style('flex-row bg-white rounded-full pt-1 pb-5 ml-2 mr-2 w-85 items-center', {
                            justifyContent: "space-between"
                        })
                    }
                >
                    <TextInput
                        onSubmitEditing={handleSend}
                        value={typeMessage}
                        onChangeText={(text) => {
                            setTypeMessage(text)
                        }}
                        returnKeyType='send'
                        style={tw.style('w-full pt-3 pb-2 pl-3 text-lg ', {
                            textAlignVertical: 'top'
                        })}
                        placeholder={'Type a message'}
                    />
                    <TouchableOpacity
                        onPress={handleSend}
                    >
                        <Icon
                            style={
                                tw.style('', {
                                })
                            }
                            type='font-awesome'
                            name='send'
                            color='gray'
                            size={20}
                        />
                    </TouchableOpacity>
                </View>
            </View>
            {/* <View
                style={
                    tw.style('bg-white h-full', {
                    })
                }
            >

            </View> */}

        </SafeAreaView>
    )
}

export default ChatInside

const styles = StyleSheet.create({
    containerFromOther: {
        position: 'relative',
        width: '100%',
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'flex-end',
        marginTop: 8,
        alignItems: 'center'
    },
    containerFromMe: {
        position: 'relative',
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-end',
        marginTop: 8,
    },
    messageContainer: {
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-end',
        paddingHorizontal: 8,
        paddingVertical: 8,
        shadowColor: 'rgba(0, 0, 0, .2)',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    msessage: {
        fontSize: 17,
        lineHeight: 20,
        textAlign: 'left',
    }
})