import { useEffect, useState } from "react";
import Popup from "../../src/components/common/popup/Popup";
import { common } from "../../src/helper/Common";
import svg from "../../src/helper/svg";
import validator from 'validator';

import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import { AlertMsg, Loading } from "../../src/helper/helper";

import styles from '../../styles/pages/DfyTemplate.module.css';
import { useDispatch } from "react-redux";
import { confirmPopupStatus, setPageHeading } from "../../src/redux/actions/commonAction";
import Link from "next/link";

const Iconpack = () => {

    let dispatch = useDispatch();
    useEffect(() => {
        dispatch(setPageHeading({
            pageHeading: "Icon Pack",
            title: "Icon Pack",
        }));
    }, [dispatch]);

    const [name, setName] = useState('');
    
    const [iconPackList, setIconPackList] = useState([]);

    const [addIconPackPopup, setAddIconPackPopup] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [editId, setEditId] = useState('');

    const iconPackPopupCloseHandler = (e) => {
        setAddIconPackPopup(false);
        //Reset popup form start
        setTimeout(() => {
            setName('');
            setEditId('');
        }, 100);
    };

    /* get icon pack start */
    const fetchIconPack = async (page, listPerPage=-1, nchange=false) => {
        common.getAPI(
            {
                method: "POST",
                url: 'admin/getSocialPacks',
                data: {page: page, listPerPage: listPerPage, searchTerm: searchTerm}
            },
            (resp) => {
                if(resp.status === 'success'){
                    setIconPackList(resp.data);
                }
            }
        );
    };
    /* get icon pack end */

    useEffect(() => {
        fetchIconPack(1);
    }, []);
    

    /* add template start */
    const addIconPackFormSubmit = (e) => {
        e.preventDefault();
        const emptyname = validator.isEmpty(name, {ignore_whitespace:true});
        if(emptyname){
            AlertMsg('error', 'Oops!', 'Field can not be empty!');
            return false;
        }else{
            Loading(true);
            if(editId){
                common.getAPI({
                    method : 'POST',
                    url : 'admin/updateSocialPack',
                    data : {
                        pack_id : editId,
                        name : name
                    }
                }, (resp) => {
                    if(resp.status === "success"){
                        iconPackPopupCloseHandler();
                        setName('');
                        setEditId('');
                        fetchIconPack(1);
                    }
                });
            }else{
                common.getAPI({
                    method : 'POST',
                    url : 'admin/addSocialPack',
                    data : {
                        name : name
                    }
                }, (resp) => {
                    if(resp.status === "success"){
                        iconPackPopupCloseHandler();
                        setName('');
                        fetchIconPack(1);
                    }
                });
            }
        }
    }
    /* add template end */

    const deleteIconPack = (id) => {
        if(id){
            dispatch(confirmPopupStatus(true , {
                type : 'Icon Pack',
                url : 'admin/deleteSocialPack',
                data : {pack_id: id},
                action : refreshIconPackList
            }));
        }
    }
    const renameIconPack = (id, name) => {
        if(id){
            setAddIconPackPopup(!addIconPackPopup);
            setEditId(id);
            setName(name);
        }
    }

    /* refresh template list after action start */
    const refreshIconPackList = () => {
        fetchIconPack(1)
    }
    /* refresh template list after action end */

    /* template status change start */
    const onIconPackStateChange = (temp, e) => {
        if(temp._id){
            var tStatus = 0;
            if(e.target.checked === true){
                tStatus = 1;
            }else{
                tStatus = 0;
            }
            common.getAPI({
                method: 'POST',
                url: 'admin/updateSocialPackStatus',
                data: {
                    pack_id : temp._id,
                    packStatus : tStatus
                }
            }, (resp) => {
                fetchIconPack(1);
            });
        }
    }
    /* template status change end */

    /* search template start */
    const handleSearchKeyupEvent = async (e) => {
        let t = e.target;
		let searchTerm = t.value;
        setSearchTerm(searchTerm);
        if (e.keyCode === 13) {
            fetchIconPack(1);
        }
    }
    /* search template end */

    return (
        <>
            <div className="pu_container">
                <div className="pu_pagetitle_wrapper">
                    <h3>Icon Pack ({iconPackList.length})</h3>
                    <div className="pu_pagetitle_right">
                        <div className="pu_search_wrapper">
                            <input type="text" placeholder="Search" onKeyUp={handleSearchKeyupEvent}/>
                            <span className="pu_search_icon">{svg.search_icon}</span>
                        </div>
                        <button className="pu_btn" onClick={(e) => setAddIconPackPopup(!addIconPackPopup)}>Add New</button>
                    </div>
                </div>
                <div className={styles.template_list}>
                    {iconPackList.map(ipack => 
                        <div key={ipack._id} className={styles.template_item + ' ' + (ipack.status === 0 ? styles.inactive : '')}>
                            <div className={styles.template_icon}>
                                {ipack.iconList ? 
                                    (ipack.iconList[0].svg_code ? 
                                        <span dangerouslySetInnerHTML={{__html: ipack.iconList[0].svg_code}}></span>
                                        : 
                                        <span className={styles.template_icon_svg}>{svg.DFY_temp_icon}</span>
                                    ) 
                                    : 
                                    null
                                }
                                
                                <div className={styles.template_overlay}>
                                    <Link href={'/admin/iconpack/'+ipack._id}><a className={styles.template_edit}>{svg.dt_edit_icon} Edit</a></Link>
                                </div>
                                {ipack.isDefault === 0 ?
                                    <>
                                        <div className={"pu_switch " + styles.template_switch}>
                                            <input type="checkbox" id={ipack._id} value={ipack._id} defaultChecked={ipack.status === 1 ? true : false} onChange={(e) => onIconPackStateChange(ipack, e)}/>
                                            <label htmlFor={ipack._id}><span className="pu_switch_icon"></span></label>
                                        </div>
                                        <div className={'pu_dropdown_wrapper ' + styles.template_action}>
                                            <div className={'pu_dropdown_toggle ' + styles.template_action_icon} data-toggle="dropdown">
                                                <span></span>
                                                <span></span>
                                                <span></span>
                                            </div>
                                            <div className={'pu_dropdown_dd ' + styles.template_action_dropdown}>
                                                <ul>
                                                    <li><a onClick={() => renameIconPack(ipack._id , ipack.name)} className="pu_dropdown_link">Rename</a></li>
                                                    <li><a onClick={() => deleteIconPack(ipack._id)} className="pu_dropdown_link">Delete</a></li>
                                                </ul>
                                            </div>
                                        </div>
                                    </> : null
                                }
                            </div>
                            <p>{ipack.name}</p>
                        </div>
                    )}
                </div>
            </div>

            <Popup
                heading={editId ? "Rename Icon Pack" :"Add Icon Pack"}
                show={addIconPackPopup}
                onClose={iconPackPopupCloseHandler}
            >
                <form onSubmit={addIconPackFormSubmit}>
                    <div className="pu_input_wrapper">
                        <label>Icon Pack Name</label>
                        <input type="text" className="pu_input" name="name" value={name} onChange={(e) => setName(e.target.value)} />
                    </div>
                    <div className="text-center">
                        <button type="submit" className="pu_btn">{editId ? "Rename" :"Add"}</button>
                    </div>
                </form>
            </Popup>
        </>
    );
}

export default Iconpack;