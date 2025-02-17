let initState = {
    autoSaveStatus : false,
    editorData : [],
    pages : [],
    pageData : [],
    pageStyle : '',
    sectionList : [],
    updateActivePage : false,
    content_placeholder : {
        pages : false,
        pageData : false,
    }
}

export const editorReducer = (state = initState, action) => {
    switch (action.type) {
        case "EDITOR_AUTO_SAVE":
            return {...state,...action.payload};
        case "EDITOR_AUTO_SAVE_STATUS":
            return {...state,...action.payload};
        case "EDITOR_DATA_UPDATE":
            return {...state,...action.payload};
        case "RESET_EDITOR_DATA":
            return {...state,...action.payload};
            
        case "UPDATE_PAGE_STYLE":
            let pageStyle = {...state};
            pageStyle = {
                ...pageStyle,
                editorData : {
                    ...pageStyle.editorData,
                    templateStyle : action.payload
                }
            }
            return pageStyle;
        
        case "UPDATE_SOCIAL_ICON":
            let socialIcon = {...state};
            socialIcon = {
                ...socialIcon,
                editorData : {
                    ...socialIcon.editorData,
                    SocialIconData : action.payload
                }
            }
            return socialIcon;
        
        case "UPDATE_PAGE_LIST":
            return {...state,...action.payload};
        case "UPDATE_SECTION_LIST":
            return {...state,...action.payload};
        case "ADD_PAGE":
            let state1 = {...state};
            state1 = {
                ...state1,
                pages : [...state1.pages, action.payload]
            }
            return state1;
        case "DELETE_PAGE":
            let state2 = {...state};
            state2 = {
                ...state2,
                pages : [...state2.pages.filter(item => item._id !== action.payload )]
            }
            return state2;
        
        case "RENAME_PAGE":
            let state3 = {...state};
            var pagescopy = [...state3.pages];
            pagescopy.map((d , i) => {
                if(pagescopy[i]._id == action.payload._id){
                    pagescopy[i].title = action.payload.title;
                    pagescopy[i].slug = action.payload.slug;
                }
            });
            state3 = {
                ...state3,
                pageData : {
                    ...state3.pageData,
                    title : action.payload.title,
                    slug : action.payload.slug,
                },
            }
            return state3;
        case "GET_PAGE_DATA":
            return {...state,...action.payload};
        case "UPDATE_ACTIVE_PAGE":
            return {...state,...action.payload};
        
        case "CONTENT_PLACEHOLDER":
            let state4 = {...state};
            state4 = {
                ...state4,
                content_placeholder : {
                    ...state4.content_placeholder, 
                    ...action.payload
                }
            }
            return state4;

        case "GET_SECTION_LIST":
            return {...state,...action.payload};
        case "ADD_SECTION":
                let state5 = {...state};
                state5 = {
                    ...state5,
                    sectionList : [...state5.sectionList, action.payload]
                }
                return state5;
        case "DELETE_SECTION":
            let state6 = {...state};
            state6 = {
                ...state6,
                sectionList : [...state6.sectionList.filter(item => item._id !== action.payload )]
            }
            return state6;

        case "SAVE_SECTION":
            let state7 = {...state};
            state7.sectionList.map((d , i) => {
                if(state7.sectionList[i]._id == action.payload._id){
                    state7.sectionList[i].sectionData = action.payload.sectionData;
                }
            })
            return state7;
        case "UPDATE_SECTION_STATUS":
            let state8 = {...state};
            state8.sectionList.map((d , i) => {
                if(state8.sectionList[i]._id == action.payload.id){
                    state8.sectionList[i].status = action.payload.data;
                }
            })
            return state8;
        
        case "UPDATE_PROFILE":
            let state9 = {...state};
            state9 = {
                ...state9,
                editorData : {
                    ...state9.editorData,
                    profile : action.payload
                }
            }
            return state9;
        
        case "UPDATE_SEO_DATA":
            let state10 = {...state};
            state10.pages.map((d , i) => {
                if(state10.pages[i]._id == action.payload.page_id){
                    state10.pages[i].seoData = action.payload.seoData;
                }
            })
            return state10;
        case "DUPLICATE_SECTION":
                let state11 = {...state};
                state11 = {
                    ...state11,
                    sectionList : [...state11.sectionList, action.payload]
                }
                return state11;

        case "CHANGE_TEMPLATE":
            let state12 = {...state};
            state12 = {
                ...state12,
                editorData : {
                    ...state12.editorData,
                    templateStyle : action.payload.templateStyle,
                    html_theme_id : action.payload.html_theme_id,
                    packId : action.payload.packId,
                }
            }
            return state12;
                
        default:
            return state;
    }
}