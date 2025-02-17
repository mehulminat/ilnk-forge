import React, { useEffect, useState } from 'react'
import validator from 'validator';
import { useDispatch } from "react-redux";
import { saveSectionACT, getSectionListACT } from "../../../../redux/actions/editorAction";
import svg from '../../../../helper/svg'
import styles from '../../../../../styles/elements/InputImageUploader.module.css'
import Popup from '../../../common/popup/Popup';
import { AlertMsg } from '../../../../helper/helper';
import { common } from '../../../../helper/Common';

import Cropper from 'cropperjs';
import axios from 'axios';
import { Block } from '@mui/icons-material';

function Images(props) {

    let dispatch = useDispatch();
    const [noOfImages, setNoOfImages] = useState('Full');
    const [imageURL, setImageURL] = useState();
    const [urlList, setURLList] = useState({});
    const [copperID, setCopperId] = useState();
    const [crop, setCrop] = useState('');
    const [imageUploadPopup, setImageUploadPopup] = useState(false);
    const [imageCount, setImageCount] = useState([1, 2, 3, 4]);
    const [imagefile, setImagefileFile] = useState('')
    const [mimeType, setMimeType] = useState('')
    useEffect(() => {
        setNoOfImages(props.data.sectionData);
    }, [])

    useEffect(() => {
        if (props.data.otherBusiness.length != 0) {
            let index = props.data.otherBusiness.length;
          
            [1, 2, 3, 4].forEach((val, i) => {
                if (i < index) {
                    imageCount[i] = { ...props.data.otherBusiness[i], image: props.data.otherBusiness[i].image, id: props.data._id + i };
                    urlList[props.data._id + i] = props.data.otherBusiness[i].url;
                } else {
                    imageCount[i] = val;
                }
            }

            )
       
            setImageCount([...imageCount]);
            setURLList(urlList);
        }
    }, [props])


    const handleType = (val) => {
        setNoOfImages(val)
        const data = { ...props.data };
        data.sectionData = val;
        dispatch(saveSectionACT(data));
    }

    const uploadImage = (event, i) => {
        setCopperId(i);
        setImageUploadPopup(false);
        const file = event.target.files[0];
        const url = URL.createObjectURL(file);
        setImagefileFile(file)
        setImageURL(url);
        if (file) {
            if (!file.type.includes('image/')) {
                AlertMsg('error', 'Oops!', 'Only PNG and JPG are allowed!');
                return false;
            }
            setImageUploadPopup(!imageUploadPopup)
            setImageUploadPopup(true);

            if (url) {

                setTimeout(() => {
                    const image = document.getElementById("cropper_image" + props.data._id + i);
                    const cropper = new Cropper(image, {
                        aspectRatio: 1,
                        viewMode: 1,
                    });
                    setCrop(cropper);
                }, 10)
            }
        }
    }



    const ImagePopupCloseHandler = (e) => {
        setImageUploadPopup(false);
        if (crop) {
            crop.destroy();
        }
    };

    const popUpUploadHandle = () => {
        crop.getCroppedCanvas({ width: 500, height: 500 }).toBlob((blob) => {
            const crop_url = URL.createObjectURL(blob);
            setMimeType(blob.type)
            setImageURL(crop_url);
            if (imageCount) {

                const matchingObjectIndex = imageCount.findIndex(
                    (item) => item.id === props.data._id + copperID
                );

                if (matchingObjectIndex !== -1) {
                    imageCount[matchingObjectIndex].image = crop_url;
                    imageCount[matchingObjectIndex].blob = blob;

                } else if (copperID !== -1) {
                    imageCount[copperID] = { id: props.data._id + copperID, image: crop_url, blob: blob };
                } else {
                    imageCount.push({ id: props.data._id + copperID, image: crop_url, blob: blob });
                }
            }

            setImageCount(imageCount)
            ImagePopupCloseHandler();
        });

    }

    const uploadImageButton = (idToFind) => {
        
         if(urlList[idToFind] == undefined){
            AlertMsg('error', 'Oops!', 'URL Field can not be empty!');
            return false;
         }else{
            const URlEmpty = validator.isEmpty(urlList[idToFind], { ignore_whitespace: true });
            const isURL = validator.isURL(urlList[idToFind], { protocols: ['http', 'https', 'ftp'], require_protocol: false });
            if (URlEmpty) {
                AlertMsg('error', 'Oops!', 'URL Field can not be empty!');
                return false;
            }
            if (!isURL) {
                AlertMsg('error', 'Oops!', 'Invalid URL!');
                return false;
            }
         }
        

        if (imageCount) { 
 
            const matchingObjectIndex = imageCount.findIndex(
                (item) => item.id === idToFind
            );
            if(matchingObjectIndex == -1){
                AlertMsg('error', 'Oops!', 'Upload Image!');
                return false;
            }
            const blobURL = imageCount[matchingObjectIndex];
        
            if (blobURL && props.data.templateId) {
                const formData = new FormData();
                formData.append('SectionData', noOfImages);
                formData.append('file', imagefile ? imagefile : '');
                formData.append('blob',blobURL.blob ? blobURL.blob : '')
                formData.append('section_id', props.data._id);
                (blobURL.imageID) && formData.append('imgId', blobURL.imageID);
                formData.append('url', urlList[idToFind])
                common.getAPI({
                    method: "POST",
                    url: 'upload/addUpdateImageSection',
                    isFormData: true,
                    loading:false,
                    data: formData
                },
                    (resp) => {
                        if (resp.status === 'success') {

                            let options = {
                                headers: {
                                    'Content-Type': mimeType
                                }
                            }
                
                            axios.put(resp.signedurl, blobURL.blob, options)
                            .then(async response => {
                              console.log('File uploaded successfully:', response.status);
                            })
                            .catch(error => {
                                console.error('Error uploading file:', error.message);
                            }); 
                            dispatch(getSectionListACT({ _id: props.data.pageId }));
                        }
                    });
            }
        }
    };

    function isObject(val) {
        return typeof val === 'object' && val !== null;
    }

    const UrlHander = (e, i) => {
        const { name, value } = e.target;
        const newData = { ...urlList, [name]: value };
        setURLList(newData);
    }

    return (
        <>


            <div className="pu_input_wrapper">
                <div className={styles.full_grid_flex}>
                    <div className={`${styles.boxes_wrap} ${noOfImages === 'Full' && styles.active}`} onClick={() => handleType('Full')}>
                        <div className={styles.outer_border}>
                            <div className={styles.single_image_box}>
                                {svg['imageIcon']}
                            </div>
                        </div>
                        Full
                    </div>
                    <div className={`${styles.boxes_wrap} ${noOfImages === 'Split' && styles.active}`} onClick={() => handleType('Split')}>
                        <div className={`${styles.outer_border}  ${styles.split}`}>
                            {
                                [1, 2].map(val => <div key={val} className={styles.single_image_box}>
                                    {svg['imageIcon']}
                                </div>
                                )
                            }
                        </div>
                        Split
                    </div>

                    <div className={`${styles.boxes_wrap} ${noOfImages === 'Grid' && styles.active}`} onClick={() => handleType('Grid')}>
                        <div className={`${styles.outer_border}  ${styles.grid}`}>
                            {
                                [1, 2].map(val => <div className={styles.quard_image_box_grid} key={val}>
                                    <div className={styles.single_image_box}>
                                        {svg['imageIcon']}
                                    </div>
                                    <div className={styles.single_image_box}>
                                        {svg['imageIcon']}
                                    </div>
                                </div>
                                )
                            }
                        </div>
                        Grid
                    </div>
                </div>
            </div>
            

            {imageCount.slice(0, noOfImages === 'Grid' ? undefined : (noOfImages === 'Split' ? 2 : 1)).map((val, i) => <div className={`pu_input_wrapper_list  ${styles.list_wrap}`} key={props.data._id + i}>
                <div className={`pu_input_wrapper ${styles.url_box}`} style={{ flex: 2 }}>
                    
                    <input type="text" className="pu_input" placeholder='Enter the redirect URL for this image.' name={props.data._id + i} value={urlList[props.data._id + i] ? urlList[props.data._id + i] : ''} onChange={(e) => { UrlHander(e, i) }} />
                </div>
                <div className={styles.image_box_wrap}> 
                <div className="pu_input_wrapper">
                    <div className={styles.wrapper}>
                        <div className={styles.image}>
                            {isObject(val) ? (val.id == props.data._id + i) &&
                                <img src={val.image} alt="Profile Image" />
                                : null
                            }
                        </div>
                        <div className={styles.name}></div>
                        <div className={styles.uploader}>
                            <input type="file" id={props.data._id + i} onChange={(e) => uploadImage(e, i)} accept=".png,.jpg" />
                            <label htmlFor={props.data._id + i}>
                                {svg.icon_upload}
                                <span>Upload</span>
                            </label>
                        </div>
                    </div>
                </div>

                <div className="text-center" style={{ marginBottom: '25px' }}>
                    <button type="submit" className="pu_btn" onClick={() => uploadImageButton(props.data._id + i)}>Upload</button>
                </div>
                </div>
            </div>)}


            <Popup
                heading="Upload Image"
                show={imageUploadPopup}
                onClose={ImagePopupCloseHandler}
            >
                <div className="pu_image_cropper">
                    <img id={"cropper_image" + props.data._id + copperID} src={imageURL} alt="" style={{ width: '100%' }} />
                </div>
                <div className="text-center">
                    <button type="submit" className="pu_btn" onClick={() => popUpUploadHandle()}>Upload</button>
                </div>
            </Popup>
        </>
    )
}

export default Images