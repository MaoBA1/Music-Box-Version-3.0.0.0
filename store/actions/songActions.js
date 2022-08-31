export const UPLOAD_NEW_SONG = 'UPLOAD_NEW_SONG';
export const GET_ALL_ARTIST_SONGS = "GET_ALL_ARTIST_SONGS";
export const GET_ARTIST_TOP5_SONGS = "GET_ARTIST_TOP5_SONGS";
export const GET_ARTIST_LATEST_REALEASES = "GET_ARTIST_LATEST_REALEASES";
export const CREATE_NEW_PLAYLIST = "CREATE_NEW_PLAYLIST";


import baseIpRequest from '../../src/ServerDev';



export const uploadNewSongDispatch = data => {
    return dispatch => {
        dispatch({type: UPLOAD_NEW_SONG, data});
    }

} 


export const uploadNewSongAction = (token, details) =>{   
    return async dispatch => {        
        const response = await fetch(baseIpRequest.ServerAddress + '/song/creatNewSong', {
            method:'POST',
            headers:{
                'Content-type': 'application/json',
                'Authorization': 'Bearer ' + token
            },
            body: JSON.stringify(details)            
        })
        const data = await response.json(); 
        if(data){
            console.log(data);
            dispatch(uploadNewSongDispatch(data));
            return data;
        } else {
            throw new Error('Something went wrong');
        }
    }
}


export const getAllArtistSongsDispatch = data => {
    return dispatch => {
        dispatch({type: GET_ALL_ARTIST_SONGS, data});
    }

} 


export const getAllArtistSongsAction = (token, artistId) =>{   
    return async dispatch => {        
        const response = await fetch(baseIpRequest.ServerAddress + '/song/getAllArtistSong/' + artistId, {
            method:'GET',
            headers:{
                'Content-type': 'application/json',
                'Authorization': 'Bearer ' + token
            }
        })
        const data = await response.json(); 
        if(data){
            dispatch(getAllArtistSongsDispatch(data));
            return data;
        } else {
            throw new Error('Something went wrong');
        }
    }
}

export const getArtistTop5SongsDispatch = data => {
    return dispatch => {
        dispatch({type: GET_ARTIST_TOP5_SONGS, data});
    }

} 


export const getArtistTop5SongsAction = (token, artistId) =>{   
    return async dispatch => {        
        const response = await fetch(baseIpRequest.ServerAddress + '/song/getArtistTop5Songs/' + artistId, {
            method:'GET',
            headers:{
                'Content-type': 'application/json',
                'Authorization': 'Bearer ' + token
            }
        })
        const data = await response.json(); 
        if(data){
            dispatch(getArtistTop5SongsDispatch(data));
            return data;
        } else {
            throw new Error('Something went wrong');
        }
    }
}


export const getArtistLatestRealeasesDispatch = data => {
    return dispatch => {
        dispatch({type: GET_ARTIST_LATEST_REALEASES, data});
    }

} 


export const getArtistLatestRealeasesAction = (token, artistId) =>{   
    return async dispatch => {        
        const response = await fetch(baseIpRequest.ServerAddress + '/song/getArtistLatestReleases/' + artistId, {
            method:'GET',
            headers:{
                'Content-type': 'application/json',
                'Authorization': 'Bearer ' + token
            }
        })
        const data = await response.json(); 
        if(data){
            dispatch(getArtistLatestRealeasesDispatch(data));
            return data;
        } else {
            throw new Error('Something went wrong');
        }
    }
}



export const createNewPlaylistDispatch = data => {
    return dispatch => {
        dispatch({type: CREATE_NEW_PLAYLIST, data});
    }

} 


export const createNewPlaylistAction = (token, details) =>{  
    return async dispatch => {        
        const response = await fetch(baseIpRequest.ServerAddress + '/song/createNewPlaylist', {
            method:'PUT',
            headers:{
                'Content-type': 'application/json',
                'Authorization': 'Bearer ' + token
            },
            body: JSON.stringify({playlist: details})
        })
        const data = await response.json(); 
        if(data){
            dispatch(createNewPlaylistDispatch(data));
            return data;
        } else {
            throw new Error('Something went wrong');
        }
    }
}