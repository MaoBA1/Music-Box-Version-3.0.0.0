import {GET_ALL_ARTIST_ALBUMS} from '../actions/albumsActions';


const initialState = {
    ArtistAlbumReducer: null
}


export default (state = initialState, action) => {
    switch (action.type){
        case GET_ALL_ARTIST_ALBUMS:
            return {
                ...state,
                ArtistAlbumReducer: action.data
            }
        default:
            return state;
    }
}
