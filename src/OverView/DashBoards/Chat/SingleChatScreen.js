import React, { useEffect, useState, useCallback } from 'react';
import { 
    View,
    TouchableOpacity,
    Keyboard,
    Text
} from 'react-native';
import Colors from '../../../Utitilities/AppColors';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { db } from '../../../../firebase';
import { collection, addDoc, serverTimestamp, onSnapshot, Timestamp  } from "firebase/firestore";
import { useSelector } from 'react-redux';
import { Avatar } from 'react-native-elements';
import { GiftedChat } from 'react-native-gifted-chat';
import { ActivityIndicator } from 'react-native';

const SingleChatScreen = ({ navigation, route }) => {
    // reciver 
    const userDataSelector = useSelector(state => state.UserReducer);
    const isSuperUser = userDataSelector?.UserReducer?.account?.isSuperUser;
    const artistSelector = useSelector(state => state.ArtistsReducer);
    const artistName = artistSelector?.ArtistDataReducer?.artistName;
    const userFirstName = userDataSelector?.UserReducer?.account?.firstName;
    const userFormattedFirstName = userFirstName && userFirstName[0]?.toUpperCase() + userFirstName?.substring(1,userFirstName?.length);
    const userAvatar = userDataSelector?.UserReducer?.account?.Avatar;
    const artistAvatar = artistSelector?.ArtistDataReducer?.profileImage;
    const reciverName = isSuperUser ? artistName : userFormattedFirstName;
    const reciverId = isSuperUser? artistSelector?.ArtistDataReducer?._id : userDataSelector?.UserReducer?.account._id;
    const reciverAvatar = isSuperUser ? artistAvatar : userAvatar;
    
    // contact
    const contactName = route?.params?.contact?.artistName || route?.params?.contact?.name;
    const contactAvatar = route?.params?.contact?.profileImage || route?.params?.contact?.photo;
    const contactId = route?.params?.contact?._id || route?.params?.contact?.id;
    

    // chat configuration
    const chatId = route.params.chatId
    const chatRef = collection(db, "single-chats", chatId, "massages");
    
    const [ messages, setMessages ] = useState([]);
    
    useEffect(() => {
        const snap = onSnapshot(chatRef, (snapShot) => {
            setMessages(snapShot.docs.map(doc => ({
                _id: doc.id,
                text: doc.data().message,
                createdAt: new Date(new Timestamp(doc?.data()?.timestamp?.seconds, doc?.data()?.timestamp?.nanoseconds).toDate()),
                user: {
                    _id: doc.data().senderId,
                    name:doc.data().senderName,
                    avatar: doc.data().avatar
                },
            })).sort((a, b) => b.createdAt - a.createdAt))
        })
        
    },[])
    
    const sendMessage = async(m) => {
        Keyboard.dismiss();
        await addDoc( chatRef, {
            message:m[0].text,
            senderName: reciverName,
            senderId: reciverId,
            timestamp: serverTimestamp(),
            avatar: reciverAvatar
        })
    }
    
    const onSend = useCallback((messages = []) => {
        sendMessage(messages)
        setMessages(previousMessages => GiftedChat.append(previousMessages, messages))
      }, [])

    return(
        <View style={{
            flex: 1,
            backgroundColor:Colors.grey1
        }}>
            <GiftedChat
                messages={messages}
                onSend={message => onSend(message)}
                user={{
                    _id: reciverId,
                    name: reciverName,
                    avatar: reciverAvatar,
                }}
                showAvatarForEveryMessage={true}
                renderBubble={({currentMessage}) => {
                    const userId = currentMessage?.user?._id;
                    const userName = currentMessage?.user?.name;
                    const message = currentMessage?.text;
                    const createdAt = new Date(currentMessage.createdAt).toLocaleTimeString().split(":").slice(0,2).join(":");
                    return createdAt? 
                    (
                        <>
                            {
                                userId === reciverId?
                                (
                                    <View style={{
                                        padding:10,
                                        backgroundColor: Colors.red3,
                                        borderTopLeftRadius:20,
                                        borderTopRightRadius:20,
                                        borderBottomLeftRadius:20
                                    }}>
                                        <Text style={{fontFamily:"Baloo2-Medium", color:'#fff', fontSize:15}}>{message}</Text>
                                        <Text style={{fontFamily:"Baloo2-Regular", color: Colors.grey2, fontSize:12}}>{createdAt}</Text>
                                    </View>
                                )
                                :
                                (
                                    <View style={{
                                        padding:10,
                                        backgroundColor: Colors.grey2,
                                        borderTopLeftRadius:20,
                                        borderTopRightRadius:20,
                                        borderBottomRightRadius:20
                                    }}>
                                        <Text style={{fontFamily:"Baloo2-Medium", color:Colors.grey4, fontSize:15}}>{message}</Text>
                                        <Text style={{fontFamily:"Baloo2-Regular", color: Colors.grey3, fontSize:12}}>{createdAt}</Text>
                                    </View>
                                )
                            }
                        </>
                    )
                    :
                    (
                        <>
                            {
                                userId === reciverId?
                                (
                                    <View style={{
                                        padding:10,
                                        backgroundColor: Colors.red3,
                                        borderTopLeftRadius:20,
                                        borderTopRightRadius:20,
                                        borderBottomLeftRadius:20
                                    }}>
                                        <ActivityIndicator size="small" color={Colors.red3}/>
                                    </View>
                                )
                                :
                                (
                                    <View style={{
                                        padding:10,
                                        backgroundColor: Colors.grey2,
                                        borderTopLeftRadius:20,
                                        borderTopRightRadius:20,
                                        borderBottomRightRadius:20
                                    }}>
                                        <ActivityIndicator size="small" color={Colors.red3}/>
                                    </View>
                                )
                            }
                        </>
                    )

                }}
            />
        </View>
    );
};


export const screenOptions = ({ navigation, route }) => {
    const contactName = route?.params?.contact?.artistName || route?.params?.contact?.name;
    const contactAvatar = route?.params?.contact?.profileImage || route?.params?.contact?.photo;
    return {
        title: contactName,
        headerStyle:{backgroundColor:Colors.grey1, borderBottomWidth:2},
        headerTitleStyle:{
            color:"#FFFFFF",
            fontFamily:"Baloo2-ExtraBold",
            fontSize:25
        },
        headerTitleAlign: "center",
        headerLeft: () => {
            return <TouchableOpacity onPress={navigation.goBack} style={{ marginLeft:10, marginBottom:5 }}>
                <AntDesign name="arrowleft" size={24} color="#ffffff"/>
            </TouchableOpacity>
        },
        headerRight: () => {
            return <View style={{ marginRight: 10, marginBottom:5 }}>
                    <Avatar
                        rounded
                        source={{
                            uri: contactAvatar
                        }}
                    />
                </View>
        }
    }
}

export default SingleChatScreen;
