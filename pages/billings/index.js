import { useEffect, useState } from 'react';
import DataTable from 'react-data-table-component';
import { useDispatch } from 'react-redux';
import { common } from '../../src/helper/Common';
import { setPageHeading } from '../../src/redux/actions/commonAction';
import moment from 'moment';
import svg from '../../src/helper/svg';
import { Tooltip } from '@mui/material';

const Billings = () => {
    const [orderList, setOrderList] = useState([]);
    const [loading, setLoading] = useState(false);
    const [totalRows, setTotalRows] = useState(0);
    const [perPage, setPerPage] = useState(10);
    const [searchTerm, setSearchTerm] = useState('');
    const [expiresDate, setExpireDate] = useState([]);

    let dispatch = useDispatch();
    useEffect(() => {
        dispatch(setPageHeading({
            pageHeading: "Billing History",
            title: "Billing History",
        }));
    }, [dispatch]);

    const fetchBillings = async (page, listPerPage=perPage, nchange=false) => {
        setLoading(true);
        common.getAPI(
            {
                method: "POST",
                url: 'user/getBillingHistory',
                data: {page: page, listPerPage: listPerPage, searchTerm: searchTerm}
            },
            (resp) => {
                if(resp.status === 'success'){
                    setOrderList(resp?.data);
                    setPerPage(listPerPage);
                    setExpireDate(resp?.expireDate)
                    setTotalRows(resp?.totalOrders);
                }
                setLoading(false);
            }
        );
    };
    const handlePageChange = (page) => {
		fetchBillings(page);
	};
    const handlePerRowsChange = async (newPerPage, page) => {
        setLoading(true);
        fetchBillings(page, newPerPage, true);
    }

    useEffect(() => {
        fetchBillings(1);
    }, []);

    const deleteInvoiceFile = (name) => {
        common.getAPI(
            {
                method: "POST",
                url: 'user/deleteInvoiceFile',
                data: { name }
            },
            async (resp) => {
                // console.log(resp);
            }
        );
    }

    const handleDownloadFile = (filedata) => {
        fetch(`${process.env.APP_URL.concat(`/${filedata.filePath}`)}`).then((response) => {
            response.blob().then((blob) => {
                // Creating new object of PDF file
                const fileURL = window.URL.createObjectURL(blob);
                     
                let alink = document.createElement("a");
                alink.href = fileURL;
                alink.download = "invoice.pdf";
                alink.click();
                deleteInvoiceFile(filedata.fileName);
            });
        });
    }

    const handleInvoiceDownload = async (invoiceData) => {
        if(invoiceData.paymentMethod == 'PayPal' || invoiceData.paymentMethod == 'Bank Transfer' || invoiceData.paymentMethod == 'Razorpay') {
            common.getAPI(
                {
                    method: "POST",
                    url: 'user/downloadInvoice',
                    data: { id: invoiceData.id }
                },
                async (resp) => {
                    setLoading(false);
                    if(resp.status == 'success') {
                        handleDownloadFile(resp.data);
                    }
                }
            );
        } else {
            let alink = document.createElement('a');
            alink.href = invoiceData.invoice_url;
            alink.setAttribute('target', '_blank');
            alink.click();
        }
    }

    const columns = [
        {
            name: '#S.N.',
            width : '80px',
            center : true,
            cell : (row, index) => (<span>{'#'+(index + 1)}</span>)
        },
        {
            name: 'Plan Name',
            width: '130px',
            selector: row => row.title,
            sortable: true,
        },
        {
            name: 'Amount',
            width: '110px',
            selector: row => row.amount,
            sortable: true,
        },
        {
            name: 'Currency',
            width: '115px',
            selector: row => row.currency.toUpperCase(),
            sortable: true,
        },
        {
            name: 'Payment Status',
            selector: row => row.paymentStatus,
            sortable: true,
        },
        {
            name: 'Payment Method',
            width: '100px',
            selector: row => row.paymentMethod,
            sortable: true,
        },
        {
            name : 'Coupon',
            selector : row => row.couponCode ,
        },
        {
            name: 'Validity',
            width: '100px',
            selector: row => row.validity + ' Days',
            sortable: true,
        },
        {
            name: 'Purchased Date',
            selector: row => row.createdAt,
            sortable: true,
        },
        {
            name: 'Invoice',
            width: '100px',
            selector: row => row.invoice_url,
            sortable: true,
            cell : (row, index) => (
                <div className="pu_datatable_btns">
                    {row.invoice_url === 'AdminAssigned' || row.paymentStatus == 'Pending'
                    ? 'No Invoice' 
                    :
                    <Tooltip title="Download" placement="top" arrow>
                        <a href={void(0)} className="pu_dt_btn download" onClick={() => handleInvoiceDownload(row)}>{svg.download}</a>
                    </Tooltip>
                    }
               </div>
            )
        },
        
    ];

    const data = [];
    if(orderList.length) {
        orderList.forEach((item, index) => {
            const newItem = {
                id : item._id,
                title: item.title,
                amount: item.amount,
                currency: item.currency,
                validity: item.validity,
                paymentStatus:item.paymentStatus,
                paymentMethod:item.paymentMethod,
                invoice_url:item.invoice_url,
                couponCode : (item.couponCode != undefined && item.couponCode !='') ? item.couponCode : '-',
                createdAt: common.dateFormatter(item.createdAt),
            }
            data.push(newItem);
        });
    }
    
    return (
        <>
            <div className="pu_container">
                <div className="pu_datatable_wrapper">
                    <div className="pu_pagetitle_wrapper">
                        <div>
                        <h3>Payment History ({totalRows})</h3>
                        {expiresDate ? <h4>Your plan will expire on ( {moment(expiresDate).format("DD-MMM-YYYY")} )</h4> :''}
                        </div>
                        <div className="pu_pagetitle_right">
                            <div className="pu_search_wrapper">
                                
                            </div>
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

        </>
    );
}
export default Billings;
