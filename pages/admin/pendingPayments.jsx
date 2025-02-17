import { useEffect, useState } from 'react';
import DataTable from 'react-data-table-component';
import { useDispatch } from 'react-redux';
import { common } from '../../src/helper/Common';
import { setPageHeading, updateMyStatus, confirmPopupStatus } from '../../src/redux/actions/commonAction';
import validator from 'validator';

import { AlertMsg, Loading } from '../../src/helper/helper';
import Popup from '../../src/components/common/popup/Popup';
import { Tooltip } from '@mui/material';
import svg from '../../src/helper/svg';

const Plans = () => {

    const [planname, setPlanName] = useState('');
    const [price, setPlanPrice] = useState();
    const [validity, setValidity] = useState();

    const [addPlanPopup, setaddPlanPopup] = useState(false);
    let [isEdit, manageIsEdit] = useState(false);
    let [editId, setEditId] = useState('');

    const [pendingPayments, setPendingPayments] = useState([]);
    const [loading, setLoading] = useState(false);
    const [totalRows, setTotalRows] = useState(0);
    const [perPage, setPerPage] = useState(10);
    const [searchTerm, setSearchTerm] = useState('');
    const [currencyCode, setCurrencyCode] = useState({});

    let dispatch = useDispatch();
    useEffect(() => {
        dispatch(setPageHeading({
            pageHeading: "Pending payments",
            title: "Pending payments",
        }));
    }, [dispatch]);

    const fetchPayments = async (page, listPerPage = perPage, nchange = false) => {
        setLoading(true);
        common.getAPI(
            {
                method: "POST",
                url: 'admin/getPendingPayments',
                data: { page: page, listPerPage: listPerPage, searchTerm: searchTerm }
            },
            (resp) => {
                if (resp.status === 'success') {
                    setPendingPayments(resp.data);
                    setPerPage(listPerPage);
                    setTotalRows(resp.totalcount);
                }
                setLoading(false);
            }
        );
    };
    const handlePageChange = (page) => {
        fetchPayments(page);
    };
    const handlePerRowsChange = async (newPerPage, page) => {
        setLoading(true);
        fetchPayments(page, newPerPage, true);
    }
    const handleSearchKeyupEvent = async (e) => {
        let t = e.target;
        let searchTerm = t.value;
        setSearchTerm(searchTerm);
        if (e.keyCode === 13) {
            fetchPayments(1);
        }
    }

    useEffect(() => {
        fetchPayments(1);
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
            selector: row => row.title,
            sortable: true,
        },
        {
            name: 'Customer Name',
            selector: row => row.customerName,
            sortable: true,
        },
        {
            name: 'Customer Email',
            selector: row => row.email,
            sortable: true,
        },
        {
            name: 'Transaction ID',
            selector: row => row.transactionId,
            sortable: true,
        },

        {
            name: 'Payment Date',
            selector: row => row.createdAt,
            sortable: true,
        },
        // {
        //     name: 'Status',
        //     selector: row => row.status,
        //     sortable: true,
            
        // },
        {
            name: 'Actions',
            cell: (row, index) => (
                <div className="pu_switch">
                        <input
                            id={'planChk_' + index}
                            type="checkbox"
                            value={row.status}
                            defaultChecked={row.status === 1 ? true : false}
                            onClick={(e) => updatePlanStatus(row.id, (row.status === 'Pending' ? 'Approved' : 'Pending'))}
                        />
                    <label htmlFor={'planChk_' + index}>
                        <span className="pu_switch_icon"></span>
                        <span className="pu_switch_text">{row.paymentStatus === 'Pending' ? 'Pending' : 'Approved'}</span>
                    </label>
                </div>
            )
            // cell: (row) => (
            //     <div className="pu_datatable_btns">
            //         <Tooltip title="Edit" placement="top" arrow>
            //             <a onClick={(e) => getEditedData(e, row.id)} className="pu_dt_btn edit">{svg.dt_edit_icon}</a>
            //         </Tooltip>
            //     </div>
            // )
        },
    ];

    const data = [];
    if (pendingPayments.length) {
        pendingPayments.forEach((item, index) => {
            const newItem = {
                id: item._id,
                title: item.title,
                transactionId: item.invoice_id,
                customerName: item.customer_id.name,
                email: item.customer_id.email,
                paymentStatus : item.paymentStatus,
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
                    fetchPayments(1);
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
                    url: 'admin/updatePaymentStatus',
                    payment_id: id,
                })
            )
            const newpendingPayments = [...pendingPayments];
            var PlanIndex = newpendingPayments.findIndex((plan => plan._id == id));
            newpendingPayments[PlanIndex].status = status;
            setPendingPayments(newpendingPayments);
            setTimeout(() => {
                fetchPayments()
            }, 500);
        }
    }



    const getEditedData = (e, id) => {
        e.preventDefault();

        const newpendingPayments = [...pendingPayments];
        var payment = newpendingPayments.find((payment => payment._id == id));
        if (payment) {
            manageIsEdit(true);
            setEditId(payment._id)
            setPlanName(payment.planname);
            setValidity(payment.transactionId)
            setaddPlanPopup(true);
        }
    };
    /* update plan status end */
    
    return (
        <>
            <div className="pu_container">
                <div className="pu_datatable_wrapper">
                    <div className="pu_pagetitle_wrapper">
                        <h3>Pending Payments ({totalRows})</h3>
                        {/* <div className="pu_pagetitle_right">
                            <div className="pu_search_wrapper">
                                <input type="text" placeholder="Search" onKeyUp={handleSearchKeyupEvent} />
                                <span className="pu_search_icon">{svg.search_icon}</span>
                            </div>
                        </div> */}
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
