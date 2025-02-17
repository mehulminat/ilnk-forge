import { useEffect, useState } from 'react';
import { connect, useDispatch } from 'react-redux';
import { compose } from 'redux';
import { AlertMsg, getNameInitials } from '../../../helper/helper';
import { setPageHeading } from '../../../redux/actions/commonAction';
import styles from './Profile.module.css';
import validator from 'validator';
import { common } from '../../../helper/Common';
import svg from '../../../helper/svg';
import Popup from '../popup/Popup';
import PlanAlert from '../PlanAlert';

import '../../../../node_modules/cropperjs/dist/cropper.css';
import Cropper from 'cropperjs';
import { updateUserProfileACT } from '../../../redux/actions/authAction';
import axios from 'axios';

const Profile = (props) => {
    let dispatch = useDispatch();
    useEffect(() => {
        dispatch(setPageHeading({
            pageHeading: "PixaURL - Profile",
            title: "PixaURL - Profile",
        }));
    }, [dispatch]);

    const [name, setName] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [imageURL, setImageURL] = useState('');
    const [crop, setCrop] = useState('');
    const [profileUploadPopup, setProfileUploadPopup] = useState(false);
    const [currentPlan, setCurrentPlan] = useState({});
    const [showAlertBar, setShowAlertBar] = useState(false);

    useEffect(() => {
        setName(props.name);
        setImageURL(props.profile_img);
    }, [props])

    const alertBarCloseHandler = () => {
        setShowAlertBar(false);
    }
    const getCurrentPlan = () => {
        common.getAPI({
          method: 'POST',
          url: 'user/getCurrentPlan',
          data: {}
        }, (resp) => {
          if (resp.status === "success") {
            if(resp.data?.adminPlanStatus) {
              if(resp.data.isPlan && !resp.data.isExpired) {
                setCurrentPlan(resp.data);
              }
              if(resp.data.isPlan && resp.data.isExpired) {
                setShowAlertBar(true);
              }
            }
          }
        })
    }

    useEffect(() => {
        getCurrentPlan();
    }, []);

    const handleSubmit = (e) => {
        e.preventDefault();
        const emptyname = validator.isEmpty(name, {ignore_whitespace:true});
        const comparepass = validator.equals(password, confirmPassword);
        if(emptyname){
            AlertMsg('error', 'Oops!', 'Field can not be empty!');
            return false;
        } else if(!comparepass){
            AlertMsg('error', 'Oops!', 'Password should be match with confirm password.');
            return false;
        }else{
            common.getAPI({
                method: "POST",
                url: 'user/updateProfile',
                data: {
                    name : name,
                    password : password
                }
            },
            (resp) => {
                if(resp.status === 'success'){
                    const data = {
                        name : name,
                        profile_img : resp.data.profilePicture
                    }
                    dispatch(updateUserProfileACT(data));
                    profileUploadPopupCloseHandler();

                }
            });
        }
    }

    const uploadProfileImage = (event) => {
        setProfileUploadPopup(false);
        const file = event.target.files[0];
        const url = URL.createObjectURL(file);
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
            if(blob){
                const formData = new FormData();
                formData.append('name', name);
                formData.append('password', password);
                formData.append('profileImage', blob);
                common.getAPI({
                    method: "POST",
                    url: 'upload/updateProfile',
                    isFormData : true,
                    data: formData
                },
                (resp) => {
                    if(resp.status === 'success'){
                        const data = {
                            name : name,
                            profile_img : resp.data.profilePicture.file
                        }
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
                        // dispatch(updateUserProfileACT(data));
                        profileUploadPopupCloseHandler();
                    }
                });
            }
        });
    };

    return (
        <>
            <div className="pu_container">
                <PlanAlert show={showAlertBar} onClose={alertBarCloseHandler} />
                <div className={styles.profile_wrapper}>
                    <div className={styles.profile_left}>
                        <div className={styles.profile_info_box}>
                            <div className={styles.profile_avatar}>
                                <span className={styles.profile_avatar_initials}>{getNameInitials(name ? name : 'Unknown')}</span>
                                { imageURL ? <img src={imageURL} alt="" /> : null }
                                <div className={styles.profile_img_uploader}>
                                    <input type="file" id="profile_image_upload" onChange={(e)=> uploadProfileImage(e)} accept=".png,.jpg" />
                                    <label htmlFor="profile_image_upload">
                                        {svg.icon_upload}
                                    </label>
                                </div>
                                {/* <Tooltip title="Remove Profile Image" placement="top" arrow>
                                    <div className={styles.profile_image_remove}>
                                        {svg.popup_close}
                                    </div>
                                </Tooltip> */}
                            </div>
                            <h3>{name ? name : 'Unknown'}</h3>
                            <p>Email : <span>{props.email}</span></p>
                            <p>Registration Date : <span>{common.dateFormatter(props.createdAt)}</span></p>
                        </div>
                        {currentPlan?.planName ? 
                            <div className="pu_plan_detail_wrapper">
                                <span className="pu_plan_tagline">Active Plan</span>
                                <div className="pu_plan_status">
                                <div className="pu_plan_icon">
                                    {svg.price_tag}
                                </div>
                                    <div className="pu_plan_detail">
                                        <h5>{currentPlan.planName}</h5>
                                        <p>Expiry Date : {common.dateFormatWithoutTime(currentPlan.validityDate)}</p>
                                    </div>
                                </div>
                            </div> : null
                        }
                    </div>
                    <div className={styles.profile_right}>
                        <form onSubmit={(e) => handleSubmit(e)}>
                            <div className={styles.profile_box}>
                                <div className={styles.profile_box_title}>
                                    <h3>Basic Profile Details</h3>
                                </div>
                                <div className={styles.profile_box_body}>
                                    <div className="pu_input_wrapper_list">
                                        <div className="pu_input_wrapper" style={{marginBottom: 0}}>
                                            <label>Your Name</label>
                                            <input type="text" className="pu_input" value={name} onChange={(e) => setName(e.target.value)} />
                                        </div>
                                        <div className="pu_input_wrapper" style={{marginBottom: 0}}>
                                            <label>Your Email</label>
                                            <input type="text" className="pu_input" defaultValue={props.email} readOnly disabled />
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className={styles.profile_box}>
                                <div className={styles.profile_box_title}>
                                    <h3>Change Password</h3>
                                </div>
                                <div className={styles.profile_box_body}>
                                    <div className="pu_input_wrapper_list">
                                        <div className="pu_input_wrapper">
                                            <label>Password</label>
                                            <input type="password" className="pu_input" value={password} onChange={(e) => setPassword(e.target.value)} />
                                        </div>
                                        <div className="pu_input_wrapper">
                                            <label>Confirm Password</label>
                                            <input type="password" className="pu_input" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
                                        </div>
                                    </div>
                                    <button type="submit" className="pu_btn">Save Changes</button>
                                </div>
                            </div>
                        </form>
                    </div>
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
		...state.userData,
	};
};
export default compose(connect(mapStateToProps , null))(Profile)
