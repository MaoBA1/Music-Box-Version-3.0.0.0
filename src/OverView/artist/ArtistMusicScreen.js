import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    TextInput,
    Image,
    ImageBackground,
    TouchableOpacity,
    FlatList,
    ScrollView,
    Modal
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import Style from './style/ArtistFeedStyle';
import Colors from '../../Utitilities/AppColors';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Feather from 'react-native-vector-icons/Feather';
import { 
    getAllArtistSongs,
    getArtistTop5,
    getArtistLatestRealeases,
    getArtistPlayLists
} from '../../ApiCalls';
import AsyncStorage from '@react-native-async-storage/async-storage';

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
        getArtistSongs();
    },[])
    
    
    
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
                                        renderItem={song => 
                                            <View style={{margin:5, alignItems: 'center', justifyContent: 'center'}}>
                                                <TouchableOpacity>
                                                    <Image
                                                        source={{uri:song.item.trackImage}}
                                                        style={{width:50, height:50, borderRadius:20, resizeMode:'stretch'}}
                                                    />                                                
                                                </TouchableOpacity>
                                                <Text style={{fontFamily:'Baloo2-Medium', color:'#fff', marginTop:5}}>{song.item.trackName}</Text>
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
                                            <View style={{margin:5, alignItems: 'center', justifyContent: 'center'}}>
                                                <TouchableOpacity>
                                                    <Image
                                                        source={{uri:playlist.item.playlistImage}}
                                                        style={{width:50, height:50, borderRadius:20, resizeMode:'stretch'}}
                                                    />                                                
                                                </TouchableOpacity>
                                                <Text style={{fontFamily:'Baloo2-Medium', color:'#fff', marginTop:5}}>{playlist.item.playlistName}</Text>
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
                                    {allArtistSongs.map(item => 
                                        <View key={item._id} style={{justifyContent: 'space-between', width:'100%', flexDirection: 'row', marginVertical:3, backgroundColor: Colors.grey1, padding:10, borderRadius:10}}>
                                            <View style={{flexDirection:'row', alignItems: 'center'}}>
                                                <TouchableOpacity>
                                                    <Image
                                                        source={{uri:item.trackImage}}
                                                        style={{width:40, height:40, borderRadius:20, resizeMode:'stretch'}}
                                                    />                                                
                                                </TouchableOpacity>
                                                <Text style={{fontFamily:'Baloo2-Medium', color: '#fff', marginLeft:10}}>{item.trackName}</Text>
                                            </View>
                                            <View style={{width:'12%', flexDirection:'column-reverse'}}>
                                                <Text style={{fontFamily:'Baloo2-Medium', color: Colors.grey3}}>{item.trackLength}</Text>
                                            </View>
                                        </View>
                                    )}
                                    <TouchableOpacity onPress={() => props.navigation.navigate("AllSingels")} style={{top:10 ,paddingHorizontal:10, widht:'20%', alignItems: 'center'}}>
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