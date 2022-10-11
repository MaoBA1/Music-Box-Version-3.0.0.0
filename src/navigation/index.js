import React, {useEffect} from 'react';
import { TouchableOpacity, Platform, View, Text } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Entypo from 'react-native-vector-icons/Entypo';
import Fontisto from 'react-native-vector-icons/Fontisto';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Colors from '../Utitilities/AppColors';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { useSelector } from 'react-redux';



//Authentication
import LoginScreen, {screenOptions as LoginScreenOptions} from '../Authentication/LoginScreen';
import SignUpScreen, {screenOptions as signuUpScreenOptions} from '../Authentication/SignUpScreen';
import VerificationScreen, {screenOptions as verificationScreenOptions} from '../Authentication/VerificationScreen';
import ForgetPasswordScreen, {screenOptions as ForgetPasswordScreenOptions} from '../Authentication/ForgetPasswordScreen';
import ResetPasswordScreen, {screenOptions as ResetPasswordScreenOptions} from '../Authentication/ResetPasswordScreen';


//First Use
import FirstUseScreen, {screenOptions as FirstUseScreenOptions} from '../FirstUse';

//OverView

    // DashBoard
import DashBoardScreen, {screenOptions as DashBoardScreenOptions} from '../OverView/DashBoards/MainDashBoard/DashBoardScreen';
import MusicBoard, {screenOptions as MusicBoardScreenOptions} from '../OverView/DashBoards/DashBoardMusic/MusicBoard';
import FeedScreen, {screenOptions as FeedScreenOptions} from '../OverView/DashBoards/DashboardUserProfiles/FeedScreen';
import MusciScreen, {screenOptions as MusciScreenOptions} from '../OverView/DashBoards/DashboardUserProfiles/MusciScreen';
import PlayListScreen from '../OverView/DashBoards/DashboardUserProfiles/PlayListScreen';
import MusicBoardPlaylistScreen from '../OverView/DashBoards/DashBoardMusic/MusicBoardPlaylistScreen';
import MenuScreen, {screenOptions as MenuScreenOptions} from '../OverView/Menu/MenuScreen';
import CommentScreen, {screenOptions as CommentScreenOptions} from '../OverView/CommentScreen';


import UserChatsScreen, { screenOptions as UserChatsScreenOptions} from '../OverView/DashBoards/Chat/UserChatsScreen';
import CreateNewSingleChatScreen, { screenOptions as CreateNewSingleChatScreenOptions} from '../OverView/DashBoards/Chat/CreateNewSingleChatScreen';
import SingleChatScreen, {screenOptions as SingleChatScreenOptions} from '../OverView/DashBoards/Chat/SingleChatScreen';

import LibraryScreen, {screenOptions as LibraryScreenOptions} from '../OverView/Library/LibraryScreen';
import SearchScreen, {screenOptions as SearchScreenOptions} from '../OverView/Search/SearchScreen';
import SearchToImportScreen from '../OverView/Search/SearchToImportScreen';
import ProfileScreen, {screenOptions as ProfileScreenOptions} from '../OverView/ProfileScreen';
import EditRegularUserScreen, {screenOptions as EditRegularUserScreenOptions} from '../OverView/EditRegularUserScreen';
import CreatArtistScreen, {screenOptions as CreatArtistScreenOptions} from '../OverView/CreateArtistScreen';
import ArtistProfileScreen, {screenOptions as ArtistProfileScreenOptions} from '../OverView/artist/ArtistProfileScreen';
import ArtistFeedScreen, {screenOptions as ArtistFeedScreenOptions} from '../OverView/artist/ArtistFeedScreen';
import ArtistMusicScreen, {screenOptions as ArtistMusicScreenOptions} from '../OverView/artist/ArtistMusicScreen';
import AllArtistSingels from '../OverView/artist/Modals/AllArtistSingels';

//comment




const RootStackNavigator = createStackNavigator();
export const RootStack = () => {
    return(
        <RootStackNavigator.Navigator>
            <RootStackNavigator.Screen name='auth' component={AuthStack} options={{headerShown: false}}/>
            <RootStackNavigator.Screen name='firstUseStack' component={FirstUseStack} options={{headerShown: false}}/>
            <RootStackNavigator.Screen name='OverView' component={OverViewStack} options={{headerShown: false, gestureEnabled:false}}/>            
            <RootStackNavigator.Screen name='Comment' component={CommentScreen} options={{headerShown: false}}/>
        </RootStackNavigator.Navigator>
    )
}

const AuthStackNvigator = createStackNavigator();
export const AuthStack = () => {
    return(
        <AuthStackNvigator.Navigator initialRouteName='Login'>
            <AuthStackNvigator.Group screenOptions={({ navigation }) => ({
                    presentation:'card',
                    headerStyle: { backgroundColor: Colors.grey1,height:120},
                    headerTitleStyle: { fontFamily: 'Baloo2-ExtraBold', fontSize:25,
                    color: Colors.grey2,
                    textShadowColor: Colors.red3,
                    textShadowOffset: {width: 0, height:2},
                    textShadowRadius:10},
                    headerTitleAlign:'center',
                    headerTintColor:'#fff',
                    headerLeft: () => 
                    <TouchableOpacity onPress={navigation.goBack}
                    style={{paddingBottom:5, paddingLeft:15, height:'100%', alignItems:'center', justifyContent:'center'}}
                    >
                        <FontAwesome5
                            name='arrow-left'
                            size={20}
                            color={'#fff'}
                        />
                    </TouchableOpacity>,
                })}
            >
                <AuthStackNvigator.Screen name='Login' component={LoginScreen} options={LoginScreenOptions}/>
                <AuthStackNvigator.Screen name='SignUp' component={SignUpScreen} options={signuUpScreenOptions}/>
                <AuthStackNvigator.Screen name='Verification' component={VerificationScreen} options={verificationScreenOptions}/>
                <AuthStackNvigator.Screen name='ForgetPassword' component={ForgetPasswordScreen} options={ForgetPasswordScreenOptions}/>
                <AuthStackNvigator.Screen name='ResetPassword' component={ResetPasswordScreen} options={ResetPasswordScreenOptions}/>
            </AuthStackNvigator.Group>
        </AuthStackNvigator.Navigator>
    )
}


const FirstUseStackNavigator = createStackNavigator();
export const FirstUseStack = () => {
    return(
        <FirstUseStackNavigator.Navigator >
            <FirstUseStackNavigator.Screen  name="FirstUse" component={FirstUseScreen} options={FirstUseScreenOptions}/>
        </FirstUseStackNavigator.Navigator>
    )
}


const DashBoardTopStackNavigator = createMaterialTopTabNavigator();
export const DashBoardTopBarStack = () => {
    return(
        <DashBoardTopStackNavigator.Navigator>
            <DashBoardTopStackNavigator.Group screenOptions={{
            tabBarLabelStyle: {
                fontFamily: 'Baloo2-Bold',
                fontSize:16,            
            },
            tabBarStyle:{
                backgroundColor:Colors.grey1,
                paddingTop:Platform.OS == 'ios' ? 30 : 10,
                
            },
            
            tabBarIndicatorStyle:{backgroundColor:Colors.red3},
            tabBarActiveTintColor:Colors.red3,
            tabBarInactiveTintColor:Colors.grey3,
            tabBarPressColor:Colors.red3,
            indicatorStyle:{backgroundColor:Colors.red1}
        }}>
                <DashBoardTopStackNavigator.Screen name='Feed' component={DashBoardScreen} options={DashBoardScreenOptions}/>
                <DashBoardTopStackNavigator.Screen name='Music Board' component={MusicBoard} options={MusicBoardScreenOptions}/>
            </DashBoardTopStackNavigator.Group>
        </DashBoardTopStackNavigator.Navigator>
    )
}

// const DashBoardArtistProfileStackNavigator = createStackNavigator();
// export const DashBoardArtistProfileStack = () => {
//     return(
//         <DashBoardArtistProfileStackNavigator.Navigator>
//             <DashBoardArtistProfileStackNavigator.Group screenOptions={{
//             tabBarLabelStyle: {
//                 fontFamily: 'Baloo2-Bold',
//                 fontSize:16,            
//             },
//             tabBarStyle:{
//                 backgroundColor:Colors.grey1,
//                 paddingTop:Platform.OS == 'ios' ? 30 : 10,
                
//             },
            
//             tabBarIndicatorStyle:{backgroundColor:Colors.red3},
//             tabBarActiveTintColor:Colors.red3,
//             tabBarInactiveTintColor:Colors.grey3,
//             tabBarPressColor:Colors.red3,
//             indicatorStyle:{backgroundColor:Colors.red1}
//         }}>
//                 <DashBoardArtistProfileStackNavigator.Screen name='Feed' component={FeedScreen}/>
//                 <DashBoardArtistProfileStackNavigator.Screen name='Music Board' component={MusciScreen}/>
//             </DashBoardArtistProfileStackNavigator.Group>
//         </DashBoardArtistProfileStackNavigator.Navigator>
//     )
// }
// const profiledashBoardStackNavigator = createStackNavigator();
// export const ProfiledashBoardStack = () => {
//     return(
//         <profiledashBoardStackNavigator.Navigator>
//             <profiledashBoardStackNavigator.Screen name='Feed' component={FeedScreen}/>
//             <profiledashBoardStackNavigator.Screen name='Music Board' component={MusciScreen}/> 
//             <profiledashBoardStackNavigator.Screen name="PlaylistScreen" component={PlayListScreen} options={{headerShown: false}}/>                        
//         </profiledashBoardStackNavigator.Navigator>
//     )
// }


const ArtistProfileTopStackNavigator = createMaterialTopTabNavigator();
export const ArtistProfileTopBar = () => {

    return(
        <ArtistProfileTopStackNavigator.Navigator>
            <ArtistProfileTopStackNavigator.Group screenOptions={{
                tabBarLabelStyle: {
                    fontFamily: 'Baloo2-Bold',
                    fontSize:16,            
                },
                tabBarStyle:{
                    backgroundColor:Colors.grey1,
                    paddingTop:Platform.OS == 'ios' ? 30 : 10,
                    
                },
                
                tabBarIndicatorStyle:{backgroundColor:Colors.red3},
                tabBarActiveTintColor:Colors.red3,
                tabBarInactiveTintColor:Colors.grey3,
                tabBarPressColor:Colors.red3,
                indicatorStyle:{backgroundColor:Colors.red1}
            }}>
                <ArtistProfileTopStackNavigator.Screen name="Setting" component={ArtistProfileScreen} options={ArtistProfileScreenOptions}/>
                <ArtistProfileTopStackNavigator.Screen name="Feed" component={ArtistFeedScreen} options={ArtistFeedScreenOptions}/>
                <ArtistProfileTopStackNavigator.Screen name="Music" component={ArtistMusicScreen} options={ArtistMusicScreenOptions}/>
            </ArtistProfileTopStackNavigator.Group>
        </ArtistProfileTopStackNavigator.Navigator>
    )
}


const DashBoardContainerStackNavigator = createStackNavigator();
export const DashBoardContainerStack = () => {
    return(
        <DashBoardContainerStackNavigator.Navigator initialRouteName='Feed'>
            <DashBoardContainerStackNavigator.Screen name='Feed' component={DashBoardScreen} options={DashBoardScreenOptions}/>
            <DashBoardContainerStackNavigator.Screen name='Music Board' component={MusicBoard} options={MusicBoardScreenOptions}/>
            <DashBoardContainerStackNavigator.Screen name='ArtistFeed' component={FeedScreen} options={FeedScreenOptions}/>
            <DashBoardContainerStackNavigator.Screen name='ArtistMusicBoard' component={MusciScreen} options={MusciScreenOptions}/>
            <DashBoardContainerStackNavigator.Screen name="ArtistPlaylistScreen" component={PlayListScreen} options={{headerShown: false}}/>
            <DashBoardContainerStackNavigator.Screen name="PlaylistScreen" component={MusicBoardPlaylistScreen} options={{headerShown: false}}/>
            <DashBoardContainerStackNavigator.Screen name="CommentScreen" component={CommentScreen} options={CommentScreenOptions}/>
            <DashBoardContainerStackNavigator.Screen name="UserChatScreen" component={UserChatsScreen} options={UserChatsScreenOptions}/>
            <DashBoardContainerStackNavigator.Screen name="CreateNewSingleChatScreen" component={CreateNewSingleChatScreen} options={CreateNewSingleChatScreenOptions}/>
            <DashBoardContainerStackNavigator.Screen name="SingleChatScreen" component={SingleChatScreen} options={SingleChatScreenOptions}/>
        </DashBoardContainerStackNavigator.Navigator>
    )
}

const profileStackNavigator = createStackNavigator();
export const ProfileStack = () => {
    return(
        <profileStackNavigator.Navigator>
            <profileStackNavigator.Screen name="ProfileFirstPage" component={ProfileScreen} options={ProfileScreenOptions}/>
            <profileStackNavigator.Screen name="EditRegularUserPage" component={EditRegularUserScreen} options={EditRegularUserScreenOptions}/>
            <profileStackNavigator.Screen name="CreateArtistPage" component={CreatArtistScreen} options={CreatArtistScreenOptions}/>
            <profileStackNavigator.Screen name="ArtistProfilePage" component={ArtistProfileTopBar} options={{headerShown: false}}/>
            <profileStackNavigator.Screen name="AllSingels" component={MusicBoardPlaylistScreen} options={{headerShown: false}}/>
            <profileStackNavigator.Screen name="ProfileStack" component={ProfiledashBoardStack} options={{headerShown: false}}/>
            <profileStackNavigator.Screen name="SearchScreen" component={SearchToImportScreen} options={{headerShown: false}}/>
        </profileStackNavigator.Navigator>
    )
}


const LibraryStackNavigator = createStackNavigator();
export const LibraryStack = () => {
    return(
        <LibraryStackNavigator.Navigator>
            <LibraryStackNavigator.Screen name="LibraryScreen" component={LibraryScreen} options={{headerShown: false}}/>
            <LibraryStackNavigator.Screen name="PlaylistScreen" component={MusicBoardPlaylistScreen} options={{headerShown: false}}/>
        </LibraryStackNavigator.Navigator>
    )
}


const SearchStackNavigator = createStackNavigator();
export const SearchStack = () => {
    return(
        <SearchStackNavigator.Navigator>
            <SearchStackNavigator.Screen name="SearchScreen" component={SearchScreen} options={{headerShown: false}}/>
            <SearchStackNavigator.Screen name="ProfileStack" component={ProfiledashBoardStack} options={{headerShown: false}}/>
            <SearchStackNavigator.Screen name="PlaylistScreen" component={PlayListScreen} options={{headerShown: false}}/> 
        </SearchStackNavigator.Navigator>
    )
}

const MenuStackNavigator = createStackNavigator();
const MenuStack = () => {
    return(
        <MenuStackNavigator.Navigator>
            <MenuStackNavigator.Screen name="MenuScreen" component={MenuScreen} options={{headerShown: false}}/>
            <MenuStackNavigator.Screen name="EditRegularUserPage" component={EditRegularUserScreen} options={EditRegularUserScreenOptions}/>
            <MenuStackNavigator.Screen name="CreateArtistPage" component={CreatArtistScreen} options={CreatArtistScreenOptions}/>
            <MenuStackNavigator.Screen name="ArtistProfilePage" component={ArtistProfileTopBar} options={{headerShown: false}}/>
            <MenuStackNavigator.Screen name="PlaylistScreen" component={MusicBoardPlaylistScreen} options={{headerShown: false}}/>
        </MenuStackNavigator.Navigator>
    )
}


const OverViewBottomStackNavigator = createMaterialBottomTabNavigator();

export const OverViewStack = () => {
    const appSelector = useSelector(state => state.AppReducer);
    const { main } = appSelector;
    
    return(
        <OverViewBottomStackNavigator.Navigator initialRouteName='Home' barStyle={{backgroundColor:Colors.grey4}}>
            <OverViewBottomStackNavigator.Screen
                name='Menu'
                component={MenuStack}
                options={MenuScreenOptions}
            />
            <OverViewBottomStackNavigator.Screen
                options = {{
                    tabBarIcon:({focused,color,size}) => {
                        const iconColor = focused? Colors.red3 : '#ffffff'
                        const iconSzie = focused? 24 : 22
                        return(
                        <Entypo 
                            name={'home'}
                            color={iconColor}
                            size={iconSzie}
                        />
                        )
            
                    },                                     
                }} 
                name='Home'
                component={DashBoardContainerStack}
            />

            <OverViewBottomStackNavigator.Screen
                options = {LibraryScreenOptions} 
                name='Library'
                component={LibraryStack}
            />

            <OverViewBottomStackNavigator.Screen
                options = {SearchScreenOptions} 
                name='Search'
                component={SearchStack}
            />

            <OverViewBottomStackNavigator.Screen
                options = {ProfileScreenOptions} 
                name='Profile'
                component={ProfileStack}
            />  
                                   
    </OverViewBottomStackNavigator.Navigator>
    )
}

