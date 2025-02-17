import Cookies from "js-cookie";
import { common } from "../../helper/Common";

export function resetEditorData(data) {
    return (dispatch) => {
        dispatch({
            type: 'RESET_EDITOR_DATA',
            payload: {
                autoSaveStatus : false,
                editorData : [],
                pages : [],
                pageData : [],
                sectionList : [],
                content_placeholder : {
                    pages : false,
                    pageData : false,
                }
            }
        });
    }
}
export function editorDataUpdate(data) {
    return (dispatch) => {
        dispatch({
            type: 'EDITOR_DATA_UPDATE',
            payload: {
                editorData : data
            }
        });
    }
}
export function changeTemplateACT(data) {
    return (dispatch) => {
        const newData = {
            templateStyle : data.templateStyle,
            html_theme_id : data.html_theme_id,
            packId : data.packId,
        }
        dispatch({
            type: 'CHANGE_TEMPLATE',
            payload: newData
        });
    }
}
export function editorAutoSaveStatus(status) {
    return (dispatch) => {
        dispatch({
            type: 'EDITOR_AUTO_SAVE_STATUS',
            payload: {
                autoSaveStatus: status,
            }
        });
    }
}
export function editorAutoSave(data) {
    let targetUrl = data.url;
    return (dispatch) => {
        if(data.url){
            const Eddata = {
                id : data.data._id,
                templateData : (data.data.templateData ? data.data.templateData : [] )
            }
            var detail = {
                method: 'POST',
                headers: {
                    authorization : Cookies.get("accessToken"),
                    Accept: "application/json",
                    "Content-Type": "application/json",
                    "Cache-Control": "no-cache",
                    mode: "no-cors", // no-cors
                },
                body : JSON.stringify(Eddata)
            };
            fetch(process.env.API_URL + targetUrl, detail)
            .then((res2) => res2.json())
            .then((resp) => {
                if(resp.status === "success"){
                    delete data.url;
                    dispatch({
                        type: 'EDITOR_AUTO_SAVE',
                        payload: {
                            editorData : data.data
                        },
                    })
                    dispatch({
                        type: 'EDITOR_AUTO_SAVE_STATUS',
                        payload: {
                            autoSaveStatus: false,
                        }
                    });
                }
            });
        }
    };
}

export function contentPlaceholder(data) {
    return (dispatch) => {
        dispatch({
            type: 'CONTENT_PLACEHOLDER',
            payload : data
        });
    }
}

/* pages actions start */
export function addPageACT(data) {
    return (dispatch) => {
        common.getAPI({
            method: 'POST',
            loading : false,
            alert : false,
            url: 'editor/createTemplatePage',
            data: {
                name : data.name,
                template_id : data.id
            }
        }, (resp) => {
            if(resp.status === 'success'){
                setTimeout(() => {
                    dispatch(editorAutoSaveStatus(false));
                }, 300);
                dispatch({
                    type: 'ADD_PAGE',
                    payload: resp.data
                });
            }
        });
    }
}
export function updatePageListACT(data) {
    return (dispatch) => {
        dispatch({
            type: 'UPDATE_PAGE_LIST',
            payload: {
                pages : data
            }
        });
    }
}
export function updateActivePage(data) {
    return (dispatch) => {
        dispatch({
            type: 'UPDATE_ACTIVE_PAGE',
            payload : {
                updateActivePage : data
            }
        })
    }
}
export function deletePageACT(data) {
    return (dispatch) => {
        dispatch({
            type: 'DELETE_PAGE',
            payload: data
        });
        dispatch(updateActivePage(true));
    }
}
export function renamePageACT(data) {
    return (dispatch) => {
        dispatch({
            type: 'RENAME_PAGE',
            payload: data
        });
    }
}
export function reorderPageListACT(data) {
    return (dispatch) => {
        dispatch({
            type: 'UPDATE_PAGE_LIST',
            payload: {
                pages : data
            }
        });
        common.getAPI({
            method: 'POST',
            loading : false,
            alert : false,
            url: 'editor/savePagesOrder',
            data: data
        }, (resp) => {
            if(resp.status === 'success'){
                setTimeout(() => {
                    dispatch(editorAutoSaveStatus(false));
                }, 300);
            }
        });
    }
}
export function getPageDataACT(data) {
    return (dispatch) => {
        if(data._id){
            common.getAPI({
                method: 'POST',
                loading : false,
                url: 'editor/getTemplatePage',
                data: {
                    id : data._id
                }
            }, (resp) => {
                if(resp.status === 'success'){
                    dispatch({
                        type: 'GET_PAGE_DATA',
                        payload : {
                            pageData : data
                        }
                    })
                }
            });
        }
        
    }
}
/* pages actions end */

/* section start */
export function getSectionListACT(data) {
    return (dispatch) => {
        dispatch(contentPlaceholder({pageData : true}));
        common.getAPI({
            method: 'POST',
            url: 'editor/getSections',
            loading : false,
            data: {
                page_id : data._id,
            }
        }, (resp) => {
            if(resp.status === 'success'){
                dispatch(contentPlaceholder({pageData : false}));
                dispatch({
                    type: 'GET_SECTION_LIST',
                    payload: {
                        sectionList : resp.data,
                    }
                });
            }
        });
    }
}
export function addSectionACT(data) {
    return (dispatch) => {
        if(data.page_id){
            common.getAPI({
                method: 'POST',
                loading : false,
                alert : false,
                url: 'editor/addSection',
                data: {
                    page_id : data.page_id,
                    template_id : data.template_id,
                    title : data.title,
                    type : data.type,
                    sectionData : data.sectionData
                }
            }, (resp) => {
                if(resp.status === 'success'){
                    setTimeout(() => {
                        dispatch(editorAutoSaveStatus(false));
                    }, 300);
                    dispatch({
                        type: 'ADD_SECTION',
                        payload : resp.data
                    });
                }
            });
        }
    }
}
export function deleteSectionACT(id) {
    return (dispatch) => {
        if(id){
            common.getAPI({
                method: 'POST',
                loading : false,
                alert : false,
                url: 'editor/deleteSection',
                data: {
                    section_id : id,
                }
            }, (resp) => {
                if(resp.status === 'success'){
                    setTimeout(() => {
                        dispatch(editorAutoSaveStatus(false));
                    }, 300);
                    dispatch({
                        type: 'DELETE_SECTION',
                        payload : id
                    });
                }
            });
        }
    }
}
export function updateSectionStatusACT(data) {
    return (dispatch) => {
        dispatch(editorAutoSaveStatus(true));
        common.getAPI({
            method: 'POST',
            loading : false,
            alert : false,
            url: 'editor/updateSectionStatus',
            data: {
                section_id : data.id,
                sectionStatus : data.data
            }
        }, (resp) => {
            if(resp.status === 'success'){
                setTimeout(() => {
                    dispatch(editorAutoSaveStatus(false));
                }, 300);
                dispatch({
                    type: 'UPDATE_SECTION_STATUS',
                    payload : data
                });
            }
        });
    }
}
export function saveSectionACT(data) {
    return (dispatch) => {
        dispatch(editorAutoSaveStatus(true));
        common.getAPI({
            method: 'POST',
            loading : false,
            alert : false,
            url: 'editor/saveSection',
            data: {
                section_id : data._id,
                sectionData : data.sectionData
            }
        }, (resp) => {
            if(resp.status === 'success'){
                setTimeout(() => {
                    dispatch(editorAutoSaveStatus(false));
                }, 300);
                dispatch({
                    type: 'SAVE_SECTION',
                    payload : data
                });
            }
        });
        
    }
}
export function duplicateSectionACT(id) {
    return (dispatch) => {
        if(id){
            dispatch(editorAutoSaveStatus(true));
            common.getAPI({
                method: 'POST',
                loading : false,
                alert : false,
                url: 'editor/duplicateSection',
                data: {
                    section_id : id,
                }
            }, (resp) => {
                if(resp.status === 'success'){
                    setTimeout(() => {
                        dispatch(editorAutoSaveStatus(false));
                    }, 300);
                    dispatch({
                        type: 'DUPLICATE_SECTION',
                        payload : resp.data
                    });
                }
            });
        }
    }
}
export function reorderSectionListACT(data) {
    return (dispatch) => {
        dispatch({
            type: 'UPDATE_SECTION_LIST',
            payload: {
                sectionList : data
            }
        });

        common.getAPI({
            method: 'POST',
            loading : false,
            alert : false,
            url: 'editor/saveSectionOrder',
            data: data
        }, (resp) => {
            if(resp.status === 'success'){
                setTimeout(() => {
                    dispatch(editorAutoSaveStatus(false));
                }, 300);
            }
        });
    }
}
/* section start */

/* profile update start */
export function profileUpdateACT(pdata) {
    return (dispatch) => {
        dispatch(editorAutoSaveStatus(true));
        common.getAPI({
            method: 'POST',
            loading : false,
            alert : false,
            url: 'editor/updateTemplateProfile',
            data: pdata
        }, (resp) => {
            if(resp.status === 'success'){
                setTimeout(() => {
                    dispatch(editorAutoSaveStatus(false));
                }, 300);
                dispatch({
                    type: 'UPDATE_PROFILE',
                    payload : pdata.profile_data
                });
            }
        });
        
    }
}
/* profile update end */

/* social icon update start */
export function socialIconUpdateACT(data) {
    return (dispatch) => {
        dispatch(editorAutoSaveStatus(true));
        common.getAPI({
            method: 'POST',
            loading : false,
            alert : false,
            url: 'editor/saveSocialIcons',
            data: data
        }, (resp) => {
            if(resp.status === 'success'){
                setTimeout(() => {
                    dispatch(editorAutoSaveStatus(false));
                }, 300);
                dispatch({
                    type: 'UPDATE_SOCIAL_ICON',
                    payload : data.icon_data
                });
            }
        });
        
    }
}
/* social icon update end */


/* change page style start */
export function updatePageStyleACT(data){
    return (dispatch) => {
        dispatch({
            type: 'UPDATE_PAGE_STYLE',
            payload : data
        });
    }
}
/* change page style end */

/* change social icon start */
export function updateSocialIconsACT(data){
    return (dispatch) => {
        dispatch({
            type: 'UPDATE_SOCIAL_ICON',
            payload : data
        })
    }
}
/* change social icon end */

/* update SEO data start */
export function updatePageSeoACT(data){
    return (dispatch) => {
        dispatch({
            type: 'UPDATE_SEO_DATA',
            payload : data
        })
    }
}
/* update SEO data end */
