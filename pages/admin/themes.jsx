import { useEffect, useState } from 'react';
import Popup from '../../src/components/common/popup/Popup';
import svg from '../../src/helper/svg';
import styles from '../../styles/pages/Themes.module.css';
import validator from 'validator';
import { AlertMsg } from '../../src/helper/helper';
import ThemePreview from '../../src/components/common/themePreview';
import { common } from '../../src/helper/Common';
import { connect, useDispatch } from 'react-redux';
import { confirmPopupStatus, setPageHeading } from '../../src/redux/actions/commonAction';

import { resetThemeACT, updateBGColorACT, updateGradientAngleACT, updateGradientColor1ACT, updateGradientColor2ACT, updateHeadingColorACT, updateMetaDataACT, updateTextColorACT, updateHeadingFontACT, updateHeadingFontSizeACT, updateHeadingFontWeightACT } from '../../src/redux/actions/themeAction';

import { compose } from 'redux';
import ThemeEditor from '../../src/components/common/theme_editor/ThemeEditor';

const Themes = (props) => {
    let dispatch = useDispatch();
    useEffect(() => {
        dispatch(setPageHeading({
            pageHeading: "Themes",
            title: "Themes",
        }));
    }, [dispatch]);

    const [name, setName] = useState('');
    const [themeList, setThemeList] = useState([]);
    const [addTemplatePopup, setAddTemplatePopup] = useState(false);

    const [editThemeData, setEditThemeData] = useState('');

    const [metaData, setMetaData] = useState([]);

    const [searchTerm, setSearchTerm] = useState('');
    

    const templatePopupCloseHandler = (e) => {
        setAddTemplatePopup(false);
        //Reset popup form start
        setTimeout(() => {
            setName('');
        }, 100);
    };

    /* update metaData on props changes start */
    /* useEffect(() => {
        setMetaData(props);
    }, [props]) */
    
    /* update metaData on props changes end */

    /* get themes start */
    const fetchThemes = async (page, listPerPage=-1, nchange=false) => {
        common.getAPI(
            {
                method: "POST",
                url: 'editor/getThemes',
                data: {page: page, listPerPage: listPerPage, searchTerm: searchTerm}
            },
            (resp) => {
                if(resp.status === 'success'){
                    setThemeList(resp.data);
                }
            }
        );
    };
    /* get themes end */

    useEffect(() => {
        fetchThemes(1);
    }, []);
    

    /* add theme start */
    const addThemeFormSubmit = (e) => {
        e.preventDefault();
        const emptyname = validator.isEmpty(name, {ignore_whitespace:true});
        if(emptyname){
            AlertMsg('error', 'Oops!', 'Field can not be empty!');
            return false;
        }else{
            common.getAPI({
                method : 'POST',
                url : 'admin/addTheme',
                data : {
                    title : name,
                }
            }, (resp) => {
                if(resp.status === "success"){
                    templatePopupCloseHandler();
                    setName('');
                    fetchThemes(1);
                }
            })
        }
    }
    /* add theme end */

    /* edit theme start */
    const editTheme = (id) => {
        if(id){
            common.getAPI({
                method : 'POST',
                url : 'admin/getTheme',
                data : {id}
            }, (resp) => {
                if(resp.status === "success"){
                    var themeData = {...resp.data};
                    if(resp.data.metaData){
                        setEditThemeData(themeData);
                    }else{
                        dispatch(resetThemeACT(true));
                        themeData.metaData = props
                        setEditThemeData(themeData);
                    }
                }
            })
        }
    }
    /* edit theme end */
    
    const backToThemeList = () => {
        setEditThemeData('');
        dispatch(resetThemeACT(true));
        fetchThemes(1);
    }
    
    /* delete theme start */
    const deleteTheme = (tid) => {
        dispatch(confirmPopupStatus(true , {
            type : 'Theme',
            url : 'admin/deleteTheme',
            data : {id: tid},
            action : refreshThemeList
        }));
    }
    /* delete theme end */

    /* refresh theme list after action start */
    const refreshThemeList = () => {
        fetchThemes(1)
    }
    /* refresh theme list after action end */

    

    /* theme status change start */
    const onThemeStateChange = (theme, e) => {
        if(theme._id){
            var tStatus = 0;
            if(e.target.checked === true){
                tStatus = 1;
            }else{
                tStatus = 0;
            }
            common.getAPI({
                method: 'POST',
                loading : false,
                url: 'admin/updateThemeStatus',
                data: {
                    id : theme._id,
                    themeStatus : tStatus
                }
            }, (resp) => {
                fetchThemes(1);
            });
        }
    }
    /* theme status change end */

    /* search theme start */
    const handleSearchKeyupEvent = async (e) => {
        let t = e.target;
		let searchTerm = t.value;
        setSearchTerm(searchTerm);
        if (e.keyCode === 13) {
            fetchThemes(1);
        }
    }
    /* search theme end */

    

    return (
        <>
            <div className="pu_container">
                <div className="pu_pagetitle_wrapper">
                    <h3>
                        {editThemeData._id ? 
                            <a onClick={() => backToThemeList('')} className="pu_back_arrow"><span className="pu_back_arrow_icon">{svg.back_arrow}</span></a> : null 
                        }
                        Themes ({themeList.length}) 
                        {editThemeData._id ? 
                            <span className={styles.edited_theme_name}>{editThemeData.title}</span> : null
                        }
                    </h3>
                    {!editThemeData._id ? 
                        <div className="pu_pagetitle_right">
                            <div className="pu_search_wrapper">
                                <input type="text" placeholder="Search" onKeyUp={handleSearchKeyupEvent} />
                                <span className="pu_search_icon">{svg.search_icon}</span>
                            </div>
                            <button className="pu_btn" onClick={(e) => setAddTemplatePopup(!addTemplatePopup)}>Add New</button>
                        </div> : null
                    }
                </div>

                {!editThemeData._id ? 
                    <div className={styles.theme_list}>
                        {themeList.map(theme =>
                            <div key={theme._id} className={styles.theme_item + ' ' + (theme.status === 0 ? styles.inactive : '')}>
                                <div className={styles.theme_preview}>
                                    <div className={styles.theme_preview_inner}>{theme.metaData ? <ThemePreview data={theme.metaData} /> : null }</div>
                                    <span>{svg.DFY_temp_icon}</span>
                                    <div className={styles.theme_overlay}>
                                        <a className={styles.theme_edit} onClick={() => editTheme(theme._id)}>{svg.dt_edit_icon} Edit</a>
                                    </div>
                                    {theme.isDefault === 0 ? 
                                        <>
                                            <div className={"pu_switch " + styles.theme_switch}>
                                                <input type="checkbox" id={theme._id} value={theme._id} defaultChecked={theme.status === 1 ? true : false} onChange={(e) => onThemeStateChange(theme, e)}/>
                                                <label htmlFor={theme._id}><span className="pu_switch_icon"></span></label>
                                            </div>
                                            <div className={'pu_dropdown_wrapper ' + styles.theme_action}>
                                                <div className={'pu_dropdown_toggle pu_dropdown_toggle_icon ' + styles.theme_action_icon} data-toggle="dropdown">
                                                    <span></span>
                                                    <span></span>
                                                    <span></span>
                                                </div>
                                                <div className={'pu_dropdown_dd ' + styles.theme_action_dropdown}>
                                                    <ul>
                                                        <li><a onClick={() => deleteTheme(theme._id)} className="pu_dropdown_link">Delete</a></li>
                                                    </ul>
                                                </div>
                                            </div>
                                        </> : null
                                    }
                                </div>
                                <p>{theme.title}</p>
                            </div>
                        )}
                    </div>
                    :                     
                    <>
                        <ThemeEditor data={editThemeData} />
                    </>
                }


                <div>
                    
                </div>

            </div>   

            <Popup
                heading="Add Theme"
                show={addTemplatePopup}
                onClose={templatePopupCloseHandler}
            >
                <form onSubmit={addThemeFormSubmit}>
                    <div className="pu_input_wrapper">
                        <label>Theme Name</label>
                        <input type="text" className="pu_input" name="name" value={name} onChange={(e) => setName(e.target.value)} />
                    </div>
                    <div className="text-center">
                        <button type="submit" className="pu_btn">Continue</button>
                    </div>
                </form>
            </Popup>     
        </>
    );
}

const mapStateToProps = (state) => {
    return {
		...state.theme,
	};
};
export default compose(connect(mapStateToProps , null))(Themes)