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
            <Entypo
                name="arrow-left"
                style={{
                    left:8,
                    shadowColor:'#000', shadowOffset:{width:0, height:3},
                    shadowOpacity:0.5, 
                    position: 'absolute',
                    zIndex:1,
                    
                }}
                size={35}
                color={Colors.red3}
                onPress={backToHomePage}
            />
            <ImageBackground
                source={{uri:profileSeconderyImage}}
                style={{
                    width: '100%',
                    height:200,
                    borderBottomWidth:2,
                    borderColor:Colors.grey6,
                    flexDirection:'column-reverse',
                }}
                imageStyle={{resizeMode:'stretch'}}
            >
                
                <View
                    style={{
                        width:'100%',
                        padding:10,
                        justifyContent:'space-between',
                        flexDirection:'row',
                    }}
                >
                    <Text style={{
                        fontFamily: 'Baloo2-ExtraBold',
                        color: Colors.red3,
                        fontSize:20,
                        top:30
                    }}>
                        {artistName}
                    </Text>
                </View>
            </ImageBackground>
            <View
                style={{
                    backgroundColor: Colors.grey4,
                    width:'100%'
                }}
            >
                <View style={{
                    width:'100%',
                    flexDirection:'row',
                    justifyContent:'space-between',
                }}>
                    
                    <View style={{
                        width:'70%',
                        alignItems:'center',
                        justifyContent:'center',
                        borderBottomWidth:2,
                        borderRightWidth:2,
                        borderBottomRightRadius:50,
                        borderColor: Colors.grey6,
                        shadowColor:'#000', shadowOffset:{width:0, height:3},
                        shadowOpacity:0.5, shadowRadius :5
                    }}>
                        <Text style={{
                            fontFamily:'Baloo2-Bold',
                            color: '#fff',
                            fontSize:12
                        }}>
                            {description}
                        </Text>
                    </View>
                    <View style={{
                        borderRadius:50,
                        borderWidth:2,
                        alignSelf:'flex-end', 
                        marginLeft:10,
                        borderColor: Colors.grey6,
                        bottom:40,
                        right:8,
                        zindex:1,                    
                    }}>
                        <Image
                            source={{uri:profileImage}}
                            style={{width:70, height:70, borderRadius:50}}
                        />
                    </View>
                </View>

                <View style={{
                    width:'100%',
                    marginTop:10,
                    flexDirection:'row'
                }}>
                    <View style={{
                        width:'50%', 
                        alignItems: 'center'
                    }}>
                        <Text style={{
                            fontFamily: 'Baloo2-Bold',
                            color:Colors.grey6,
                            fontSize:12
                        }}>
                            Main Gener
                        </Text>

                        <Text style={{
                            fontFamily: 'Baloo2-Bold',
                            color:'#fff',
                            fontSize:12
                        }}>
                            {mainGener.generName}
                        </Text>
                    </View>

                    <View style={{
                        width:'50%', 
                        alignItems: 'center'
                    }}>
                        <Text style={{
                            fontFamily: 'Baloo2-Bold',
                            color:Colors.grey6,
                            fontSize:12
                        }}>
                            Additional geners
                        </Text>

                        <View style={{flexDirection:'row'}}>
                            {additionalGener.map((item, index) => 
                                <Text
                                    key={index}
                                    style={{
                                        fontFamily: 'Baloo2-Bold',
                                        color:'#fff',
                                        fontSize:12
                                    }}
                                >
                                    {item.generName}{index === additionalGener.length - 1 ? '' : ', '}
                                </Text>
                            )}
                        </View>
                    </View>
                </View>
                <View style={{
                    width:'100%', 
                    alignItems: 'center',
                    borderTopWidth:0.5,
                    borderColor:Colors.grey6,
                }}>
                    <Text style={{
                        fontFamily: 'Baloo2-Bold',
                        color:Colors.grey6,
                        fontSize:12
                    }}>
                        Skills
                    </Text>

                    <View style={{flexDirection:'row'}}>
                        {additionalGener.map((item, index) => 
                            <Text
                                key={index}
                                style={{
                                    fontFamily: 'Baloo2-Bold',
                                    color:'#fff',
                                    fontSize:12
                                }}
                            >
                                {item.generName}{index === additionalGener.length - 1 ? '' : ', '}
                            </Text>
                        )}
                    </View>
                </View>
            </View>

            {
                    artistPosts?
                    (
                        <View style={{bottom: 12}}>
                            {
                                artistPosts?.sort((a, b) => (new Date(b.creatAdt) - new Date(a.creatAdt))).map((item, index) => (
                                    <View key={index}>
                                        <Post
                                            post={item}
                                            openCommentScreen={CloseAndOpenCommentScreen} 
                                            openAddToPlaylist={() => setAddToPlaylistVisible(true)}
                                            setSongForPlaylist={setSongForPlaylist}
                                        />
                                    </View>
                                ))
                            }
                        </View>
                    )
                    :
                    (
                        <ImageBackground 
                                source={ require('../../../assets/AppAssets/Logo.png') }
                                resizeMode="cover" 
                                style={{flex:1, width:'100%', height:'100%', alignItems: 'center', justifyContent:'center'}}
                                imageStyle={{opacity: 0.3}}
                        >
                            <Text style={{fontFamily:'Baloo2-Bold', color:'#fff', fontSize:20}}>There is no content to show right now</Text>
                        </ImageBackground>
                    ) 
                    
                }
            
        </ScrollView>
    );
};


export default FeedScreen;




// {
//     artistPosts?
//     (
//         <View
            
//         >
//             {
//                 artistPosts.sort((a, b) => (new Date(b.creatAdt) - new Date(a.creatAdt)))
//                 .map((item, index) => 
//                     <View key={index}>
//                         <Post
//                             post={item}
//                             openCommentScreen={CloseAndOpenCommentScreen} 
//                             openAddToPlaylist={() => setAddToPlaylistVisible(true)}
//                             setSongForPlaylist={setSongForPlaylist}
//                         />
//                     </View>
//                 )
//             }
//         </View>
//     )
//     :
//     (
//         <ImageBackground 
//                 source={ require('../../../assets/AppAssets/Logo.png') }
//                 resizeMode="cover" 
//                 style={{top:400, width: '100%', height:'100%', alignItems: 'center', position: 'absolute'}}
//                 imageStyle={{flex:1 , opacity: 0.3, width:300, height:300, left:40}}
//         >
//             <Text style={{fontFamily:'Baloo2-Bold', color:'#fff', fontSize:20, top:150}}>This profile have no post right now</Text>
//         </ImageBackground>
//     ) 
    
// }