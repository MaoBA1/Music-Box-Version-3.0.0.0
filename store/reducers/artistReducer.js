import { GET_ALL_ARTISTS, GET_ARTIST_DATA, GET_ARTIST_PLAYLISTS } from '../actions/artistActions';

const initialState = {
    ArtistsReducer: null,
    ArtistDataReducer: null,
    ArtistPlaylistsReducer: null
}


export default (state = initialState, action) => {       
    switch (action.type){
        case GET_ALL_ARTISTS:
            return {
                ...state,       
                ArtistsReducer: action.data
            }
        case GET_ARTIST_DATA:
            return {
                ...state,       
                ArtistDataReducer: action.data.Artist
            }
        case GET_ARTIST_PLAYLISTS:
            return {
                ...state,       
                ArtistPlaylistsReducer: action.data.playlists
            }
        default:
            return state;
    }
}