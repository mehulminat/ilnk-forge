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


const TemplateCategories = () => {

    const [name, setName] = useState('');

    const [addCategoryPopup, setAddCategoryPopup] = useState(false);
    let [isEdit, manageIsEdit] = useState(false);
    let [editId, setEditId] = useState('');

    const [categoryList, setCategoryList] = useState([]);
    const [loading, setLoading] = useState(false);
    const [totalRows, setTotalRows] = useState(0);
    const [perPage, setPerPage] = useState(10);
    const [searchTerm, setSearchTerm] = useState('');

    const [catCount, setCatCount] = useState(0);

    let dispatch = useDispatch();
    useEffect(() => {
        dispatch(setPageHeading({
            pageHeading: "Template Categories",
            title: "Template Categories",
        }));
    }, [dispatch]);

    const fetchCategory = async (page, listPerPage=perPage, nchange=false) => {
        setLoading(true);
        common.getAPI(
            {
                method: "POST",
                url: 'admin/getCategories',
                data: {page: page, listPerPage: listPerPage, searchTerm: searchTerm}
            },
            (resp) => {
                if(resp.status === 'success'){
                    setCategoryList(resp.data);
                    setCatCount(resp.totalCategory);
                    if(nchange) {
                        setPerPage(listPerPage);
                    }else {
                        setTotalRows(resp.totalCategory);
                    }
                }
                setLoading(false);
            }
        );
    };
    const handlePageChange = (page) => {
        fetchCategory(page);
	};
    const handlePerRowsChange = async (newPerPage, page) => {
        setLoading(true);
        fetchCategory(page, newPerPage, true);
    }
    const handleSearchKeyupEvent = async (e) => {
        let t = e.target;
		let searchTerm = t.value;
        setSearchTerm(searchTerm);
        if (e.keyCode === 13) {
            fetchCategory(1);
        }
    }

    useEffect(() => {
        fetchCategory(1);
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
            selector: row => row.title,
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
    if(categoryList.length) {
        categoryList.forEach((item, index) => {
            const newItem = {
                id : item._id,
                title: item.title,
                status: item.status,
            }
            data.push(newItem);
        });
    }

    const categoryPopupCloseHandler = (e) => {
        setAddCategoryPopup(false);
        //Reset popup form start
        setTimeout(() => {
            manageIsEdit(false);
            setEditId('');
            setName('');
        }, 100);
    };

    /* add category start */
    const addCategoryFormSubmit = (e) => {
        e.preventDefault();
        const emptyname = validator.isEmpty(name, {ignore_whitespace:true});
        if(emptyname && !isEdit){
            AlertMsg('error', 'Oops!', 'Field can not be empty!');
            return false;
        }else{
            const data = {
                name : name,
            }
            if(isEdit === true){
                data.id = editId;
            }
            Loading(true);
            common.getAPI({
                method : 'POST',
                url : 'admin/updateTemplateCategory',
                data : data
            }, (resp) => {
                if(resp.status === "success"){
                    categoryPopupCloseHandler();
                    setEditId('');
                    setName('');
                    fetchCategory(1);
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
                    url : 'admin/updateTemplateCategoryStatus',
                    category_id: id,
                    catStatus: status,
                })
            )
            const newcategoryList = [...categoryList];
            var userIndex = newcategoryList.findIndex((user => user._id == id));
            newcategoryList[userIndex].status = status;
            setCategoryList(newcategoryList);
        }
    }
    /* update user status end */

    /* edit user start */
    const getEditedData = (e, id) => {
        e.preventDefault();
        const newCategoryList = [...categoryList];
        var category = newCategoryList.find((category => category._id == id));
        if(category){
            manageIsEdit(true);
            setEditId(category._id)
            setName(category.title);
            setAddCategoryPopup(true);
        }
    };
    /* edit user end */

    /* refresh category list after action start */
    const refreshCategoryList = () => {
        fetchCategory(1)
    }
    /* refresh category list after action end */

    /* delete user start */
    const deleteCategory = (e, id) => {
        if(id){
            dispatch(confirmPopupStatus(true , {
                type : 'Category',
                url : 'admin/deleteTemplateCategory',
                data : {category_id: id},
                action : refreshCategoryList
            }));
        }
    }
    /* delete user end */

    return (
        <>
            <div className="pu_container">
                <div className="pu_datatable_wrapper">
                    <div className="pu_pagetitle_wrapper">
                        <h3>Template Categories ({catCount})</h3>
                        <div className="pu_pagetitle_right">
                            <div className="pu_search_wrapper">
                                <input type="text" placeholder="Search" onKeyUp={handleSearchKeyupEvent} />
                                <span className="pu_search_icon">{svg.search_icon}</span>
                            </div>
                            <button className="pu_btn" onClick={(e) => setAddCategoryPopup(!addCategoryPopup)}>Add New Category</button>
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
                heading={isEdit ? "Update Category" : "Add New Category"}
                show={addCategoryPopup}
                onClose={categoryPopupCloseHandler}
            >
                <form onSubmit={addCategoryFormSubmit}>
                    <div className="pu_input_wrapper">
                        <label>Name</label>
                        <input type="text" className="pu_input" name="name" value={name} onChange={(e) => setName(e.target.value)} />
                    </div>
                    <div className="text-center">
                        <button type="submit" className="pu_btn">{isEdit ? 'Update' : 'Add Category'}</button>
                    </div>
                </form>
            </Popup>

        </>
    );
}
export default TemplateCategories;