//import liraries
import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, Image, Modal, ImageBackground } from 'react-native';
import Colors from '../../Utitilities/AppColors';
import { useDispatch, useSelector} from 'react-redux';
import Entypo from 'react-native-vector-icons/Entypo'
import { SwitchBetweenDashBoardStacksAction, setPostAuthorProfileAction } from '../../../store/actions/appActions';
import { getArtistPostsById } from '../../ApiCalls';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Post from '../../components/Post';
import Comment from '../CommentScreen';
import AddSongFromPostToPlaylist from '../../components/AddSongFromPostToPlaylist';

const FeedScreen = () => {
    const dispatch = useDispatch();
    const appSelector = useSelector(state => state.AppReducer);
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
    const postSelector = useSelector(state => state.Post);
    const artistPosts = postSelector.ArtistPostsReducer;
    const [commentParams, setCommentParams] = useState(null);
    const [songForPlaylist, setSongForPlaylist] = useState(null);
    const [addToPlaylistVisible, setAddToPlaylistVisible] = useState(false);
    const [isVisible, setIsVisble] = useState(false);
    const [modalStatus, setModalStatus] = useState('');

    const backToHomePage = () => {
        try {
            dispatch(setPostAuthorProfileAction(null))
            dispatch(SwitchBetweenDashBoardStacksAction(true));
        }catch(error) {
            console.log(error.message);
        }        
    }

    useEffect(() => {
        async function getArtistPostsAsync(){
            const jsonToken = await AsyncStorage.getItem('Token');
            const userToken = jsonToken != null ? JSON.parse(jsonToken) : null; 
            if(userToken) {
                getArtistPostsById(dispatch, userToken, _id);
            }
        }
        getArtistPostsAsync();
        
    },[])
    console.log('====================================');
    console.log(artistPosts);
    console.log('====================================');

    const CloseAndOpenCommentScreen = (params) => {
        setCommentParams(params);
        setModalStatus('comment');
       setIsVisble(!isVisible);
    }

    return (
        <ScrollView style={{
            flex: 1,
            backgroundColor:Colors.grey1
        }}>
            <Modal
                visible={isVisible}
                animationType='slide'   

            >               
               {modalStatus == 'comment' && <Comment func={CloseAndOpenCommentScreen} params={commentParams}/>}
            </Modal>
            {addToPlaylistVisible && <AddSongFromPostToPlaylist close={setAddToPlaylistVisible} track={songForPlaylist}/>}
            <View style={{width:'100%'}}>
                <Entypo
                    name="arrow-left"
                    style={{
                        position:'absolute',
                        zIndex:1,
                        top:10,
                        left:5,
                        shadowColor:'#000',
                        shadowOffset:{width:0, height:3},
                        shadowOpacity:0.5,
                        shadowRadius :5
                    }}
                    color={Colors.red3}
                    size={35}
                    onPress={backToHomePage}
                />
                <View style={{
                    borderBottomWidth:2,
                    borderColor: Colors.grey6
                }}>
                    <Image
                        source={{uri:profileSeconderyImage}}
                        style={{width:'100%', height:200, resizeMode:'stretch'}}
                    />
                </View>                
            </View>
            <View style={{
                    width:'100%',
                    alignItems: 'center',
                    bottom: 50,
                    zIndex:1,                    
                }}>
                <View style={{
                    borderRadius:50,
                    padding:1,
                    borderWidth:1,
                    borderColor: Colors.grey6
                }}>
                    <Image
                        source={{uri:profileImage}}
                        style={{width: 90, height: 90, borderRadius:50, resizeMode:'stretch'}}
                    />
                </View>
            </View>
            <View style={{
                width:'100%',
                backgroundColor: Colors.grey4,
                bottom:95
            }}>
                <View style={{
                    marginLeft:10,
                    marginTop:30,
                    padding:10
                }}>
                    <Text style={{
                        fontFamily: 'Baloo2-ExtraBold',
                        fontSize:25,
                        color:Colors.red3
                    }}>
                        {artistName}
                    </Text>
                </View>

                <View
                    style={{
                        borderWidth:0.5,
                        padding:10,
                        paddingHorizontal:20,
                        width:'95%',
                        alignSelf:'center',
                        backgroundColor: Colors.grey1,
                        shadowColor:'#000',
                        shadowOffset:{width:0, height:3},
                        shadowOpacity:0.5,
                        shadowRadius :5,
                        borderRadius:20
                    }}
                >
                    <Text
                        style={{
                            fontFamily: 'Baloo2-Bold',
                            color:Colors.red1,
                            textShadowColor: '#fff',
                            textShadowOffset: {width: 1, height:1},
                            textShadowRadius:2,
                            fontSize:18
                        }}
                    >
                        {mainGener?.generName}
                    </Text>
                    <View style={{
                        flexDirection:'row',
                    }}>
                        {
                            additionalGener.map((item, index) => 
                                <Text 
                                    key={item._id}
                                    style={{
                                        fontFamily: 'Baloo2-Bold',
                                        color:Colors.grey6,
                                        textShadowColor: '#fff',
                                        textShadowOffset: {width: 0, height:1},
                                        textShadowRadius:1,
                                    }}
                                >
                                    {item?.generName}{index === additionalGener.length - 1? ' ' : ', '}                                
                                </Text>
                            )
                        }
                    </View>
                    <View style={{
                        flexDirection:'row',
                        marginTop:10,
                    }}>
                        {
                            
                            skills.map((item, index) => 
                                <Text 
                                    key={index}
                                    style={{
                                        fontFamily: 'Baloo2-Bold',
                                        color:Colors.grey2,
                                        textShadowColor: '#fff',
                                        textShadowOffset: {width: 0, height:1},
                                        textShadowRadius:1,
                                    }}
                                >
                                    {item}{index === skills.length - 1? ' ' : ', '}                                
                                </Text>
                            )
                        }
                    </View>
                </View>

                <View style={{
                    width:'95%',
                    alignSelf:'center',
                    alignItems: 'center',
                    borderRadius:20,
                    borderWidth:0.5,
                    backgroundColor:Colors.grey1,
                    margin:10,
                    padding:10,
                    backgroundColor: Colors.grey1,
                    shadowColor:'#000',
                    shadowOffset:{width:0, height:3},
                    shadowOpacity:0.5,
                    shadowRadius :5
                }}>
                    <Text style={{
                        fontFamily: 'Baloo2-Bold',
                        fontSize:16,
                        color:'#fff'
                    }}>
                        {description}
                    </Text>
                </View>
            </View>

            {
                    artistPosts?
                    (
                        <View
                            style={{
                                bottom:100
                            }}
                        >
                            {
                                artistPosts.sort((a, b) => (new Date(b.creatAdt) - new Date(a.creatAdt)))
                                .map((item, index) => 
                                    <Post
                                        key={item._id} 
                                        post={item}
                                        openCommentScreen={CloseAndOpenCommentScreen} 
                                        openAddToPlaylist={() => setAddToPlaylistVisible(true)}
                                        setSongForPlaylist={setSongForPlaylist}
                                    />
                                )
                            }
                        </View>
                    )
                    :
                    (
                        <ImageBackground 
                                source={ require('../../../assets/AppAssets/Logo.png') }
                                resizeMode="cover" 
                                style={{top:400, width: '100%', height:'100%', alignItems: 'center', position: 'absolute'}}
                                imageStyle={{flex:1 , opacity: 0.3, width:300, height:300, left:40}}
                        >
                            <Text style={{fontFamily:'Baloo2-Bold', color:'#fff', fontSize:20, top:150}}>This profile have no post right now</Text>
                        </ImageBackground>
                    ) 
                    
                }
            
        </ScrollView>
    );
};


export default FeedScreen;
