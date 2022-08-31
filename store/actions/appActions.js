export const SET_MUSIC_ON_BACKGROUND = "SET_MUSIC_ON_BACKGROUND";
export const SET_SONG_ON_BACKGROUND = "SET_SONG_ON_BACKGROUND";
export const SET_SONG_INDEX = "SET_SONG_INDEX";
export const PLAY_FOR_FIRST_TIME = "PLAY_FOR_TIME";
export const PAUSE_SONG = "PAUSE_SONG";
export const RESUME_SONG = "RESUME_SONG";
export const PLAY_NEXT_SONG = "PLAY_NEXT_SONG";


export const setMusicOnBackGroundDispatch = boolValue => {
    return dispatch => {
        dispatch({type: SET_MUSIC_ON_BACKGROUND, boolValue});
    }

} 


export const setMusicOnBackGroundAction = (boolValue) =>{   
    return async dispatch => {        
        dispatch(setMusicOnBackGroundDispatch(boolValue));
    }
}

export const setSongOnBackGroundDispatch = list => {
    return dispatch => {
        dispatch({type: SET_SONG_ON_BACKGROUND, list});
    }

} 


export const setSongOnBackGroundAction = (list) =>{   
    return async dispatch => {        
        dispatch(setSongOnBackGroundDispatch(list));
    }
}


export const setSongIndexDispatch = index => {
    return dispatch => {
        dispatch({type: SET_SONG_INDEX, index});
    }

} 


export const setSongIndexAction = (index) =>{   
    return async dispatch => {        
        dispatch(setSongIndexDispatch(index));
    }
}







export const playInTheFirstTimeDispatch = ({
    playbackObj,
    status,
    currentAudio,
    isPlaying,
    index,
    list,
    musicOnBackGround
}) => {
    return dispatch =>  {
        dispatch({
            type:PLAY_FOR_FIRST_TIME, 
            playbackObj,
            status,
            currentAudio,
            isPlaying,
            index,
            list,
            musicOnBackGround
        })
    }
}

export const playInTheFirstTimeAction = (params) => {
    return dispatch => {
        dispatch(playInTheFirstTimeDispatch(params));
    }
}

export const pauseSongDispatch = ({status, isPlaying}) => {
    return dispatch => {
        dispatch({
            type: PAUSE_SONG,
            status,
            isPlaying
        });
    }
}

export const pauseSongAction = (params) => {
    return dispatch => {
        dispatch(pauseSongDispatch(params));
    }
}

export const resumeSongDispatch = ({status, isPlaying}) => {
    return dispatch => {
        dispatch({
            type: RESUME_SONG,
            status,
            isPlaying
        });
    }
}

export const resumeSongAction = (params) => {
    return dispatch => {
        dispatch(resumeSongDispatch(params));
    }
}

export const playNextSongDispatch = ({
    status,
    currentAudio,
    isPlaying,
    index,
}) => {
    return dispatch => {
        dispatch({
            type: PLAY_NEXT_SONG,
            status,
            currentAudio,
            isPlaying,
            index,
        })
    }
}


export const playNextSongAction = (params) => {
    return dispatch => {
        dispatch(playNextSongDispatch(params));
    }
}