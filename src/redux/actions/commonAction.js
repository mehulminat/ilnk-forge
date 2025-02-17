import { common } from "../../helper/Common";

export function setPageHeading(data) {
    return (dispatch) => {
        dispatch({
            type: "PAGE_HEADING",
            payload: data,
        });
    };
}

export function resetCommon() {
    return (dispatch) => {
        dispatch({
            type: "RESET_COMMON",
        });
    };
}

export function confirmPopupStatus(status, data = {}) {
    return (dispatch) => {
        dispatch({
            type: "CONFIRM_MODAL",
            payload: {
                removeModalStatus: status,
                removeData: data,
            },
        });
    };
}

export function removeMe(data) {
    let targetUrl = data.url;
    let action = data.action;
    delete data.action;
    delete data.url;
    return (dispatch) => {
        if(targetUrl != ''){
            common.getAPI({
                method: 'POST',
                url: targetUrl,
                data: data.data
            }, (resp) => {
                action();
                dispatch({
                    type: 'CONFIRM_MODAL',
                    payload: {
                        removeModalStatus: false,
                    }
                })
            });
        }else{
            action();
            dispatch({
                type: 'CONFIRM_MODAL',
                payload: {
                    removeModalStatus: false,
                }
            })
        }
    }
}

export const loaderShowHide = (data) => {
    return (dispatch) => {
        dispatch({
            type: "LOADER_SHOW_HIDE",
            payload: {
                siteLoader: data,
            }
        });
        
    };
};
export const alertShowHide = (data) => {
    return (dispatch) => {
        dispatch({
            type: "ALERT_SHOW_HIDE",
            payload: {
                alert: data,
            }
        });
        
    };
};

export function updateMyStatus(data) {
    let targetUrl = data.url;
    delete data.url;
    return (dispatch) => {
        return common.getAPI({
            method: 'POST',
            url: targetUrl,
            data: data
        }, (resp) => {
            return true;
        });
    }
}

/* export function deleteItem(data) {
    return (dispatch) => {
        return common.getAPI({
            method: 'POST',
            url: data.url,
            data: data
        }, (resp) => {
            return true;
        });
    }
} */

export const setHideShowMediaPopup = (data) => {
    return (dispatch) => {
        dispatch({
            type: "HIDE_SHOW_MEDIA_POPUP",
            payload: data,
        });
    };
};



/* link management start */
export const createLinkNameACT = (data) => {
    return (dispatch) => {
        dispatch({
            type: "CREATE_LINK_NAME",
            payload: data
        });
    };
};
export const createLinkTemplateIdACT = (id) => {
    return (dispatch) => {
        dispatch({
            type: "CREATE_LINK_TEMPLATE_ID",
            payload: id
        });
    };
};
export const resetCreateLinkDataACT = () => {
    return (dispatch) => {
        dispatch({
            type: "RESET_CREATE_LINK_DATA",
            payload: {
                linkCreateData : {
                    name : '',
                    templateId : ''
                }
            }
        });
    };
};
/* link management end */