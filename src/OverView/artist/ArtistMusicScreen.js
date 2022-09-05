import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    ActivityIndicator,
    Image,
    ImageBackground,
    TouchableOpacity,
    FlatList,
    ScrollView,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import Style from './style/ArtistFeedStyle';
import Colors from '../../Utitilities/AppColors';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import Feather from 'react-native-vector-icons/Feather';
import { 
    getAllArtistSongs,
    getArtistTop5,
    getArtistLatestRealeases,
    getArtistPlayLists
} from '../../ApiCalls';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { 
    playInTheFirstTimeAction,
    pauseSongAction,
    resumeSongAction,
    playNextSongAction,
    preperNextSongAction,
    handleSeeBarAction
} from '../../../store/actions/appActions';
import { play, pause, resume, playNext } from '../../../audioController';
import { Audio } from 'expo-av';
import MusicHeader from './components/MusicHeader';
import UploadSongModal from './Modals/UploadSongModal';
import CreateNewPlaylistModal from './Modals/CreateNewPlaylistModal';


const ArtistMusicScreen = props => {
    const dispatch = useDispatch();
    const artistSelector = useSelector(state => state.ArtistsReducer);
    const artistId = artistSelector?.ArtistDataReducer?._id;
    const [uploadSongModalVisible, setUploadSongModalVisible] = useState(false);
    const [createNewPlaylistModalVisible, setCreateNewPlaylistModalVisible] = useState(false);    
    const artistSongsSelector = useSelector(state => state.SongReducer);
    const artistTop5 = artistSongsSelector?.ArtistTop5SongsReducer;
    const artistLatestRealeases = artistSongsSelector?.ArtistLatestReleasesReducer;
    const allArtistSongs = artistSongsSelector?.ArtistSongsReducer;
    const allArtistPlaylist = artistSelector?.ArtistPlaylistsReducer;
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
   
    const getArtistSongs = async () => {
        const jsonToken = await AsyncStorage.getItem('Token');        
        const userToken = jsonToken != null ? JSON.parse(jsonToken) : null;
        if(userToken) {            
            getAllArtistSongs(dispatch, userToken, artistId);
            getArtistTop5(dispatch, userToken, artistId);
            getArtistLatestRealeases(dispatch, userToken, artistId);
            getArtistPlayLists(dispatch, userToken);
        }
    }

    useEffect(() => {
        const onPlaybackStatusUpdate = async(playbackStatus) => {
            if(playbackStatus.isLoaded && playbackStatus.isPlaying) {
                dispatch(handleSeeBarAction({
                    playbackPosition: playbackStatus.positionMillis,
                    playbackDuration: playbackStatus.durationMillis
                }))
            }


            if(playbackStatus.didJustFinish) {
                try{
                    const nextAudioIndex = (SongIndexReducer + 1) % SongOnBackGroundReducer?.length;
                    const audio = SongOnBackGroundReducer[nextAudioIndex];
                    dispatch(preperNextSongAction({
                        currentAudio: audio,
                        isPlaying: false,
                        index: nextAudioIndex,
                        isLoading: true
                    }))
                    const status = await playNext(playbackObj, audio.trackUri);
                
                    return dispatch(playNextSongAction({
                        status: status,
                        currentAudio: audio,
                        isPlaying: true,
                        index: nextAudioIndex,
                        isLoading: false,
                        MusicOnForGroundReducer: MusicOnForGroundReducer,
                        list: SongOnBackGroundReducer 
                    }))
                }catch(error) {
                    console.log(error.message);
                }
            }
        }

        if(playbackObj) {
            playbackObj.setOnPlaybackStatusUpdate(onPlaybackStatusUpdate)
        }

        getArtistSongs();
    },[
        SongIndexReducer,
        SongOnBackGroundReducer,                
        playbackObj,        
        MusicOnForGroundReducer
    ])
    

    const handleAudioPress = async (audio, index, list) => {     
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

        if(soundObj.isLoaded && !soundObj.isPlaying && currentAudio._id === audio._id) {
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
        
        if(soundObj.isLoaded && currentAudio._id !== audio._id){
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
    
    
    
    return(
        <ImageBackground 
                source={ require('../../../assets/AppAssets/Logo.png') }
                resizeMode="cover" 
                style={Style.backgroundContainer}
                imageStyle={{opacity: 0.3}}
        >
            <MusicHeader goBack={() =>  props.navigation.navigate('Setting')}/>
            {uploadSongModalVisible && <UploadSongModal close={setUploadSongModalVisible}/>}
            {createNewPlaylistModalVisible && <CreateNewPlaylistModal close={setCreateNewPlaylistModalVisible}/>}
            
            <View style={{width:'100%', flexDirection:'row', borderBottomWidth:2, borderColor:Colors.grey3}}>
                <TouchableOpacity style={{backgroundColor:Colors.grey1, padding:10, width:`${100/3}%`, alignItems: 'center', justifyContent: 'center', flexDirection: 'row'}}>
                    <MaterialIcons
                        name='album'
                        size={18}
                        color={Colors.red3}                    
                    />
                    <Text style={{left:2, fontFamily:'Baloo2-Bold', color: '#fff'}}>Create Album</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => setCreateNewPlaylistModalVisible(true)} style={{backgroundColor:Colors.grey1, padding:10, width:`${100/3}%`, alignItems: 'center', justifyContent: 'center', flexDirection: 'row'}}>
                    <MaterialCommunityIcons
                        name='playlist-music'
                        size={18}
                        color={Colors.red3}                    />
                    <Text style={{left:2, fontFamily:'Baloo2-Bold', color: '#fff'}}>Create Playlist</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => setUploadSongModalVisible(true)} style={{backgroundColor:Colors.grey1, padding:10, width:`${100/3}%`, alignItems: 'center', justifyContent: 'center', flexDirection: 'row'}}>
                    <MaterialIcons
                        name='music-note'
                        size={18}
                        color={Colors.red3}                    
                    />
                    <Text style={{left:2, fontFamily:'Baloo2-Bold', color: '#fff'}}>Upload Song</Text>
                </TouchableOpacity>
            </View>

            <ScrollView>
                <View style={{marginTop:20}}>
                    <View style={{left:10}}>
                        <Text style={{fontFamily:'Baloo2-Bold', color: '#fff', fontSize:18}}>Top 5</Text>
                    </View>
                    <View style={{marginTop:10, width:'100%', borderTopWidth:2, borderBottomWidth:2, borderColor:'#fff', padding:10, backgroundColor:Colors.grey4}}>
                        {
                            !artistTop5 || artistTop5.length == 0 ?
                            (
                                <View style={{alignItems: 'center', justifyContent: 'center'}}>
                                    <Text style={{fontFamily:'Baloo2-Medium', color: Colors.red3, fontSize:15}}>Soon we will start to</Text>
                                    <Text style={{fontFamily:'Baloo2-Medium', color: Colors.red3, fontSize:15}}>understand what your most</Text>
                                    <Text style={{fontFamily:'Baloo2-Medium', color: Colors.red3, fontSize:15}}>successful songs</Text>
                                </View>
                            )
                            :
                            (
                                <View></View>
                            )
                        }
                    </View>
                </View>

                <View style={{marginTop:20}}>
                    <View style={{left:10}}>
                        <Text style={{fontFamily:'Baloo2-Bold', color: '#fff', fontSize:18}}>Latest Realeases</Text>
                    </View>
                    <View style={{marginTop:10, width:'100%', borderTopWidth:2, borderBottomWidth:2, borderColor:'#fff', padding:10, backgroundColor:Colors.grey4}}>
                        {
                            !artistLatestRealeases || artistLatestRealeases?.length == 0 ?
                            (
                                <View style={{alignItems: 'center', justifyContent: 'center'}}>
                                    <Text style={{fontFamily:'Baloo2-Medium', color: Colors.red3, fontSize:15}}>Come on, don't wait,</Text>
                                    <Text style={{fontFamily:'Baloo2-Medium', color: Colors.red3, fontSize:15}}>start uploading new songs</Text>
                                </View>
                            )
                            :
                            (
                                <View style={{width:'100%', justifyContent: 'center'}}>
                                    <FlatList
                                        horizontal
                                        data={artistLatestRealeases}
                                        keyExtractor={item => item._id}
                                        renderItem={({item, index}) => 
                                            
                                                !isLoading?
                                                (
                                                    <View style={{width:80, margin:5, alignItems: 'center', justifyContent: 'center'}}>
                                                        <TouchableOpacity
                                                            onPress={() => handleAudioPress(item, index, artistLatestRealeases)}
                                                        >
                                                            <ImageBackground
                                                                source={{uri:item.trackImage}}
                                                                style={{
                                                                    width:40,
                                                                    height:40,
                                                                    resizeMode:'stretch',
                                                                    alignItems: 'center',
                                                                    justifyContent: 'center',
                                                                    opacity:index === SongIndexReducer && item._id === currentAudio._id? 0.7 : 1
                                                                }}
                                                                imageStyle={{borderRadius:20}}
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
                                                        </TouchableOpacity>
                                                        <Text numberOfLines={1} style={{fontFamily:'Baloo2-Medium', color:'#fff', marginTop:5}}>{item.trackName}</Text>
                                                    </View>
                                                )
                                                :
                                                (
                                                    <View style={{width:80, margin:5, alignItems: 'center', justifyContent: 'center'}}>
                                                        <View
                                                            onPress={() => handleAudioPress(item, index, artistLatestRealeases)}
                                                        >
                                                            <ImageBackground
                                                                source={{uri:item.trackImage}}
                                                                style={{
                                                                    width:40,
                                                                    height:40,
                                                                    resizeMode:'stretch',
                                                                    alignItems: 'center',
                                                                    justifyContent: 'center',
                                                                    opacity:index === SongIndexReducer && item._id === currentAudio._id? 0.7 : 1
                                                                }}
                                                                imageStyle={{borderRadius:20}}
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
                                                        </View>
                                                        <Text numberOfLines={1} style={{fontFamily:'Baloo2-Medium', color:'#fff', marginTop:5}}>{item.trackName}</Text>
                                                    </View>
                                                )
                                            
                                        }
                                    />
                                </View>
                            )
                        }
                    </View>
                </View>

                <View style={{marginTop:20}}>
                    <View style={{left:10}}>
                        <Text style={{fontFamily:'Baloo2-Bold', color: '#fff', fontSize:18}}>Your Playlists</Text>
                    </View>
                    <View style={{marginTop:10, width:'100%', borderTopWidth:2, borderBottomWidth:2, borderColor:'#fff', padding:10, backgroundColor:Colors.grey4}}>
                        {
                            !allArtistPlaylist || allArtistPlaylist.length == 0 ?
                            (
                                <View style={{alignItems: 'center', justifyContent: 'center'}}>
                                    <Text style={{fontFamily:'Baloo2-Medium', color: Colors.red3, fontSize:15}}>Start creating playlists of your</Text>
                                    <Text style={{fontFamily:'Baloo2-Medium', color: Colors.red3, fontSize:15}}>singles by styles</Text>
                                </View>
                            )
                            :
                            (
                                <View style={{width:'100%', justifyContent: 'center'}}>
                                    <FlatList
                                        horizontal
                                        data={allArtistPlaylist}
                                        keyExtractor={item => item._id}
                                        renderItem={playlist => 
                                            <View style={{width:80, margin:5, alignItems: 'center', justifyContent: 'center'}}>
                                                <TouchableOpacity onPress={() => props.navigation.navigate("AllSingels", {songsList: playlist.item.tracks})}>
                                                    <Image
                                                        source={{uri:playlist.item.playlistImage}}
                                                        style={{width:50, height:50, borderRadius:20, resizeMode:'stretch'}}
                                                    />                                                
                                                </TouchableOpacity>
                                                <Text numberOfLines={1} style={{fontFamily:'Baloo2-Medium', color:'#fff', marginTop:5}}>{playlist.item.playlistName}</Text>
                                            </View>
                                        }
                                    />
                                </View>
                            )
                        }
                    </View>
                </View>

                <View style={{marginTop:20}}>
                    <View style={{left:10}}>
                        <Text style={{fontFamily:'Baloo2-Bold', color: '#fff', fontSize:18}}>Your Albums</Text>
                    </View>
                    <View style={{marginTop:10, width:'100%', borderTopWidth:2, borderBottomWidth:2, borderColor:'#fff', padding:10, backgroundColor:Colors.grey4}}>
                        {
                            !artistTop5 || artistTop5.length == 0 ?
                            (
                                <View style={{alignItems: 'center', justifyContent: 'center'}}>
                                    <Text style={{fontFamily:'Baloo2-Medium', color: Colors.red3, fontSize:15}}>Start creating playlists of your</Text>
                                    <Text style={{fontFamily:'Baloo2-Medium', color: Colors.red3, fontSize:15}}>singles by styles</Text>
                                </View>
                            )
                            :
                            (
                                <View></View>
                            )
                        }
                    </View>
                </View>

                {
                    allArtistSongs && allArtistSongs.length > 0 &&
                    <View style={{marginTop:20}}>
                         <View style={{left:10}}>
                             <Text style={{fontFamily:'Baloo2-Bold', color: '#fff', fontSize:18}}>Your Singles</Text>
                         </View>
                         <ScrollView style={{marginTop:10, width:'100%', borderTopWidth:2, borderBottomWidth:2, borderColor:'#fff', padding:10, backgroundColor:Colors.grey4}}>
                                    {allArtistSongs.sort((a, b) => (new Date(b.creatAdt) - new Date(a.creatAdt))).slice(0,5).map((item,index) => 
                                        
                                            !isLoading?
                                            (
                                                <TouchableOpacity 
                                                    key={item._id}
                                                    style={{
                                                        justifyContent: 'space-between',
                                                        width:'100%',
                                                        flexDirection: 'row',
                                                        marginVertical:3,
                                                        backgroundColor: Colors.grey1,
                                                        padding:10,
                                                        borderRadius:10
                                                    }}
                                                    onPress={() => handleAudioPress(item, index, allArtistSongs.sort((a, b) => (new Date(b.creatAdt) - new Date(a.creatAdt))))}
                                                >
                                                    <View style={{flexDirection:'row', alignItems: 'center'}}>
                                                        <View>
                                                            <ImageBackground
                                                                source={{uri:item.trackImage}}
                                                                style={{
                                                                    width:40,
                                                                    height:40,
                                                                    resizeMode:'stretch',
                                                                    alignItems: 'center',
                                                                    justifyContent: 'center',
                                                                    opacity:index === SongIndexReducer && item._id === currentAudio._id? 0.7 : 1
                                                                }}
                                                                imageStyle={{borderRadius:20}}
                                                            
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
                                                        </View>
                                                        <Text style={{fontFamily:'Baloo2-Medium', color: '#fff', marginLeft:10}}>{item.trackName}</Text>
                                                    </View>
                                                    <View style={{width:'12%', flexDirection:'column-reverse'}}>
                                                        <Text style={{fontFamily:'Baloo2-Medium', color: Colors.grey3}}>{item.trackLength}</Text>
                                                    </View>
                                                </TouchableOpacity>
                                            )
                                            :
                                            (
                                                <View 
                                                    key={item._id}
                                                    style={{
                                                        justifyContent: 'space-between',
                                                        width:'100%',
                                                        flexDirection: 'row',
                                                        marginVertical:3,
                                                        backgroundColor: Colors.grey1,
                                                        padding:10,
                                                        borderRadius:10,                                                        
                                                    }}
                                                >
                                                    <View style={{flexDirection:'row', alignItems: 'center'}}>
                                                        <View>
                                                            <ImageBackground
                                                                source={{uri:item.trackImage}}
                                                                style={{
                                                                    width:40,
                                                                    height:40,
                                                                    resizeMode:'stretch',
                                                                    alignItems: 'center',
                                                                    justifyContent: 'center',
                                                                    opacity:index === SongIndexReducer && item._id === currentAudio._id? 0.7 : 1
                                                                }}
                                                                imageStyle={{borderRadius:20}}
                                                            
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
                                                        </View>
                                                        <Text style={{fontFamily:'Baloo2-Medium', color: '#fff', marginLeft:10}}>{item.trackName}</Text>
                                                    </View>
                                                    <View style={{width:'12%', flexDirection:'column-reverse'}}>
                                                        <Text style={{fontFamily:'Baloo2-Medium', color: Colors.grey3}}>{item.trackLength}</Text>
                                                    </View>
                                                </View>
                                            )
                                        
                                    )}
                                    <TouchableOpacity onPress={() => props.navigation.navigate("AllSingels", {songsList: allArtistSongs})} style={{top:10 ,paddingHorizontal:10, widht:'20%', alignItems: 'center'}}>
                                        <Text style={{fontFamily:'Baloo2-Medium', color:Colors.grey3, fontSize:12}}>See all singles</Text>
                                        <Feather
                                            name="more-horizontal"
                                            color={Colors.grey3}
                                            size={20}
                                            style={{bottom:5}}
                                        />
                                        
                                    </TouchableOpacity>
                         </ScrollView>
                    </View>
                }
            </ScrollView>
        </ImageBackground>
    )
}


export const screenOptions = navData => {
    return {        
        gestureEnabled: false,
        headerShown: false,
    }
}

export default ArtistMusicScreen;