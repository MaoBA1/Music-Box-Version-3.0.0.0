import React, { useState, useEffect, useCallback } from 'react';
import { 
    View,
    Text,
    TouchableOpacity,
    ImageBackground,
    Modal, Platform,
    ActivityIndicator,
    Image,
    ScrollView,
    FlatList
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useDispatch, useSelector } from 'react-redux';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import Feather from 'react-native-vector-icons/Feather';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Entypo from 'react-native-vector-icons/Entypo';
import Colors from '../../Utitilities/AppColors';
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



const MusicBoardScreen = props => {
    const dispatch = useDispatch();
    const userDataSelector = useSelector(state => state.UserReducer);
    const songsSelector = useSelector(state => state.SongReducer);
    const artistSelector = useSelector(state => state.ArtistsReducer);
    const appBackGroundSelector = useSelector(state => state.AppReducer);
    const user = userDataSelector?.UserReducer?.account;
    const userPlaylists = userDataSelector?.UserPlaylists?.Playlists;
    const songsByUserFavoriteGeners = songsSelector?.SongsByUserFavoriteGeners?.List; 
    const artistsByUserFavoriteGeners = artistSelector?.ArtistsByUserFavoritGeners;
    const [topList, setTopList] = useState([]);
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
    
    const blessing = () => {
        const currentTime = new Date().getHours();
        if(currentTime >= 5 && currentTime<12) {
            return "Good Morning";
        } else if(currentTime >= 12 && currentTime<18) {
            return "Good After Noon";
        } else if(currentTime >= 18 && currentTime<22) {
            return "Good Evening";
        } else {
            return "Good Night";
        }
    }

    useEffect(() => {
        function makeTopList(){
            let playlist = userPlaylists?.sort((a,b) => (a.songs.length - b.songs.length));
            let songsByGeners = songsByUserFavoriteGeners?.map(x => x = x.songs);
            songsByGeners = [].concat.apply([],songsByGeners);
            let list = [];
            for(let i = 0; list.length < 3 || i < playlist?.length; i ++) {
                list.push({
                    type:'playlist',
                    _id: playlist[i]?._id,
                    playlistName: playlist[i]?.playlistName,
                    playlistImage: playlist[i]?.playlistImage,
                    tracks: playlist[i]?.songs,
                })
            }
            for(let i = 0; list.length < 3 || i < songsByGeners?.length; i++) {
                list.push({
                    type: 'song',
                    _id:songsByGeners[i]?._id,
                    artistName:songsByGeners[i]?.artistName,
                    trackImage: songsByGeners[i]?.trackImage,
                    trackLength: songsByGeners[i]?.trackLength,
                    trackName: songsByGeners[i]?.trackName,
                    trackUri: songsByGeners[i]?.trackUri 

                })
            }
            list = list.sort((a, b) => 0.5 - Math.random()).slice(0,6);
            setTopList(list);
        }
        if(userPlaylists?.length > 0 && songsByUserFavoriteGeners?.length > 0){
            makeTopList();
        }
    },[userPlaylists, songsByUserFavoriteGeners])
    

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


    const openToArtistScreen = (artist) => {
        try {
            dispatch(setPostAuthorProfileAction(artist))
            props.navigation.navigate("ProfileStack");
        }catch(error) {
            console.log(error.message);
        }        
    }

    

    
    
    return(
        <ImageBackground 
                source={ require('../../../assets/AppAssets/Logo.png') }
                resizeMode="cover" 
                style={{flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor:Colors.grey1}}
                imageStyle={{opacity: 0.3}}
        >
            <ScrollView style={{flex:1, width: '100%',}}>
                <View style={{
                    width: '60%',
                    paddingTop:10,
                    left:10,
                    alignItems: 'center',
                    alignSelf: 'center',
                    backgroundColor:Colors.grey4,
                    borderBottomLeftRadius:50,
                    borderBottomRightRadius:50,
                    borderBottomWidth:2,
                    borderLeftWidth:2,
                    borderRightWidth:2,
                    borderColor:'#fff'
                }}>
                    <Text style={{
                        fontFamily: 'Baloo2-ExtraBold',
                        color: '#fff',
                        textShadowColor: Colors.red3,
                        textShadowOffset: {width: 0, height:3},
                        textShadowRadius:3,
                        fontSize:18
                    }}>
                        Hi {user?.firstName}
                    </Text>
                    <Text style={{fontFamily:'Baloo2-Bold', fontSize:16, color:Colors.red3}}>Have a {blessing()}</Text>
                </View>
                <View style={{flexDirection: 'row', width: '100%', justifyContent: 'space-around', marginVertical: 20 }}>
                    <View style={{width:'49%'}}>
                        {
                            topList.length > 0
                            && topList.slice(0, topList.length/2)
                            .map((item, index) => 
                                <View key={index}>
                                    {
                                        item.type === 'playlist' &&
                                        <TouchableOpacity 
                                            onPress={() => props.navigation.navigate("PlaylistScreen", {songsList: item.tracks, screenName: item.playlistName})} 
                                            key={index} style={{borderRadius:10, margin:2, backgroundColor:Colors.grey4, flexDirection:'row', alignItems: 'center', widht:'45%'}}
                                        >
                                            <View style={{width:'29%'}}>
                                                <Image
                                                    source={{uri: item?.playlistImage}}
                                                    style={{width: 50, height: 50, borderTopLeftRadius:10, borderBottomLeftRadius:10}}
                                                />
                                            </View>
                                            <View style={{width:'65%', alignItems:'flex-start'}}>
                                                <Text style={{fontFamily:'Baloo2-Medium', color:'#fff', fontSize:15}} numberOfLines={1}>
                                                    {item.playlistName}
                                                </Text>
                                                <View style={{margin:5}}>
                                                    <Text style={{fontFamily:'Baloo2-Medium', color:Colors.grey3, fontSize:12}}>{item?.tracks?.length} tracks</Text>
                                                </View>
                                            </View>
                                        </TouchableOpacity>
                                    }
                                    {
                                        item.type === 'song' &&
                                        <TouchableOpacity onPress={() => handleAudioPress(item, index, [item])} key={index} style={{borderRadius:10, margin:2, backgroundColor:Colors.grey4, flexDirection:'row', alignItems: 'center', widht:'45%'}}>
                                            <View style={{width:'29%'}}>
                                            <ImageBackground
                                                style={{width: 50, height: 50, alignItems: 'center', justifyContent: 'center'}}
                                                imageStyle={{borderTopLeftRadius:10, borderBottomLeftRadius:10}}
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
                                            </View>
                                            <View style={{width:'65%', alignItems: 'flex-start'}}>
                                                <Text style={{fontFamily:'Baloo2-Medium', color:'#fff', fontSize:15}} numberOfLines={1}>
                                                    {item.trackName}
                                                </Text>
                                                <View style={{margin:5}}>
                                                    <Text style={{fontFamily:'Baloo2-Medium', color:Colors.grey3, fontSize:12}}>{item?.artistName}</Text>
                                                </View>
                                            </View>
                                        </TouchableOpacity>
                                    }
                                </View>
                            )
                        }
                    </View>
                    <View style={{width:'49%'}}>
                        {
                            topList.length > 0
                            && topList.slice(topList.length/2, topList.length)
                            .map((item, index) => 
                                <View key={index}>
                                    {
                                        item.type === 'playlist' &&
                                        <TouchableOpacity 
                                            onPress={() => props.navigation.navigate("PlaylistScreen", {songsList: item.tracks, screenName: item.playlistName})}
                                            key={index} style={{borderRadius:10, margin:2, backgroundColor:Colors.grey4, flexDirection:'row', alignItems: 'center', widht:'45%'}}
                                        >
                                            <View style={{width:'29%'}}>
                                                <Image
                                                    source={{uri: item?.playlistImage}}
                                                    style={{width: 50, height: 50, borderTopLeftRadius:10, borderBottomLeftRadius:10}}
                                                />
                                            </View>
                                            <View style={{width:'65%', alignItems: 'flex-start'}}>
                                                <Text style={{fontFamily:'Baloo2-Medium', color:'#fff', fontSize:15}} numberOfLines={1}>
                                                    {item.playlistName}
                                                </Text>
                                                <View style={{margin:5}}>
                                                    <Text style={{fontFamily:'Baloo2-Medium', color:Colors.grey3, fontSize:12}}>{item?.tracks?.length} tracks</Text>
                                                </View>
                                            </View>
                                        </TouchableOpacity>
                                    }
                                    {
                                        item.type === 'song' &&
                                        <TouchableOpacity onPress={() => handleAudioPress(item, index, [item])} key={index} style={{borderRadius:10, margin:2, backgroundColor:Colors.grey4, flexDirection:'row', alignItems: 'center', widht:'45%'}}>
                                            <View style={{width:'29%'}}>
                                            <ImageBackground
                                                style={{width: 50, height: 50, alignItems: 'center', justifyContent: 'center'}}
                                                imageStyle={{borderTopLeftRadius:10, borderBottomLeftRadius:10}}
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
                                            </View>
                                            <View style={{width:'65%', alignItems: 'flex-start'}}>
                                                <Text style={{fontFamily:'Baloo2-Medium', color:'#fff', fontSize:15}} numberOfLines={1}>
                                                    {item.trackName}
                                                </Text>
                                                <View style={{margin:5}}>
                                                    <Text style={{fontFamily:'Baloo2-Medium', color:Colors.grey3, fontSize:12}}>{item?.artistName}</Text>
                                                </View>
                                            </View>
                                        </TouchableOpacity>
                                    }
                                </View>
                            )
                        }
                    </View>
                </View>
                {
                    songsByUserFavoriteGeners && songsByUserFavoriteGeners?.length > 0 &&
                    <>
                        <View style={{borderBottomWidth: 1, borderColor:'#fff', width:'70%', left:10}}>
                            <Text style={{fontFamily:'Baloo2-Bold', color:'#fff', fontSize:18}}>
                                Songs from your favorite genres
                            </Text>
                        </View>
                        <View>
                            <ScrollView>
                                {
                                    songsByUserFavoriteGeners?.map((item, index) =>
                                        item?.songs?.length > 0 &&
                                        <View key={index}>
                                            <Text style={{fontFamily:'Baloo2-Bold', color:Colors.red3, left:10, margin:10, fontSize:16}}>
                                                {item?.gener?.generName}
                                            </Text>
                                            <ScrollView horizontal style={{backgroundColor: Colors.grey4, paddingTop:10}}>
                                                {
                                                    item?.songs?.map((item, index, list) =>
                                                        <TouchableOpacity onPress={() => handleAudioPress(item, index, list)} key={index} style={{
                                                            margin: 5,
                                                            width:90,
                                                            alignItems: 'center'
                                                        }}>
                                                            <ImageBackground
                                                                style={{width:80, height:80, alignItems: 'center', justifyContent: 'center'}}
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
                                                            <Text numberOfLines={1} style={{marginTop:5, fontFamily:'Baloo2-Bold', color:'#fff'}}>{item?.trackName}</Text>
                                                        </TouchableOpacity>
                                                    )
                                                }
                                            </ScrollView>
                                        </View>
                                    )
                                }
                            </ScrollView>
                        </View>
                    </>
                }
                {
                    artistsByUserFavoriteGeners && artistsByUserFavoriteGeners?.length > 0 &&
                    <>
                        <View style={{borderBottomWidth: 1, borderColor:'#fff', width:'70%', left:10, marginTop:20}}>
                            <Text style={{fontFamily:'Baloo2-Bold', color:'#fff', fontSize:18}}>
                                Artists from your favorite genres
                            </Text>
                        </View>
                        <View>
                            <ScrollView>
                                {
                                    artistsByUserFavoriteGeners?.map((item, index) =>
                                        item?.artists?.length > 0 &&
                                        <View key={index}>
                                            <Text style={{fontFamily:'Baloo2-Bold', color:Colors.red3, left:10, margin:10, fontSize:16}}>
                                                {item?.gener?.generName}
                                            </Text>
                                            <ScrollView horizontal style={{backgroundColor: Colors.grey4, paddingTop:10}}>
                                                {
                                                    item?.artists?.map((item, index) =>
                                                        <TouchableOpacity onPress={() => openToArtistScreen(item)} key={index} style={{
                                                            margin: 5,
                                                            width:90,
                                                            alignItems: 'center'
                                                        }}>
                                                            <Image
                                                                source={{uri: item?.profileImage}}
                                                                style={{width:80, height:80, resizeMode:'stretch'}}
                                                            />
                                                            <Text numberOfLines={1} style={{marginTop:5, fontFamily:'Baloo2-Bold', color:'#fff'}}>{item?.artistName}</Text>
                                                        </TouchableOpacity>
                                                    )
                                                }
                                            </ScrollView>
                                        </View>
                                    )
                                }
                            </ScrollView>
                        </View>
                    </>
                }
            </ScrollView>
            
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
    