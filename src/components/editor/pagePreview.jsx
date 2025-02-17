import { connect, useSelector } from 'react-redux';
import { compose } from 'redux';
import styles from '../../../styles/editor/pagePreview.module.css';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import svg from '../../helper/svg';
import ElementPreview from './elementPreview';
import Popup from '../common/popup/Popup';
import domtoimage from 'dom-to-image';
import { common } from '../../helper/Common';
import { Loading } from '../../helper/helper';

const PagePreview = (props) => {
    const [tempData, setTempData] = useState('');
    const cData = useSelector((state) => state);
    const [createThumbPopup, setCreateThumbPopup] = useState(false);
    
    useEffect(() => {
        if(props){
            var data = {
                page : props.pageData,
                sections : props.sectionList,
                template : props.editorData
            };
            setTempData(data);
        }
    }, [props]);

    const thumbPopupCloseHandler = (e) => {
        setCreateThumbPopup(false);
    };

    const setThumbClick = () => {
        Loading(true);
        var el = document.getElementById('getTemplateThumbId');
        domtoimage.toBlob(el, {cacheBust : true})
        .then(function (blob) {
            if(props.editorData._id){
                const formData = new FormData();
                formData.append('thumb', blob);
                formData.append('template_id', props.editorData._id);
                common.getAPI({
                    method : 'POST',
                    url : 'upload/updateTemplateThumb',
                    isFormData : true,
                    data : formData
                }, (resp) => {
                    if(resp.status === "success"){

                        let options = {
                            headers: {
                                'Content-Type': blob.type
                            }
                        }
            
                        axios.put(resp.signedurl, blob, options)
                        .then(async response => {
                          console.log('File uploaded successfully:', response.status);
                        })
                        .catch(error => {
                            console.error('Error uploading file:', error.message);
                        }); 
                        thumbPopupCloseHandler();
                    }
                })
            }
        });
    }

    return (
        <>
            <div className={styles.wrapper}>
                {cData.userData.role === 1 ? 
                <h3>
                    Preview
                    <Link href={'/preview/'+ props.pageData.templateId + '/' + props.pageData.slug}><a target="_blank" rel="noopener noreferrer">{svg.icon_open_link}</a></Link>
                    
                </h3> : null }
                <div className={styles.preview_iframe}>
                    <img src="/images/phone_mockup.png" alt="" />
                    {tempData ? 
                        <ElementPreview role={cData.userData.role} {...tempData} editorPreview={true} /> : null
                    }
                </div>
                {cData.userData.role === 1 ? 
                    <>
                        <br/>
                        <div className="text-center">
                            <button className="pu_btn" onClick={(e) => setCreateThumbPopup(!createThumbPopup)} >Set Thumb</button>
                        </div>
                    </> : null 
                }
            </div>

            <Popup
                heading="Set Thumbnail"
                show={createThumbPopup}
                maxWidth= '480px'
                onClose={thumbPopupCloseHandler}
            >
                <div className="pu_set_thumb" id="getTemplateThumbId">
                    {tempData ? 
                        <ElementPreview role={cData.userData.role} {...tempData} editorPreview={true} /> : null
                    }
                </div>
                <div className="text-center">
                    <button className="pu_btn" onClick={()=> setThumbClick()}>Set</button>
                </div>
            </Popup>

        </>
    );
}
const mapStateToProps = (state) => {
    return {
		...state.editor
	};
};
export default compose(connect(mapStateToProps , null))(PagePreview)
