let initState = {
    name: '',
    email: '',
    role: 2,
    accessLevel : [],
    profile_img : '',
    token : '',
    user_id : '',
    short_nm : '',
    access_level : []
}

export const authReducer = (state = initState, action) =>{
    switch (action.type) {
        case 'LOGIN_SUCCESS':
            return {...state,...action.payload};
        case 'UPDATE_USER_PROFILE':
            let state1 = {...state};
            state1 = {
                ...state1,
                name : action.payload.name,
                profile_img : action.payload.profile_img,
            }
            return state1;
        case 'LOGOUT' : 
            return state; 
            
        default:
            return state;
    }
}