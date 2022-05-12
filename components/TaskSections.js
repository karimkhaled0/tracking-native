import { FlatList, RefreshControl, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useCallback, useEffect, useState } from 'react'
import * as SecureStore from 'expo-secure-store';
import tw from 'twrnc';
import { Icon } from '@rneui/base';
import moment from 'moment';
import { useNavigation } from '@react-navigation/native';
const wait = (timeout) => {
    return new Promise(resolve => setTimeout(resolve, timeout));
}


const TaskSections = ({ inProgress = false, inReview = false, completed = false }) => {
    const navigation = useNavigation()
    const [refreshing, setRefreshing] = useState(false);
    const [userData, setUserData] = useState([])
    const [tasks, setTasks] = useState([])

    // on refresh function
    const onRefresh = useCallback(() => {
        setRefreshing(true);
        wait(2000).then(() => setRefreshing(false));
    }, []);

    // Fetch userData and tasks
    const getUser = useEffect(() => {
        setTasks([])
        const data = async () => {
            let token = await SecureStore.getItemAsync('userToken');
            const res = await fetch('http://192.168.1.7:8000/api/user/me', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'authorization': `Bearer ${token}`
                },
            }).then((t) => t.json())
            setUserData(res.data)
            const ress = await fetch('http://192.168.1.7:8000/api/task', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'authorization': `Bearer ${token}`
                },
            }).then((t) => t.json())
            ress?.tasks?.map((item) => {
                if (item.techId._id === res.data._id) {
                    return setTasks(oldArray => [...oldArray, item])
                } else {
                    return
                }
            })
        }
        data()
    }, [refreshing])

    // FlatList Render Items
    const TaskRenderItems = ({ item }) => {
        if (item.inProgress && inProgress) {
            return ( // render items implement
                //   make click opacity animation
                // Component
                <TouchableOpacity
                    style={tw.style('h-40 w-full mt-5 mr-2 ml-2 border-b border-[#4A649F]', {
                    })}
                    onPress={() => navigation.navigate('TaskView')}
                    key={item._id}
                >
                    {/* Location */}
                    <View
                        style={tw.style('flex-row mr-2 text-center', {
                        })}
                    >
                        <Icon
                            style={
                                tw.style('p-2  bg-white', {
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
                        }>{item.location}</Text>
                    </View>
                    {/* Date */}
                    <View
                        style={tw.style('flex-row mr-2 text-center', {
                        })}
                    >
                        <Icon
                            style={
                                tw.style('p-2  bg-white', {
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
                        }>{moment(item.endDate).format('DD/MM/yyyy')}</Text>
                    </View>
                    {/* Description */}
                    <View
                        style={tw.style('flex-row mr-2 text-center', {
                        })}
                    >
                        <Icon
                            style={
                                tw.style('p-2 bg-white', {
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
                            <Text>{item.description}</Text>

                        </ScrollView>
                    </View>
                </TouchableOpacity>
            )
        }
        if (item.inReview && inReview) {
            return ( // render items implement
                //   make click opacity animation
                // Component
                <TouchableOpacity
                    style={tw.style('h-40 w-full mt-5 mr-2 ml-2 border-b border-[#4A649F]', {
                    })}
                    key={item._id}
                >
                    {/* Location */}
                    <View
                        style={tw.style('flex-row mr-2 text-center', {
                        })}
                    >
                        <Icon
                            style={
                                tw.style('p-2  bg-white', {
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
                        }>{item.location}</Text>
                    </View>
                    {/* Date */}
                    <View
                        style={tw.style('flex-row mr-2 text-center', {
                        })}
                    >
                        <Icon
                            style={
                                tw.style('p-2  bg-white', {
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
                        }>{moment(item.endDate).format('DD/MM/yyyy')}</Text>
                    </View>
                    {/* Description */}
                    <View
                        style={tw.style('flex-row mr-2 text-center', {
                        })}
                    >
                        <Icon
                            style={
                                tw.style('p-2 bg-white', {
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
                            <Text>{item.description}</Text>

                        </ScrollView>
                    </View>
                </TouchableOpacity>
            )
        }
        if (item.finished && completed) {
            return ( // render items implement
                //   make click opacity animation
                // Component
                <TouchableOpacity
                    style={tw.style('h-40 w-full mt-5 mr-2 ml-2 border-b border-[#4A649F]', {
                    })}
                    key={item._id}
                >
                    {/* Location */}
                    <View
                        style={tw.style('flex-row mr-2 text-center', {
                        })}
                    >
                        <Icon
                            style={
                                tw.style('p-2  bg-white', {
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
                        }>{item.location}</Text>
                    </View>
                    {/* Date */}
                    <View
                        style={tw.style('flex-row mr-2 text-center', {
                        })}
                    >
                        <Icon
                            style={
                                tw.style('p-2  bg-white', {
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
                        }>{moment(item.endDate).format('DD/MM/yyyy')}</Text>
                    </View>
                    {/* Description */}
                    <View
                        style={tw.style('flex-row mr-2 text-center', {
                        })}
                    >
                        <Icon
                            style={
                                tw.style('p-2 bg-white', {
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
                            <Text>{item.description}</Text>

                        </ScrollView>
                    </View>
                </TouchableOpacity>
            )
        }
    }

    return (
        <FlatList // loop on data 
            data={tasks} // data 
            refreshControl={
                <RefreshControl
                    refreshing={refreshing}
                    onRefresh={onRefresh}
                />
            }
            keyExtractor={(item) => item._id}
            renderItem={TaskRenderItems}
        />
    )
}

export default TaskSections

const styles = StyleSheet.create({})