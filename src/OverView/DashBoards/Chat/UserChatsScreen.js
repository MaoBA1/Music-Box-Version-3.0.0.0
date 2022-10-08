import React, {  } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import Colors from '../../../Utitilities/AppColors';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Entypo from 'react-native-vector-icons/Entypo';
import Fontisto from 'react-native-vector-icons/Fontisto';

const UserChatsScreen = () => {
    return (
        <View style={{
            flex:1,
            backgroundColor:Colors.grey1
        }}>
            <Text>UserChatsScreen</Text>
        </View>
    );
};

export const screenOptions = ({ navigation }) => {
    return {
        title:'Messages',
        headerStyle:{backgroundColor:Colors.grey1, borderBottomWidth:2, borderBottomColor:Colors.grey3},
        headerTitleStyle:{
            color:"#FFFFFF",
            fontFamily:"Baloo2-ExtraBold",
            fontSize:25
        },
        headerTitleAlign: 'center',
        headerLeft: () => {
            return <TouchableOpacity onPress={navigation.goBack} style={{ marginLeft:10 }}>
                <AntDesign name="arrowleft" size={24} color="#ffffff"/>
            </TouchableOpacity>
        },
        headerRight: () => {
            return <View style={{ marginRight:10, flexDirection:'row', width:65, justifyContent:"space-between"}}>
                <TouchableOpacity>
                    <Fontisto name="persons" size={24} color={Colors.grey6}/>
                </TouchableOpacity>
                <TouchableOpacity>
                    <Entypo name="new-message" size={24} color={Colors.grey6}/>
                </TouchableOpacity>
            </View>
        }
    }
}

export default UserChatsScreen;
