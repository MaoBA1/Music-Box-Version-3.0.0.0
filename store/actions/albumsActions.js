export const GET_ALL_ARTIST_ALBUMS = "GET_ALL_ARTIST_ALBUMS";
export const CREATE_NEW_ALBUM = "CREATE_NEW_ALBUM";

import baseIpRequest from '../../src/ServerDev';


export const getAllArtistAlbumsDispatch = (data) => {
    return dispatch => {
        dispatch({type: GET_ALL_ARTIST_ALBUMS, data});
    }
}


export const getAllArtistAlbumsAction = (token, artistId) => {
    return async dispatch => {       
        const response = await fetch(baseIpRequest.ServerAddress + '/album/getAllArtistAlbums/' + artistId, {
            method:'GET',
            headers:{
                'Content-type': 'application/json',
                'Authorization': 'Bearer ' + token
            },
            
        })
        const data = await response.json();
        if(data) {
            dispatch(getAllArtistAlbumsDispatch(data));
            return data;
        } else {
            throw new Error('Something went wrong');
        }
    }
}


export const createNewAlbumsDispatch = (data) => {
    return dispatch => {
        dispatch({type: CREATE_NEW_ALBUM, data});
    }
}


export const createNewAlbumsAction = (token, artistId, album) => {
    return async dispatch => {       
        const response = await fetch(baseIpRequest.ServerAddress + '/album/createNewAlbum/' + artistId, {
            method:'POST',
            headers:{
                'Content-type': 'application/json',
                'Authorization': 'Bearer ' + token
            },
            body: JSON.stringify({album: album})
        })
        const data = await response.json();
        console.log('====================================');
        console.log(data);
        console.log('====================================');
        if(data) {
            dispatch(createNewAlbumsDispatch(data));
            return data;
        } else {
            throw new Error('Something went wrong');
        }
    }
}




