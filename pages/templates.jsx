import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { common } from "../src/helper/Common";
import svg from "../src/helper/svg";
import { resetCreateLinkDataACT, setPageHeading } from '../src/redux/actions/commonAction';
import styles from '../styles/pages/Template.module.css';
import Popup from "../src/components/common/popup/Popup";
import validator from 'validator';
import { AlertMsg } from "../src/helper/helper";
import {useRouter} from 'next/router';
import { Pagination } from "@mui/material";

const Templates = () => {
    let dispatch = useDispatch();
    const router = useRouter();
    const [pageTitle, setPageTitle] = useState('Templates');
    useEffect(() => {
        dispatch(setPageHeading({
            pageHeading: "PixaURL - " + pageTitle,
            title: "PixaURL - " + pageTitle,
        }));
    }, [dispatch]);

    const [categoryList, setCategoryList] = useState([]);
    const [templateList, setTemplateList] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');

    const [name, setName] = useState('');
    const [tempId, setTempId] = useState('');
    
    const [createLinkPopup , setCreateLinkPopup] = useState(false);

    const [perPage, setPerPage] = useState(15);
    const [pageNo, setPageNo] = useState(1);
    const [totalPageCount, setTotalPageCount] = useState(0);

    const [templateCount, setTemplateCount] = useState(0);
    const [noData, setNoData] = useState(false);

    const [filterCatId, setFilterCatId] = useState('');

    const createLinkPopupCloseHandler = (e) => {
        setCreateLinkPopup(false);
        setTempId('');
    };

    /* get category start */
    const fetchCategory = async (page, listPerPage=-1, nchange=false) => {
        common.getAPI(
            {
                method: "POST",
                url: 'admin/getCategories',
                loading : false,
                data: {page, listPerPage: listPerPage, searchTerm: ''}
            },
            (resp) => {
                if(resp.status === 'success'){
                    setCategoryList(resp.data);
                }
            }
        );
    };
    /* get category end */
    
    /* get template start */
    const fetchTemplate = async (page, category_id, listPerPage=perPage, nchange=false) => {
        common.getAPI(
            {
                method: "POST",
                url: 'user/getTemplates',
                data: {page, listPerPage: listPerPage, searchTerm: searchTerm, category_id: filterCatId}
            },
            async (resp) => {
                if(resp.status === 'success'){
                    try {
                        const promises = resp.data.map(async (element) => {
                          try {
                            const blob = await getImageBlob(element.thumb.url);
                            element.thumb.url = URL.createObjectURL(blob);
                          } catch (err) {
                            console.log(err);
                          }
                        });
                        await Promise.all(promises);

                        setTemplateList(resp.data);
                      } catch (error) {
                        console.error('Error updating template list:', error);
                      }

                    if(!resp.data.length > 0){
                        setNoData(true);
                    }else{
                        setNoData(false);
                    }
                    setTotalPageCount(resp.pageCounts);
                    setTemplateCount(resp.totalTemplates);
                }
            }
        );
    };

    async function getImageBlob(url) {
        try {
          const response = await fetch(url);
          const blob = await response.blob();
          return blob;
        } catch (error) {
          console.error('Error fetching image:', error);
        }
      }
    /* get template end */
    
    useEffect(() => {
        fetchCategory(1);
        fetchTemplate(1);
    }, []);

    const handlePageChange = (event, value) => {
        setPageNo(value);
        fetchTemplate(value);
    };
    
    /* search template start */
    const handleSearchKeyupEvent = async (e) => {
        let t = e.target;
		let searchTerm = t.value;
        setSearchTerm(searchTerm);
        if (e.keyCode === 13) {
            fetchTemplate(1);
        }
    }
    /* search template end */

    const createLink = (id) => {
        /* if(store.linkCreateData.templateId === "" && store.linkCreateData.name === ""){
            dispatch(createLinkTemplateIdACT(id));
            setCreateLinkPopup(!createLinkPopup);
        }else if(store.linkCreateData.templateId === ""){
            dispatch(createLinkTemplateIdACT(id));
        } */
        setCreateLinkPopup(!createLinkPopup);
        setTempId(id);
        
    }

    /* add template start */
    const createLinkFormSubmit = (e) => {
        e.preventDefault();
        const emptyname = validator.isEmpty(name, {ignore_whitespace:true});
        if(emptyname){
            AlertMsg('error', 'Oops!', 'Field can not be empty!');
            return false;
        }else{
            //dispatch(createLinkNameACT(name));
            if(tempId){
                common.getAPI({
                    method: "POST",
                    url: 'user/createCampaign',
                    data: {
                        link_name : name,
                        template_id : tempId
                    }
                },
                (resp) => {
                    if(resp.status === 'success'){
                        if(resp.data.id){
                            router.push('/edit/'+resp.data.id);
                        }
                        dispatch(resetCreateLinkDataACT(true));
                        createLinkPopupCloseHandler();
                    }
                });
            }
            
        }
    }

    /* add template end */

    

    /* useEffect(() => {
        if(store.linkCreateData.name){
            setPageTitle('Select Template');
        }
        if((store.linkCreateData.name !== '') && (store.linkCreateData.templateId !== '')){
            const name = store.linkCreateData.name
            const templateId = store.linkCreateData.templateId;
            common.getAPI({
                method: "POST",
                url: 'user/createCampaign',
                data: {
                    link_name : name,
                    template_id : templateId
                }
            },
            (resp) => {
                if(resp.status === 'success'){
                    if(resp.data.id){
                        router.push('/edit/'+resp.data.id);
                    }
                    dispatch(resetCreateLinkDataACT(true));
                }
            });
        }
    }, [store]) */

    const filterByCategory = (id) => {
        setFilterCatId(id);
    }
    useEffect(() => {
        fetchTemplate(1, filterCatId ? filterCatId : '');
    }, [filterCatId, setFilterCatId]);

    return (
        <>
            <div className="pu_container">
                <div className="pu_pagetitle_wrapper">
                    <h3>{pageTitle} ({templateCount})</h3>
                    <div className="pu_pagetitle_right">
                        <div className="pu_search_wrapper">
                            <input type="text" placeholder="Search" onKeyUp={handleSearchKeyupEvent}/>
                            <span className="pu_search_icon">{svg.search_icon}</span>
                        </div>
                        <div className={'pu_dropdown_wrapper ' + styles.filter_toggle_wrapper}>
                            <div className={'pu_dropdown_toggle ' + styles.filter_toggle} data-toggle="dropdown">
                                <svg width="17" height="10" viewBox="0 0 17 10" fill="none" xmlns="http://www.w3.org/2000/svg"><rect width="16.1429" height="1.29143" rx="0.645714" fill="#5f6c91"></rect><rect x="2.58252" y="3.87427" width="10.9771" height="1.29143" rx="0.645714" fill="#5f6c91"></rect><rect x="5.16602" y="7.7486" width="5.81143" height="1.29143" rx="0.645714" fill="#5f6c91"></rect></svg>
                                <span>Filter By</span>
                            </div>
                            <div className={'pu_dropdown_dd ' + styles.filter_toggle_dropdown}>
                                <ul>
                                    <li className={(filterCatId === '' ? styles.active : '') +' '+ styles.filter_link} onClick={()=>filterByCategory('')}>All</li>
                                    {categoryList.map(category =>
                                        <li key={category._id} className={(filterCatId === category._id ? styles.active : '') +' '+ styles.filter_link} onClick={()=>filterByCategory(category._id)}>{category.title}</li>
                                    )}
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
                <div className={styles.template_list_wrapper}>
                    {/* <div className={styles.template_list_sidebar}>
                        <h3>Filter by Category -</h3>
                        <ul>
                            <li className={filterCatId === '' ? styles.active : ''} onClick={()=>filterByCategory('')}>All</li>
                            {categoryList.map(category =>
                                <li key={category._id} className={filterCatId === category._id ? styles.active : '' } onClick={()=>filterByCategory(category._id)}>{category.title}</li>
                            )}
                        </ul>
                    </div> */}
                    <div className={styles.template_list_inner}>
                        {templateCount ? 
                            <>
                                <div className={styles.template_list}>
                                    {templateList.map(temp => 
                                        <div key={temp._id} className={styles.template_item}>
                                            <div className={styles.template_icon}>
                                                {temp.thumb?.url ?
                                                    <img src={temp.thumb.url} alt="" />
                                                :
                                                    <span className={styles.template_icon_svg}>{svg.DFY_temp_icon}</span>
                                                }
                                                <div className={styles.template_overlay}>
                                                    <a className={styles.template_preview} href={'/preview/'+temp._id+'/home'} target="_blank" rel="noreferrer">Preview</a>
                                                    <a className={styles.template_edit} onClick={() => createLink(temp._id)}>Select</a>
                                                </div>
                                            </div>
                                            <p>{temp.title}</p>
                                        </div>
                                    )}
                                </div>
                                {totalPageCount ? 
                                    <Pagination count={totalPageCount} page={pageNo} onChange={handlePageChange} />
                                    : null
                                }
                            </>: null
                        }
                        {noData ? 
                            <div className="pu_noData">
                                <span>{svg.noData}</span>
                                <h3>No Records Found.</h3>
                                <p>There is no template available with this filter.</p>
                            </div> : null
                        }
                    </div>
                </div>
                
            </div>

            <Popup
                heading="Create New PixaURL"
                subHeading="Enter Your URL Below to Continue"
                show={createLinkPopup}
                maxWidth={570}
                onClose={createLinkPopupCloseHandler}
            >
                <form onSubmit={createLinkFormSubmit}>
                    <div className={styles.create_link_input}>
                        <div className={styles.cli_text}>{process.env.APP_URL}</div>
                        <input type="text" className={styles.cli_input} name="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Your URL" />
                    </div>
                    <div className="text-center">
                        <button type="submit" className="pu_btn">Continue {svg.btn_arrow_right}</button>
                    </div>
                </form>
            </Popup>
        </>
    );
}
export default Templates;
