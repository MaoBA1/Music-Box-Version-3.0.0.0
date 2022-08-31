import React, { useState } from "react";
import {
    View, TouchableOpacity,
    Text, ImageBackground
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { setMusicOnBackGroundAction } from './store/actions/appActions'
import {RootStack as AppNavigator, AuthStack} from './src/navigation';
import {NavigationContainer} from '@react-navigation/native';
import Colors from './src/Utitilities/AppColors';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import FontAwesome from 'react-native-vector-icons/FontAwesome';


export const SongBar = props => {
    const dispatch = useDispatch();
    const appSelector = useSelector(state => state.AppReducer);
    const index = appSelector?.SongIndexReducer;
    const songDetails = appSelector?.SongOnBackGroundReducer[index];
    const artistName = songDetails?.artistName;
    const songLength = songDetails?.trackLength;
    const songName = songDetails?.trackName;
    const songUri = songDetails?.trackUri;
    const songImage = songDetails?.trackImage;
    

    const closeSongBar = () => {
        let action = setMusicOnBackGroundAction(false);
        try{
            dispatch(action);
        }catch(error) {
            console.log(error.message);
        }
    }

    return(
      <View style={{width:'100%', alignItems: 'center', position:'absolute', zIndex:1, top:655}}>
          <View style={{width:'90%', backgroundColor:'#fff', borderRadius:20, backgroundColor: Colors.grey6, flexDirection:'row', padding:10}}>
                <View style={{width:'20%', alignItems: 'center'}}>
                    <ImageBackground
                        source={{uri: songImage}}
                        style={{width:40, height:40, alignItems: 'center', justifyContent: 'center'}}
                        imageStyle={{opacity:1}}
                    >
                        <FontAwesome5
                            name="play"
                            size={15}
                            color={"#000"}
                            style={{opacity:0.8}}
                        />
                    </ImageBackground>
                </View>
                <View style={{width:'50%'}}>
                    <Text numberOfLines={1} style={{fontFamily:'Baloo2-Bold', color:Colors.red3}}>{songName}</Text>
                    <Text style={{fontFamily:'Baloo2-Medium', color:Colors.grey3}}>{artistName}</Text>
                </View>
                <View style={{width:'20%'}}></View>
                <TouchableOpacity style={{
                        shadowColor: '#171717',
                        shadowOffset: {width: 0, height: 10},
                        shadowOpacity: 0.5,
                        shadowRadius: 3,
                        width:'10%',
                        alignItems: 'center'
                    }} 
                    onPress={closeSongBar}
                >
                    <FontAwesome
                        name='close'
                        size={17}
                        color={'#fff'}
                    />
                </TouchableOpacity>
          </View>
      </View>
    )
}

const AppBackGround = props => {
    const appSelector = useSelector(state => state.AppReducer);
    const backgrounMusicBarVisible = appSelector.MusicOnBackGroundReducer;
    
    return(
        <NavigationContainer>
            <AppNavigator/>
            {backgrounMusicBarVisible && <SongBar/>}
        </NavigationContainer>
    )
}


export default AppBackGround;
