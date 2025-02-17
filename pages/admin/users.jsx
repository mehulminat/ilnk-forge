import { useEffect, useState } from 'react';
import DataTable from 'react-data-table-component';
import { useDispatch } from 'react-redux';
import { common } from '../../src/helper/Common';
import { setPageHeading, updateMyStatus, confirmPopupStatus } from '../../src/redux/actions/commonAction';
import validator from 'validator';

import svg from '../../src/helper/svg';
import { Tooltip } from '@mui/material';
import { AlertMsg, getNameInitials, Loading } from '../../src/helper/helper';
import Popup from '../../src/components/common/popup/Popup';

import Box from '@mui/material/Box';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import Chip from '@mui/material/Chip';
import moment from 'moment';
import { defaultCurrency } from '../../src/helper/currencies';


const Users = () => {

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const [addUserPopup, setAddUserPopup] = useState(false);
    let [isEdit, manageIsEdit] = useState(false);
    let [editId, setEditId] = useState('');

    const [addplanpopup, setAddPlanPopup] = useState(false)
    const [isAssign, setIsAssign] = useState(false);
    const [planList, setPlanList] = useState('');
    const [planCurrency, setPlanCurrency] = useState(defaultCurrency);
    const [userID, setUserId] = useState('');
    const [userList, setUserList] = useState([]);
    const [loading, setLoading] = useState(false);
    const [totalRows, setTotalRows] = useState(0);
    const [perPage, setPerPage] = useState(10);
    const [searchTerm, setSearchTerm] = useState('');

    const [otoName, setOtoName] = useState([]);

    let dispatch = useDispatch();
    useEffect(() => {
        dispatch(setPageHeading({
            pageHeading: "Users",
            title: "Users",
        }));
    }, [dispatch]);

    const fetchUsers = async (page, listPerPage=perPage, nchange=false) => {
        setLoading(true);
        common.getAPI(
            {
                method: "POST",
                url: 'admin/getUsers',
                data: {page: page, listPerPage: listPerPage, searchTerm: searchTerm}
            },
            (resp) => {
                if(resp.status === 'success'){
                    setUserList(resp.data);
                    setPerPage(listPerPage);
                    setTotalRows(resp.totalUser);
                }
                setLoading(false);
            }
        );
    };
    const handlePageChange = (page) => {
		fetchUsers(page);
	};
    const handlePerRowsChange = async (newPerPage, page) => {
        setLoading(true);
        fetchUsers(page, newPerPage, true);
    }
    const handleSearchKeyupEvent = async (e) => {
        let t = e.target;
		let searchTerm = t.value;
        setSearchTerm(searchTerm);
        if (e.keyCode === 13) {
            fetchUsers(1);
        }
    }

    useEffect(() => {
        fetchUsers(1);
    }, []);

    /* const handleChange = ({ selectedRows }) => {
        console.log('Selected Rows: ', selectedRows);
    }; */

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
            cell : (row) => (
                <div className="pu_avatarName_wrapper">
                    <div className="pu_avatar_icon">
                        <span className="pu_avatar_initial">{getNameInitials(row.name)}</span>
                        {row.userImg ? 
                            <img src={row.userImg} alt="" />    
                            : null
                        }
                    </div>
                    <div className="pu_avatar_name">{row.name}</div>
                </div>
            )
        },
        {
            name: 'Email',
            selector: row => row.email,
            sortable: true,
        },
        
        {
            name: 'Registration Date',
            selector: row => row.createdAt,
            sortable: true,
        },
        {
            name: 'Plan Validity',
            selector: row =>  (row.validityDate && row.validityDate !== '') ? moment(row.validityDate).format("DD-MMM-YYYY") : '-',
            sortable: true,
            cell : (row) => (
                <div>
                    { (row.validityDate && row.validityDate !== '') ?
                        <span className="">{moment(row.validityDate).format("DD-MMM-YYYY")}</span>
                        :
                        <span style={{marginLeft:'40px'}}>{'-'}</span>
                    }
                </div>
            )
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
                        onClick={(e) => updateUserStatus(row.id, (row.status === 1 ? 0 : 1))}
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
                        <a onClick={(e) => deleteUser(e, row.id)} className="pu_dt_btn delete">{svg.dt_delete_icon}</a>
                    </Tooltip>
                    <Tooltip title="Assign Plan" placement="top" arrow>
                        <a onClick={(e) => assignPlan(e, row)} className="pu_dt_btn ">{svg.icon_el_assignPlan}</a>
                    </Tooltip>
                </div>
            )
        },
        
    ];


    const planColumns = [
        {
            name: 'Plan Name',
            width:'120px',
            selector: row => row.name,
            sortable: true,
         
        },
        {
            name: 'price',
            width:'70px',
            selector: row => row.currency?.symbol.concat(row.price),
            sortable: false,
        },
        {
            name: 'Validity',
            width:'80px',
            selector: row => row.validity,
            sortable: false,
        },
        {
            name: 'Actions',
            width:'100px',
            cell : (row) => (
                <button className='pu_btn ' style={{width:'80px', height:'30px', padding:'0px 10px'}} onClick={(e) =>{planAssign(row.id)}}>Select</button>
            )
        },
    ];
    
    const planAssign = (planId) =>{
        common.getAPI(
            {
                method: "POST",
                url: 'admin/assignPlan',
                data : {planId : planId, user_id : userID}
            },
            (resp) => {
                if (resp.status === 'success') {
                    fetchUsers()
                }
                setLoading(false);
            }
        );
    }

    const data = [];
    if(userList.length) {
        userList.forEach((item, index) => {
            const newItem = {
                id : item._id,
                name: item.name,
                userImg : item.profilePicture ? item.profilePicture.file : '',
                email: item.email,
                createdAt: common.dateFormatter(item.createdAt),
                validityDate : item.validityDate,
                status: item.status,
            }
            data.push(newItem);
        });
    }

    const userPopupCloseHandler = (e) => {
        setAddUserPopup(false);
        //Reset popup form start
        setTimeout(() => {
            manageIsEdit(false);
            setEditId('');
            setName('');
            setEmail('');
            setPassword('');
        }, 100);
    };

    const planPopupCloseHandler = (e) => {
        setAddPlanPopup(false);
        setTimeout(() => {
            setIsAssign(false)
            setEditId('');
            setEmail('');
        }, 100);
    };

    /* add user start */
    const addUserFormSubmit = (e) => {
        e.preventDefault();
        const emptyname = validator.isEmpty(name, {ignore_whitespace:true});
        const emptyemail = validator.isEmpty(email, {ignore_whitespace:true});
        const emptypassword = validator.isEmpty(password, {ignore_whitespace:true});
        const isemail = validator.isEmail(email);
        const passlength = validator.isLength(password, {min:5, max:15})
        if(emptyname || emptyemail || (emptypassword && !isEdit)){
            AlertMsg('error', 'Oops!', 'Field can not be empty!');
            return false;
        }else if(!isemail){
            AlertMsg('error', 'Oops!', 'Email Is not valid!');
            return false;
        }else if(!passlength && !isEdit || !passlength && password){
            AlertMsg('error', 'Oops!', 'Password should be between 5 to 15 characters.');
            return false;
        }else{
            const data = {
                name : name,
                email : email,
                password : password
            }
            if(isEdit === true){
                data.id = editId;
                if(password === '') delete data.password;
            }
            Loading(true);
            common.getAPI({
                method : 'POST',
                url : 'admin/updateUser',
                data : data
            }, (resp) => {
                if(resp.status === "success"){
                    userPopupCloseHandler();
                    setEditId('');
                    setName('');
                    setEmail('');
                    setPassword('');
                    fetchUsers(1);
                }
            })
        }
    }
    /* add user end */
    
    /* update user status start */
    const updateUserStatus = (id, status) => {
        if(id){
            dispatch(
                updateMyStatus({
                    url : 'admin/updateUserStatus',
                    user_id: id,
                    userStatus: status,
                })
            )
            const newUserList = [...userList];
            var userIndex = newUserList.findIndex((user => user._id == id));
            newUserList[userIndex].status = status;
            setUserList(newUserList);
        }
    }
    /* update user status end */

    /* edit user start */
    const getEditedData = (e, id) => {
        e.preventDefault();

        const newUserList = [...userList];
        var user = newUserList.find((user => user._id == id));
        if(user){
            manageIsEdit(true);
            setEditId(user._id)
            setName(user.name);
            setEmail(user.email);
            setAddUserPopup(true);
        }
    };
    /* edit user end */

    /* refresh user list after action start */
    const refreshUserList = () => {
        fetchUsers(1)
    }
    /* refresh user list after action end */

    /* delete user start */
    const deleteUser = (e, id) => {
        if(id){
            dispatch(confirmPopupStatus(true , {
                type : 'User',
                url : 'admin/deleteUser',
                data : {user_id: id},
                action : refreshUserList
            }));
        }
    }

    const assignPlan = (e, userData) => {
        e.preventDefault();

        setUserId(userData.id);
        setEmail(userData.email);
        common.getAPI(
            {
                method: "POST",
                url: 'auth/getPlans',
                data : {status : 1}
            },
            (resp) => {
                if (resp.status === 'success') {
                    setPlanList(resp.data);
                    setPlanCurrency(resp.currency);
                }
                setLoading(false);
            }
        );
        const newUserList = [...userList];
        var user = newUserList.find((user => user._id == userData.id));
        if(user){
            setIsAssign(true);
            setEditId(user?._id)
            setAddPlanPopup(true);
        }
    }
    /* delete user end */

    
    const otoname = [
        'FE',
        'OTO1',
        'OTO2',
        'OTO3',
        'OTO4',
      ];

    const handleOtoChange = (event) => {
        const {
            target: { value },
        } = event;
        setOtoName(
            typeof value === 'string' ? value.split(',') : value,
        );
    };

    const list = [];
    if (planList.length) {
        planList.forEach((item, index) => {
            const newItem = {
                id: item._id,
                name: item.planname,
                price: item.price,
                validity: item.validity,
                createdAt: common.dateFormatter(item.createdAt),
                status: item.status,
                currency: planCurrency
            }
            list.push(newItem);
        });
    }
    
    return (
        <>
            <div className="pu_container">
                <div className="pu_datatable_wrapper">
                    <div className="pu_pagetitle_wrapper">
                        <h3>Users ({totalRows})</h3>
                        <div className="pu_pagetitle_right">
                            <div className="pu_search_wrapper">
                                <input type="text" placeholder="Search" onKeyUp={handleSearchKeyupEvent} />
                                <span className="pu_search_icon">{svg.search_icon}</span>
                            </div>
                            <button className="pu_btn" onClick={(e) => setAddUserPopup(!addUserPopup)}>Add New User</button>
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
                heading={isEdit ? "Update User" : "Add New User"}
                show={addUserPopup}
                onClose={userPopupCloseHandler}
            >
                <form onSubmit={addUserFormSubmit}>
                    <div className="pu_input_wrapper">
                        <label>Name</label>
                        <input type="text" className="pu_input" name="name" value={name} onChange={(e) => setName(e.target.value)} />
                    </div>
                    <div className="pu_input_wrapper">
                        <label>Email</label>
                        <input type="text" className="pu_input" name="email" value={email} onChange={(e) => setEmail(e.target.value)} readOnly={isEdit ? true : false} disabled={isEdit ? true : false}/>
                    </div>
                    <div className="pu_input_wrapper">
                        <label>Password</label>
                        <input type="password" className="pu_input" name="password" value={password} onChange={(e) => setPassword(e.target.value)} />
                        {isEdit ? 
                            <div className="pu_input_info"><b>Note -</b> Keep the password field blank&#44; if you don&apos;t want to update the password.</div>
                        
                        : null}
                    </div>
                    {/* <div className="pu_input_wrapper">
                        <label>Select OTO</label>
                        <div className="pu_mui_select">
                            <FormControl fullWidth>
                                <Select
                                    multiple
                                    value={otoName}
                                    onChange={handleOtoChange}
                                    renderValue={(selected) => (
                                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                        {selected.map((value) => (
                                            <Chip key={value} label={value} />
                                        ))}
                                        </Box>
                                    )}
                                >
                                    {otoname.map((name) => (
                                        <MenuItem key={name} value={name}> {name} </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </div>
                    </div> */}
                    
                    <div className="text-center">
                        <button type="submit" className="pu_btn">{isEdit ? 'Update' : 'Add User'}</button>
                    </div>
                </form>
            </Popup>

            <Popup
                heading={isAssign ? 'Assign plan' : ''}
                subHeading={email}
                show={addplanpopup}
                onClose={planPopupCloseHandler}
            >
                 <DataTable
                        columns={planColumns}
                        data={list}

                    />
            </Popup>

        </>
    );
}
export default Users;
