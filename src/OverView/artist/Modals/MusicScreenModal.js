import React, { useState, useRef, useEffect } from 'react';
import {
    Text,
    View,
    Modal,
    Image,
    ImageBackground,
    FlatList, TouchableOpacity,
    Dimensions, Animated
} from 'react-native';
import Colors from '../../../Utitilities/AppColors';
import { useDispatch, useSelector } from 'react-redux';
import AntDesign from 'react-native-vector-icons/AntDesign';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { setSongOnBackGroundAction, setMusicOnBackGroundAction, setSongIndexAction } from '../../../../store/actions/appActions';
import { Audio } from 'expo-av';




const { width, height } = Dimensions.get('window');


const MusicScreenModal = props => {
    const dispatch = useDispatch();
    const artistSongsSelector = useSelector(state => state.SongReducer);
    const allArtistSongs = artistSongsSelector?.ArtistSongsReducer;
    const appSelector = useSelector(state => state.AppReducer);
    const intialIndex = appSelector?.SongIndexReducer;
    const [songIndex, setSongIndex] = useState(intialIndex);
    const songDetails = appSelector?.SongOnBackGroundReducer[songIndex];
    const artistName = songDetails?.artistName;
    const songLength = songDetails?.trackLength;
    const songName = songDetails?.trackName;
    const songUri = songDetails?.trackUri;
    const songImage = songDetails?.trackImage;
    const scrollX = useRef(new Animated.Value(0)).current;
    const songSlider = useRef(null);
    const state = {
        playbackObj: null,
        soundObj: null,
    }
    const [playbackObj, setPlaybackObj] = useState(null);
    const [soundObj, setSoundObj] = useState(null);
    
    
    


    const moveSong = (index) => {
        let action = [setMusicOnBackGroundAction(true), setSongOnBackGroundAction(allArtistSongs), setSongIndexAction(index)];
        try{
            dispatch(action[0]);
            dispatch(action[1]);
            dispatch(action[2]);
        }
        catch(error) {
            console.log(error.message);
        }
    }

   

    useEffect(() => {
        scrollX.addListener(({value}) => {
            const index = Math.round(value/width);
            setSongIndex(index); 
        },[]);

        return () => {
            scrollX.removeAllListeners();         
        }
    },[])

    

    const skipToNext = () => {
        songSlider.current.scrollToOffset({
            offset: (songIndex + 1) * width
        });
    }

    const skipToPrevious = () => {
        songSlider.current.scrollToOffset({
            offset: (songIndex - 1) * width
        });
    }


    

    const playSong = async () => {
        try{
            if(soundObj === null) {
                console.log('1');
                const soundObject = new Audio.Sound();
                const status = await soundObject.loadAsync(
                    {uri:songUri},
                    {shouldPlay: true}
                )
                setPlaybackObj(soundObject);
                setSoundObj(status);
                return;
            }

            if(soundObj?.isLoaded && soundObj?.isPlaying) {
                console.log('2');
                const status = await playbackObj?.setStatusAsync({shouldPlay: false});
                setSoundObj(status);
                return;
            }
            
            if(soundObj?.isLoaded && !soundObj?.isPlaying) {
                console.log('3');
                const status = await playbackObj?.playAsync({shouldPlay: true});  
                if(status.isPlaying === false) {

                    console.log('1');
                    const soundObject = new Audio.Sound();
                    const status = await soundObject.loadAsync(
                        {uri:songUri},
                        {shouldPlay: true}
                    )
                    setPlaybackObj(soundObject);
                    setSoundObj(status);
                    return;
                }
                setSoundObj(status);
                return;
            }
            
        }catch(error) {
            console.log(error);
        }
        
    }
    

    useEffect(() => {
        if(soundObj) {
            console.log(soundObj);
        }
        
    },[soundObj])

   
    
    

    return(
        <Modal
            visible={true}
            transparent={true}
            animationType='slide'
        >
            <View style={{flex:1, width: '100%', height: '100%', backgroundColor:Colors.grey4}}>
                <TouchableOpacity style={{
                        shadowColor: '#171717',
                        shadowOffset: {width: 0, height: 10},
                        shadowOpacity: 0.5,
                        shadowRadius: 3,
                        width:'10%',
                        alignItems: 'center', top:35
                    }} 
                    onPress={() => props.close(false)}
                >
                    <FontAwesome
                        name='close'
                        size={25}
                        color={'#fff'}
                    />
                </TouchableOpacity>
                <View style={{width: '100%', marginTop:50}}>
                    <Animated.FlatList
                        ref={songSlider}
                        horizontal
                        data={allArtistSongs}
                        showsHorizontalScrollIndicator={false}
                        scrollEventThrottle={25}
                        pagingEnabled
                        keyExtractor={item => item._id}
                        initialScrollIndex={intialIndex}
                        renderItem={
                            ({item, index}) => 
                            <View 
                                style={{
                                    width:width,
                                    alignItems: 'center', 
                                    justifyContent: 'center', 
                                    shadowColor:'#000', shadowOffset:{width:0, height:3}, shadowOpacity:0.5, shadowRadius :5
                                }}
                            >
                                <Image
                                    source={{uri:songImage}}
                                    style={{width:250, height: 300, borderRadius:20}}
                                />
                            </View>
                        }
                        onScroll={Animated.event(
                            [{nativeEvent:{
                                contentOffset: {x: scrollX}
                            }}],
                            {useNativeDriver: true}
                        )}
                    />
                </View>
                <View style={{width:'100%', alignItems: 'center', marginTop:50}}>
                    <Text style={{fontFamily:'Baloo2-Bold', color: '#fff', fontSize:18}}>{songName}</Text>
                    <Text style={{fontFamily:'Baloo2-Medium', fontSize:15, color:Colors.grey3}}>{artistName}</Text>
                </View>

                <View style={{width:'100%', marginTop:30, alignItems: 'center'}}>
                    <View style={{width:'60%', justifyContent: 'space-between', flexDirection:'row', alignItems: 'center'}}>
                        <TouchableOpacity onPress={skipToPrevious}>
                                <AntDesign
                                    name='stepbackward'
                                    size={30}
                                    color={'#fff'}
                                />
                        </TouchableOpacity>
                        <TouchableOpacity onPress={playSong} style={{width:50, height:50, borderRadius:50, backgroundColor:'#fff', alignItems: 'center', justifyContent: 'center'}}>
                                <AntDesign
                                    name='caretright'
                                    size={30}
                                    color={'#000'}
                                />
                        </TouchableOpacity>
                        <TouchableOpacity onPress={skipToNext}>
                                <AntDesign
                                    name='stepforward'
                                    size={30}
                                    color={'#fff'}
                                />
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    )
}

export default MusicScreenModal;