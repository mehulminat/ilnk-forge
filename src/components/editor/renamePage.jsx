import { Tooltip } from '@mui/material';
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import validator from 'validator';
import { common } from '../../helper/Common';
import svg from '../../helper/svg';
import { renamePageACT } from '../../redux/actions/editorAction';
import Popup from '../common/popup/Popup';

const RenamePage = (props) => {
    let dispatch = useDispatch();
    const [renamePopup, setRenamePopup] = useState(false);
    const [pageTitle, setPageTitle] = useState('');

    const renamePage = (id) => {
        setRenamePopup(!renamePopup)
        setPageTitle(props.data.title);
    }

    const renamePopupCloseHandler = (e) => {
        setRenamePopup(false);
    };
    /* rename start */
    const renameFormSubmit = (e) => {
        e.preventDefault();
        const emptypagename = validator.isEmpty(pageTitle, {ignore_whitespace:true});
        if(emptypagename){
            AlertMsg('error', 'Oops!', 'Field can not be empty!');
            return false;
        }else{
            if(props.data._id){
                const data = {
                    title : pageTitle,
                    page_id : props.data._id,
                }
                common.getAPI({
                    method : 'POST',
                    url : 'editor/updatePageName',
                    data : data
                }, (resp) => {
                    if(resp.status === "success"){
                        renamePopupCloseHandler();
                        dispatch(renamePageACT(resp.data));                    
                    }
                })
            }
        }
    }
    /* rename end */

    return (
        <>
            <Tooltip title="Rename Page" placement="top" arrow>
                <div className="pu_btn_icon" onClick={() => renamePage(props.data._id)}>{svg.edit_icon}</div>
            </Tooltip>
            <Popup
                heading="Rename Page"
                show={renamePopup}
                onClose={renamePopupCloseHandler}
            >
                <form onSubmit={renameFormSubmit}>
                    <div className="pu_input_wrapper">
                        <label>Name</label>
                        <input type="text" className="pu_input" value={pageTitle} onChange={(e) => setPageTitle(e.target.value)} />
                    </div>
                    <div className="text-center">
                        <button type="submit" className="pu_btn">Rename</button>
                    </div>
                </form>
            </Popup>
        </>
    );
}

export default RenamePage;