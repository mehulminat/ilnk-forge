import { Tooltip } from '@mui/material';
import { useState, useRef, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import svg from '../../../../helper/svg';
import { confirmPopupStatus, updateMyStatus } from '../../../../redux/actions/commonAction';
import { deleteSectionACT, duplicateSectionACT, editorAutoSaveStatus, updateSectionStatusACT } from '../../../../redux/actions/editorAction';
import Heading from '../elements/Heading';
import Link from '../elements/Link';
import Paragraph from '../elements/Paragraph';
import Profile from '../elements/Profile';
import styles from './pageSection.module.css';
import Images from '../elements/Images';
import QRCode from '../elements/QRCode';
import Video from '../elements/Video';

const PageSection = (props) => { 
    let dispatch = useDispatch();
    const wrapperRef = useRef(); 

    const [sectionTitle, setSectionTitle] = useState('');

    const elementBody = (elType) => {
        if(elType === 'el_profile') return <Profile data={props.data} />
        if(elType === 'el_heading') return <Heading data={props.data} />
        if(elType === 'el_paragraph') return <Paragraph data={props.data} />
        if(elType === 'el_link') return <Link data={props.data} />
        if(elType === 'el_image') return <Images data={props.data} />
        if(elType === 'el_qrcode') return <QRCode data={props.data} />
        if(elType === 'el_video') return <Video data={props.data} />
    }

    useEffect(() => {
        if(props.data.type === "el_link"){
            setSectionTitle(props.data.sectionData.linkTitle);
        }else if(props.data.type === "el_image"){
            setSectionTitle('Image');
        }else if(props.data.type === "el_video"){
            setSectionTitle(props.data.sectionData.title);
        }else if(props.data.type === "el_audio"){
            setSectionTitle(props.data.sectionData.title);
        }else{
            setSectionTitle(props.data.sectionData);
        }
    }, [props])

    /* delete section start */
    const deleteSection = () => {
        if(props.data._id){
            dispatch(confirmPopupStatus(true , {
                type : 'Section',
                url : '',
                data : props.data._id,
                action : deleteAfterConfirm
            }));
        }
    }
    const deleteAfterConfirm = async () => {
        if(props.data._id){
            dispatch(confirmPopupStatus(false , {}));
            dispatch(editorAutoSaveStatus(true));
            dispatch(deleteSectionACT(props.data._id))
        }
    }
    /* delete section end */

    const duplicateSection = () => {
        if(props.data._id){
           dispatch(duplicateSectionACT(props.data._id));
        }
    }

    /* accordion start */
    const accordionHandler = () => {
        if(wrapperRef.current.classList.contains(styles.active)){
            wrapperRef.current.classList.remove(styles.active)
        }else{
            wrapperRef.current.classList.add(styles.active)
        }
        var el_id = 'el_' + props.data._id;
        var elid = document.getElementById(el_id);
        if(elid){
            elid.focus();
        }
    }
    /* accordion end */

    /* update section status start */
    const updateSectionStatus = (id, data) => {
        if (props.data._id) {
            dispatch(updateSectionStatusACT({id,data}));
        }
    }
    /* update section status end */

    return (
        <>
            <div className={styles.wrapper + ' ' + (props.data.isDefault === 1 ? styles.active : '')} ref={wrapperRef}>
                <div className={styles.header}>
                    <div className={styles.header_bg} onClick={(e) => accordionHandler()}></div>
                    <div className={styles.section_drag_icon} {...props.dragprops ? {...props.dragprops.dragHandleProps} : null}>
                        <span></span>
                        <span></span>
                    </div> 
                    
                    <div className={styles.section_icon} onClick={(e) => accordionHandler()}>
                        {svg['icon_'+ props.data.type]} 
                    </div>
                    
                    <div className={styles.section_title +' '+ styles[props.data.type]} onClick={(e) => accordionHandler()}>
                        <span>{sectionTitle.replace(/<[^>]+>/g, '')}</span>
                    </div>

                    <div className={styles.section_actions}>
                        
                        {!props.data.isDefault === true ?
                        <>
                            <Tooltip title="Clone Element" placement="top" arrow>
                                <div className="pu_btn_icon" onClick={(e) => duplicateSection(e)}>{svg.icon_duplicate}</div>
                            </Tooltip>
                            <Tooltip title={(props.data.status === 0 ? 'Show' : 'Hide') + ' Element'} placement="top" arrow>
                                <div className="pu_switch">
                                    <input 
                                        type="checkbox" 
                                        id={'section_'+ props.data._id}
                                        defaultChecked={props.data.status === 1 ? true : false}
                                        onClick={(e) => updateSectionStatus(props.data._id, (props.data.status === 1 ? 0 : 1))} 
                                    />
                                    <label htmlFor={'section_'+ props.data._id}>
                                        <div className="pu_switch_icon"></div>
                                    </label>
                                </div>
                            </Tooltip>
                            <Tooltip title="Delete Element" placement="top" arrow>
                                <div className="pu_btn_icon" onClick={(e) => deleteSection()}>{svg.icon_delete}</div>
                            </Tooltip>
                        </>
                        : null
                        }
                        <div className={styles.section_accordion_icon} onClick={(e) => accordionHandler()}></div>
                    </div>

                </div>
                <div className={styles.body}>
                    {elementBody(props.data.type)}
                </div>
            </div>
        </>
    );
}
export default PageSection;