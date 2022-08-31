import { 
    getAllArtistsAction,
    createArtistAction,
    getArtistDataAction,
    getArtistPlaylistAction
} from '../store/actions/artistActions';
import { getUserDataAction, updateProfileAction } from '../store/actions/userActions';
import { getGenersAction } from '../store/actions/genersActions';
import { 
    getAllPostsAction,
    likeAction,
    unLikeAction,
    getPostCommentsAction,
    sendCommentsAction, getAllArtistPostsByIdAction 
} from '../store/actions/postActions';
import {
     getAllArtistSongsAction,
     getArtistTop5SongsAction,
     getArtistLatestRealeasesAction
 } from '../store/actions/songActions';





export const getAllAppGeners = async(dispatch) => {
    let action = getGenersAction();   
    try{
        await dispatch(action);
    } catch(error) {
        console.log(error);
    }
};


export const getPosts = async(dispatch, token) => {
    let action = getAllPostsAction(token);
    try{
        await dispatch(action);
    } catch(error) {
        console.log(error);
    }
};


export const getArtists = async(dispatch, token) => {
    let action = getAllArtistsAction(token)
    try{
        await dispatch(action);
    } catch(error) {
        console.log(error);
    }
}; 

export const createArtist = async(dispatch, token, details) => {
    
    let action = createArtistAction(token, details);
    try{
        await dispatch(action)
        .then(data => {
            console.log(data);
            return data;
        })
        .catch(error => {
            return error;
        })
    } catch(error) {
        return error;
    }
}



export const getUserData = async(dispatch, token) => {
    let action = getUserDataAction(token)
    try{
        await dispatch(action)
    } catch(error) {
        console.log(error);
    }
};

export const getArtistData = async(dispatch, token) => {
    let action = getArtistDataAction(token)
    try{
        await dispatch(action)
    } catch(error) {
        console.log(error);
    }
};



export const giveLikeToPost = async(dispatch, token, postId) => {
    let action = likeAction(token, postId);
    try {
        await dispatch(action)
        .then(result => {return result});
    } catch(error) {
        console.log(error);
    }
}

export const unLikeToPost = async(dispatch, token, postId) => {
    let action = unLikeAction(token, postId);
    try {
        await dispatch(action)
        .then(result => {return result});
    } catch(error) {
        console.log(error);
    }
}



export const getPostComment = async(dispatch, token, postId) => {
    let action = getPostCommentsAction(token, postId);
    try{
        await dispatch(action); 
        
    } catch (error) {
        console.log(error.message);
        
    }
};


export const giveCommentToPost = async(dispatch, token, postId, commentText) => {
    let action = sendCommentsAction(token, postId, commentText);
    try {
        await dispatch(action)
        .then(result => {
            if(result) {
                getPosts(dispatch, token);
                getPostComment(dispatch, token, postId);
            }
        });
    } catch(error) {
        console.log(error.message);
    }
}

export const updateRegularProfile = async(dispatch, token, details) => {
    let action = updateProfileAction(token, details);
    try {
        await dispatch(action)
        .then(result => {
            if (result) {
                getUserData(dispatch, token);
                return result;
            }
        })
    } catch(error) {
        console.log(error.message);
    }
}

export const getArtistPostsById = async(dispatch, token, artistId) => {
    let action = getAllArtistPostsByIdAction(token, artistId);
    try {
        await dispatch(action);
    } catch(error) {
        console.log(error.message);
    }
}

export const getAllArtistSongs = async(dispatch, token, artistId) => {
    let action = getAllArtistSongsAction(token, artistId);
    try{
        await dispatch(action)
        .then(result => {
            
        })
    } catch(error) {
        console.log(error.message);
    }
}


export const getArtistTop5 = async(dispatch, token, artistId) => {
    let action = getArtistTop5SongsAction(token, artistId);
    try{
        await dispatch(action)
        .then(result => {
            return result;
        })
    }
    catch(error) {
        console.log(error.message);
    }
}

export const getArtistLatestRealeases = async(dispatch, token, artistId) => {
    let action = getArtistLatestRealeasesAction(token, artistId);
    try{
        await dispatch(action)
        .then(result => {
            return result;
        })
    }catch(error) {
        console.log(error.message);
    }
}

export const getArtistPlayLists = async(dispatch, token) => {
    let action = getArtistPlaylistAction(token);
    try {
        await dispatch(action)        
    } catch(error) {
        console.log(error.message);
    }
}





