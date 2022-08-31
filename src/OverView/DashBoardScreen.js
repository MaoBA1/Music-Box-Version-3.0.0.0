import React, { useState, useEffect } from 'react';
import { 
    View,
    Text,
    Modal, 
    FlatList, ImageBackground
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Style from './Style/DashBoardStyle';
import Post from '../components/Post';
import Header from '../components/Header';
import Menu from './MenuScreen';
import Comment from './CommentScreen';
import { getArtistData } from '../ApiCalls';

const DashBoardScreen = props => {
    const dispatch = useDispatch();
    const userDataSelector = useSelector(state => state.UserReducer);
    const isSuperUser = userDataSelector?.UserReducer?.account?.isSuperUser;
    const [isVisible, setIsVisble] = useState(false);
    const postSelector = useSelector(state => state.Post);
    const post = postSelector?.PostReducer;
    const [modalStatus, setModalStatus] = useState('');
    const [commentParams, setCommentParams] = useState(null);

    const closeAndOpenMenu = () => {
        setModalStatus('menu');
        setIsVisble(!isVisible);
    }

    const logout = async () =>{
        try {
            closeAndOpenMenu();
            props.navigation.navigate('auth');
        } catch (error) {
            console.log(error);
        }
    }

    const CloseAndOpenCommentScreen = (params) => {
        setCommentParams(params);
        setModalStatus('comment');
       setIsVisble(!isVisible);
    }

    useEffect(async() => {
        if(isSuperUser) {
            const jsonToken = await AsyncStorage.getItem('Token');
            const userToken = jsonToken != null ? JSON.parse(jsonToken) : null;     
            if(userToken) {
                getArtistData(dispatch, userToken);
            }
        }
    }, [])
    
    return(
        <View style={Style.backgroundContainer}>
            <Modal
                visible={isVisible}
                animationType='slide'   

            >
               { modalStatus == 'menu' && <Menu func={closeAndOpenMenu} logout={logout}/>}
               {modalStatus == 'comment' && <Comment func={CloseAndOpenCommentScreen} params={commentParams}/>}
            </Modal>

            <Header func={closeAndOpenMenu}/>
            <View style={Style.mainContainer}>                
                
                {
                    post?
                    (
                        <FlatList
                            style={{width: '100%'}}
                            data={post.sort((a, b) => (new Date(b.creatAdt) - new Date(a.creatAdt)))}
                            keyExtractor={item => item._id}
                            renderItem={currentPost => <Post post={currentPost.item} openCommentScreen={CloseAndOpenCommentScreen}/>}
                            
                        />
                    )
                    :
                    (
                        <ImageBackground 
                                source={ require('../../assets/AppAssets/Logo.png') }
                                resizeMode="cover" 
                                style={{flex:1, width:'100%', height:'100%', alignItems: 'center', justifyContent:'center'}}
                                imageStyle={{opacity: 0.3}}
                        >
                            <Text style={{fontFamily:'Baloo2-Bold', color:'#fff', fontSize:20}}>There is no content to show right now</Text>
                        </ImageBackground>
                    ) 
                    
                }
                
            </View>
        </View>
    )
}




export const screenOptions = navData => {
    return {        
        gestureEnabled:false,
        tabBarLabel:'Feed',
    }
}


export default DashBoardScreen;
    