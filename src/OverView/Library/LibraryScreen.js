import React, { useState, useEffect, useCallback } from 'react';
import { 
    View,
    Text,
    TextInput,
    TouchableOpacity,
    ImageBackground,
    Modal, Platform,
    ActivityIndicator,
    KeyboardAvoidingView ,
    FlatList, Image
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useDispatch, useSelector } from 'react-redux';
import Fontisto from 'react-native-vector-icons/Fontisto';
import Feather from 'react-native-vector-icons/Feather';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Colors from '../../Utitilities/AppColors';


const LibraryScreen = props => {
    const userDataSelector = useSelector(state => state.UserReducer);
    const userPlaylists = userDataSelector?.UserPlaylists?.Playlists;
    return(
        <ImageBackground 
                source={ require('../../../assets/AppAssets/Logo.png') }
                resizeMode="cover" 
                style={{flex:1, backgroundColor:Colors.grey1, alignItems: 'center'}}
                imageStyle={{opacity: 0.3}}
        >
            <View style={{
                width: '100%',
                padding: 10,
                backgroundColor:Colors.grey1,
                shadowColor: '#171717',
                shadowOffset: {width: 10, height: 10},
                shadowOpacity: 0.5,
                shadowRadius: 10,
                height:100,
                borderBottomWidth:2, 
                borderColor: Colors.grey3,
                alignItems: 'center',
                justifyContent: 'flex-end'
            }}>
                <Text style={{
                    fontFamily:'Baloo2-ExtraBold', 
                    color: '#fff',
                    fontSize:22,
                    textShadowColor: Colors.red3,
                    textShadowOffset: {width: 0, height:3.5},
                    textShadowRadius:5,
                }}>
                    Your Library
                </Text>
            </View>
            {
                userPlaylists && userPlaylists.length > 0?
                (
                    <FlatList
                        style={{marginTop:50}}
                        numColumns={2}   
                        data={userPlaylists}
                        keyExtractor={item => item._id}
                        renderItem={({item, index}) => 
                            <TouchableOpacity onPress={() => props.navigation.navigate("PlaylistScreen", {songsList: item.songs, screenName: item.playlistName})}  style={{width:140 ,margin:25, alignItems: 'center'}}>
                                <Image
                                    source={{uri:item.playlistImage}}
                                    style={{
                                        width:140,
                                        height:140,
                                        resizeMode:'stretch',
                                        borderRadius:10,
                                        borderWidth:2,
                                        borderColor:Colors.grey3,
                                        shadowColor: '#171717',
                                        shadowOffset: {width: 10, height: 10},
                                        shadowOpacity: 0.5,
                                        shadowRadius: 10,
                                    }}
                                />
                                <Text
                                    style={{
                                        fontFamily: 'Baloo2-Bold',
                                        fontSize:20,
                                        color: '#fff'
                                    }}
                                    numberOfLines={1}
                                >
                                    {item?.playlistName}
                                </Text>
                            </TouchableOpacity>    
                        }
                    />
                )
                :
                (
                    <View style={{flex:1, alignItems: 'center', justifyContent: 'center'}}>
                        <Text
                            style={{
                                fontFamily: 'Baloo2-Bold',
                                fontSize:20,
                                color: '#fff'
                            }}
                            numberOfLines={1}
                        >
                            You don't have any playlists yet 
                        </Text>
                    </View>
                )
            }
        </ImageBackground>
    )
}


export const screenOptions = navData => {
    return {
        headerShown: false,
        tabBarLabel:'Library',
        headerTitle:'Library',
        tabBarLabelStyle: {
            fontFamily: 'Baloo2-Medium',
            fontSize:25
        },
        tabBarIcon:({focused,color,size}) => {
            const iconColor = focused? Colors.red3 : '#ffffff'
            const iconSzie = focused? 24 : 22
            return(
            <Ionicons name={'library'} color={iconColor} size={iconSzie} />
            )

        } 
    }
}

export default LibraryScreen;