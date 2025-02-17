export function updateBGColorACT(color) {
    return (dispatch) => {
        dispatch({
            type: 'UPDATE_BG_COLOR',
            payload : {
                bgcolor : color
            }
        });
    }
}
export function updateHeadingColorACT(color) {
    return (dispatch) => {
        dispatch({
            type: 'UPDATE_HEADING_COLOR',
            payload : {
                headingcolor : color
            }
        });
    }
}
export function updateHeadingFontACT(font) {
    return (dispatch) => {
        dispatch({
            type: 'UPDATE_HEADING_FONT',
            payload : {
                headingfont : font
            }
        });
    }
}
export function updateHeadingFontWeightACT(weight) {
    return (dispatch) => {
        dispatch({
            type: 'UPDATE_HEADING_FONT_WEIGHT',
            payload : {
                headingfontweight : weight
            }
        });
    }
}
export function updateHeadingFontSizeACT(size) {
    return (dispatch) => {
        dispatch({
            type: 'UPDATE_HEADING_FONT_SIZE',
            payload : {
                headingsize : size
            }
        });
    }
}
export function updateTextColorACT(color) {
    return (dispatch) => {
        dispatch({
            type: 'UPDATE_TEXT_COLOR',
            payload : {
                textcolor : color
            }
        });
    }
}
export function updateGradientColor1ACT(color) {
    return (dispatch) => {
        dispatch({
            type: 'UPDATE_GRADIENT_COLOR1',
            payload : color
        });
    }
}
export function updateGradientColor2ACT(color) {
    return (dispatch) => {
        dispatch({
            type: 'UPDATE_GRADIENT_COLOR2',
            payload : color
        });
    }
}
export function updateGradientAngleACT(angle) {
    return (dispatch) => {
        dispatch({
            type: 'UPDATE_GRADIENT_ANGLE',
            payload : angle
        });
    }
}

export function updateMetaDataACT(data) {
    return (dispatch) => {
        dispatch({
            type: 'UPDATE_META_DATA',
            payload : data
        });
    }
}

export function resetThemeACT(data) {
    return (dispatch) => {
        if(data === true) {
            dispatch({
                type: 'RESET_THEME_DATA',
                payload : {
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
            });
        }
    }
}