export const GET_USER_DATA = 'GET_USER_DATA';
export const LOGIN = "LOGIN";
export const UPDATE_PROFILE = "UPDATE_PROFILE";
export const CREATE_NEW_PLAYLIST = "CREATE_NEW_PLAYLIST";
export const GET_ALL_USER_PLAYLIST = "GET_ALL_USER_PLAYLIST";
export const ADD_SONG_TO_USER_PLAYLIST = "ADD_SONG_TO_USER_PLAYLIST";

import baseIpRequest from '../../src/ServerDev';


export const getUserDataDispatch = data => {
    return dispatch => {
        dispatch({type: GET_USER_DATA, data});
    }

} 


export const getUserDataAction = token =>{     
    return async dispatch => {        
        const response = await fetch(baseIpRequest.ServerAddress + '/accounts/getUserData', {
            method:'GET',
            headers:{
                'Content-type': 'application/json',
                'Authorization': 'Bearer ' + token
                
            }            
        })
        const data = await response.json(); 
        if(data){
            dispatch(getUserDataDispatch(data));
            return true;
        } else {
            throw new Error('Something went wrong');
        }
    }
}


export const loginDispatch = data => {
    return dispatch => {
        dispatch({type: LOGIN, data});
    }

} 


export const loginAction = details =>{     
    return async dispatch => {        
        const response = await fetch(baseIpRequest.ServerAddress + '/accounts/login', {
            method:'POST',
            headers:{
                'Content-type': 'application/json',
                
            },
            body: JSON.stringify(details)
        })
        const data = await response.json(); 
        if(data.status){
            dispatch(loginDispatch(data));
            return {
                token: data.token,
                isItFirstUse: data.isItFirstUse
            }
        } else {
            throw new Error(data.message);
        }
    }
}


export const updateDispatch = data => {
    return dispatch => {
        dispatch({type: UPDATE_PROFILE, data});
    }

} 


export const updateProfileAction = (token, details) =>{     
    return async dispatch => {        
        const response = await fetch(baseIpRequest.ServerAddress + '/accounts/updateRegularAccount', {
            method:'PUT',
            headers:{
                'Content-type': 'application/json',
                'Authorization': 'Bearer ' + token                    
            },
            body: JSON.stringify(details)
        })
        const data = await response.json(); 
        if(data){
            dispatch(updateDispatch(data));
            if(data.status) {
                return data;
            }
        } else {
            throw new Error(data.message);
        }
    }
}

export const createNewPlaylistDispatch = (data) => {
    return dispatch => {
        dispatch({type: CREATE_NEW_PLAYLIST, data})
    }
}

export const createNewPlaylistAction = (token, playlist) => {
    return async dispatch => {
        const response = await fetch(baseIpRequest.ServerAddress + '/accounts/createNewPlaylist', {
            method:'PUT',
            headers:{
                'Content-type': 'application/json',
                'Authorization': 'Bearer ' + token                    
            },
            body: JSON.stringify({playlist: playlist})
        })
        const data = await response.json(); 
        
        if(data){
            dispatch(createNewPlaylistDispatch(data));
            if(data.status) {
                return data;
            }
        } else {
            throw new Error(data.message);
        }
    }
}

export const getAllUserPlaylistsDispatch = (data) => {
    return dispatch => {
        dispatch({type:GET_ALL_USER_PLAYLIST, data})
    }
}

export const getAllUserPlaylistsAction = (token) => {
    return async dispatch => {        
        const response = await fetch(baseIpRequest.ServerAddress + '/accounts/getAllUserPlaylists', {
            method:'GET',
            headers:{
                'Content-type': 'application/json',
                'Authorization': 'Bearer ' + token
                
            }            
        })
        const data = await response.json();
        if(data){
            dispatch(getAllUserPlaylistsDispatch(data));
            return true;
        } else {
            throw new Error('Something went wrong');
        }
    }
}


export const addSongTouserPlaylistDispatch = (data) => {
    return dispatch => {
        dispatch({type: ADD_SONG_TO_USER_PLAYLIST, data})
    }
}

export const addSongTouserPlaylistAction = (token, song, playlistId) => {
    return async dispatch => {
        const response = await fetch(baseIpRequest.ServerAddress + '/accounts/addSongToUserPlaylist/' + playlistId, {
            method:'PUT',
            headers:{
                'Content-type': 'application/json',
                'Authorization': 'Bearer ' + token                    
            },
            body: JSON.stringify({song: song})
        })
        const data = await response.json(); 
        
        if(data){
            dispatch(createNewPlaylistDispatch(data));
            if(data.status) {
                return data;
            }
        } else {
            throw new Error(data.message);
        }
    }
}