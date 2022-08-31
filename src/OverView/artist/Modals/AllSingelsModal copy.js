import React, { useState } from 'react';
import {
    View,KeyboardAvoidingView,
    Text, TouchableOpacity, Image, ActivityIndicator,
    FlatList, Modal, TextInput, Platform
} from 'react-native';
import Colors from '../../../Utitilities/AppColors';
import { useDispatch, useSelector } from 'react-redux';
import AntDesign from 'react-native-vector-icons/AntDesign';
import MusicGeneralHeader from '../components/MusicGeneralHeder';
import { setSongOnBackGroundAction, setMusicOnBackGroundAction, setSongIndexAction } from '../../../../store/actions/appActions';

import MusicScreenModal from './MusicScreenModal';

const AllSingelsModal = props => {
    const dispatch = useDispatch();
    const artistSongsSelector = useSelector(state => state.SongReducer);
    const allArtistSongs = artistSongsSelector?.ArtistSongsReducer;
    const [musicScreenVisible, setMusicScreenVisible] = useState(false);
    const playSong = (index) => {
        let action = [setMusicOnBackGroundAction(true), setSongOnBackGroundAction(allArtistSongs), setSongIndexAction(index)];
        try{
            dispatch(action[0]);
            dispatch(action[1]);
            dispatch(action[2]);
            setMusicScreenVisible(true);
        }
        catch(error) {
            console.log(error.message);
        }
    }

    return(
       
        <View style={{flex: 1, width: '100%', height:'100%', backgroundColor:Colors.grey3}}>
            <MusicGeneralHeader goBack={() => props.navigation.goBack(null)} title={'Singels'}/>
            {musicScreenVisible && <MusicScreenModal close={setMusicScreenVisible}/>}
            <FlatList
                data={allArtistSongs}
                keyExtractor={item => item._id}
                renderItem={ ({item, index}) => 
                    <TouchableOpacity onPress={() => playSong(index)} style={{width:'100%', marginTop:5, backgroundColor: Colors.grey1, padding:10, flexDirection:'row', justifyContent: 'space-between'}}>
                        <View style={{flexDirection:'row', alignItems: 'center'}}>
                            <Image
                                source={{uri:item.trackImage}}
                                style={{width: 50, height:50, borderWidth:20}}
                            />
                            <Text style={{fontFamily:'Baloo2-Medium', color:'#fff', left:5}}>{item.trackName}</Text>
                        </View>
                        <View style={{width:'20%', alignItems: 'center'}}>
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
            />            
            
        </View>
    
    )
}

export default AllSingelsModal;