import { GET_USER_DATA, GET_ALL_USER_PLAYLIST } from '../actions/userActions';

const initialState = {
    UserReducer: null,
    UserPlaylists: null
};


export default (state = initialState, action) => {       
    switch (action.type){
        case GET_USER_DATA:
            return {
                ...state,       
                UserReducer: action.data
            }
        case GET_ALL_USER_PLAYLIST:
            return {
                ...state, 
                UserPlaylists: action.data
            }
        default:
            return state;
    }
}