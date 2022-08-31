import React, { useState, useEffect, useCallback } from 'react';
import { 
    View,
    Text,
    TextInput,
    TouchableOpacity,
    ImageBackground,
    Modal, Platform,
    ActivityIndicator,
    KeyboardAvoidingView 
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useDispatch, useSelector } from 'react-redux';
import Fontisto from 'react-native-vector-icons/Fontisto';
import Feather from 'react-native-vector-icons/Feather';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Entypo from 'react-native-vector-icons/Entypo';
import baseIpRequest from '../ServerDev';
import Colors from '../Utitilities/AppColors';
import Style from './Style/MusicBoardStyle';
import { getUserDataAction } from '../../store/actions/userActions';
import { getGenersAction } from '../../store/actions/genersActions';


const MusicBoardScreen = props => {
    const dispatch = useDispatch();
    const userDataSelector = useSelector(state => state.UserReducer);
    const user = userDataSelector?.UserReducer?.account;
    return(
        <ImageBackground 
                source={ require('../../assets/AppAssets/Logo.png') }
                resizeMode="cover" 
                style={Style.backgroundContainer}
                imageStyle={{opacity: 0.3}}
        >
            <View style={Style.mainContainer}>
                <Text>Music Board</Text>
            </View>
        </ImageBackground>
    )
}




export const screenOptions = navData => {
    return {        
        gestureEnabled:false,
        tabBarLabel:'Music Board',
    }
}


export default MusicBoardScreen;
    