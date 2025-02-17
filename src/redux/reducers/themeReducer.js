let initState = {
    primary_color : '#2bdcf0',
    secondary_color : '#2d2d38',
    bgcolor : '#ffffff',
    headingcolor : '#222222',
    textcolor : '#333333',
    headingfont : 'Nunito',
    headingfontweight : 400,
    headingsize : 16,
    textfont : 'Nunito',
    textfontweight : 400,
    textsize : 14,
    bg_gradient : {
        status : 0,
        type : 'linear',
        colors : [
            { color : '#8EC5FC', stop : 0 },
            { color : '#E0C3FC', stop : 100 },
        ],
        angle : 62
    },
    default_gradient : {
        status : 0,
        type : 'linear',
        colors : [
            { color : '#fa8bff', stop : 0 },
            { color : '#2bd2ff', stop : 50 },
            { color : '#2bff88', stop : 100 },
        ],
        angle : 90
    },
    bgimage : {
        url : '',
        repeat : false,
        position : 'center center',
        size : 50
    }
}

export const themeReducer = (state = initState, action) => {
    switch (action.type) {
        case "RESET_THEME_DATA":
            return action.payload;
        
        case "UPDATE_META_DATA":
                return {...state, ...action.payload};

        case "UPDATE_BG_COLOR":
            return {...state, ...action.payload};

        case "UPDATE_HEADING_COLOR":
            return {...state, ...action.payload};

        case "UPDATE_HEADING_FONT":
            return {...state, ...action.payload};
        
        case "UPDATE_HEADING_FONT_WEIGHT":
            return {...state, ...action.payload};
            
        case "UPDATE_HEADING_FONT_SIZE":
            return {...state, ...action.payload};

        case "UPDATE_TEXT_COLOR":
            return {...state, ...action.payload};
            
        case "UPDATE_GRADIENT_COLOR1":
            var color1State = {...state};
            color1State = {
                ...color1State,
                gradient : {
                    ...color1State.gradient,
                    status : 1,
                    color1 : action.payload
                }
            }
            return color1State;

        case "UPDATE_GRADIENT_COLOR2":
            var color2State = {...state};
            color2State = {
                ...color2State,
                gradient : {
                    ...color2State.gradient,
                    status : 1,
                    color2 : action.payload
                }
            }
            return color2State;

        case "UPDATE_GRADIENT_ANGLE":
            var angleState = {...state};
            angleState = {
                ...angleState,
                gradient : {
                    ...angleState.gradient,
                    status : 1,
                    angle : action.payload
                }
            }
            return angleState;

        default:
            return state;
    }
}