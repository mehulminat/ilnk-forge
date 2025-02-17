import { useEffect, useState } from "react";
import Popup from "../../src/components/common/popup/Popup";
import { common } from "../../src/helper/Common";
import svg from "../../src/helper/svg";
import validator from 'validator';

import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import { AlertMsg, Loading } from "../../src/helper/helper";

import styles from '../../styles/pages/DfyTemplate.module.css';
import { useDispatch } from "react-redux";
import { confirmPopupStatus, setPageHeading } from "../../src/redux/actions/commonAction";
import Link from "next/link";
import RenameIcon from "../../src/components/common/rename_icon/RenameIcon";

import HTML_THEME_LIST from '../../src/helper/htmlThemeList';
import { Pagination } from "@mui/material";

const Templates = () => {
    let dispatch = useDispatch();
    useEffect(() => {
        dispatch(setPageHeading({
            pageHeading: "DFY Templates",
            title: "DFY Templates",
        }));
    }, [dispatch]);

    const [name, setName] = useState('');
    const [categoryId, setCategoryId] = useState('');

    const [categoryList, setCategoryList] = useState([]);
    const [templateList, setTemplateList] = useState([]);

    const [addTemplatePopup, setAddTemplatePopup] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');

    const [htmlThemeList, setHtmlThemeList] = useState(HTML_THEME_LIST);
    const [htmlThemeId, setHtmlThemeId] = useState('1');

    const [perPage, setPerPage] = useState(15);
    const [pageNo, setPageNo] = useState(1);
    const [totalPageCount, setTotalPageCount] = useState(0);

    const [templateCount, setTemplateCount] = useState(0);
    const [noData, setNoData] = useState(false);

    const [filterCatId, setFilterCatId] = useState('');

    const templatePopupCloseHandler = (e) => {
        setAddTemplatePopup(false);
        //Reset popup form start
        setTimeout(() => {
            setName('');
            setCategoryId('');
        }, 100);
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
                url: 'admin/getTemplates',
                data: {page, listPerPage: listPerPage, searchTerm: searchTerm, category_id: filterCatId}
            },
            (resp) => {
                if(resp.status === 'success'){
                    setTemplateList(resp.data);
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
    /* get template end */

    useEffect(() => {
        fetchCategory(1);
        //fetchTemplate(1);
    }, []);

    const handlePageChange = (event, value) => {
        setPageNo(value);
        fetchTemplate(value);
    };
    

    /* add template start */
    const addTemplateFormSubmit = (e) => {
        e.preventDefault();
        const emptyname = validator.isEmpty(name, {ignore_whitespace:true});
        const emptycategory = validator.isEmpty(categoryId, {ignore_whitespace:true});
        if(emptyname){
            AlertMsg('error', 'Oops!', 'Field can not be empty!');
            return false;
        }else if(emptycategory){
            AlertMsg('error', 'Oops!', 'Please select at least one category.');
            return false;
        }else{
            const data = {
                name : name,
                category_id : categoryId,
                html_theme_id : htmlThemeId
            }
            Loading(true);
            common.getAPI({
                method : 'POST',
                url : 'admin/createTemplate',
                data : data
            }, (resp) => {
                if(resp.status === "success"){
                    templatePopupCloseHandler();
                    setName('');
                    setCategoryId('');
                    fetchTemplate(1);
                }
            })
        }
    }
    /* add template end */

    const handleCategoryChange = (event) => {
        setCategoryId(event.target.value);
    };
    const handleHtmlThemeChange = (event) => {
        setHtmlThemeId(event.target.value);
    };

    const deleteTemplate = (temp_id) => {
        if(temp_id){
            dispatch(confirmPopupStatus(true , {
                type : 'Template',
                url : 'admin/deleteTemplate',
                data : {id: temp_id},
                action : refreshTemplateList
            }));
        }
    }

    /* refresh template list after action start */
    const refreshTemplateList = () => {
        fetchTemplate(1)
    }
    /* refresh template list after action end */

    /* template status change start */
    const onTemplateStateChange = (temp, e) => {
        if(temp._id){
            var tStatus = 0;
            if(e.target.checked === true){
                tStatus = 1;
            }else{
                tStatus = 0;
            }
            common.getAPI({
                method: 'POST',
                loading : false,
                url: 'admin/updateTemplateStatus',
                data: {
                    id : temp._id,
                    templateStatus : tStatus
                }
            }, (resp) => {
                fetchTemplate(1);
            });
        }
    }
    /* template status change end */

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
                    <h3>Templates ({templateCount})</h3>
                    <div className="pu_pagetitle_right">
                        <div className="pu_search_wrapper">
                            <input type="text" placeholder="Search" onKeyUp={handleSearchKeyupEvent}/>
                            <span className="pu_search_icon">{svg.search_icon}</span>
                        </div>
                        <button className="pu_btn" onClick={(e) => setAddTemplatePopup(!addTemplatePopup)}>Add New</button>
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
                                        <div key={temp._id} className={styles.template_item + ' ' + (temp.status === 0 ? styles.inactive : '')}>
                                            <div className={styles.template_icon}>
                                                {temp.thumb?.url ?
                                                    <img src={temp.thumb.url} alt="" />
                                                :
                                                    <span className={styles.template_icon_svg}>{svg.DFY_temp_icon}</span>
                                                }
                                                <div className={styles.template_overlay}>
                                                    <Link href={'/edit/'+temp._id}><a className={styles.template_edit}>{svg.dt_edit_icon} Edit</a></Link>
                                                </div>
                                                <div className={"pu_switch " + styles.template_switch}>
                                                    <input type="checkbox" id={temp._id} value={temp._id} defaultChecked={temp.status === 1 ? true : false} onChange={(e) => onTemplateStateChange(temp, e)}/>
                                                    <label htmlFor={temp._id}><span className="pu_switch_icon"></span></label>
                                                </div>
                                                <div className={'pu_dropdown_wrapper ' + styles.template_action}>
                                                    <div className={'pu_dropdown_toggle ' + styles.template_action_icon} data-toggle="dropdown">
                                                        <span></span>
                                                        <span></span>
                                                        <span></span>
                                                    </div>
                                                    <div className={'pu_dropdown_dd ' + styles.template_action_dropdown}>
                                                        <ul>
                                                            <li><a href={'/preview/'+temp._id+'/home'} target="_blank" rel="noreferrer" className="pu_dropdown_link">Preview</a></li>
                                                            <li><a onClick={() => deleteTemplate(temp._id)} className="pu_dropdown_link">Delete</a></li>
                                                        </ul>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className={styles.title}>
                                                {temp.title} 
                                                <RenameIcon id={temp._id} title={temp.title} callBack={refreshTemplateList} />
                                            </div>
                                        </div>
                                    )}
                                </div>
                                {totalPageCount ? 
                                    <Pagination count={totalPageCount} page={pageNo} onChange={handlePageChange} />
                                    : null
                                }
                            </>
                            : null
                        }
                        
                        {noData ? 
                            <div className="pu_noData">
                                <span>{svg.noData}</span>
                                <h3>No Records Found.</h3>
                                <p>Create your first teamplate and make it available to the customers.</p>
                            </div> : null
                        }
                    </div>
                </div>
            </div>

            <Popup
                heading="Add Template"
                show={addTemplatePopup}
                onClose={templatePopupCloseHandler}
            >
                <form onSubmit={addTemplateFormSubmit}>
                    <div className="pu_input_wrapper">
                        <label>Template Name</label>
                        <input type="text" className="pu_input" name="name" value={name} onChange={(e) => setName(e.target.value)} />
                    </div>
                    <div className="pu_input_wrapper">
                        <label>Select Category</label>
                        <div className="pu_mui_select">
                            <FormControl fullWidth>
                                <Select
                                    value={categoryId}
                                    onChange={handleCategoryChange}
                                >
                                    {categoryList.filter(item => item.status === 1).map((cat) => (
                                        <MenuItem key={cat._id} value={cat._id}> {cat.title} </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </div>
                    </div>
                    {/* <div className="pu_input_wrapper">
                        <label>Select HTML Theme</label>
                        <div className="pu_mui_select">
                            <FormControl fullWidth>
                                <Select
                                    value={htmlThemeId}
                                    onChange={handleHtmlThemeChange}
                                >
                                    {htmlThemeList.map((theme) => (
                                        <MenuItem key={theme.id} value={theme.id}> {theme.title} </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </div>
                        <a href="/admin/html-theme-preview" target="_blank">Preview HTML Templates</a>
                    </div> */}
                    <div className="text-center">
                        <button type="submit" className="pu_btn">Continue</button>
                    </div>
                </form>
            </Popup>
        </>
    );
}

export default Templates;
