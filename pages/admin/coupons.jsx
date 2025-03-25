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

const Coupons = () => {

    const [couponName, setCouponName] = useState('');
    const [couponCode, setCouponCode] = useState('');
    const [discountType, setDiscountType] = useState('');
    const [discount, setDiscount] = useState('');

    const [addCouponPopup, setAddCouponPopup] = useState(false);
    let [isEdit, manageIsEdit] = useState(false);
    let [editId, setEditId] = useState('');

    const [couponList, setCouponList] = useState([]);
    const [loading, setLoading] = useState(false);
    const [totalRows, setTotalRows] = useState(0);
    const [perPage, setPerPage] = useState(10);
    const [searchTerm, setSearchTerm] = useState('');
    const [duration, setDuration] = useState('')
    const [minAmount,setMinAmount] = useState('')
    let dispatch = useDispatch();
    useEffect(() => {
        dispatch(setPageHeading({
            pageHeading: "Coupons",
            title: "Coupons",
        }));
    }, [dispatch]);

    const fetchCoupons = async (page, listPerPage = perPage, nchange = false) => {
        setLoading(true);
        common.getAPI(
            {
                method: "POST",
                url: 'auth/getCoupons',
                data: { page: page, listPerPage: listPerPage, searchTerm: searchTerm }
            },
            (resp) => {
                if (resp.status === 'success') {
                    setCouponList(resp.data);
                    setPerPage(listPerPage);
                    setTotalRows(resp.totalCoupons);
                }
                setLoading(false);
            }
        );
    };
    const handlePageChange = (page) => {
        fetchCoupons(page);
    };
    const handlePerRowsChange = async (newPerPage, page) => {
        setLoading(true);
        fetchCoupons(page, newPerPage, true);
    }
    const handleSearchKeyupEvent = async (e) => {
        let t = e.target;
        let searchTerm = t.value;
        setSearchTerm(searchTerm);
        if (e.keyCode === 13) {
            fetchCoupons(1);
        }
    }

    useEffect(() => {
        fetchCoupons(1);
    }, []);

    const columns = [
        {
            name: '#S.N.',
            width: '80px',
            center: true,
            cell: (row, index) => (<span>{'#' + (index + 1)}</span>)
        },
        {
            name: 'Coupon Name',
            width: '160px',
            selector: row => row.name,
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
            name: 'Coupon Code',
            selector: row => row.couponCode,
        },
        {
            name: 'Discount Type',
            selector: row => row.discountType,
        },
        {
            name: 'Discount',
            width: '110px',
            selector: row => row.discount,
        },
        {
            name: 'Duration',
            width: '110px',
            selector: row => row.duration,
        },

        {
            name: 'Created Date',
            selector: row => row.createdAt,
        },
        {
            name: 'Status',
            width: '150px',
            selector: row => row.status,
            cell: (row, index) => (
                <div className="pu_switch">
                        <input
                            id={'couponChk_' + index}
                            type="checkbox"
                            value={row.status}
                            defaultChecked={row.status === 1 ? true : false}
                            onClick={(e) => updateCouponstatus(row.id, (row.status === 1 ? 0 : 1))}
                        />
                    <label htmlFor={'couponChk_' + index}>
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
                    {row.couponCode !== 'demouser@linkforge.fun' ?
                        <Tooltip title="Delete" placement="top" arrow>
                            <a onClick={(e) => deletecoupon(e, row.id)} className="pu_dt_btn delete">{svg.dt_delete_icon}</a>
                        </Tooltip> : null
                    }
                </div>
            )
        },

    ];

    const data = [];
    if (couponList.length) {
        couponList.forEach((item, index) => {
            const newItem = {
                id: item._id,
                name: item.couponName,
                couponCode: item.couponCode,
                discountType: item.discountType,
                discount: item.discount,
                duration: (item.duration != undefined && item.duration != '') ? item.duration : '-',
                createdAt: common.dateFormatter(item.createdAt),
                status: item.status,
            }
            data.push(newItem);
        });
    }

    const couponPopupCloseHandler = (e) => {
        setAddCouponPopup(false);
        //Reset popup form start
        setTimeout(() => {
            manageIsEdit(false);
            setEditId('');
            setCouponName('');
            setCouponCode('');
            setDiscount('');
            setDiscountType('');
            setDuration('');
            setMinAmount('');
        }, 100);
    };

    /* add coupon start */
    const addcouponFormSubmit = (e) => {
        e.preventDefault();
        const emptycoupon = validator.isEmpty(couponName, { ignore_whitespace: true });

        if (emptycoupon || !couponCode || !discount || !discountType)  {
            AlertMsg('error', 'Oops!', 'Field can not be empty!');
            return false;
        } else {
            const data = {
                couponName: couponName,
                couponCode: couponCode.toUpperCase(),
                duration : duration,
                discount: discount,
                discountType : discountType,
                minAmount: minAmount
            }
            if (isEdit === true) {
                data.id = editId;
            }

            Loading(true);
            common.getAPI({
                method: 'POST',
                url: 'admin/addCoupon',
                data: data
            }, (resp) => {
                if (resp.status === "success") {
                    couponPopupCloseHandler();
                    setEditId('');
                    setCouponName('');
                    setCouponCode('');
                    setDiscountType('')
                    setDiscount('');
                    setDuration('');
                    setMinAmount('');
                    fetchCoupons(1);
                }
            })
        }
    }
    /* add coupon end */

    /* update coupon status start */
    const updateCouponstatus = (id, status) => {
        if (id) {
            dispatch(
                updateMyStatus({
                    url: 'admin/updateCouponStatus',
                    coupon_id: id,
                    couponStatus: status,
                })
            )
            const newcouponList = [...couponList];
            var couponIndex = newcouponList.findIndex((coupon => coupon._id == id));
            newcouponList[couponIndex].status = status;
            setCouponList(newcouponList);
        }
    }
    /* update coupon status end */

    /* edit coupon start */
    const getEditedData = (e, id) => {
        e.preventDefault();

        const newcouponList = [...couponList];
        var coupon = newcouponList.find((coupon => coupon._id == id));
        if (coupon) {
            manageIsEdit(true);
            setEditId(coupon._id)
            setCouponName(coupon.couponName);
            setCouponCode(coupon.couponCode);
            setDiscount(coupon.discount)
            setDiscountType(coupon.discountType)
            setDuration(coupon.duration)
            setMinAmount(coupon.minAmount)
            setAddCouponPopup(true);
        }
    };
    /* edit coupon end */

    /* refresh coupon list after action start */
    const refreshcouponList = () => {
        fetchCoupons(1)
    }
    /* refresh coupon list after action end */

    /* delete coupon start */
    const deletecoupon = (e, id) => {
        if (id) {
            dispatch(confirmPopupStatus(true, {
                type: 'Coupon',
                url: 'admin/deleteCoupon',
                data: { coupon_id: id },
                action: refreshcouponList
            }));
        }
    }
    /* delete coupon end */
    
    return (
        <>
            <div className="pu_container">
                <div className="pu_datatable_wrapper">
                    <div className="pu_pagetitle_wrapper">
                        <h3>Coupons ({totalRows})</h3>
                        <div className="pu_pagetitle_right">
                            <div className="pu_search_wrapper">
                                <input type="text" placeholder="Search" onKeyUp={handleSearchKeyupEvent} />
                                <span className="pu_search_icon">{svg.search_icon}</span>
                            </div>
                            <button className="pu_btn" onClick={(e) => setAddCouponPopup(!addCouponPopup)}>Add New coupon</button>
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
                heading={isEdit ? "Update coupon" : "Add New coupon"}
                show={addCouponPopup}
                onClose={couponPopupCloseHandler}
            >
                <form onSubmit={addcouponFormSubmit}>
                    <div className="pu_input_wrapper">
                        <label>Coupon Name</label>
                        <input type="text" className="pu_input" name="couponName" value={couponName} onChange={(e) => setCouponName(e.target.value)} />
                    </div>
                    <div className="pu_input_wrapper">
                        <label>Coupon Code</label>
                        <input style={{textTransform:'uppercase'}} type="text" className="pu_input" name="couponCode" value={couponCode} onChange={(e) => setCouponCode(e.target.value)} />
                    </div>
                    <div className="pu_input_wrapper">
                        <label>Duration</label>
                            <select className=" pu_input" value={duration} onChange={(e) => setDuration(e.target.value)}>
                                <option>Select duration time</option>
                                <option value={'Forever'}>Forever</option>
                                <option value={'Once per user'}>Once per user</option>
                            </select>
                    </div>
                    <div className="pu_input_wrapper">
                        <label>Type Of Discount</label>
                            <select className=" pu_input" value={discountType} onChange={(e) => setDiscountType(e.target.value)}>
                                <option>Select discount type</option>
                                <option value={'By Percentage'}>By Percentage</option>
                                <option value={'By Price'}>By Price</option>
                            </select>
                    </div>
                    <div className="pu_input_wrapper">
                        <label>Discount</label>
                        <input type="number" className="pu_input" name="discount" value={discount} onChange={(e) => setDiscount(e.target.value)} />
                    </div>
                    <div className="pu_input_wrapper">
                        <label>Apply on minimum order value</label>
                        <input type="text" className="pu_input" name="minAmount" value={minAmount} onChange={(e) => setMinAmount(e.target.value)} />
                    </div>

                    <div className="text-center">
                        <button type="submit" className="pu_btn">{isEdit ? 'Update' : 'Add coupon'}</button>
                    </div>
                </form>
            </Popup>

        </>
    );
}
export default Coupons;
