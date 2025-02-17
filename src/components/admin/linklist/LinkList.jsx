import { Pagination, Tooltip } from '@mui/material';
import { useEffect, useState } from 'react';
import { common } from '../../../helper/Common';
import { AlertMsg, getNameInitials } from '../../../helper/helper';
import svg from '../../../helper/svg';
import styles from './LinkList.module.css';
import Link from 'next/link';
import { confirmPopupStatus, updateMyStatus } from '../../../redux/actions/commonAction';
import { useDispatch } from 'react-redux';
import RenameIcon from '../../common/rename_icon/RenameIcon';

const LinkList = (props) => {
    let dispatch = useDispatch();
    const [linkList, setLinkList] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [perPage, setPerPage] = useState(10);
    /* const [totalRows, setTotalRows] = useState(0); */
    const [activeActionID, setActiveActionID] = useState('');
    const [pageNo, setPageNo] = useState(1);
    const [totalPageCount, setTotalPageCount] = useState(0);

    const [noData, setNoData] = useState(false);
    
    /* get template start */
    const fetchLinks = async (page, listPerPage=perPage, nchange=false) => {
        common.getAPI(
            {
                method: "POST",
                url: 'admin/getAllCampaigns',
                data: {page, listPerPage: listPerPage, searchTerm: searchTerm}
            },
            (resp) => {
                if(resp.status === "success"){
                    setLinkList(resp.data);
                    setTotalPageCount(resp.pageCounts); 
                    if(!resp.data.length > 0){
                        setNoData(true);
                    }else{
                        setNoData(false);
                    }
                    if(props.setLinkCount){
                        props.setLinkCount(resp.totalCampaigns);
                    }
                }
            }
        );
    };
    /* get template end */

    const handlePageChange = (event, value) => {
        setPageNo(value);
        fetchLinks(value);
    };
    useEffect(() => {
        fetchLinks(1);
    }, []);

    const copyURL = (url) => {
        navigator.clipboard.writeText(url);
        AlertMsg('success', 'Successfully!', 'Link Copied!');
    }
    
    /* refresh link list after action start */
    const refreshLinkList = () => {
        fetchLinks(1)
    }
    /* refresh link list after action end */

    return (
        <>
            <div className={styles.linklist_wrapper}>
                {linkList.map((link) =>
                    <div key={link._id} className={styles.linklist_item +' '+ (activeActionID === link._id ? styles.action_active : '')}>
                        <div className={styles.linklist_image}>
                            <span className={styles.linklist_avatar_initials}>{link.userDetails.length ? getNameInitials(link.userDetails[0].name) : ''}</span>
                            {/* {link.profile.image ? 
                                <img src={process.env.s3URL + link.profile.image} alt="" />
                                : <span className={styles.linklist_avatar_initials}>{getNameInitials(link.profile.name)}</span>
                            } */}
                        </div>
                        <div className={styles.linklist_details}>
                            <h3>
                                {link.title} 
                                <RenameIcon id={link._id} title={link.title} callBack={refreshLinkList} />
                                </h3>
                            <p>
                                <a href={process.env.APP_URL + link.slug} target="_blank" rel="noreferrer">{process.env.APP_URL + link.slug}</a>
                                <Tooltip title="Copy URL" placement="top" arrow>
                                    <span className={styles.linklist_copylink} onClick={() => copyURL(process.env.APP_URL + link.slug)}>{svg.icon_duplicate}</span>
                                </Tooltip>
                            </p>
                            <div className={styles.linklist_analytics}>
                                <div className={styles.linklist_analytics_item}>
                                    {svg.link_visitor} Visitor <span>({link.totalVisits ? link.totalVisits : 0})</span>
                                </div>
                                <div className={styles.linklist_analytics_item}>
                                    {svg.link_click} Clicks <span>({link.totalClicks ? link.totalClicks : 0})</span>
                                </div>
                                <div className={styles.linklist_analytics_item}>
                                    By - <span>{link.userDetails.length ? getNameInitials(link.userDetails[0].name) : ''}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
                {noData ? 
                    <div className="pu_noData">
                        <span>{svg.noData}</span>
                        <h3>No Records Found.</h3>
                        <p>Create a new link, and your link will be displayed here.</p>
                    </div> : null
                }
            </div>
            {totalPageCount ? 
                <Pagination count={totalPageCount} page={pageNo} onChange={handlePageChange} />
                : null
            }
        </>
    );
}

export default LinkList;
