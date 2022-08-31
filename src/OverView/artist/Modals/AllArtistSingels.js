//import liraries
import React, { Component, useEffect, useState } from 'react';
import { View, Text, StyleSheet, Dimensions, FlatList, Image, TouchableOpacity, ImageBackground } from 'react-native';
import Colors from '../../../Utitilities/AppColors';
import { useDispatch, useSelector } from 'react-redux';
import MusicGeneralHeader from '../components/MusicGeneralHeder';
import AntDesign from 'react-native-vector-icons/AntDesign';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import { 
    setSongOnBackGroundAction,
    setMusicOnBackGroundAction,
    setSongIndexAction ,
    setCurrentAudioAction,
    setIsPlayingAction,
    setPlaybackDurationAction,
    setPlaybackObjAction,
    setPlaybackPostitionAction,
    setSoundObjAction,
    playInTheFirstTimeAction,
    pauseSongAction,
    resumeSongAction,
    playNextSongAction
} from '../../../../store/actions/appActions';
import { Audio } from 'expo-av';
import { play, pause, resume, playNext } from '../../../../audioController';

const {width} = Dimensions.get('window');



const AllArtistSingels = props => {
    const dispatch = useDispatch();
    const artistSongsSelector = useSelector(state => state.SongReducer);
    const allArtistSongs = artistSongsSelector?.ArtistSongsReducer;
    const appBackGroundSelector = useSelector(state => state.AppReducer);
    const [musicScreenVisible, setMusicScreenVisible] = useState(false);
    const {
        SongIndexReducer,
        SongOnBackGroundReducer,
        currentAudio,
        isPlaying,
        playbackDuration,
        playbackObj,
        playbackPosition,
        soundObj
    } = appBackGroundSelector

    
    const [state, setState] = useState({
        audioFiles: allArtistSongs,
        playbackObj: null,
        soundObj: null,
        currentAudio:{},
        isPlaying: false,
        currenAudioIndex: 0,
        playbackPosition: null,
        playbackDuration: null
    });

   
    
    const handleAudioPress = async(audio, index) => {
        const { 
            playbackObj,
            soundObj,
            currentAudio,
        } = state;
        
        if(soundObj === null) {
            console.log('1');
            const playbackObj = new Audio.Sound();
            const status = await play(playbackObj, audio.trackUri);
            return setState({...state, 
                playbackObj: playbackObj,
                soundObj: status,
                currentAudio: audio,
                isPlaying: true,
                currenAudioIndex: index
            })
            
        }
    
        if(soundObj.isLoaded && soundObj.isPlaying && currentAudio._id === audio._id) {
            console.log('2');
           const status = await playbackObj.setStatusAsync({
             shouldPlay: false
           })
           return setState({
               ...state,
               soundObj: status,
               isPlaying: false
           });
        }
    
        if(soundObj.isLoaded && !soundObj.isPlaying && currentAudio._id === audio._id) {
            console.log('3');
            const status = await resume(playbackObj)
            return setState({
                ...state,
                soundObj: status,
                isPlaying: true
            });
            
        }
              
        if(soundObj.isLoaded && currentAudio._id !== audio._id){
            console.log('4');
            const status = await playNext(playbackObj, audio.trackUri);
            return setState({
                ...state,
                soundObj: status,
                isPlaying: true,
                currentAudio: audio,
                currenAudioIndex: index
            });
              
        }
    }
    

    

    // const handleAudioPress = async (audio, index) => {     
        
    //     console.log('====================================');
    //     console.log(playbackObj);
    //     console.log('====================================');
    //     if(soundObj === null) {
    //         console.log('1');
    //          const playbackObj = new Audio.Sound();
    //          const status = await play(playbackObj, audio.trackUri);
    //         try{
    //             return dispatch(playInTheFirstTimeAction({
    //                 playbackObj: playbackObj,
    //                 status: status,
    //                 currentAudio: audio,
    //                 isPlaying: true,
    //                 index: index,
    //                 list: allArtistSongs,
    //                 musicOnBackGround: true
    //             }))
    //         } catch {
    //             console.log(error.message);
    //         }
    //         //return playbackObj.setOnPlaybackStatusUpdate(this.onPlaybackStatusUpdate)
    //     }

    //     if(soundObj.isLoaded && soundObj.isPlaying && currentAudio._id === audio._id) {
    //         console.log('2');            
    //        const status = await pause(playbackObj)
    //        try {
    //         return dispatch(pauseSongAction({
    //             status: status,
    //             isPlaying: false                
    //         }))
    //        }catch(error) {
    //         console.log(error.message);
    //        }
    //        return;
    //     }

    //     if(soundObj.isLoaded && !soundObj.isPlaying && currentAudio._id === audio._id) {
    //         console.log('3');
    //         const status = await resume(playbackObj)
    //         try {
    //             return dispatch(resumeSongAction({
    //                 status: status,
    //                 isPlaying: true  
    //             }));
                
    //         }catch(error) {
    //             console.log(error.message);
    //         }
            
    //     }
        
    //     if(soundObj.isLoaded && currentAudio._id !== audio._id){
    //         console.log('4');
    //         const status = await playNext(playbackObj, audio.trackUri);
            
    //         try{
    //             return dispatch(playNextSongAction({
    //                 status: status,
    //                 currentAudio: audio,
    //                 isPlaying: true,
    //                 index: index,
    //             }))
    //         } catch {
    //             console.log(error.message);
    //         }
             
    //     }
    // }

    const rowRender = ({item, index}) => {
        const {
            artistName,
            creatAdt,
            likes,
            trackImage,
            trackLength,
            trackName,
            trackUri
        } = item;
        return <TouchableOpacity
            style={{
                width: width,
                backgroundColor:Colors.grey4,
                padding:10,
                borderBottomWidth:0.8,
                flexDirection:'row',
            }}

            onPress={() => handleAudioPress(item, index)}
        >
            <View style={{
                width: '20%'
            }}>
                <ImageBackground
                    source={{uri:trackImage}}
                    style={[{width:50, height:50, alignItems: 'center', justifyContent: 'center'}, {opacity:index === SongIndexReducer? 0.8 : 1}]}
                    imageStyle={{borderRadius:50}}
                >
                    {
                        index === SongIndexReducer &&
                        <>
                            <FontAwesome5
                                name="play"
                                size={20}
                                color={Colors.red3}
                            />
                        </>
                    }
                </ImageBackground>
            </View>
            <View
                style={{
                    justifyContent: 'center',
                    width: '60%'
                }}
            >
                <Text
                    style={{fontFamily:'Baloo2-Medium', color:Colors.grey6, fontSize:16}}
                >
                    {trackName}
                </Text>
                <Text
                    style={{fontFamily:'Baloo2-Regular', color:Colors.grey3, fontSize:14}}
                >
                    {artistName}
                </Text>
            </View>
            <View
                style={{width:'20%', justifyContent: 'space-between', alignItems: 'center'}}
            >
                <Text style={{fontFamily:'Baloo2-Medium', color: Colors.grey3}}>{item.trackLength}</Text>
                <View style={{flexDirection:'row', alignItems: 'center', justifyContent: 'center'}}>
                    <AntDesign
                        name="like1"
                        color={Colors.grey3}
                        size={15}
                    />
                    <Text style={{fontFamily:'Baloo2-Medium', color: Colors.grey3, left:5, top:2}}>{item.likes.length} Likes</Text>
                </View>
                
                <Text style={{fontFamily:'Baloo2-Medium', color: Colors.grey3, fontSize:10, top:5}}>{new Date(item.creatAdt).toDateString()}</Text>
            </View>
        </TouchableOpacity>
    }
    

    return (
        <View
            style={{flex:1}}
        >
            <MusicGeneralHeader goBack={() => props.navigation.goBack(null)} title={'Singels'}/>
            <View
                style={{
                    flex: 1,
                    backgroundColor: Colors.grey1,                    
                }}
            >

                <FlatList
                    data={allArtistSongs}
                    keyExtractor={item => item._id}
                    renderItem={rowRender}
                    
                />
                
            </View>
        </View>
    );
};





export default AllArtistSingels;







