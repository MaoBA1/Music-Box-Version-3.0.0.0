import { GET_ALL_POST, GET_POST_COMMENTS, GET_ALL_ARTIST_POST_BY_ID } from '../actions/postActions';

const initialState = {
    PostReducer:null,
    postCommentReducer:null,
    ArtistPostsReducer:null
};


export default (state = initialState, action) => {       
    switch (action.type){
        case GET_ALL_POST:
            return {
                ...state,       
                PostReducer: action.data.Posts
            }
        case GET_POST_COMMENTS:
            return{
                ...state,  
                postCommentReducer: action.data.postComments
            }
        case GET_ALL_ARTIST_POST_BY_ID:
            return{
                ...state,  
                ArtistPostsReducer: action.data.Posts
            }
        default:
            return state;
    }
}