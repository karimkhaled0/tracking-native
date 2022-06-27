import { FlatList, SafeAreaView, ScrollView, StyleSheet, Text, View, Dimensions } from 'react-native'
import React, { useEffect, useState } from 'react'
import tw from 'twrnc';
import { Icon } from '@rneui/base';
import { Button } from '@rneui/themed';
import * as SecureStore from 'expo-secure-store';
import moment from 'moment';
import { useNavigation } from '@react-navigation/native';
import MapView, { Marker } from 'react-native-maps';

const TaskView = ({ route }) => {
    const [viewport, setViewport] = useState({
        latitude: 30.06125232571432,
        longitude: 31.242046455822305,
        latitudeDelta: 2,
        longitudeDelta: 0.9421,
    })
    const [coordinate, setCoordinate] = useState({})

    const [task, setTask] = useState([])
    const getTask = useEffect(() => {
        const data = async () => {
            let token = await SecureStore.getItemAsync('userToken');
            const ress = await fetch('http://10.0.3.67:8000/api/task', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'authorization': `Bearer ${token}`
                },
            }).then((t) => t.json())
            ress?.tasks?.map((item) => {
                if (item._id === route.params.id) {
                    setCoordinate(item.coordinates)
                    return setTask(oldArray => [...oldArray, item])
                } else {
                    return
                }
            })
        }
        data()
        setTask([])
    }, [viewport])
    const navigation = useNavigation()
    return (
        <ScrollView
            style={tw.style('bg-gray-100', {
            })}
        >

            {
                task.map((item) => {
                    if (item.inProgress) {
                        return (
                            <View
                                style={
                                    tw.style('', {
                                        position: 'relative',
                                    })
                                }
                                key={item._id}
                            >
                                <View
                                    style={
                                        tw.style('', {
                                            position: 'absolute',
                                            top: 58,
                                            left: 10,
                                            zIndex: 3,

                                        })
                                    }
                                >
                                    <Icon
                                        style={
                                            tw.style('p-2 bg-white w-10', {
                                            })
                                        }
                                        type='font-awesome-5'
                                        name='arrow-left'
                                        color='#4A649F'
                                        onPress={() => navigation.goBack()}
                                    />
                                </View>
                                <View style=
                                    {tw.style('flex-row bg-white w-full pt-17 pb-5 text-center', {
                                        justifyContent: "center",
                                        zIndex: 1

                                    })}
                                >
                                    <Text style={tw`text-center pl-2 pr-2 pt-1 pb-1 border-r mr-2`}>#Id</Text>
                                    <Text style={tw`text-center bg-[#4A649F] text-white pl-2 pr-2 pt-1 pb-1 rounded-full`}>In progress</Text>
                                </View>
                                {/* Chat */}
                                <View>
                                    {/* Main */}
                                    <View
                                        style=
                                        {tw.style('flex-row mt-10 border-b border-gray-300 pb-5', {
                                            justifyContent: "flex-start"
                                        })}
                                    >
                                        {/* ICons */}
                                        <View
                                            style=
                                            {tw.style('border-r pr-10 ml-5 border-gray-300 pt-5', {
                                            })}
                                        >
                                            <Icon
                                                style={
                                                    tw.style('bg-gray-100', {
                                                    })
                                                }
                                                type='font-awesome-5'
                                                name='user'
                                                color='#4A649F'
                                            />
                                            <Icon
                                                style={
                                                    tw.style('bg-gray-100 mt-15', {
                                                    })
                                                }
                                                type='font-awesome-5'
                                                name='phone'
                                                color='#4A649F'
                                            />
                                            <Icon
                                                style={
                                                    tw.style('bg-gray-100 mt-15', {
                                                    })
                                                }
                                                type='font-awesome-5'
                                                name='calendar'
                                                color='#4A649F'
                                            />
                                            <Icon
                                                style={
                                                    tw.style('bg-gray-100 mt-15 pb-20', {
                                                    })
                                                }
                                                type='font-awesome-5'
                                                name='map-marker-alt'
                                                color='#4A649F'
                                            />

                                        </View>
                                        {/* DATA */}
                                        <View
                                            style=
                                            {tw.style('ml-8 pt-2', {
                                            })}
                                        >
                                            {/* Customer Name */}
                                            <View
                                                style=
                                                {tw.style('', {
                                                })}
                                            >
                                                <Text style={tw`text-gray-500 text-lg`}>Customer name</Text>
                                                <Text style={tw`font-bold ml-2 w-60 text-lg mt-2`}>{item.customerName}</Text>
                                                <View style={tw`border-b pl-10 pr-52 border-gray-300`}></View>
                                            </View>
                                            {/* Customer Phone number */}
                                            <View
                                                style=
                                                {tw.style('mt-8', {
                                                })}
                                            >
                                                <Text style={tw`text-gray-500 text-lg`}>Customer phone number</Text>
                                                <Text style={tw`font-bold ml-2 w-60 text-lg mt-2`}>{item.customerPhonenumber}</Text>
                                                <View style={tw`border-b pl-10 pr-52 border-gray-300`}></View>
                                            </View>
                                            {/* DeadLine */}
                                            <View
                                                style=
                                                {tw.style('mt-8', {
                                                })}
                                            >
                                                <Text style={tw`text-gray-500 text-lg`}>Deadline</Text>
                                                <Text style={tw`font-bold ml-2 w-60 text-lg mt-2`}>{moment(item.endDate).format('dd/MM/yyyy')}</Text>
                                                <View style={tw`border-b pl-10 pr-52 border-gray-300`}></View>
                                            </View>
                                            {/* Location */}
                                            <View
                                                style=
                                                {tw.style('mt-3', {
                                                })}
                                            >
                                                <View style={styles.container}>
                                                    <Text style={tw`text-xl text-center text-gray-500`}>Click To view the map</Text>
                                                    <MapView
                                                        userInterfaceStyle='dark'
                                                        style=
                                                        {tw.style('w-66 h-66', {
                                                        })}
                                                        region={viewport}
                                                        onPress={() => navigation.navigate('TaskMap', {
                                                            coordinates: {
                                                                long: coordinate.long,
                                                                lat: coordinate.lat
                                                            },
                                                            viewport: viewport
                                                        })}
                                                    >
                                                        <Marker
                                                            coordinate={{ latitude: coordinate.lat, longitude: coordinate.long }}
                                                        >
                                                            <Icon
                                                                type='font-awesome-5'
                                                                name='map-marker-alt'
                                                                color='#FF0000'
                                                            />
                                                        </Marker>
                                                    </MapView>
                                                </View>
                                            </View>
                                        </View>
                                    </View>
                                    {/* Second */}
                                    <View>
                                        <View
                                            style=
                                            {tw.style('', {
                                            })}
                                        >
                                            <Text style={tw`text-gray-500 text-lg ml-2 mt-3`}>Description</Text>
                                            <ScrollView style={
                                                tw.style('mr-5 ml-5 w-92 h-40', {
                                                })
                                            }>
                                                <Text style={tw`bg-white p-1`}>{item.description}</Text>

                                            </ScrollView>
                                        </View>
                                    </View>
                                    {/* Button */}
                                    {
                                        item.started ? (
                                            <View style=
                                                {tw.style('mt-15 mb-10', {
                                                    justifyContent: "center",
                                                    zIndex: 3

                                                })}>
                                                <Button title="Finish the task" type="outline" onPress={() => navigation.navigate('Report', {
                                                    id: route.params.id
                                                })} buttonStyle={tw`ml-15 mr-15 pt-2 pb-2 rounded-lg`} />
                                            </View>
                                        ) : (
                                            route.params.pending ? (
                                                <View style=
                                                    {tw.style('mt-15 mb-10', {
                                                        justifyContent: "center",
                                                        zIndex: 3

                                                    })}>
                                                    <Button title="Start the task" type="solid" onPress={() => navigation.navigate('TaskStarted', {
                                                        id: route.params.id
                                                    })} buttonStyle={tw`bg-[#4A649F] ml-15 mr-15 pt-2 pb-2 rounded-lg`} />
                                                </View>
                                            ) : (
                                                <View style=
                                                    {tw.style('mt-15 mb-10', {
                                                        justifyContent: "center",
                                                        zIndex: 3

                                                    })}>
                                                    <Button title="Start the task" disabled={true} type="solid" onPress={() => navigation.navigate('TaskStarted', {
                                                        id: route.params.id
                                                    })} buttonStyle={tw`bg-[#4A649F] ml-15 mr-15 pt-2 pb-2 rounded-lg`} />
                                                </View>
                                            )
                                        )
                                    }
                                </View>
                            </View>
                        )
                    }
                    if (item.inReview) {
                        return (
                            <View
                                style={
                                    tw.style('', {
                                        position: 'relative',
                                    })
                                }
                                key={item._id}
                            >
                                <View
                                    style={
                                        tw.style('', {
                                            position: 'absolute',
                                            top: 58,
                                            left: 10,
                                            right: 0,
                                            bottom: 0,
                                            zIndex: 3,

                                        })
                                    }
                                >
                                    <Icon
                                        style={
                                            tw.style('p-2 bg-white w-10', {
                                            })
                                        }
                                        type='font-awesome-5'
                                        name='arrow-left'
                                        color='#4A649F'
                                        onPress={() => navigation.goBack()}
                                    />
                                </View>
                                <View style=
                                    {tw.style('flex-row bg-white w-full pt-17 pb-5 text-center', {
                                        justifyContent: "center",
                                        zIndex: 1

                                    })}
                                >
                                    <Text style={tw`text-center pl-2 pr-2 pt-1 pb-1 border-r mr-2`}>#Id</Text>
                                    <Text style={tw`text-center bg-[#4A649F] text-white pl-2 pr-2 pt-1 pb-1 rounded-full`}>In review</Text>
                                </View>
                                {/* Chat */}
                                <View>
                                    {/* Main */}
                                    <View
                                        style=
                                        {tw.style('flex-row mt-10 border-b border-gray-300 pb-5', {
                                            justifyContent: "flex-start"
                                        })}
                                    >
                                        {/* ICons */}
                                        <View
                                            style=
                                            {tw.style('border-r pr-10 ml-5 border-gray-300 pt-5', {
                                            })}
                                        >
                                            <Icon
                                                style={
                                                    tw.style('bg-gray-100', {
                                                    })
                                                }
                                                type='font-awesome-5'
                                                name='user'
                                                color='#4A649F'
                                            />
                                            <Icon
                                                style={
                                                    tw.style('bg-gray-100 mt-15', {
                                                    })
                                                }
                                                type='font-awesome-5'
                                                name='phone'
                                                color='#4A649F'
                                            />
                                            <Icon
                                                style={
                                                    tw.style('bg-gray-100 mt-15', {
                                                    })
                                                }
                                                type='font-awesome-5'
                                                name='calendar'
                                                color='#4A649F'
                                            />
                                            <Icon
                                                style={
                                                    tw.style('bg-gray-100 mt-15 pb-20', {
                                                    })
                                                }
                                                type='font-awesome-5'
                                                name='map-marker-alt'
                                                color='#4A649F'
                                            />

                                        </View>
                                        {/* DATA */}
                                        <View
                                            style=
                                            {tw.style('ml-8 pt-2', {
                                            })}
                                        >
                                            {/* Customer Name */}
                                            <View
                                                style=
                                                {tw.style('', {
                                                })}
                                            >
                                                <Text style={tw`text-gray-500 text-lg`}>Customer name</Text>
                                                <Text style={tw`font-bold ml-2 w-60 text-lg mt-2`}>{item.customerName}</Text>
                                                <View style={tw`border-b pl-10 pr-52 border-gray-300`}></View>
                                            </View>
                                            {/* Customer Phone number */}
                                            <View
                                                style=
                                                {tw.style('mt-8', {
                                                })}
                                            >
                                                <Text style={tw`text-gray-500 text-lg`}>Customer phone number</Text>
                                                <Text style={tw`font-bold ml-2 w-60 text-lg mt-2`}>{item.customerPhonenumber}</Text>
                                                <View style={tw`border-b pl-10 pr-52 border-gray-300`}></View>
                                            </View>
                                            {/* DeadLine */}
                                            <View
                                                style=
                                                {tw.style('mt-8', {
                                                })}
                                            >
                                                <Text style={tw`text-gray-500 text-lg`}>Deadline</Text>
                                                <Text style={tw`font-bold ml-2 w-60 text-lg mt-2`}>{moment(item.endDate).format('dd/MM/yyyy')}</Text>
                                                <View style={tw`border-b pl-10 pr-52 border-gray-300`}></View>
                                            </View>
                                            {/* Location */}
                                            <View
                                                style=
                                                {tw.style('mt-8', {
                                                })}
                                            >
                                                <Text style={tw`text-gray-500 text-lg`}>Location</Text>
                                                <Text style={tw`font-bold ml-2 w-60 text-lg mt-2`}>{item.location}</Text>
                                                <View style={tw`border-b pl-10 pr-52 border-gray-300`}></View>
                                            </View>
                                        </View>
                                    </View>
                                    {/* Description */}
                                    <View>
                                        <View
                                            style=
                                            {tw.style('', {
                                            })}
                                        >
                                            <Text style={tw`text-gray-500 text-lg ml-2 mt-3`}>Description</Text>
                                            <ScrollView style={
                                                tw.style('mr-5 ml-5 w-92 h-40', {
                                                })
                                            }>
                                                <Text style={tw`bg-white p-1`}>{item.description}</Text>

                                            </ScrollView>
                                        </View>
                                    </View>
                                    {/* Report */}
                                    <View>
                                        <View
                                            style=
                                            {tw.style('', {
                                            })}
                                        >
                                            <Text style={tw`text-gray-500 text-lg ml-2 mt-3`}>Report</Text>
                                            <ScrollView style={
                                                tw.style('mr-5 ml-5 w-92 h-40', {
                                                })
                                            }>
                                                <Text style={tw`bg-white p-1`}>{item.report}</Text>

                                            </ScrollView>
                                        </View>
                                    </View>
                                </View>
                            </View>
                        )
                    }
                    if (item.finished) {
                        return (
                            <View
                                style={
                                    tw.style('', {
                                        position: 'relative',
                                    })
                                }
                                key={item._id}
                            >
                                <View
                                    style={
                                        tw.style('', {
                                            position: 'absolute',
                                            top: 58,
                                            left: 10,
                                            right: 0,
                                            bottom: 0,
                                            zIndex: 3,

                                        })
                                    }
                                >
                                    <Icon
                                        style={
                                            tw.style('p-2 bg-white w-10', {
                                            })
                                        }
                                        type='font-awesome-5'
                                        name='arrow-left'
                                        color='#4A649F'
                                        onPress={() => navigation.goBack()}
                                    />
                                </View>
                                <View style=
                                    {tw.style('flex-row bg-white w-full pt-17 pb-5 text-center', {
                                        justifyContent: "center",
                                        zIndex: 1

                                    })}
                                >
                                    <Text style={tw`text-center pl-2 pr-2 pt-1 pb-1 border-r mr-2`}>#Id</Text>
                                    <Text style={tw`text-center bg-[#4A649F] text-white pl-2 pr-2 pt-1 pb-1 rounded-full`}>Completed</Text>
                                </View>
                                {/* Chat */}
                                <View>
                                    {/* Main */}
                                    <View
                                        style=
                                        {tw.style('flex-row mt-10 border-b border-gray-300 pb-5', {
                                            justifyContent: "flex-start"
                                        })}
                                    >
                                        {/* ICons */}
                                        <View
                                            style=
                                            {tw.style('border-r pr-10 ml-5 border-gray-300 pt-5', {
                                            })}
                                        >
                                            <Icon
                                                style={
                                                    tw.style('bg-gray-100', {
                                                    })
                                                }
                                                type='font-awesome-5'
                                                name='user'
                                                color='#4A649F'
                                            />
                                            <Icon
                                                style={
                                                    tw.style('bg-gray-100 mt-15', {
                                                    })
                                                }
                                                type='font-awesome-5'
                                                name='phone'
                                                color='#4A649F'
                                            />
                                            <Icon
                                                style={
                                                    tw.style('bg-gray-100 mt-15', {
                                                    })
                                                }
                                                type='font-awesome-5'
                                                name='calendar'
                                                color='#4A649F'
                                            />
                                            <Icon
                                                style={
                                                    tw.style('bg-gray-100 mt-15 pb-20', {
                                                    })
                                                }
                                                type='font-awesome-5'
                                                name='map-marker-alt'
                                                color='#4A649F'
                                            />

                                        </View>
                                        {/* DATA */}
                                        <View
                                            style=
                                            {tw.style('ml-8 pt-2', {
                                            })}
                                        >
                                            {/* Customer Name */}
                                            <View
                                                style=
                                                {tw.style('', {
                                                })}
                                            >
                                                <Text style={tw`text-gray-500 text-lg`}>Customer name</Text>
                                                <Text style={tw`font-bold ml-2 w-60 text-lg mt-2`}>{item.customerName}</Text>
                                                <View style={tw`border-b pl-10 pr-52 border-gray-300`}></View>
                                            </View>
                                            {/* Customer Phone number */}
                                            <View
                                                style=
                                                {tw.style('mt-8', {
                                                })}
                                            >
                                                <Text style={tw`text-gray-500 text-lg`}>Customer phone number</Text>
                                                <Text style={tw`font-bold ml-2 w-60 text-lg mt-2`}>{item.customerPhonenumber}</Text>
                                                <View style={tw`border-b pl-10 pr-52 border-gray-300`}></View>
                                            </View>
                                            {/* DeadLine */}
                                            <View
                                                style=
                                                {tw.style('mt-8', {
                                                })}
                                            >
                                                <Text style={tw`text-gray-500 text-lg`}>Deadline</Text>
                                                <Text style={tw`font-bold ml-2 w-60 text-lg mt-2`}>{moment(item.endDate).format('dd/MM/yyyy')}</Text>
                                                <View style={tw`border-b pl-10 pr-52 border-gray-300`}></View>
                                            </View>
                                            {/* Location */}
                                            <View
                                                style=
                                                {tw.style('mt-8', {
                                                })}
                                            >
                                                <Text style={tw`text-gray-500 text-lg`}>Location</Text>
                                                <Text style={tw`font-bold ml-2 w-60 text-lg mt-2`}>{item.location}</Text>
                                                <View style={tw`border-b pl-10 pr-52 border-gray-300`}></View>
                                            </View>
                                        </View>
                                    </View>
                                    {/* Description */}
                                    <View>
                                        <View
                                            style=
                                            {tw.style('', {
                                            })}
                                        >
                                            <Text style={tw`text-gray-500 text-lg ml-2 mt-3`}>Description</Text>
                                            <ScrollView style={
                                                tw.style('mr-5 ml-5 w-92 h-40', {
                                                })
                                            }>
                                                <Text style={tw`bg-white p-1`}>{item.description}</Text>

                                            </ScrollView>
                                        </View>
                                    </View>
                                    {/* Report */}
                                    <View>
                                        <View
                                            style=
                                            {tw.style('mb-5', {
                                            })}
                                        >
                                            <Text style={tw`text-gray-500 text-lg ml-2 mt-3`}>Report</Text>
                                            <ScrollView style={
                                                tw.style('mr-5 ml-5 w-92 h-40', {
                                                })
                                            }>
                                                <Text style={tw`bg-white p-1`}>{item.report}</Text>

                                            </ScrollView>
                                        </View>
                                    </View>
                                </View>
                            </View>
                        )
                    }
                })
            }
        </ScrollView>
    )

}

export default TaskView
const styles = StyleSheet.create({
    container: {

    },
    map: {
        width: Dimensions.get('window').width,
        height: Dimensions.get('window').height,
    },
});