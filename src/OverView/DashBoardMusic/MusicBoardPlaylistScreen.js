//import liraries
import React, { Component } from 'react';
import { View, Text, ScrollView, ImageBackground, ActivityIndicator, TouchableOpacity } from 'react-native';
import MusicGeneralHeader from '../../OverView/artist/components/MusicGeneralHeder';
import Colors from '../../Utitilities/AppColors';
import { useDispatch, useSelector } from 'react-redux';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import { Audio } from 'expo-av';
import { play, pause, resume, playNext } from '../../../audioController';
import { 
    playInTheFirstTimeAction,
    pauseSongAction,
    resumeSongAction,
    playNextSongAction,
    preperNextSongAction,
    setPostAuthorProfileAction
} from '../../../store/actions/appActions';




const MusicBoardPlaylistScreen = (props) => {
    const dispatch = useDispatch();
    const { screenName, songsList } = props.route.params;
    const appBackGroundSelector = useSelector(state => state.AppReducer);
    const {
        SongIndexReducer,
        SongOnBackGroundReducer,
        currentAudio,
        isPlaying,
        playbackDuration,
        playbackObj,
        playbackPosition,
        soundObj,
        isLoading,
        MusicOnForGroundReducer
    } = appBackGroundSelector;
    
    
    const handleAudioPress = async (audio, index, list) => { 
        if(isLoading) {
            return;
        }    
        if(soundObj === null) {
            try{
                dispatch(preperNextSongAction({
                    currentAudio: audio,
                    isPlaying: false,
                    index: index,
                    isLoading: true
                }))
                const playbackObj = new Audio.Sound();
                const status = await play(playbackObj, audio.trackUri);
                return dispatch(playInTheFirstTimeAction({
                    playbackObj: playbackObj,
                    status: status,
                    currentAudio: audio,
                    isPlaying: true,
                    index: index,
                    list: list,
                    musicOnBackGround: true,
                    isLoading: false,
                    MusicOnForGroundReducer: false
                }))
            } catch(error){
                console.log(error.message);
            }
           
        }

        if(soundObj?.isLoaded && soundObj?.isPlaying && currentAudio?._id === audio._id) {
            console.log('2');            
           const status = await pause(playbackObj)
           try {
            return dispatch(pauseSongAction({
                status: status,
                isPlaying: false                
            }))
           }catch(error) {
            console.log(error.message);
           }           
        }

        if(soundObj?.isLoaded && !soundObj?.isPlaying && currentAudio?._id === audio._id) {
            console.log('3');
            try{
                const status = await resume(playbackObj);            
                return dispatch(resumeSongAction({
                    status: status,
                    isPlaying: true  
                }));
                
            }catch(error) {
                console.log(error.message);
            }
            
        }
        
        if(soundObj?.isLoaded && currentAudio?._id !== audio._id){
            console.log('4');
            try{
                dispatch(preperNextSongAction({
                    currentAudio: audio,
                    isPlaying: false,
                    index: index,
                    isLoading: true
                }))
                const status = await playNext(playbackObj, audio.trackUri);
                return dispatch(playNextSongAction({
                    status: status,
                    currentAudio: audio,
                    isPlaying: true,
                    index: index,
                    isLoading: false,
                    MusicOnForGroundReducer: false,
                    list: list
                }))
            } catch {
                console.log(error.message);
            }
             
        }
    }


    return (
        <View style={{flex: 1, backgroundColor:Colors.grey1}}>
            <MusicGeneralHeader goBack={() => props.navigation.goBack(null)} title={screenName}/>
            <ScrollView>
                {
                    songsList.map((item, index) =>
                        <TouchableOpacity key={index} style={{
                            width: '100%',
                            padding: 10,
                            borderBottomWidth: 0.5,
                            borderColor: Colors.grey3,
                            flexDirection:'row',
                        }} onPress={() => handleAudioPress(item, index, songsList)}>
                            <ImageBackground
                                style={{width: 70, height: 70, alignItems: 'center', justifyContent: 'center'}}
                                imageStyle={{resizeMode:'stretch'}}
                                source={{uri: item?.trackImage}}
                            >
        
                            {
                                    item._id === currentAudio._id &&
                                    <>
                                        {
                                            isPlaying?
                                            (
                                                <FontAwesome5
                                                    name="pause"
                                                    size={20}
                                                    color={Colors.red3}
                                                />
                                            )
                                            :
                                            (
                                                <>
                                                    {
                                                        isLoading?
                                                        (
                                                            <ActivityIndicator color={Colors.red3}/>
                                                        )
                                                        :
                                                        (
                                                            <FontAwesome5
                                                                name="play"
                                                                size={20}
                                                                color={Colors.red3}
                                                            />
                                                        )
                                                    }
                                                    
                                                </>
                                            )
                                        }
                                        
                                    </>
                                }
        
                            </ImageBackground>
                            <View style={{width:'65%', alignItems: 'flex-start', justifyContent: 'center'}}>
                                <Text style={{fontFamily:'Baloo2-Bold', color:'#fff', fontSize:16, left:10}}>
                                    {item.trackName}
                                </Text>
                                <Text style={{fontFamily:'Baloo2-Medium', color:Colors.grey3, fontSize:14, left:10}}>
                                    {item?.artist?.artistName}
                                </Text>
                            </View>
                            <View style={{width:'19%', alignItems: 'center', justifyContent: 'center'}}>
                                <Text style={{fontFamily:'Baloo2-Medium', color:Colors.grey3, fontSize:14}}>
                                    {item.trackLength}
                                </Text>
                            </View>
                        </TouchableOpacity>
                    )
                }
            </ScrollView>
            {/* <FlatList
                data={songsList}
                keyExtractor={item => item._id}
                renderItem={({item, index}) => 
                <TouchableOpacity style={{
                    width: '100%',
                    padding: 10,
                    borderBottomWidth: 0.5,
                    borderColor: Colors.grey3,
                    flexDirection:'row',
                }} onPress={() => handleAudioPress(item, index, songsList)}>
                    <ImageBackground
                        style={{width: 70, height: 70, alignItems: 'center', justifyContent: 'center'}}
                        imageStyle={{resizeMode:'stretch'}}
                        source={{uri: item?.trackImage}}
                    >

                    {
                            item._id === currentAudio._id &&
                            <>
                                {
                                    isPlaying?
                                    (
                                        <FontAwesome5
                                            name="pause"
                                            size={20}
                                            color={Colors.red3}
                                        />
                                    )
                                    :
                                    (
                                        <>
                                            {
                                                isLoading?
                                                (
                                                    <ActivityIndicator color={Colors.red3}/>
                                                )
                                                :
                                                (
                                                    <FontAwesome5
                                                        name="play"
                                                        size={20}
                                                        color={Colors.red3}
                                                    />
                                                )
                                            }
                                            
                                        </>
                                    )
                                }
                                
                            </>
                        }

                    </ImageBackground>
                    <View style={{width:'65%', alignItems: 'flex-start', justifyContent: 'center'}}>
                        <Text style={{fontFamily:'Baloo2-Bold', color:'#fff', fontSize:16, left:10}}>
                            {item.trackName}
                        </Text>
                        <Text style={{fontFamily:'Baloo2-Medium', color:Colors.grey3, fontSize:14, left:10}}>
                            {item?.artist?.artistName}
                        </Text>
                    </View>
                    <View style={{width:'19%', alignItems: 'center', justifyContent: 'center'}}>
                        <Text style={{fontFamily:'Baloo2-Medium', color:Colors.grey3, fontSize:14}}>
                            {item.trackLength}
                        </Text>
                    </View>
                </TouchableOpacity>
            }
            /> */}
        </View>
    );
};


export default MusicBoardPlaylistScreen;
