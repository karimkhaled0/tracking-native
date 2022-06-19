import MapView, { Marker, Polyline } from 'react-native-maps';
import { StyleSheet, Text, View, Dimensions } from 'react-native';
import tw from 'twrnc';
import React, { useEffect, useState } from 'react'
import { Icon } from '@rneui/base';
import * as Location from 'expo-location';

const TaskMap = ({ route }) => {
    const [userLatitude, setUserLatitude] = useState(30.9124932);
    const [userLongitude, setUserLongitude] = useState(31.1045873);

    // Get User location
    useEffect(() => {
        (async () => {
            let location = await Location.getCurrentPositionAsync({});
            setUserLatitude(JSON.stringify(location.coords.latitude));
            setUserLongitude(JSON.stringify(location.coords.longitude));
        })();
    }, []);

    // Distance
    // function distance(lat1, lon1, lat2, lon2) {
    //     var p = Math.PI / 180;    // Math.PI / 180
    //     var c = Math.cos;
    //     var a = 0.5 - c((lat2 - lat1) * p) / 2 +
    //         c(lat1 * p) * c(lat2 * p) *
    //         (1 - c((lon2 - lon1) * p)) / 2;

    //     return 12742 * Math.asin(Math.sqrt(a)); // 2 * R; R = 6371 km
    // }
    // console.log(distance(30.9124932, 31.1045873, 29.8955893, 30.1189253))

    return (
        <View style={styles.container}>
            <MapView
                style=
                {tw.style('w-full h-full', {
                })}
                region={route.params.viewport}
            >
                {/* Customer */}
                <Marker
                    coordinate={{ latitude: route.params.coordinates.lat, longitude: route.params.coordinates.long }}
                >
                    <Icon
                        type='font-awesome-5'
                        name='map-pin'
                        color='#b91c1c'
                        size={20}
                        solid
                    />
                </Marker>
                {/* User */}
                <Marker
                    coordinate={{ latitude: Number(userLatitude), longitude: Number(userLongitude) }}
                >
                    <Icon
                        type='font-awesome-5'
                        name='circle'
                        color='white'
                        size={10}
                        containerStyle={tw.style('border-red-700 rounded-full', {
                            borderWidth: 4
                        })}
                        solid
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

