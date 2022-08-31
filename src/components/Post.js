import React from 'react';
import { 
    View,
    Text,
    TouchableOpacity,
    ImageBackground,
    Image 
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Colors from '../Utitilities/AppColors';
import Style from './Style/PostStyle';
import { Video } from 'expo-av';
import { getPosts, giveLikeToPost, unLikeToPost, getPostComment } from '../ApiCalls';


const Post = props => {
    const dispatch = useDispatch(); 
    const getAllArtistsSelector = useSelector(state => state.ArtistsReducer);
    const getUserDataSelector = useSelector(state => state.UserReducer);
    const artists = getAllArtistsSelector? getAllArtistsSelector?.ArtistsReducer?.artists : null;
    let likeStatus = false;
    const post = props?.post;
    const formatted_artistName = post?.postAuthorName[0]?.toUpperCase() + post?.postAuthorName?.substring(1,post?.postAuthorName?.length);    
    const postDate = new Date(post?.creatAdt).toDateString();
    let postAuthor = null;


    const getPostAuthor = async() => {
        if(artists) {
           artists.forEach(artist => {
               if(artist._id == post?.postAuthorId) {
                 postAuthor = artist;
                 return;
               }
           })
        }
    }
    
    const media = () => {
        switch(post?.postMedia?.format) {
            case 'video':
                return(
                    <Video
                        style={{width:'100%', height:250, resizeMode: 'cover'}}
                        source={{ uri: post?.postMedia?.uri }}
                        useNativeControls 
                    />
                )
            case 'image':
                return(
                    <Image
                        source={{ uri: post?.postMedia?.uri }}
                        style={{width:'100%', height:250, resizeMode:'cover'}}
                    />
                )
            default:
                return(<View></View>)
        }
    }

    const like = async() => {
        try {
            const jsonToken = await AsyncStorage.getItem('Token');
            const userToken = jsonToken != null ? JSON.parse(jsonToken) : null;
            if(userToken){            
                await giveLikeToPost(dispatch, userToken, post?._id)
                .then(result => {
                    getPosts(dispatch, userToken);
                    amILikeThisPost();
                    likeStatus = true;
                })
            }
        } catch (error) {
            console.log(error.message);
        }
        
    }

    const unlike = async() => {
        try {
            const jsonToken = await AsyncStorage.getItem('Token');
            const userToken = jsonToken != null ? JSON.parse(jsonToken) : null;
            if(userToken){
                await unLikeToPost(dispatch, userToken, post?._id)
                .then(result => {
                    getPosts(dispatch, userToken);
                    amILikeThisPost();
                })
            }
        } catch (error) {
            console.log(error.message);
        }
        
    }

   

    const amILikeThisPost = async () => {
        let likes = post?.likes;
        let myId = getUserDataSelector?.UserReducer?.account?._id;        
        let flag = false;
        likes.forEach(like => {
            if(like.toString() == myId?.toString()) {
                flag = true;
                likeStatus = true;                
                return;
            }
        })
        if(!flag) {
            likeStatus = false;
        }
    }
   
    
    amILikeThisPost();
    getPostAuthor();
    
    const openCommentScreen = async() => {
        const jsonToken = await AsyncStorage.getItem('Token');
        const userToken = jsonToken != null ? JSON.parse(jsonToken) : null; 
        if(userToken){
            await getPostComment(dispatch, userToken, post._id)
            .then(result => {
                props.openCommentScreen({post:post, postAuthor:formatted_artistName, postAuthorImage:postAuthor.profileImage})
            })
        }
    }

   
    
    return (
        <ImageBackground 
            style={Style.mainContainer}
            source={ require('../../assets/AppAssets/Logo.png') }
            resizeMode="cover"
            imageStyle={{opacity:0.4}}
        >
            
            <View style={Style.authorDetailsContainer}>
                <View style={Style.authorNameAndImageContainer}>
                    <View style={Style.authorImageContainer}>
                        <Image
                            source={{uri:postAuthor?.profileImage}}
                            style={Style.authorImageStyle}
                        />
                    </View>
                    <View style={Style.authorNameContainer}>
                        <Text style={Style.authorNameStyle}>{formatted_artistName}</Text>
                    </View>
                </View>
                <View style={Style.dateContainer}>
                    <Text style={Style.dateStyle}>{postDate}</Text>
                </View>
            </View>

            <View style={Style.postContentContainer}>
                <Text style={Style.postContentStyle}>{post.postContent}</Text>
            </View>

            <View style={Style.postMediaStyle}>
                {media()}
            </View>


            <View style={Style.countOfCommentAndLikeContainer}>
                <TouchableOpacity style={Style.countContainer}>
                    <FontAwesome
                        name='comment'
                        size={20} 
                        style={{width:30}} 
                        color={Colors.grey3}                      
                    />
                    <Text style={Style.count}>{post.comments.length} comments</Text>
                </TouchableOpacity>
                <View style={Style.countContainer}>
                    <AntDesign
                        name='like1'
                        size={20}       
                        style={{width:30}}
                        color={Colors.grey3}                                        
                    />
                    <Text style={Style.count}>{post.likes.length} Likes</Text>
                </View>
            </View>
            <View style={Style.buttonsContainer}>
                <View style={[Style.buttonIconsContainer,{opacity: post?.postMedia?.format == 'video' || post?.postMedia?.format == 'audio'? 1 : 0.5}]}>
                    <Ionicons
                        name='md-add-circle'
                        size={25}   
                        color={Colors.grey7}                     
                    />
                    <Text style={Style.buttonTitle}>Add to Playlist</Text>
                </View>
                
                <TouchableOpacity onPress={openCommentScreen} style={Style.buttonIconsContainer}>
                    <FontAwesome
                        name='comment'
                        size={25}           
                        color={Colors.grey7}             
                    />
                    <Text style={Style.buttonTitle}>Add comment</Text>
                </TouchableOpacity>

                {
                    likeStatus?
                    (
                        <TouchableOpacity onPress={unlike} style={Style.buttonIconsContainer}>
                            <AntDesign
                                name='dislike1'
                                size={25} 
                                color={Colors.red3}                       
                            />
                            <Text style={Style.buttonTitle}>UnLike</Text>
                        </TouchableOpacity>
                            
                        
                    )
                    :
                    (
                        <TouchableOpacity onPress={like} style={Style.buttonIconsContainer}>
                            <AntDesign
                                name='like1'
                                size={25}
                                color={Colors.grey7}                     
                            />
                            <Text style={Style.buttonTitle}>Like</Text>
                        </TouchableOpacity>
                            
                        
                    )
                }
            </View>
        </ImageBackground>
    )
}


export default Post;