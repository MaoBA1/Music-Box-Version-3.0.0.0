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
import { getArtistPostsById } from '../../ApiCalls';
import AsyncStorage from '@react-native-async-storage/async-storage';


import FeedHeadr from './components/FeedHedar';
import UploadPostModal from './Modals/UploadPostModal';
import ArtistPost from './components/ArtistPost';
import Comment from '../CommentScreen';
import ArtistPostCommentModal from './Modals/AtristPostCommentModal';

const ArtistFeedScreen = props => {
    const [uploadPostModalVisible, setUploadPostModalVisible] = useState(false);
    const dispatch = useDispatch();
    const postSelector = useSelector(state => state.Post);
    const artistPosts = postSelector.ArtistPostsReducer;
    const artistSelector = useSelector(state => state.ArtistsReducer);
    const artistId = artistSelector?.ArtistDataReducer?._id;
    const [commentParams, setCommentParams] = useState(null);
    const [commentScreenVisible, setCommentScreenVisble] = useState(false);
    
    
    useEffect(() => {
        async function getArtistPostsAsync(){
            const jsonToken = await AsyncStorage.getItem('Token');
            const userToken = jsonToken != null ? JSON.parse(jsonToken) : null; 
            if(userToken) {
                getArtistPostsById(dispatch, userToken, artistId);
            }
        }
        getArtistPostsAsync();
        
    },[])

   

    return(
        <View style={Style.backgroundContainer}>
            <FeedHeadr goBack={() =>  props.navigation.navigate('Setting')} openModal={setUploadPostModalVisible}/>
            {uploadPostModalVisible && <UploadPostModal close={setUploadPostModalVisible}/>}
            {commentScreenVisible && <ArtistPostCommentModal close={setCommentScreenVisble} params={commentParams}/>}
            {
                !artistPosts || artistPosts?.length == 0 ?
                (
                    <View style={{width:'100%', height:'90%', alignItems: 'center', justifyContent: 'center'}}>
                        <Text style={{fontFamily:'Baloo2-Bold', color: '#fff', fontSize:20}}>You have no posts yet</Text>
                    </View>
                )
                :
                (
                    <FlatList
                        data={artistPosts.sort((a, b) => (new Date(b.creatAdt) - new Date(a.creatAdt)))}
                        keyExtractor={item => item._id}
                        renderItem={post => <ArtistPost post={post.item} artist={artistSelector?.ArtistDataReducer} openComments={setCommentScreenVisble} setCommentDetails={setCommentParams}/>}
                    />
                )
            }
            
        </View>
    )
}


export const screenOptions = navData => {
    return {        
        gestureEnabled: false,
        headerShown: false,
    }
}

export default ArtistFeedScreen;