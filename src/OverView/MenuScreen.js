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
import Style from './Style/MenuStyle';
import { getUserDataAction } from '../../store/actions/userActions';
import { getGenersAction } from '../../store/actions/genersActions';
import MenuHeader from '../components/MenuHeader';


const MenuScreen = props => {
    const dispatch = useDispatch();
    const userDataSelector = useSelector(state => state.UserReducer);
    const user = userDataSelector?.UserReducer?.account;
    const[isLoading, setIsLoading] = useState(false);

    const logout = async() => {
        await AsyncStorage.removeItem('Token');
        await AsyncStorage.removeItem('IsItFirstUse');
        setIsLoading(true);
        setTimeout(() => {
            setIsLoading(false);
            props.logout();
        },3000)
    }
    
    return(
        <ImageBackground 
                source={ require('../../assets/AppAssets/Logo.png') }
                resizeMode="cover" 
                style={Style.backgroundContainer}
                imageStyle={{opacity: 0.3}}
        >
            <MenuHeader func={props.func}/>
            <View style={Style.mainContainer}>
                {
                    isLoading?
                    (
                        <ActivityIndicator size='large' color={Colors.red3}/>
                    )
                    :
                    (
                        <TouchableOpacity onPress={logout} style={{width:100, height:50, alignItems:'center', justifyContent: 'center', backgroundColor:Colors.grey2, borderRadius:50}}>
                            <Text>Log Out</Text>
                        </TouchableOpacity> 
                    )
                }
                
            </View>
        </ImageBackground>
    )
}



export default MenuScreen;
    