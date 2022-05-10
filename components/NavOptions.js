import { Text, View, FlatList, TouchableOpacity, Image } from 'react-native'
import React from 'react'
import tw from 'twrnc';
import { Icon } from '@rneui/base';
import { useNavigation } from '@react-navigation/native';

const NavOptions = () => {
    const navigation = useNavigation()
    return (
        <View>
            <Text>hi</Text>
        </View>
    )
}

export default NavOptions

