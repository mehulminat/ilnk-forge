import { Pagination, Tooltip } from '@mui/material';
import { useEffect, useState } from 'react';
import { common } from '../../../helper/Common';
import { AlertMsg, getNameInitials } from '../../../helper/helper';
import svg from '../../../helper/Logo';
import styles from './LinkList.module.css';
import Link from 'next/link';
import { confirmPopupStatus, updateMyStatus } from '../../../redux/actions/commonAction';
import { useDispatch } from 'react-redux';
import RenameIcon from '../rename_icon/RenameIcon';

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
                url: 'user/getCampaigns',
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

    /* delete link start */
    const deleteLink = (id) => {
        if(id){
            dispatch(confirmPopupStatus(true , {
                type : 'Link',
                url : 'user/deleteCampaign',
                data : {id : id},
                action : refreshLinkList
            }));
        }
    }
    /* delete link end */
    
    /* duplicate link start */
    const duplicateLink = (id) => {
        if(id){
            common.getAPI({
                method: "POST",
                url: 'user/duplicateCampaign',
                data: {id}
            },
            (resp) => {
                if(resp.status === 'success'){
                    fetchLinks(1);
                }
            });
        }
    }
    /* duplicate link end */

    /* refresh link list after action start */
    const refreshLinkList = () => {
        fetchLinks(1)
    }
    /* refresh link list after action end */

    /* update link status start */
    const updateLinkStatus = (id, status) => {
        if(id){
            dispatch(
                updateMyStatus({
                    url : 'user/updateCampaignStatus',
                    id: id,
                    campaignStatus: status,
                })
            )
            const newLinkList = [...linkList];
            var linkIndex = newLinkList.findIndex((link => link._id == id));
            newLinkList[linkIndex].status = status;
            setLinkList(newLinkList);
        }
    }
    /* update link status end */

    const actionToggle = (id) => {
        if(activeActionID === id){
            setActiveActionID('');
        }else{
            setActiveActionID(id);
        }
    }

    return (
        <>
            <div className={styles.linklist_wrapper}>
                {linkList.map((link) =>
                    <div key={link._id} className={styles.linklist_item +' '+ (activeActionID === link._id ? styles.action_active : '')}>
                        <div className={styles.linklist_image}>
                            {link.profile.image ? 
                                <img src={link.profile.image} alt="" />
                                : <span className={styles.linklist_avatar_initials}>{getNameInitials(link.profile.name)}</span>
                            }
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
                            </div>
                        </div>
                        <div className={styles.link_action_toggle} onClick={() => actionToggle(link._id)}>
                            <span></span>
                            <span></span>
                            <span></span>
                        </div>
                        
                        <div className={styles.linklist_action}>
                            {/* <Tooltip title="Analytics" placement="top" arrow>
                                <div className={styles.analytics_link}>{svg.icon_analytics}</div>
                            </Tooltip> */}
                            <Link href={'/edit/'+link._id}><a className={"pu_btn pu_btn_link " + styles.pu_btn}>Edit</a></Link>
                            <div className="pu_switch">
                                <input 
                                    type="checkbox" 
                                    id={'chk_'+ link._id}
                                    value={link.status} 
                                    defaultChecked={link.status === 1 ? true : false} 
                                    onClick={(e) => updateLinkStatus(link._id, (link.status === 1 ? 0 : 1))}
                                />
                                <label htmlFor={'chk_'+ link._id}>
                                    <div className="pu_switch_icon"></div>
                                </label>
                            </div>
                            <Tooltip title="Clone Link" placement="top" arrow>
                                <div className="pu_btn_icon" onClick={() => duplicateLink(link._id)}>{svg.icon_duplicate}</div>
                            </Tooltip>
                            <Tooltip title="Delete" placement="top" arrow>
                                <div className="pu_btn_icon" onClick={() => deleteLink(link._id)}>{svg.icon_delete}</div>
                            </Tooltip>
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