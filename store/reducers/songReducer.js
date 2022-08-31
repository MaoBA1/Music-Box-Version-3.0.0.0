import {
     UPLOAD_NEW_SONG,
     GET_ALL_ARTIST_SONGS,
     GET_ARTIST_TOP5_SONGS,
     GET_ARTIST_LATEST_REALEASES
 } from '../actions/songActions';

const initialState = {
    ArtistSongsReducer: null,
    ArtistTop5SongsReducer: null,
    ArtistLatestReleasesReducer: null
};



export default (state = initialState, action) => {       
    switch (action.type){
        case GET_ALL_ARTIST_SONGS:
            return {
                ...state,       
                ArtistSongsReducer: action.data.ArtistSongs
            } 
        case GET_ARTIST_TOP5_SONGS:
            return {
                ...state,       
                ArtistTop5SongsReducer: action.data.Songs
            } 
        case GET_ARTIST_LATEST_REALEASES:
            return {
                ...state,       
                ArtistLatestReleasesReducer: action.data.Songs
            }        
        default:
            return state;
    }
}