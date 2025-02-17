import { Tooltip } from '@mui/material';
import { useState } from 'react';
import { AlertMsg } from '../../../helper/helper';
import svg from '../../../helper/svg';
import Popup from '../popup/Popup';
import validator from 'validator';
import styles from './RenameIcon.module.css'
import { common } from '../../../helper/Common';

const RenameIcon = (props) => {
    const [renamePopup, setRenamePopup] = useState(false);
    const [name, setName] = useState('');

    const renamePopupCloseHandler = (e) => {
        setRenamePopup(false);
    };

    const renamePopupClick = () => {
        setRenamePopup(!renamePopup)
        setName(props.title);
    }

    /* rename start */
    const renameFormSubmit = (e) => {
        e.preventDefault();
        const emptyname = validator.isEmpty(name, {ignore_whitespace:true});
        if(emptyname){
            AlertMsg('error', 'Oops!', 'Field can not be empty!');
            return false;
        }else{
            if(props.id){
                const data = {
                    id : props.id,
                    title : name,
                }
                common.getAPI({
                    method : 'POST',
                    url : 'editor/updateTemplateName',
                    data : data
                }, (resp) => {
                    if(resp.status === "success"){
                        renamePopupCloseHandler();
                        props.callBack();
                    }
                })
            }
        }
    }
    /* rename end */

    return (
        <>
            <Tooltip title="Rename" placement="top" arrow>
                <span onClick={() => renamePopupClick()} className="pu_rename_icon">{svg.dt_edit_icon}</span>
            </Tooltip>
            <Popup
                heading="Rename"
                show={renamePopup}
                onClose={renamePopupCloseHandler}
            >
                <form onSubmit={renameFormSubmit}>
                    <div className="pu_input_wrapper">
                        <label>Name</label>
                        <input type="text" className="pu_input" name="name" value={name} onChange={(e) => setName(e.target.value)} />
                    </div>
                    <div className="text-center">
                        <button type="submit" className="pu_btn">Rename</button>
                    </div>
                </form>
            </Popup>
        </>
    );
}

export default RenameIcon;