import { FlatList, RefreshControl, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useCallback, useEffect, useState } from 'react'
import * as SecureStore from 'expo-secure-store';
import tw from 'twrnc';
import { Icon } from '@rneui/base';
import moment from 'moment';
import { useNavigation } from '@react-navigation/native';
import TaskView from './TaskView';


const TaskSections = ({ location, endDate, description, id, pending }) => {
    const navigation = useNavigation()
    return ( // render items implement
        //   make click opacity animation
        // Component
        <TouchableOpacity
            style={tw.style('h-40 w-full mt-5 mr-2 ml-2 border-b border-[#4A649F]', {
            })}
            onPress={() => {
                navigation.navigate('TaskView', {
                    id: id,
                    pending: pending
                })
            }}
        >
            {/* Location */}

            <View
                style={tw.style('flex-row mr-2 text-center', {
                })}
            >
                <Icon
                    style={
                        tw.style('p-2 bg-[#F8F8F8]', {
                        })
                    }
                    type='feather'
                    name='map-pin'
                    color='#4A649F'
                    size={20}
                />
                <Text style={
                    tw.style('p-2 w-72  ', {
                    })
                }>{location}</Text>
            </View>
            {/* Date */}
            <View
                style={tw.style('flex-row mr-2 text-center', {
                })}
            >
                <Icon
                    style={
                        tw.style('p-2 bg-[#F8F8F8]', {
                        })
                    }
                    type='feather'
                    name='calendar'
                    color='#4A649F'
                    size={20}
                />
                <Text style={
                    tw.style('p-2 w-72  ', {
                    })
                }>{moment(endDate).format('DD/MM/yyyy')}</Text>
            </View>
            {/* Description */}
            <View
                style={tw.style('flex-row mr-2 text-center', {
                })}
            >
                <Icon
                    style={
                        tw.style('p-2 bg-[#F8F8F8]', {
                        })
                    }
                    type='feather'
                    name='align-left'
                    color='#4A649F'
                    size={20}
                />
                <ScrollView style={
                    tw.style('p-2 pb-2 w-72 h-15', {
                    })
                }>
                    <Text>{description}</Text>

                </ScrollView>
            </View>
        </TouchableOpacity>
    )
}

export default TaskSections

const styles = StyleSheet.create({})

