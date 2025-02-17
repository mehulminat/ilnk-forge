import { useEffect, useState } from 'react';
import { connect, useDispatch } from 'react-redux';
import { compose } from 'redux';
import styles from '../../../../styles/elements/InputImageUploader.module.css';
import { common, manageMyFile } from '../../../helper/Common';
import svg from '../../../helper/svg';
import { profileUpdateACT } from '../../../redux/actions/editorAction';
import Popup from '../popup/Popup';

import '../../../../node_modules/cropperjs/dist/cropper.css';
import Cropper from 'cropperjs';
import axios from 'axios';

const InputImageUploader = (props) => {
    let dispatch = useDispatch();
    const [imageURL, setImageURL] = useState('');
    const [imageName, setImageName] = useState('');
    const [profileData, setProfileData] = useState('');

    const [crop, setCrop] = useState('');
    const [profileUploadPopup, setProfileUploadPopup] = useState(false);
    
    const uploadTemplateProfile = (event) => {
        setProfileUploadPopup(false);
        const file = event.target.files[0];
        const url = URL.createObjectURL(file);
        const name = event.target.files[0].name;
        setImageName(name);
        setImageURL(url);
        if(file){
            setProfileUploadPopup(!profileUploadPopup);
            if(url){
                setTimeout(() =>{
                    const image = document.getElementById('cropper_image');
                    const cropper = new Cropper(image, {
                        aspectRatio: 1,
                        viewMode : 1,
                    });
                    setCrop(cropper);
                }, 10)
            }
        }
    }
    
    useEffect(() => {
        if(props.url){
            setImageURL(props.url)
        }else{
            setImageURL('');
        }
    }, [props])

    const profileUploadPopupCloseHandler = (e) => {
        setProfileUploadPopup(false);
        if(crop){
            crop.destroy();
        }
    };

    const uploadImageButton = () => {
        crop.getCroppedCanvas({width : 500, height : 500}).toBlob((blob) => {
            const crop_url = URL.createObjectURL(blob);
            setImageURL(crop_url);
            if(blob && props.templateId){
                const formData = new FormData();
                formData.append('file', blob);
                formData.append('template_id', props.templateId);
                common.getAPI({
                    method: "POST",
                    url: 'upload/uploadTemplateProfileImage',
                    isFormData : true,
                    data: formData
                },
                (resp) => {
                    if(resp.status === 'success'){

                        let options = {
                            headers: {
                                'Content-Type': blob.type
                            }
                        }
            
                        axios.put(resp.signedurl, blob, options)
                        .then(async response => {
                          console.log('File uploaded successfully:', response.status);
                        })
                        
                        setProfileData(resp.profile);
                        profileUploadPopupCloseHandler();
                    }
                });
            }
        });
    };

    useEffect(() => {
        const tid = props.editorData._id;
        if(profileData){
            const data = {
                profile_data : profileData,
                template_id : tid,
            }
            dispatch(profileUpdateACT(data));
        }
    },[profileData]);

    return (
        <>
            <div className={styles.wrapper}>
                <div className={styles.image}>
                    {imageURL ? 
                        <img src={imageURL} alt="Profile Image" />
                        : null
                    }
                </div>
                <div className={styles.name} title={imageName ? imageName : ''}>{imageName ? imageName : ''}</div>
                <div className={styles.uploader}>
                    <input type="file" id="image_uploader" onChange={(e)=> uploadTemplateProfile(e)} accept=".png,.jpg" />
                    <label htmlFor="image_uploader">
                        {svg.icon_upload}
                        <span>Upload</span>
                    </label>
                </div>
            </div>
            <Popup
                heading="Upload Profile"
                show={profileUploadPopup}
                onClose={profileUploadPopupCloseHandler}
            >
                <div className="pu_image_cropper">
                    <img id="cropper_image" src={imageURL} alt="" style={{width: '100%'}} />
                </div>
                <div className="text-center">
                    <button type="submit" className="pu_btn" onClick={() => uploadImageButton()}>Upload</button>
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
export default compose(connect(mapStateToProps , null))(InputImageUploader)
