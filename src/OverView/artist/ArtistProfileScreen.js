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
import Style from './style/ArtistProfileStyle';
import Colors from '../../Utitilities/AppColors';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { getArtistData } from '../../ApiCalls';
import AsyncStorage from '@react-native-async-storage/async-storage';


import GeneralHeader from '../../components/GeneralHedher';
import ChangeImageModal from './Modals/ChangeImageModal';
import ChangeDescriptionModal from './Modals/ChangeDescriptionModal';
import EdditGenersModal from './Modals/EdditGenrersModal';
import EdditSkillsModal from './Modals/EdditSkillsModal';



const ArtistProfileScreen = props => {
    const dispatch = useDispatch();
    const artistSelector = useSelector(state => state.ArtistsReducer);
    const artistName = artistSelector?.ArtistDataReducer?.artistName;
    const profileImage = artistSelector?.ArtistDataReducer?.profileImage;
    const profileSeconderyImage = artistSelector?.ArtistDataReducer?.profileSeconderyImage;
    const formatted_artistName = artistName && artistName[0]?.toUpperCase() + artistName?.substring(1,artistName?.length);
    const artistSkills = artistSelector?.ArtistDataReducer?.skills;
    const artistMainGener = artistSelector?.ArtistDataReducer?.mainGener.generName;
    const artistAditionalGeners = artistSelector?.ArtistDataReducer?.additionalGener;
    const artistDescription = artistSelector?.ArtistDataReducer?.description;
    const [changeImageVisible, setChangeImageVisible] = useState(false);
    const [changeDescriptionVisible, setChangeDescriptionVisible] = useState(false);
    const [changeImageDetails, setChangeImageDetails] = useState(null);
    const [editGenersVisible, setEditGenersVisible] = useState(false);
    const [edditGenersModalDetails, setEditGenersMoadlDetails] = useState(null);
    const [edditSkillsModalVisible, setEditSkillsMoadlVisible] = useState(false);
    const [edditSkillsModalDetails, setEditSkillsMoadlDetails] = useState(false);
    
    useEffect(async () => {
        const jsonToken = await AsyncStorage.getItem('Token');
        const userToken = jsonToken != null ? JSON.parse(jsonToken) : null;     
        if(userToken) {
            getArtistData(dispatch, userToken);
        }
    },[])
    

    const renderListOfSkills = () => {
        let listOfSkills = [];
        let key = 1;
        artistSkills?.forEach(skill => {
            listOfSkills.push((<Text style={{fontFamily:'Baloo2-Medium', color: Colors.grey6}} key={key++}>{skill}{key != artistSkills.length ? ', ' : ' '}</Text>))
        })
        return listOfSkills;
    }

    const renderListOfGeners = () => {
        if(artistAditionalGeners?.length == 0){
            return (<Text style={{fontFamily:'Baloo2-Medium', color: Colors.grey6}}>No Additional only {artistMainGener}</Text>)
        }
        let listOfGeners = [];
        let key = 1;
        artistAditionalGeners?.forEach(gener => {
            listOfGeners.push((<Text style={{fontFamily:'Baloo2-Medium', color: Colors.grey6}} key={key++}>{gener.generName}{key != artistAditionalGeners.length ? ', ' : ' '}</Text>))
        })
        return listOfGeners;
    }

    const openChangeImageModal = (type) => {
        if(type == 'main') {
            setChangeImageDetails({image:profileImage, func:setChangeImageVisible, title:'Change Profile Image', type:'main'});
        } else {
            setChangeImageDetails({image:profileSeconderyImage, func:setChangeImageVisible, title:'Change Subject Image', type:'second'});
        }
        setChangeImageVisible(true);
    }

    const openEdditGenrsModal = type => {
        if(type == 'main') {
            setEditGenersMoadlDetails({type:type, gener: artistSelector?.ArtistDataReducer?.mainGener});
        } else {
            setEditGenersMoadlDetails({type:type, geners: artistAditionalGeners})
        }
        setEditGenersVisible(true);
    }

   

    return(
        <View style={Style.backgroundContainer}>
        <GeneralHeader title={formatted_artistName} size={'short'} goBack={() => props.navigation.goBack(null)}/>
        {changeImageVisible && <ChangeImageModal details={changeImageDetails}/>}
        {changeDescriptionVisible && <ChangeDescriptionModal  desc={artistDescription} func={setChangeDescriptionVisible}/>}
        {editGenersVisible && <EdditGenersModal details={edditGenersModalDetails} func={setEditGenersVisible}/>}
        {edditSkillsModalVisible && <EdditSkillsModal func={setEditSkillsMoadlVisible}/>}
        <View>
            <View style={Style.subImageView}>
                <TouchableOpacity onPress={() => openChangeImageModal('second')} style={{right:10, bottom:160, position: 'absolute', zIndex:1, alignItems: 'center', justifyContent: 'center', width:30, height:30, backgroundColor: Colors.grey3, borderRadius:50}}>
                    <MaterialIcons
                        name={'edit'}
                        size={20}
                        color={'#fff'}
                    />
                </TouchableOpacity>
                <Image
                    style={Style.subImage}
                    source={{uri:profileSeconderyImage}}
                />
            </View>
            <View style={[Style.profileImageView, {zIndex:1}]}>
                <Image
                    style={Style.profileImage}
                    source={{uri:profileImage}}
                />
                <TouchableOpacity onPress={() => openChangeImageModal('main')} style={{right:0, bottom:5, position: 'absolute', zIndex:1, alignItems: 'center', justifyContent: 'center', width:20, height:20, backgroundColor: Colors.grey3, borderRadius:50}}>
                    <MaterialIcons
                        name={'edit'}
                        size={15}
                        color={'#fff'}
                    />
                </TouchableOpacity>
            </View>
            <View style={{width:'100%', borderBottomWidth:0.5, backgroundColor:Colors.grey1, bottom:105}}>
                <View style={{marginTop:70, paddingHorizontal:20}}>
                    <View style={{flexDirection:'row', justifyContent: 'space-between', width:'100%'}}>
                        <Text style={{fontFamily:'Baloo2-Bold', fontSize:16, color:'#fff'}}>About</Text>
                        <TouchableOpacity onPress={() => setChangeDescriptionVisible(true)} style={{alignItems: 'center', justifyContent: 'center', width:25, height:25, backgroundColor: Colors.grey3, borderRadius:50}}>
                            <MaterialIcons
                                name={'edit'}
                                size={18}
                                color={'#fff'}
                            />
                        </TouchableOpacity>
                    </View>
                    <View style={{flexDirection:'row', marginBottom: 20}}>
                        <Text style={{fontFamily:'Baloo2-Medium', color: Colors.grey6}}>{artistDescription}</Text>
                    </View>
                </View>
            </View>
            <View style={{width:'100%', borderBottomWidth:0.5, backgroundColor:Colors.grey1, bottom:105}}>
                <View style={{paddingVertical:20, paddingHorizontal:20}}>
                    <View style={{flexDirection:'row', justifyContent: 'space-between', width:'100%'}}>
                        <Text style={{fontFamily:'Baloo2-Bold', fontSize:16, color:'#fff'}}>Main Gener</Text>
                        <TouchableOpacity onPress={() => openEdditGenrsModal('main')} style={{alignItems: 'center', justifyContent: 'center', width:25, height:25, backgroundColor: Colors.grey3, borderRadius:50}}>
                            <MaterialIcons
                                name={'edit'}
                                size={18}
                                color={'#fff'}
                            />
                        </TouchableOpacity>
                    </View>
                    <View style={{flexDirection:'row'}}>
                        <Text style={{fontFamily:'Baloo2-Medium', color: Colors.grey6}}>{artistMainGener}</Text>
                    </View>
                </View>
            </View>
            <View style={{width:'100%', borderBottomWidth:0.5, backgroundColor:Colors.grey1, bottom:105}}>
                <View style={{paddingVertical:20, paddingHorizontal:20}}>
                    <View style={{flexDirection:'row', justifyContent: 'space-between', width:'100%'}}>
                        <Text style={{fontFamily:'Baloo2-Bold', fontSize:16, color:'#fff'}}>Additional Geners</Text>
                        <TouchableOpacity onPress={() => openEdditGenrsModal('additional')} style={{alignItems: 'center', justifyContent: 'center', width:25, height:25, backgroundColor: Colors.grey3, borderRadius:50}}>
                            <MaterialIcons
                                name={'edit'}
                                size={18}
                                color={'#fff'}
                            />
                        </TouchableOpacity>
                    </View>
                    <View style={{flexDirection:'row'}}>
                         {renderListOfGeners()}
                    </View>
                </View>
            </View>
            <View style={{width:'100%', borderBottomWidth:0.5, backgroundColor:Colors.grey1, bottom:105}}>
                <View style={{paddingVertical:20, paddingHorizontal:20}}>
                    <View style={{flexDirection:'row', justifyContent: 'space-between', width:'100%'}}>
                        <Text style={{fontFamily:'Baloo2-Bold', fontSize:16, color:'#fff'}}>Skills</Text>
                        <TouchableOpacity onPress={() => setEditSkillsMoadlVisible(true)} style={{alignItems: 'center', justifyContent: 'center', width:25, height:25, backgroundColor: Colors.grey3, borderRadius:50}}>
                            <MaterialIcons
                                name={'edit'}
                                size={18}
                                color={'#fff'}
                            />
                        </TouchableOpacity>
                    </View>
                    <View style={{flexDirection:'row'}}>
                         {renderListOfSkills()}
                    </View>
                </View>
            </View>
            
        </View>


        </View>
    )
}


export const screenOptions = navData => {
    return {        
        gestureEnabled: false,
        headerShown: false,
    }
}


export default ArtistProfileScreen;