let initState = {
    title : '',
    description : '',
    keywords : '',
    pageHeading : '',
    siteLoader : false,
    removeModalStatus : false,
    removeData : {
        target : '',
        url : ''
    },
    linkCreateData : {
        name : '',
        templateId : ''
    }
}
        
export const commonReducer = (state = initState, action) =>{
    switch (action.type) {
        case "LOADER_SHOW_HIDE":
            return {...state,...action.payload};
        case 'PAGE_HEADING':
            return {...state,...action.payload};
        case 'CONFIRM_MODAL':
            return {...state,...action.payload};
        case "ALERT_SHOW_HIDE":
            return {...state,...action.payload};

        case "CREATE_LINK_NAME":
            let state1 = {...state};
            state1 = {
                ...state1,
                linkCreateData : {
                    ...state1.linkCreateData,
                    name : action.payload
                }
            }
            return state1;
        case "CREATE_LINK_TEMPLATE_ID":
            let state2 = {...state};
            state2 = {
                ...state2,
                linkCreateData : {
                    ...state2.linkCreateData,
                    templateId : action.payload
                }
            }
            return state2;
        case "RESET_CREATE_LINK_DATA":
                return {...state,...action.payload};

        default:
            return state;
    }
}

