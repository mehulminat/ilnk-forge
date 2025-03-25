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

const Plans = () => {

    const [planname, setPlanName] = useState('');
    const [price, setPlanPrice] = useState();
    const [validity, setValidity] = useState();

    const [addPlanPopup, setaddPlanPopup] = useState(false);
    let [isEdit, manageIsEdit] = useState(false);
    let [editId, setEditId] = useState('');

    const [planList, setPlanList] = useState([]);
    const [loading, setLoading] = useState(false);
    const [totalRows, setTotalRows] = useState(0);
    const [perPage, setPerPage] = useState(10);
    const [searchTerm, setSearchTerm] = useState('');
    const [currencyCode, setCurrencyCode] = useState({});

    let dispatch = useDispatch();
    useEffect(() => {
        dispatch(setPageHeading({
            pageHeading: "Plans",
            title: "Plans",
        }));
    }, [dispatch]);

    const fetchPlans = async (page, listPerPage = perPage, nchange = false) => {
        setLoading(true);
        common.getAPI(
            {
                method: "POST",
                url: 'auth/getPlans',
                data: { page: page, listPerPage: listPerPage, searchTerm: searchTerm }
            },
            (resp) => {
                if (resp.status === 'success') {
                    setPlanList(resp.data);
                    setPerPage(listPerPage);
                    setTotalRows(resp.totalPlan);
                }
                setLoading(false);
            }
        );
    };
    const handlePageChange = (page) => {
        fetchPlans(page);
    };
    const handlePerRowsChange = async (newPerPage, page) => {
        setLoading(true);
        fetchPlans(page, newPerPage, true);
    }
    const handleSearchKeyupEvent = async (e) => {
        let t = e.target;
        let searchTerm = t.value;
        setSearchTerm(searchTerm);
        if (e.keyCode === 13) {
            fetchPlans(1);
        }
    }

    useEffect(() => {
        fetchPlans(1);
    }, []);

    const columns = [
        {
            name: '#S.N.',
            width: '100px',
            center: true,
            cell: (row, index) => (<span>{'#' + (index + 1)}</span>)
        },
        {
            name: 'Plan Name',
            selector: row => row.name,
            sortable: true,
            cell: (row) => (
                <div className="pu_avatarName_wrapper">
                    <div className="pu_avatar_icon">
                        <span className="pu_avatar_initial">{getNameInitials(row.name)}</span>
                    </div>
                    <div className="pu_avatar_name">{row.name}</div>
                </div>
            )
        },
        {
            name: 'price',
            selector: row => row.price,
            sortable: true,
        },

        {
            name: 'Created Date',
            selector: row => row.createdAt,
            sortable: true,
        },
        {
            name: 'Status',
            selector: row => row.status,
            sortable: true,
            cell: (row, index) => (
                <div className="pu_switch">
                        <input
                            id={'planChk_' + index}
                            type="checkbox"
                            value={row.status}
                            defaultChecked={row.status === 1 ? true : false}
                            onClick={(e) => updatePlanStatus(row.id, (row.status === 1 ? 0 : 1))}
                        />
                    <label htmlFor={'planChk_' + index}>
                        <span className="pu_switch_icon"></span>
                        <span className="pu_switch_text">{row.status === 1 ? 'Active' : 'Inactive'}</span>
                    </label>
                </div>
            )
        },
        {
            name: 'Actions',
            cell: (row) => (
                <div className="pu_datatable_btns">
                    <Tooltip title="Edit" placement="top" arrow>
                        <a onClick={(e) => getEditedData(e, row.id)} className="pu_dt_btn edit">{svg.dt_edit_icon}</a>
                    </Tooltip>
                    {row.price !== 'demouser@linkforge.fun' ?
                        <Tooltip title="Delete" placement="top" arrow>
                            <a onClick={(e) => deletePlan(e, row.id)} className="pu_dt_btn delete">{svg.dt_delete_icon}</a>
                        </Tooltip> : null
                    }
                </div>
            )
        },

    ];

    const data = [];
    if (planList.length) {
        planList.forEach((item, index) => {
            const newItem = {
                id: item._id,
                name: item.planname,
                price: item.price,
                validity: item.validity,
                createdAt: common.dateFormatter(item.createdAt),
                status: item.status,
            }
            data.push(newItem);
        });
    }

    const planPopupCloseHandler = (e) => {
        setaddPlanPopup(false);
        //Reset popup form start
        setTimeout(() => {
            manageIsEdit(false);
            setEditId('');
            setPlanName('');
            setPlanPrice('');
            setValidity('');
        }, 100);
    };

    /* add plan start */
    const addPlanFormSubmit = (e) => {
        e.preventDefault();
        const emptyplan = validator.isEmpty(planname, { ignore_whitespace: true });

        if (emptyplan || !price || !validity) {
            AlertMsg('error', 'Oops!', 'Field can not be empty!');
            return false;
        } else {
            const data = {
                planname: planname,
                price: price,
                validity: validity,
                currency : currencyCode
            }
            if (isEdit === true) {
                data.id = editId;
            }

            Loading(true);
            common.getAPI({
                method: 'POST',
                url: 'admin/addPlan',
                data: data
            }, (resp) => {
                if (resp.status === "success") {
                    planPopupCloseHandler();
                    setEditId('');
                    setPlanName('');
                    setPlanPrice('');
                    setCurrencyCode({})
                    setValidity('');
                    fetchPlans(1);
                }
            })
        }
    }
    /* add plan end */

    /* update plan status start */
    const updatePlanStatus = (id, status) => {
        if (id) {
            dispatch(
                updateMyStatus({
                    url: 'admin/updatePlanStatus',
                    plan_id: id,
                    planStatus: status,
                })
            )
            const newplanList = [...planList];
            var PlanIndex = newplanList.findIndex((plan => plan._id == id));
            newplanList[PlanIndex].status = status;
            setPlanList(newplanList);
        }
    }
    /* update plan status end */

    /* edit plan start */
    const getEditedData = (e, id) => {
        e.preventDefault();

        const newplanList = [...planList];
        var plan = newplanList.find((plan => plan._id == id));
        if (plan) {
            manageIsEdit(true);
            setEditId(plan._id)
            setPlanName(plan.planname);
            setPlanPrice(plan.price);
            setValidity(plan.validity)
            setaddPlanPopup(true);
        }
    };
    /* edit plan end */

    /* refresh plan list after action start */
    const refreshplanList = () => {
        fetchPlans(1)
    }
    /* refresh plan list after action end */

    /* delete plan start */
    const deletePlan = (e, id) => {
        if (id) {
            dispatch(confirmPopupStatus(true, {
                type: 'Plan',
                url: 'admin/deletePlan',
                data: { plan_id: id },
                action: refreshplanList
            }));
        }
    }
    /* delete plan end */
    
    return (
        <>
            <div className="pu_container">
                <div className="pu_datatable_wrapper">
                    <div className="pu_pagetitle_wrapper">
                        <h3>Plans ({totalRows})</h3>
                        <div className="pu_pagetitle_right">
                            <div className="pu_search_wrapper">
                                <input type="text" placeholder="Search" onKeyUp={handleSearchKeyupEvent} />
                                <span className="pu_search_icon">{svg.search_icon}</span>
                            </div>
                            <button className="pu_btn" onClick={(e) => setaddPlanPopup(!addPlanPopup)}>Add New Plan</button>
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
                heading={isEdit ? "Update Plan" : "Add New Plan"}
                show={addPlanPopup}
                onClose={planPopupCloseHandler}
            >
                <form onSubmit={addPlanFormSubmit}>
                    <div className="pu_input_wrapper">
                        <label>Plan Name</label>
                        <input type="text" className="pu_input" name="planname" value={planname} onChange={(e) => setPlanName(e.target.value)} />
                    </div>
                    <div className="pu_input_wrapper">
                        <label>Price</label>
                        <input type="number" className="pu_input" name="price" value={price} onChange={(e) => setPlanPrice(e.target.value)} />
                    </div>
                    <div className="pu_input_wrapper">
                        <label>Validity in days</label>
                        <input type="number" className="pu_input" name="validity" value={validity} onChange={(e) => setValidity(e.target.value)} />
                    </div>

                    <div className="text-center">
                        <button type="submit" className="pu_btn">{isEdit ? 'Update' : 'Add Plan'}</button>
                    </div>
                </form>
            </Popup>

        </>
    );
}
export default Plans;
