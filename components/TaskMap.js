import MapView, { Marker } from 'react-native-maps';
import { StyleSheet, Text, View, Dimensions } from 'react-native';
import tw from 'twrnc';
import React from 'react'
import { Icon } from '@rneui/base';

const TaskMap = ({ route }) => {
    return (
        <View style={styles.container}>
            <MapView style=
                {tw.style('w-full h-full', {
                })}
                region={route.params.viewport}
            >
                <Marker
                    coordinate={{ latitude: route.params.coordinates.lat, longitude: route.params.coordinates.long }}
                >
                    <Icon
                        type='font-awesome-5'
                        name='map-marker-alt'
                        color='#FF0000'
                    />
                </Marker>
            </MapView>
        </View>
    )
}

export default TaskMap

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
});