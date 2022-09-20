import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    ScrollView,
    ImageBackground,
    TouchableOpacity,
    Image,
    ActivityIndicator
} from 'react-native';
import { useDispatch, useSelector} from 'react-redux';
import Entypo from 'react-native-vector-icons/Entypo';
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Feather from 'react-native-vector-icons/Feather';
import { 
    cleanArtistPostsForDashboardProfil,
    cleanSongReducers ,
    cleanPlaylistReducer,
    cleanAlbumReducer
} from '../../ApiCalls';
import { SwitchBetweenDashBoardStacksAction, setPostAuthorProfileAction } from '../../../store/actions/appActions';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Colors from '../../Utitilities/AppColors';
import { 
    getArtistLatestRealeasesForDashBoardProfil,
    getArtistTop5ForDashBoardProfil,
    getAllArtistSongsForDashBoardProfil,
    getArtistPlayListsForDashBoardProfile,
    getAllArtistAlbumsForDashBoardProfile
} from '../../ApiCalls';
import { getAllArtistAlbumsAction } from '../../../store/actions/albumsActions';
import { 
    playInTheFirstTimeAction,
    pauseSongAction,
    resumeSongAction,
    playNextSongAction,
    preperNextSongAction,
    handleSeeBarAction
} from '../../../store/actions/appActions';
import { Audio } from 'expo-av';
import { play, pause, resume, playNext } from '../../../audioController';



import AudioListItemRow from './components/AudioListItemRow';
import OptionsModal from './components/OptionsModal';
import AddSongToPlayList from './components/AddSongToPlayList';

const MusicScreen = props => {
    const dispatch = useDispatch();
    const appSelector = useSelector(state => state.AppReducer);
    const artistSelector = useSelector(state => state.ArtistsReducer);
    const artistAlbumSelector = useSelector(state => state.AlbumReducers);
    const artistSongsSelector = useSelector(state => state.SongReducer);
    const allArtistAlbums = artistAlbumSelector?.ArtistAlbumDashBordReducer?.ArtistAlbums;
    const artistTop5 = artistSongsSelector?.ArtistTop5SongsDashBoardProfileReducer;
    const artistLatestRealeases = artistSongsSelector?.ArtistLatestReleasesDashBoardProfileReducer;
    const allArtistSongs = artistSongsSelector?.ArtistSongsDashBoardProfileReducer;
    const allArtistPlaylist = artistSelector?.ArtistPlaylistsDashBoardReducer;
    const { PostAuthorProfile } = appSelector;
    const { 
        _id,
        profileImage,
        profileSeconderyImage,
        artistName,
        description,
        mainGener,
        additionalGener,
        skills
    } = PostAuthorProfile;
    const artistId = _id;
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
    const [optionIsVisible, setOptionIsVisible] = useState(false);
    const [optionModalTrack, setOptionModalTrack] = useState(null);
    const [listForOptionsModal, setListForOptionsModal] = useState(null);
    const [indexForOptionsModal, setIndexForOptionsModal] = useState(null);
    const [addToPlayListVisible, setAddToPlaylistVisible] = useState(false);
    
    
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

        const getArtistSongs = async () => {
            const jsonToken = await AsyncStorage.getItem('Token');        
            const userToken = jsonToken != null ? JSON.parse(jsonToken) : null;
            if(userToken) {            
                getAllArtistSongsForDashBoardProfil(dispatch, userToken, artistId);
                getArtistTop5ForDashBoardProfil(dispatch, userToken, artistId);
                getArtistLatestRealeasesForDashBoardProfil(dispatch, userToken, artistId);
                getArtistPlayListsForDashBoardProfile(dispatch, userToken, artistId);
                getAllArtistAlbumsForDashBoardProfile(dispatch, userToken, artistId);
            }
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

    const backToHomePage = () => {
        props.navigation.goBack(null);
    }

    return (
        <>
        <View style={{backgroundColor: Colors.grey4}}>
            <Entypo
                name="arrow-left"
                style={{
                    left:8,
                    shadowColor:'#000', shadowOffset:{width:0, height:3},
                    shadowOpacity:0.5, 
                }}
                size={35}
                color={Colors.red3}
                onPress={backToHomePage}
            />
        </View>
        {
            optionIsVisible && 
            <OptionsModal
                currentAudio={optionModalTrack}
                close={setOptionIsVisible}
                backGroundCurrentAudio={currentAudio}
                play={handleAudioPress}
                list={listForOptionsModal}
                index={indexForOptionsModal}    
                setAddToPlaylistVisible={setAddToPlaylistVisible}
            />
        }
        {
            addToPlayListVisible &&
            <AddSongToPlayList
                artist={{artistName:artistName, artistId:artistId}}
                song={optionModalTrack}
                close={setAddToPlaylistVisible}
            />
        }
        
            {
                (!artistTop5 || artistTop5?.length === 0) && (!artistLatestRealeases || artistLatestRealeases?.length === 0)
                && (!allArtistPlaylist || allArtistPlaylist?.length === 0) && (!allArtistAlbums || allArtistAlbums?.length === 0)
                && (!allArtistSongs || allArtistSongs?.length === 0) ?
                ( 
                    <ImageBackground
                        source={require('../../../assets/AppAssets/Logo.png')}
                        style={{flex: 1, backgroundColor:Colors.grey1, alignItems: 'center', justifyContent: 'center'}}
                        imageStyle={{opacity: 0.3}}
                    >
                        <Text
                            style={{
                                fontFamily: 'Baloo2-Bold', 
                                color: '#fff',
                                fontSize:20,
                            }}
                        >
                            Apparently this is a new profile,
                        </Text>
                        <Text
                            style={{
                                fontFamily: 'Baloo2-Bold', 
                                color: '#fff',
                                fontSize:20,
                            }}
                        >
                            currently there is no content to display yet
                        </Text>
                    </ImageBackground>
                )
                :
                (
                    <ScrollView
                        style={{
                            flex:1,
                            backgroundColor: Colors.grey1
                        }}
                    >
                        {artistTop5 && artistTop5.length > 0 && 
                            <>
                                    <View style={{
                                        marginTop:20, 
                                        marginLeft:10
                                    }}>
                                        <Text style={{
                                            fontFamily:'Baloo2-Bold',
                                            color: '#fff',
                                            fontSize:16
                                        }}>
                                            Top 5
                                        </Text>
                                    </View>

                                    <View style={{
                                        borderColor: Colors.grey6,
                                        borderTopWidth:0.5,
                                        borderBottomWidth:0.5,
                                    }}>
                                        {
                                            artistTop5.map((item, index) => 
                                                <AudioListItemRow
                                                    key={item._id}
                                                    index={index}
                                                    item={item}
                                                    list={artistTop5}
                                                    handleAudioPress={handleAudioPress}
                                                    SongIndex={SongIndexReducer}
                                                    currentAudio={currentAudio}
                                                    isPlaying={isPlaying}
                                                    isLoading={isLoading}
                                                    setOptionIsVisible={setOptionIsVisible}
                                                    setOptionModalTrack={setOptionModalTrack}
                                                    setListForOptionsModal={setListForOptionsModal}
                                                    setIndexForOptionsModal={setIndexForOptionsModal}
                                                />
                                            )
                                        }

                                    </View>

                                    
                            </>
                        }


                        
                        {
                            artistLatestRealeases && artistLatestRealeases.length > 0 &&
                                <>
                                        <View style={{
                                            marginTop:20, 
                                            marginLeft:10
                                        }}>
                                            <Text style={{
                                                fontFamily:'Baloo2-Bold',
                                                color: '#fff',
                                                fontSize:16
                                            }}>
                                                Latest Realeases
                                            </Text>
                                        </View>

                                        <View style={{
                                            borderColor: Colors.grey6,
                                            borderTopWidth:0.5,
                                            borderBottomWidth:0.5,
                                        }}>
                                            {
                                                artistLatestRealeases.slice(0,5).map((item, index) => 
                                                    <AudioListItemRow
                                                        key={item._id}
                                                        index={index}
                                                        item={item}
                                                        list={artistLatestRealeases}
                                                        handleAudioPress={handleAudioPress}
                                                        SongIndex={SongIndexReducer}
                                                        currentAudio={currentAudio}
                                                        isPlaying={isPlaying}
                                                        isLoading={isLoading}
                                                        setOptionIsVisible={setOptionIsVisible}
                                                        setOptionModalTrack={setOptionModalTrack}
                                                        setListForOptionsModal={setListForOptionsModal}
                                                        setIndexForOptionsModal={setIndexForOptionsModal}
                                                    />
                                                )
                                            }

                                        </View>

                                        
                                </>
                            
                        }


                        {
                            allArtistPlaylist && allArtistPlaylist.length > 0 &&
                                <>
                                        <View style={{
                                            marginTop:20, 
                                            marginLeft:10
                                        }}>
                                            <Text style={{
                                                fontFamily:'Baloo2-Bold',
                                                color: '#fff',
                                                fontSize:16
                                            }}>
                                                Playlists
                                            </Text>
                                        </View>

                                        <ScrollView horizontal style={{
                                            borderColor: Colors.grey6,
                                            borderTopWidth:0.5,
                                            borderBottomWidth:0.5,
                                            backgroundColor: Colors.grey4,
                                        }}>
                                            {
                                                allArtistPlaylist.map((item, index) => 
                                                    <TouchableOpacity key={item._id} style={{
                                                        margin:10,
                                                        alignItems: 'center',
                                                        top:5,
                                                        height:'100%'
                                                    }} onPress={() => props.navigation.navigate("PlaylistScreen", {songsList: item.tracks, screenName: item.playlistName})}>
                                                        <Image
                                                            style={{width:85, height:85, resizeMode:'stretch'}}
                                                            source={{uri:item.playlistImage}}
                                                        />
                                                        <Text numberOfLines={1} style={{
                                                            fontFamily:'Baloo2-Medium',
                                                            color:'#fff', 
                                                            width:'80%'
                                                        }}>
                                                            {item.playlistName}
                                                        </Text>
                                                    </TouchableOpacity>
                                                )
                                            }

                                        </ScrollView>

                                        
                                </>
                            
                        }

                        {
                            allArtistAlbums && allArtistAlbums.length > 0 &&
                                <>
                                        <View style={{
                                            marginTop:20, 
                                            marginLeft:10
                                        }}>
                                            <Text style={{
                                                fontFamily:'Baloo2-Bold',
                                                color: '#fff',
                                                fontSize:16
                                            }}>
                                                Albums
                                            </Text>
                                        </View>

                                        <ScrollView horizontal style={{
                                            borderColor: Colors.grey6,
                                            borderTopWidth:0.5,
                                            borderBottomWidth:0.5,
                                            backgroundColor: Colors.grey4,
                                        }}>
                                            {
                                                allArtistAlbums.map((item, index) => 
                                                    <TouchableOpacity key={item._id} style={{
                                                        margin:10,
                                                        alignItems: 'center',
                                                        top:5,
                                                        height:'100%'
                                                    }} onPress={() => props.navigation.navigate("PlaylistScreen", {songsList: item.tracks, screenName: item.albumName})}>
                                                        <Image
                                                            style={{width:85, height:85, resizeMode:'stretch'}}
                                                            source={{uri:item.albumCover}}
                                                        />
                                                        <Text numberOfLines={1} style={{
                                                            fontFamily:'Baloo2-Medium',
                                                            color:'#fff', 
                                                            width:'80%'
                                                        }}>
                                                            {item.albumName}
                                                        </Text>
                                                    </TouchableOpacity>
                                                )
                                            }

                                        </ScrollView>

                                        
                                </>
                            
                        }

                        
                        {
                            allArtistSongs && allArtistSongs.length > 0 &&
                                <>
                                        <View style={{
                                            marginTop:20, 
                                            marginLeft:10
                                        }}>
                                            <Text style={{
                                                fontFamily:'Baloo2-Bold',
                                                color: '#fff',
                                                fontSize:16
                                            }}>
                                                Singles
                                            </Text>
                                        </View>

                                        <View style={{
                                            borderColor: Colors.grey6,
                                            borderTopWidth:0.5,
                                            borderBottomWidth:0.5,
                                        }}>
                                            {
                                                allArtistSongs.slice(0,5).map((item, index) => 
                                                    <AudioListItemRow
                                                        key={item._id}
                                                        index={index}
                                                        item={item}
                                                        list={artistLatestRealeases}
                                                        handleAudioPress={handleAudioPress}
                                                        SongIndex={SongIndexReducer}
                                                        currentAudio={currentAudio}
                                                        isPlaying={isPlaying}
                                                        isLoading={isLoading}
                                                        setOptionIsVisible={setOptionIsVisible}
                                                        setOptionModalTrack={setOptionModalTrack}
                                                        setListForOptionsModal={setListForOptionsModal}
                                                        setIndexForOptionsModal={setIndexForOptionsModal}
                                                    />
                                                )
                                            }
                                                <View style={{width: '100%', alignItems: 'center', margin:10}}>
                                                    <TouchableOpacity style={{alignItems: 'center'}} onPress={() => props.navigation.navigate("PlaylistScreen", {songsList: allArtistSongs, screenName:"Singels"})}>
                                                        <Text style={{
                                                            color:Colors.grey3,
                                                            fontFamily: 'Baloo2-Medium'
                                                        }}>See All Singles</Text>
                                                        <Feather
                                                            name="more-horizontal"
                                                            color={Colors.grey3}
                                                            size={20}
                                                            style={{bottom:5}}
                                                        />
                                                    </TouchableOpacity>
                                                </View> 
                                        </View>

                                       
                                </>
                            
                        }
                   </ScrollView> 
                )
            }
        

        </>
    );
    
};


export default MusicScreen;
