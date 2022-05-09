import { Text, View, FlatList, TouchableOpacity, Image } from 'react-native'
import React from 'react'
import tw from 'twrnc';
import { Icon } from '@rneui/base';
import { useNavigation } from '@react-navigation/native';

const data = [
    {
        id: '123',
        title: 'Get a ride',
        image: require('../images/success.png'),
        screen: 'MapScreen'
    },
    {
        id: '456',
        title: 'Order food',
        image: 'https://links.papareact.com/28w',
        screen: 'EatsScreen'
    }
]
const NavOptions = () => {
    const navigation = useNavigation()
    return (
        <FlatList // loop on data 
            data={data} // data 
            keyExtractor={(item) => item.id} // key
            horizontal // make components horizontal
            renderItem={({ item }) => ( // render items implement
                //   make click opacity animation
                // Component
                <TouchableOpacity
                    onPress={() => navigation.navigate(item.screen)}
                    style={tw`p-2 pl-6 pt-4 pb-8 bg-gray-200 m-2 w-40`}
                >
                    <View>
                        {/* Image */}
                        <Image
                            style={{
                                width: 120,
                                height: 120,
                                resizeMode: 'cover'
                            }}
                            source={item.image}
                        />
                        {/* Title */}
                        <Text style={tw`text - lg mt - 2 font - semibold`}>{item.title}</Text>
                        <Icon
                            style={tw`p - 2 bg - black rounded - full w - 10 mt - 4`}
                            type='antdesign'
                            name='arrowright'
                            color='white'
                        />
                    </View>
                </TouchableOpacity>
            )}
        />
    )
}

export default NavOptions

