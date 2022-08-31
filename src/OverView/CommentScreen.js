import React, { useState } from 'react';
import { 
    View,
    Text,
    TextInput,
    TouchableOpacity,
    ImageBackground,
    Platform, Keyboard,
    KeyboardAvoidingView, Image
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useDispatch, useSelector } from 'react-redux';
import Style from './Style/CommentStyle';
import CommentHeader from '../components/CommentHeader';
import {KeyboardAwareFlatList} from 'react-native-keyboard-aware-scroll-view';
import CommentItem from '../components/CommentItem';
import { giveCommentToPost , getPosts } from '../ApiCalls';


const CommentScreen = props => {
    const flatListRef = React.useRef();
    const dispatch = useDispatch();
    const userDataSelector = useSelector(state => state.UserReducer);
    const user = userDataSelector?.UserReducer?.message;
    const post = props.params.post;
    const postAuthorName = props.params.postAuthor;
    const postAuthorImage = props.params.postAuthorImage;    
    let commentsSelector = useSelector(state => state.Post?.postCommentReducer);
    const [commentText, setCommentText] = useState('');

    const sendComment = async() => {
        Keyboard.dismiss();
        try{
            const jsonToken = await AsyncStorage.getItem('Token');
            const userToken = jsonToken != null ? JSON.parse(jsonToken) : null;
            if(userToken) {
                getPosts(dispatch, userToken);
                giveCommentToPost(dispatch, userToken, post._id, commentText);
                setCommentText('');
            }
        } catch (error) {
            console.log(error);
        }
    }

    
    
    return(
        <ImageBackground 
                source={ require('../../assets/AppAssets/Logo.png') }
                resizeMode="cover" 
                style={Style.backgroundContainer}
                imageStyle={{opacity: 0.3}}
        >
            <CommentHeader func={props.func}/>
            <KeyboardAvoidingView keyboardVerticalOffset={Platform.OS == 'android' && 20} behavior="height" style={{width:'100%', height:'100%', flex:1}}>
                <View style={Style.mainContainer}>
                    <View style={Style.authorPartContainer}>
                            <View style={Style.authorImageContainer}>
                                <Image
                                    source={{uri:postAuthorImage}}
                                    style={Style.authorImageStyle}
                                />
                            </View>
                            <View style={Style.authorNameAndPostContentContainer}>
                                <Text style={Style.authorNameStyle}>{postAuthorName}</Text>
                                <View style={{width:'90%'}}>
                                    <Text style={Style.postContentStyle}>{post?.postContent}</Text>
                                </View>
                            </View>
                    </View>
                    <View style={{width:'100%', flex:1}}>
                        <KeyboardAwareFlatList
                            ref={flatListRef}
                            data={commentsSelector?.sort((a, b) => (new Date(b.commentCreatAdt) - new Date(a.commentCreatAdt)))}
                            keyExtractor={item => item._id}
                            renderItem={commentItem => <CommentItem comment={commentItem.item}/>}
                        />
                    </View>
                    <View style={Style.textInputContainer}>
                        <TextInput
                            style={Style.textInputStyle}
                            placeholder="Comment..."
                            value={commentText}
                            onChangeText={text => setCommentText(text)}
                            keyboardAppearance='dark'
                            multiline
                            
                        />
                        {
                            commentText.length > 0?
                            (
                                <TouchableOpacity onPress={sendComment} style={Style.sendButtonStyle}>
                                    <Text style={{fontFamily:'Baloo2-Medium', color:'#fff'}}>Send</Text>
                                </TouchableOpacity>
                            )
                            :
                            (
                                <View style={Style.sendButtonDeom}>
                                    <Text style={{fontFamily:'Baloo2-Medium', color:'#fff'}}>Send</Text>
                                </View>
                            )
                        }
                        
                    </View>
                </View>
            </KeyboardAvoidingView>
        </ImageBackground>
    )
}



export default CommentScreen;
    