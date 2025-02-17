import styles from '../../../styles/editor/pageEditor.module.css';
import svg from '../../helper/svg';
import { connect, useDispatch } from 'react-redux';
import { useEffect, useRef, useState } from 'react';
import { compose } from 'redux';
import { confirmPopupStatus } from '../../redux/actions/commonAction';
import { deletePageACT, editorAutoSaveStatus, addSectionACT, profileUpdateACT, reorderSectionListACT, updatePageListACT } from '../../redux/actions/editorAction';
import PageSection from './pageElements/section/pageSection';
import Popup from '../common/popup/Popup';
import { common } from '../../helper/Common';
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

import ContentLoader from 'react-content-loader';
import InputImageUploader from '../common/elements/inputImageUploader';
import { Tooltip } from '@mui/material';
import RenamePage from './renamePage';

const PageEditor = (props) => {
    let dispatch = useDispatch();
    const profileWrapperRef = useRef();

    let elementList = [
        {
            id : 1,
            title : 'Heading',
            type : 'el_heading',
            status: 1,
            icon : 'icon_el_heading',
            defaultValue : 'Default Heading'
        },
        {
            id : 2,
            title : 'Paragraph',
            type : 'el_paragraph',
            status: 1,
            icon : 'icon_el_paragraph',
            defaultValue : 'Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Donec quam felis, ultricies nec, pellentesque eu, pretium quis, sem. Nulla consequat massa quis enim..'
        },
        {
            id : 3,
            title : 'Link',
            type : 'el_link',
            status: 1,
            icon : 'icon_el_link',
            defaultValue : {
                linkTitle : 'Link',
                type: 'link',
                pageSlug : 'home',
                link : '#',
                openNewTab : false
            }
        },
        {
            id : 4,
            title : 'Image',
            type : 'el_image',
            status: 1,
            icon : 'icon_el_image',
            defaultValue : 'Full'
        },
        {
            id : 5,
            title : 'Social Icons',
            type : 'el_social_icons',
            status: 0,
            icon : 'icon_el_social_icons',
            defaultValue : 'This is the default social_icons.'
        },
        {
            id : 6,
            title : 'Gallery',
            type : 'el_gallery',
            status: 0,
            icon : 'icon_el_gallery',
            defaultValue : 'This is the default gallery.'
        },
        {
            id : 7,
            title : 'QRCode',
            type : 'el_qrcode',
            status: 1,
            icon : 'icon_el_qrcode',
            defaultValue : 'This is default url to genterate QR Code.'
        },
        {
            id : 8,
            title : 'Video',
            type : 'el_video',
            status: 1,
            icon : 'icon_el_video',
            defaultValue : {
                title:"Add Video URL here.",
                url:''
            }   
        },
        {
            id : 8,
            title : 'SoundCloud',
            type : 'el_audio',
            status: 0,
            icon : 'icon_el_video',
            defaultValue : {
                title:"Add SoundCloud Audio URL here.",
                url:''
            }   
        },
    ]
    const [addElementPopup, setAddElementPopup] = useState(false);
    const [profileName, setProfileName] = useState('');
    const [profileTagline, setProfileTagline] = useState('');
    const [profileImage, setProfileImage] = useState('');

    const [sectionList, setSectionList] = useState([]);

    const [pageTitle, setPageTitle] = useState('');

    useEffect(() => {
        let propSections = props.sectionList;
        if(propSections.length){
            setSectionList(propSections); 
        }else{
            setSectionList([]); 
        }

        if(props.pageData){
            setPageTitle(props.pageData.title);
        }
    }, [props]);

    /* delete page action start */
    const deletePage = (e) => {
        var pid = props.pageData._id;
        if(pid){
            dispatch(confirmPopupStatus(true , {
                type : 'Page',
                url : 'editor/deleteTemplatePage',
                data : {id: pid},
                action : closeConfirmPopup
            }));
        }
    }
    /* delete page action end */

    /* close confirm popup after delete start */
    const closeConfirmPopup = () => {
        if(props.pageData){
            const deletedPageId = props.pageData._id;
            dispatch(deletePageACT(deletedPageId));
            dispatch(confirmPopupStatus(false , {}));
        }
    }
    /* close confirm popup after delete end */

    const elementPopupCloseHandler = (e) => {
        setAddElementPopup(false);
    };

    useEffect(() => {
        if(props.editorData){
            if(props.editorData.profile){
                setProfileName(props.editorData.profile.name ? props.editorData.profile.name : '');
                setProfileTagline(props.editorData.profile.tagline ? props.editorData.profile.tagline : '');
                setProfileImage(props.editorData.profile.image ? props.editorData.profile.image : '');
            }
        }
    }, [props.editorData]);
    
    /* add element start */
    const addElement = (el) => {
        var activePageId = props.pageData._id;
        if(activePageId){
            elementPopupCloseHandler();
            dispatch(editorAutoSaveStatus(true));
            const data = {
                page_id : activePageId,
                template_id : props.templateId,
                title : el.title,
                type : el.type,
                sectionData : el.defaultValue
            }
            dispatch(addSectionACT(data));
        }
    }
    /* add element end */

    // a little function to help us with reordering the result
    const reorder = (list, startIndex, endIndex) => {
        const result = Array.from(list);
        const [removed] = result.splice(startIndex, 1);
        result.splice(endIndex, 0, removed);
        return result;
    };
    const sectionDragHandle = (result) => {
        if (!result.destination) {
            return;
        }
        const items = reorder(
            sectionList,
            result.source.index,
            result.destination.index
        );
        setSectionList(items);
        /* send section list to store start */
        dispatch(editorAutoSaveStatus(true));
        dispatch(reorderSectionListACT(items));
        /* send section list to store end */
    }

    /* accordion start */
    const accordionHandler = () => {
        if(profileWrapperRef.current.classList.contains(styles.active)){
            profileWrapperRef.current.classList.remove(styles.active)
        }else{
            profileWrapperRef.current.classList.add(styles.active)
        }
    }
    /* accordion end */

    const updateProfileName = (e) => {
        const data = {...props.editorData.profile};
        setProfileName(e.target.value);
        if(data.name !== profileName){
            data.name = profileName;
            const newData = {
                template_id : props.editorData._id,
                profile_data : data
            }
            dispatch(profileUpdateACT(newData));
        }
    }
    const updateProfileTagline = (e) => {
        const data = {...props.editorData.profile};
        if(data.tagline !== profileTagline){
            data.tagline = profileTagline;
            const newData = {
                template_id : props.editorData._id,
                profile_data : data
            }
            dispatch(profileUpdateACT(newData));
        }
    }

    const duplicatePage = (id) => {
        if(id){
            var pagesCopy = [...props.pages];
            common.getAPI({
                method: 'POST',
                url: 'editor/duplicatePage',
                data: {
                    page_id : id
                }
            }, (resp) => {
                if(resp.status === 'success'){
                    var newPages = [...pagesCopy, resp.data];
                    dispatch(updatePageListACT(newPages));
                }
            });
        }
    }

    return (
        <>
            {!props.content_placeholder.pageData ?
                <>
                    <div className={styles.header}>
                        <div className={styles.header_title}>
                            <h3>
                                {props.pageData ? props.pageData.title : 'Loading'} 
                                {props.pageData.isDefault === 1 ? <span>(Default)</span> : ''}
                            </h3>
                            {props.pageData.isDefault === 0 ?
                                <div className={styles.header_title_action}>
                                    <RenamePage data={props.pageData} />
                                    <Tooltip title="Clone Page" placement="top" arrow>
                                        <div className="pu_btn_icon" onClick={() => duplicatePage(props.pageData._id)}>{svg.icon_duplicate}</div>
                                    </Tooltip>
                                    {/* <div className="pu_switch">
                                        <input type="checkbox" id="page_status_switch" />
                                        <label htmlFor="page_status_switch">
                                            <div className="pu_switch_icon"></div>
                                        </label>
                                    </div> */}
                                    <Tooltip title="Delete Page" placement="top" arrow>
                                        <div className="pu_btn_icon" onClick={(e) => deletePage(e)}>{svg.icon_delete}</div>
                                    </Tooltip>
                                </div>
                            : null}
                        </div>
                        <div className={styles.header_btns}>
                            <button className={'pu_btn ' + styles.btn} onClick={(e) => setAddElementPopup(!addElementPopup)}>{svg.btn_add_icon} Add New Element</button>
                        </div>
                    </div>

                    <div className={styles.page_section_list}>
                        {props.pageData.isDefault === 1 ?
                            <div className={styles.profile_wrapper +' '+ styles.active} ref={profileWrapperRef}>
                                <div className={styles.profile_header} onClick={(e) => accordionHandler()}>
                                    <div className={styles.profile_section_icon}>
                                        {svg.icon_el_profile}
                                    </div>
                                    
                                    <div className={styles.profile_section_title}>Profile</div>

                                    <div className={styles.profile_section_actions}>
                                        <div className={styles.profile_section_accordion_icon}></div>
                                    </div>

                                </div>
                                <div className={styles.profile_body}>
                                    <div className="pu_input_wrapper_list">
                                        <div className="pu_input_wrapper">
                                            <label>Full Name</label>
                                            <input type="text" className="pu_input" value={profileName} onChange={(e) => setProfileName(e.target.value)} onBlur={(e) => updateProfileName(e)} />
                                        </div>
                                        <div className="pu_input_wrapper">
                                            <label>Profile Image</label>
                                            <InputImageUploader 
                                                url={profileImage ? profileImage : ''} 
                                                templateId ={props.editorData._id}
                                            />
                                        </div>
                                    </div>
                                    <div className="pu_input_wrapper">
                                        <label>Tag Line</label>
                                        <textarea rows="5" className="pu_input" value={profileTagline} onChange={(e) => setProfileTagline(e.target.value)} onBlur={(e) => updateProfileTagline(e)}></textarea>
                                    </div>
                                </div>
                            </div> : null
                        }
                        {sectionList.length ? 
                            <DragDropContext onDragEnd={sectionDragHandle}>
                                <Droppable droppableId="droppable">
                                    {(provided, snapshot) => (
                                        <div 
                                            {...provided.droppableProps}
                                            ref={provided.innerRef}
                                        >
                                            {sectionList.map((section, index) => 
                                                <Draggable key={section._id} draggableId={(section._id).toString()} index={index}>
                                                    {(provided, snapshot) => (
                                                        <div 
                                                            ref={provided.innerRef}
                                                            {...provided.draggableProps}                                                
                                                        >
                                                            <PageSection
                                                                data={section}
                                                                dragprops={provided}
                                                            />   
                                                        </div>
                                                    )}
                                                </Draggable>
                                            )}
                                            {provided.placeholder}
                                        </div>
                                    )}
                                </Droppable>
                            </DragDropContext> : null
                        }

                    </div>
                </>
                : 
                <>
                    <ContentLoader 
                        viewBox="0 0 800 650"
                        backgroundColor={'#FFFFFF'}
                        foregroundColor={'#f8fafd'}
                    >
                        <rect x="0" y="0" rx="8" ry="8" width="550" height="60" />
                        <rect x="570" y="0" rx="8" ry="8" width="230" height="60" />
                        <rect x="0" y="90" rx="8" ry="8" width="800" height="200" />
                        <rect x="0" y="310" rx="8" ry="8" width="800" height="100" />
                        <rect x="0" y="430" rx="8" ry="8" width="800" height="100" />
                        <rect x="0" y="550" rx="8" ry="8" width="800" height="100" />
                    </ContentLoader><br/><br/>
                </>
            }
            
            <Popup
                heading="Add New Element"
                subHeading="Select And Add Element to the Page"
                maxWidth="630px"
                show={addElementPopup}
                onClose={elementPopupCloseHandler}
            >
                <div className={styles.element_list}>
                    {elementList.filter(item => item.status === 1).map(el =>
                        <div key={el.id} className={styles.element_item} onClick={() => addElement(el)}>
                            <span>{svg[el.icon]}</span>
                            <p>{el.title}</p>
                        </div>                        
                    )}
                </div>
            </Popup>
        </>
    );
}

const mapStateToProps = (state) => {
    return {
		...state.editor,
	};
};

export default compose(connect(mapStateToProps , null))(PageEditor)