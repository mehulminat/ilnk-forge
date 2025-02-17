import { useEffect, useState } from 'react';
import DataTable from 'react-data-table-component';
import { useDispatch } from 'react-redux';
import { common } from '../../src/helper/Common';
import { setPageHeading, updateMyStatus, confirmPopupStatus } from '../../src/redux/actions/commonAction';
import validator from 'validator';

import svg from '../../src/helper/svg';
import { Tooltip } from '@mui/material';
import { AlertMsg, Loading } from '../../src/helper/helper';
import Popup from '../../src/components/common/popup/Popup';


const Icontype = () => {
    const [name, setName] = useState('');
    const [type, setType] = useState('url');
    const [addIconTypePopup, setaddIconTypePopup] = useState(false);
    let [isEdit, manageIsEdit] = useState(false);
    let [editId, setEditId] = useState('');

    const [iconTypeList, setIconTypeList] = useState([]);
    const [loading, setLoading] = useState(false);
    const [totalRows, setTotalRows] = useState(0);
    const [perPage, setPerPage] = useState(10);
    const [searchTerm, setSearchTerm] = useState('');

    let dispatch = useDispatch();
    useEffect(() => {
        dispatch(setPageHeading({
            pageHeading: "Icon Type",
            title: "Icon Type",
        }));
    }, [dispatch]);

    const fetchSocialIconType = async (page, listPerPage=perPage, nchange=false) => {
        setLoading(true);
        common.getAPI(
            {
                method: "POST",
                url: 'admin/getSocialTypes',
                data: {page: page, listPerPage: listPerPage, searchTerm: searchTerm}
            },
            (resp) => {
                if(resp.status === 'success'){
                    setIconTypeList(resp.data);
                    if(nchange) {
                        setPerPage(listPerPage);
                    }else {
                        setTotalRows(resp.totalUser);
                    }
                }
                setLoading(false);
            }
        );
    };
    const handlePageChange = (page) => {
		fetchSocialIconType(page);
	};
    const handlePerRowsChange = async (newPerPage, page) => {
        setLoading(true);
        fetchSocialIconType(page, newPerPage, true);
    }
    const handleSearchKeyupEvent = async (e) => {
        let t = e.target;
		let searchTerm = t.value;
        setSearchTerm(searchTerm);
        if (e.keyCode === 13) {
            fetchSocialIconType(1);
        }
    }

    useEffect(() => {
        fetchSocialIconType(1);
    }, []);

    const columns = [
        {
            name: '#S.N.',
            width : '100px',
            center : true,
            cell : (row, index) => (<span>{'#'+(index + 1)}</span>)
        },
        {
            name: 'Name',
            selector: row => row.name,
            sortable: true,
        },
        {
            name: 'Type',
            selector: row => row.itype,
            sortable: true,
        },
        {
            name: 'Status',
            selector: row => row.status,
            sortable: true,
            cell : (row, index) => (
                <div className="pu_switch">
                    <input 
                        id={'userChk_'+index} 
                        type="checkbox" 
                        value={row.status} 
                        defaultChecked={row.status === 1 ? true : false} 
                        onClick={(e) => updateCategoryStatus(row.id, (row.status === 1 ? 0 : 1))}
                    />
                    <label htmlFor={'userChk_'+index}>
                        <span className="pu_switch_icon"></span>
                        <span className="pu_switch_text">{row.status === 1 ? 'Active' : 'Inactive'}</span>
                    </label>
                </div>    
            )
        },
        {
            name: 'Actions',
            cell : (row) => (
                <div className="pu_datatable_btns">
                    <Tooltip title="Edit" placement="top" arrow>
                        <a onClick={(e) => getEditedData(e, row.id)} className="pu_dt_btn edit">{svg.dt_edit_icon}</a>
                    </Tooltip>
                    <Tooltip title="Delete" placement="top" arrow>
                        <a onClick={(e) => deleteCategory(e, row.id)} className="pu_dt_btn delete">{svg.dt_delete_icon}</a>
                    </Tooltip>
                </div>
            )
        },
        
    ];
    
    const data = [];
    if(iconTypeList.length) {
        iconTypeList.forEach((item, index) => {
            const newItem = {
                id : item._id,
                name: item.name,
                itype: item.itype,
                status: item.status,
            }
            data.push(newItem);
        });
    }

    const iconTypePopupCloseHandler = (e) => {
        setaddIconTypePopup(false);
        //Reset popup form start
        setTimeout(() => {
            manageIsEdit(false);
            setEditId('');
            setName('');
        }, 100);
    };

    /* add category start */
    const addIconTypeFormSubmit = (e) => {
        e.preventDefault();
        const emptyname = validator.isEmpty(name, {ignore_whitespace:true});
        if(emptyname && !isEdit){
            AlertMsg('error', 'Oops!', 'Field can not be empty!');
            return false;
        }else{
            const data = {
                name : name,
                itype : type
            }
            if(isEdit === true){
                data.type_id = editId;
            }
            Loading(true);
            common.getAPI({
                method : 'POST',
                url : 'admin/addSocialType',
                data : data
            }, (resp) => {
                if(resp.status === "success"){
                    iconTypePopupCloseHandler();
                    setEditId('');
                    setName('');
                    fetchSocialIconType(1);
                }
            })
        }
    }
    /* add category end */
    
    /* update user status start */
    const updateCategoryStatus = (id, status) => {
        if(id){
            dispatch(
                updateMyStatus({
                    url : 'admin/updateSocialTypeStatus',
                    type_id: id,
                    typeStatus: status,
                })
            )
            const newIconTypeList = [...iconTypeList];
            var userIndex = newIconTypeList.findIndex((user => user._id == id));
            newIconTypeList[userIndex].status = status;
            setIconTypeList(newIconTypeList);
        }
    }
    /* update user status end */

    /* edit user start */
    const getEditedData = (e, id) => {
        e.preventDefault();
        const newIconTypeList = [...iconTypeList];
        var icontype = newIconTypeList.find((icontype => icontype._id == id));
        if(icontype){
            manageIsEdit(true);
            setEditId(icontype._id)
            setName(icontype.name);
            setaddIconTypePopup(true);
        }
    };
    /* edit user end */

    /* refresh category list after action start */
    const refreshIconTypeList = () => {
        fetchSocialIconType(1)
    }
    /* refresh category list after action end */

    /* delete user start */
    const deleteCategory = (e, id) => {
        if(id){
            dispatch(confirmPopupStatus(true , {
                type : 'Icon Type',
                url : 'admin/deleteSocialType',
                data : {type_id : id},
                action : refreshIconTypeList
            }));
        }
    }
    /* delete user end */

    return (
        <>
            <div className="pu_container">
                <div className="pu_datatable_wrapper">
                    <div className="pu_pagetitle_wrapper">
                        <h3>Icon Type ({iconTypeList.length})</h3>
                        <div className="pu_pagetitle_right">
                            <div className="pu_search_wrapper">
                                <input type="text" placeholder="Search" onKeyUp={handleSearchKeyupEvent} />
                                <span className="pu_search_icon">{svg.search_icon}</span>
                            </div>
                            <button className="pu_btn" onClick={(e) => setaddIconTypePopup(!addIconTypePopup)}>Add New</button>
                        </div>
                    </div>
                    <DataTable
                        columns={columns}
                        data={data}
                        progressPending={loading}
                        pagination
                        paginationServer
                        paginationTotalRows={totalRows}
                        onChangeRowsPerPage={handlePerRowsChange}
                        onChangePage={handlePageChange}
                    />
                </div>
            </div>
            
            <Popup
                heading={isEdit ? "Update Icon Type" : "Add New Icon Type"}
                show={addIconTypePopup}
                onClose={iconTypePopupCloseHandler}
            >
                <form onSubmit={addIconTypeFormSubmit}>

                    <div className="pu_input_wrapper">
                        <label>Select Type</label>
                        <div className="pu_radio_list">
                            <div className="pu_radio">
                                <input type="radio" name="social_type" id="type_url" value="url" defaultChecked={type === 'url' ? true : false} onChange={(e) => setType(e.target.value)} />
                                <label htmlFor="type_url">URL</label>
                            </div>
                            <div className="pu_radio">
                                <input type="radio" name="social_type" id="type_email" value="email" defaultChecked={type === 'email' ? true : false} onChange={(e) => setType(e.target.value)} />
                                <label htmlFor="type_email">Email</label>
                            </div>
                            <div className="pu_radio">
                                <input type="radio" name="social_type" id="type_phone" value="phone" defaultChecked={type === 'phone' ? true : false} onChange={(e) => setType(e.target.value)} />
                                <label htmlFor="type_phone">Phone</label>
                            </div>
                        </div>
                    </div>
                    <div className="pu_input_wrapper">
                        <label>Name</label>
                        <input type="text" className="pu_input" name="name" value={name} onChange={(e) => setName(e.target.value)} />
                    </div>
                    <div className="text-center">
                        <button type="submit" className="pu_btn">{isEdit ? 'Update' : 'Add Icon Type'}</button>
                    </div>
                </form>
            </Popup>

        </>
    );
}
export default Icontype;