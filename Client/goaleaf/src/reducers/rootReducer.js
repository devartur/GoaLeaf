const initState = {
    authenticated: false,
    userLogged: null,
    users: [],
    habits: [],
    members: [],
    isLoading: true
}

const rootReducer = (state = initState, action) => {
    function parseJwt(token) {
        if (!token) { return; }
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace('-', '+').replace('_', '/');
        return JSON.parse(window.atob(base64));
    }
    const tokenData = parseJwt(action.token);


    console.log(action)
    if(action.type === 'VALIDATE_USER'){
        return {
            ...state,
            authenticated: true,
            userLogged: parseInt(tokenData.sub)
        }
    }
    if(action.type === 'INVALIDATE_USER'){
        localStorage.removeItem('token');
        return {
            ...state,
            authenticated: false,
            userLogged: null
        }
    }

    if(action.type === 'GET_HABITS'){
        return {
            ...state,
            habits: action.payload
          }
    }
    if(action.type === 'GET_MEMBERS'){
        return {
            ...state,
            members: action.payload
          }
    }
    if(action.type === 'GET_USERS'){
            return {
                ...state,
                users: action.payload
              }
    }
    if(action.type === 'IS_LOADED'){
            return {
                ...state,
                isLoading: false
              }
    }
    
    return state;
}   

export default rootReducer;