import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { connect, useDispatch, useSelector } from 'react-redux';
import { compose } from 'redux';
import ThemePreview from '../../src/components/common/themePreview';
import PagePreview from '../../src/components/editor/pagePreview';
import { common } from '../../src/helper/Common';
import svg from '../../src/helper/svg';
import { changeTemplateACT, editorDataUpdate, socialIconUpdateACT, updatePageSeoACT, updatePageStyleACT } from '../../src/redux/actions/editorAction';
import $ from "jquery";
import validator from 'validator';
import styles from '../../styles/pages/Settings.module.css';
import { AlertMsg } from '../../src/helper/helper';
import Chip from '@mui/material/Chip';
import ThemeEditor from '../../src/components/common/theme_editor/ThemeEditor';
import { Alert } from '@mui/material';
import AnimationSetting from '../../src/components/common/animation_setting/AnimationSetting';

const Settings = (props) => {
    const dispatch = useDispatch();
    const router = useRouter();
    const cData = useSelector((state) => state); 
    const [themeList, setThemeList] = useState([]);
    const [iconPackList, setIconPackList] = useState([]);
    const [activeThemeID, setActiveThemeID] = useState('custom');
    const [activeTab, setActiveTab] = useState('tab_appearance');
    const [iconLinkList, setIconLinkList] = useState([]);
    const [activeIconPackId, setActiveIconPackId] = useState('');

    const [pageList, setPageList] = useState([]);
    const [activeSeoPage, setActiveSeoPage] = useState('');

    const [seoTitle, setSeoTitle] = useState('');
    const [seoDescription, setSeoDescription] = useState('');
    const [seoTagInput, setSeoTagInput] = useState('');
    const [seoTagList, setSeoTagList] = useState([]);

    const [customThemeStyleData, setcustomThemeStyleData] = useState('');

    const [activeTemplateId, setActiveTemplateId] = useState('');
    const [campaignId, setCampaignId] = useState('');
    const [templateList, setTemplateList] = useState([]);

    //const [activeCustomTheme, setActiveCustomTheme] = useState(false);
   
    useEffect(() => {
        var setting_id = router.query.id;
        if(props.editorData._id === setting_id){
            common.getAPI({
                method: 'POST',
                loading : false,
                url: 'editor/getTemplate',
                data: {
                    id : setting_id
                }
            }, (resp) => {
                if(resp.status === 'success'){
                    setIconLinkList(resp.data.SocialIconData);
                    dispatch(editorDataUpdate(resp.data));
                    setcustomThemeStyleData(resp.data.templateStyle);
                    setActiveTemplateId(resp.data.usedTemplateId);
                    setCampaignId(resp.data._id);
                    /* if(resp.data.themeId){
                        setActiveThemeID(resp.data.themeId);
                    }else if(resp.data.isCustomTheme === 1){
                        setActiveThemeID('custom');
                    } */
                }
            }); 
        }else{
            //router.push('/admin/templates');
        }
        /* if(props.editorData){
            if(props.editorData.themeId){
                setActiveThemeID(props.editorData.themeId);
            }else if(props.editorData.isCustomTheme === 1){
                setActiveThemeID('custom');
            }
        } */
        if(props.editorData){
            if(props.editorData.packId){
                setActiveIconPackId(props.editorData.packId);
            }
        }
        
        /* get theme list start */
        /* const fetchThemes = async (page, listPerPage=-1, nchange=false) => {
            common.getAPI({
                method: "POST",
                url: 'editor/getThemes',
                data: {page: page, listPerPage: listPerPage, searchTerm: ''}
            },
            (resp) => {
                if(resp.status === 'success'){
                    setThemeList(resp.data);
                }
            });
        };
        fetchThemes(1); */
        /* get theme list end */

        /* get template list start */
        const fetchTemplate = async (page, listPerPage=-1, nchange=false) => {
            common.getAPI(
                {
                    method: "POST",
                    url: 'user/getTemplates',
                    loading : false,
                    data: {page, listPerPage: listPerPage, searchTerm: ''}
                },
                (resp) => {
                    if(resp.status === 'success'){
                        setTemplateList(resp.data);
                    }
                }
            );
        };
        fetchTemplate(1);
        /* get template list end */

        fetchIconPack(1);

        if(props.pages.length){
            setPageList(props.pages);
            setActiveSeoPage(props.pages[0]._id);
            const seod = props.pages[0].seoData;
            if(seod){
                setSeoTitle(seod.title);
                setSeoDescription(seod.description);
                setSeoTagList(seod.tags);
            }
        }
    }, [router.query]);

    useEffect(() => {
        if(props.editorData){
            setcustomThemeStyleData(props.editorData.templateStyle);
        }
    }, [props]);
    
    

     /* get icon pack start */
     const fetchIconPack = async (page, listPerPage=-1, nchange=false) => {
        common.getAPI(
            {
                method: "POST",
                url: 'admin/getSocialPacks',
                data: {page: page, listPerPage: listPerPage, searchTerm: ''}
            },
            (resp) => {
                if(resp.status === 'success'){
                    const filtereddata = resp.data.filter(item => item.status === 1);
                    if(filtereddata){
                        setIconPackList(filtereddata);
                    }
                }
            }
        );
    };
    /* get icon pack end */



    /* active theme on click start */
    const selectThemehandle = (theme, e) => {
        const elts = $('.pu_setting_content_body > div > div');
        $.each(elts, function(i, el){
            el.classList.remove(styles.active);
        });
        
        if(theme !== 'custom'){
            const el = $('#'+theme._id)[0];
            el.classList.add(styles.active);
            dispatch(updatePageStyleACT(theme.metaData));
            if(theme._id || props.editorData._id){
                setActiveThemeID(theme._id);
                common.getAPI({
                    method: "POST",
                    url: 'editor/applyTheme',
                    data: {
                        template_id : props.editorData._id,
                        theme_id : theme._id
                    }
                },
                (resp) => {
                    
                });
            }
        }else{
            const el = $('#theme_custom')[0];
            el.classList.add(styles.active);
            setActiveThemeID('custom');

            if(props.editorData.templateStyle){
                setcustomThemeStyleData(props.editorData.templateStyle);
            }
        }
    }
    /* active theme on click end */

    /* tab click start */
    const tabClick = (tabid) => {
        setActiveTab(tabid);
    }
    /* tab click end */

    /* activete icon pack start */
    const activateIconPack = (iconTheme) => {
        const newicon = [...iconLinkList];
        iconTheme.iconList.map((item, index) => {
            newicon[index].svg_code = item.svg_code
        });
        setIconLinkList(newicon);
        const newData = {
            template_id : props.editorData._id,
            icon_data : newicon
        }
        dispatch(socialIconUpdateACT(newData));

        /* setting icon pack */
        setActiveIconPackId(iconTheme._id);
        common.getAPI({
            method: "POST",
            url: 'editor/updateSocialIconsPack',
            data: {
                template_id : props.editorData._id,
                pack_id : iconTheme._id
            }
        },
        (resp) => {
            
        });

    }
    /* activete icon pack end */

    /* change social icon input start */
    const changeSocialIconInput = (e, icon) => {
        if(icon.itype === "phone"){
            var regExp = /[^0-9+]/g;
            const isnumber = validator.isAlpha(e.target.value) || validator.contains(e.target.value, ' ') || regExp.test(e.target.value);
            if(isnumber){
                return false;
            }
        }
        const data = [...iconLinkList];
        var finditem = data.find(item => item.id === icon.id);
        finditem.value = e.target.value;
        setIconLinkList(data);
    }
    /* change social icon input end */

    /* Save Social Icons start */
    const saveSocialIcon = (e, icon) => {
        const data = [...iconLinkList];
        if(e.target.value){
            if(icon.itype === "url"){
                const isURL = validator.isURL(e.target.value, {require_protocol : true});
                if(!isURL){
                    AlertMsg('error', 'Oops!', 'Invalid URL!');
                    var finditem = data.find(item => item.id === icon.id);
                    finditem.value = '';
                    return false;
                }
            }
            if(icon.itype === "email"){
                const isURL = validator.isEmail(e.target.value);
                if(!isURL){
                    AlertMsg('error', 'Oops!', 'Email Is not valid!');
                    var finditem = data.find(item => item.id === icon.id);
                    finditem.value = '';
                    return false;
                }
            }
            
            const newData = {
                template_id : props.editorData._id,
                icon_data : data
            }
            dispatch(socialIconUpdateACT(newData));
            setIconLinkList(data);
        }
    }
    /* Save Social Icons end */

    /* Update Social Icon status start */
    const updateSocialIconStatus = (id, status) => {
        const data = [...iconLinkList];
        const data2 = data.map(obj => {
            if (obj.id === id) {
              return {...obj, status};
            }
            return obj;
        });
        const newData = {
            template_id : props.editorData._id,
            icon_data : data2
        }
        dispatch(socialIconUpdateACT(newData));
        setIconLinkList(data2);
    }
    /* Update Social Icon status end */

    /* --------------------------------- SEO START --------------------------------- */
    /* active SEO Page start */
    const isActiveSeo = (id) => {
        if(id == activeSeoPage){
            return styles.active
        }
        else ""
    }
    /* active SEO Page end */

    /* SEO Page click start */
    const sepPageClickHandle = (page) => {
        setActiveSeoPage(page._id);
        if(page.seoData){
            setSeoTitle(page.seoData.title);
            setSeoDescription(page.seoData.description);
            setSeoTagList(page.seoData.tags);
        }else{
            setSeoTitle('');
            setSeoDescription('');
            setSeoTagList([]);
        }
    }
    /* SEO Page click end */

    /* SEO Tag add start */
    const addSeoTag = (e) => {
        e.preventDefault();
        const newList =  [...seoTagList];
        newList.push(seoTagInput);
        setSeoTagList(newList);
        setSeoTagInput('');
    }
    /* SEO Tag add end */

    /* SEO Tag Delete start */
    const handleSeoTagDelete = (index) => {
        const newList = [...seoTagList];
        newList.splice(index, 1);
        setSeoTagList(newList);
    }
    /* SEO Tag Delete end */

    /* save SEO Tag start */
    const saveSeoTag = (e) => {
        let data = {
            page_id : activeSeoPage,
            seoData : {
                title : seoTitle,
                description : seoDescription,
                tags : seoTagList,
            }
        }
        dispatch(updatePageSeoACT(data));
        common.getAPI({
            method : 'POST',
            url : 'editor/saveSEOData',
            data : data
        }, (resp) => {
            
        });
    }
    /* save SEO Tag end */
    /* --------------------------------- SEO END --------------------------------- */

    /* change template start */
    const changeTemplate = (temp) => {
        if(activeTemplateId !== temp._id){
            var tdata = {
                id : campaignId,
                template_id : temp._id
            } 
            common.getAPI({
                method : 'POST',
                url : 'user/changeUsedTemplate',
                data : tdata
            }, (resp) => {
                setActiveTemplateId(temp._id);
                dispatch(changeTemplateACT(temp))
            });
        }
    }
    /* change template end */

    const editorHeaderBackBtn = () => {
        if(router.pathname === '/edit/[edit]'){
            if(cData.userData.role === 1){
                router.push('/admin/templates');
            }else{
                router.push('/links');
            }
        }else{
            router.push('/edit/'+router.query.id);
        }
    }
        
    return (
        <>
            <div className={styles.header_settings}>
                <div className={styles.header_settings_wrapper}>
                    <span onClick={() => editorHeaderBackBtn()} className={styles.header_settings_back}>
                        {svg.back_arrow}
                    </span>
                    <div className={"pu_container " + styles.pu_container}>
                        <div className="pu_tab_nav">
                            <ul>
                                <li className={activeTab === 'tab_appearance' ? 'active' : ''}>
                                    <a onClick={(e) => tabClick('tab_appearance')}>Appearance</a>
                                </li>
                                <li className={activeTab === 'tab_socialsettings' ? 'active' : ''}>
                                    <a onClick={(e) => tabClick('tab_socialsettings')}>Social Settings</a>
                                </li>
                                {cData.userData.role === 2 ?
                                    <>
                                        <li className={activeTab === 'tab_template' ? 'active' : ''}>
                                            <a onClick={(e) => tabClick('tab_template')}>Templates</a>
                                        </li>
                                        <li className={activeTab === 'tab_seosettings' ? 'active' : ''}>
                                            <a onClick={(e) => tabClick('tab_seosettings')}>SEO Settings</a>
                                        </li>
                                       
                                        {/* <li className={activeTab === 'tab_analytics' ? 'active' : ''}>
                                            <a onClick={(e) => tabClick('tab_analytics')}>Analytics</a>
                                        </li>
                                        <li className={activeTab === 'tab_integration' ? 'active' : ''}>
                                            <a onClick={(e) => tabClick('tab_integration')}>Integration</a>
                                        </li>
                                        <li className={activeTab === 'tab_domainsettings' ? 'active' : ''}>
                                            <a onClick={(e) => tabClick('tab_domainsettings')}>Domain Settings</a>
                                        </li> */}
                                    </>                            
                                    : null
                                }
                                 <li className={activeTab === 'animation_settings' ? 'active' : ''}>
                                            <a onClick={(e) => tabClick('animation_settings')}>Animations Settings</a>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
            <div className="pu_container" style={{maxWidth: 1520, padding: 0}}>
                <div className="pu_setting_wrapper">
                    <div className="pu_setting_content">

                        {/* Appearance tab start */}
                        <div className={"pu_tab_content " + (activeTab === 'tab_appearance' ? 'active' : '')}>
                            <div className="pu_setting_content_header">
                                <h3>Customize Theme</h3>
                            </div>
                            <div className="pu_setting_content_body">
                                {/* <div className={styles.theme_list}>
                                    {themeList.filter(item => item.status === 1).map((theme, index) =>
                                        <div key={theme._id} className={styles.theme_item + ' ' + (activeThemeID === theme._id ? styles.active : '')} id={theme._id} onClick={(e) => selectThemehandle(theme, e)}>
                                            <div className={styles.theme_preview}>
                                                {theme.metaData ? <ThemePreview data={theme.metaData} /> : null }
                                            </div>
                                            <p>{theme.title}</p>
                                        </div>
                                    )}
                                </div><br/> */}
                                {/* <div className={styles.theme_list}>
                                    <div className={styles.theme_item + ' ' + styles.custom_theme + ' ' + (activeThemeID === 'custom' ? styles.active : '')} onClick={(e) => selectThemehandle('custom', e)} id="theme_custom">
                                        <p> {svg.icon_paint} Custom Theme</p>
                                    </div>
                                </div> */}
                                
                                <ThemeEditor data={customThemeStyleData} />
                                {/* {activeThemeID === 'custom' ? 
                                    <>
                                    </>
                                : null} */}

                            </div>
                        </div>
                        {/* Appearance tab end */}

                        {/* Page Settings tab start */}
                        <div className={"pu_tab_content " + (activeTab === 'tab_socialsettings' ? 'active' : '')}>
                            <div className="pu_setting_content_header">
                                <h3>Social Icons Themes</h3>
                            </div>
                            <div className="pu_setting_content_body">
                                <div className={styles.social_icon_wrapper +' '+ (cData.userData.role === 1 ? styles.admin_only : '')}>
                                    <div className={styles.social_pack_list}>
                                        {iconPackList.filter(ico => ico.status === 1).map(item => 
                                            <div key={item._id} className={styles.social_pack_item +' '+ (activeIconPackId ===item._id ? styles.active : '' )} onClick={() => activateIconPack(item)}>
                                                <div className={styles.social_pack_svgs}>
                                                    {item?.iconList?.map(svg => 
                                                        <div className={styles.social_pack_svg_icon} key={svg.id} dangerouslySetInnerHTML={{__html : svg.svg_code}}></div>    
                                                    )}
                                                </div>
                                                <p>{item.name}</p>
                                            </div>
                                        )}
                                    </div>
                                    
                                </div>
                            </div>

                        </div>
                        {cData.userData.role === 2 ?
                            <div className={"pu_tab_content " + (activeTab === 'tab_socialsettings' ? 'active' : '')} style={{marginTop: 10}}>
                                <div className="pu_setting_content_header">
                                    <h3>Social Icons</h3>
                                </div>
                                <div className="pu_setting_content_body">
                                    <div className={styles.social_icon_link_list}>
                                        {iconLinkList.map((icon, index) =>
                                            <div key={icon.id} className={styles.social_icon_link_item}>
                                                <div className={styles.social_icon_link_svg} dangerouslySetInnerHTML={{__html : icon.svg_code}}></div>
                                                <div className={"pu_input_wrapper " + styles.input_wrapper}>
                                                    <label>Enter
                                                        {icon.itype === 'url' ? (' '+icon.name+' ') : " " }
                                                        <span style={{textTransform: 'capitalize'}}>{icon.itype}</span>
                                                    </label>
                                                    <input className={styles.social_icon_link_input} type={icon.itype === 'phone' ? 'tel' : 'text'} placeholder={icon.itype === 'url' ? 'https://' : (icon.itype === 'phone' ? '+91' : 'yourname@company.com')} value={icon.value} onChange={(e) => changeSocialIconInput(e, icon)} onBlur={(e) => saveSocialIcon(e, icon)} />
                                                </div>
                                                <div className={styles.social_icon_link_action}>
                                                    <div className="pu_switch">
                                                        <input 
                                                            id={'userChk_'+index} 
                                                            type="checkbox" 
                                                            value={icon.status} 
                                                            defaultChecked={icon.status === 1 ? true : false} 
                                                            onClick={(e) => updateSocialIconStatus(icon.id, (icon.status === 1 ? 0 : 1))}
                                                        />
                                                        <label htmlFor={'userChk_'+index}>
                                                            <span className="pu_switch_icon"></span>
                                                        </label>
                                                    </div>
                                                </div>
                                            </div>                                            
                                        )}
                                    </div>
                                </div>
                            </div>
                            : null 
                        }
                        {/* Page Settings tab end */}

                        {/* templates tab start */}
                        <div className={"pu_tab_content " + (activeTab === 'tab_template' ? 'active' : '')}>
                            <div className="pu_setting_content_header">
                                <h3>Change Templates</h3>
                            </div>
                            <div className="pu_setting_content_body">
                                <Alert severity="info">Your appearance settings will be updated when you change your template.</Alert><br/>
                                <div className={styles.template_list}>
                                    {templateList.map(temp => 
                                        <div key={temp._id} className={styles.template_item +' '+ (activeTemplateId === temp._id ? styles.active : '')} onClick={() => changeTemplate(temp)}>
                                            {activeTemplateId === temp._id ?
                                                <div className={styles.template_checked}>
                                                    <span><svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M2 12L7.25 17L9.875 14M8 12L13.25 17L22 7M16 7L12.5 11" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg></span>
                                                </div> : null
                                            }
                                            <div className={styles.template_icon}>
                                                {temp.thumb?.url ?
                                                    <img src={temp.thumb.url} alt="" />
                                                :
                                                    <span className={styles.template_icon_svg}>{svg.DFY_temp_icon}</span>
                                                }
                                            </div>
                                            <p>{temp.title}</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                        {/* templates tab end */}
                        
                        
                        {/* SEO Settings tab start */}
                        <div className={"pu_tab_content " + (activeTab === 'tab_seosettings' ? 'active' : '')}>
                            <div className="pu_setting_content_header">
                                <h3>SEO Settings</h3>
                            </div>
                            <div className="pu_setting_content_body">
                                <div className={styles.seo_wrapper}>
                                    <div className={styles.seo_pagelist_wrapper}>
                                        <h3>Select Page</h3>
                                        <div className={styles.seo_pagelist}>
                                            {pageList.map(page => 
                                                <div 
                                                    key={page._id} 
                                                    className={styles.seo_page_item +' '+ isActiveSeo(page._id)}
                                                    onClick={() => sepPageClickHandle(page)}
                                                    >
                                                        {page.title}
                                                    </div>    
                                            )}
                                        </div>
                                    </div>
                                    <div className={styles.seo_settings}>
                                        <div className="pu_input_wrapper">
                                            <label>Title</label>
                                            <input type="text" className="pu_input" value={seoTitle} onChange={(e) => setSeoTitle(e.target.value)} />
                                        </div>
                                        <div className="pu_input_wrapper">
                                            <label>Description</label>
                                            <textarea rows="6" className="pu_input" value={seoDescription} onChange={(e) => setSeoDescription(e.target.value)}></textarea>
                                        </div>
                                        <div className="pu_input_wrapper">
                                            <label>Tags</label>
                                            <div className="pu_tag_list">
                                                <div className="pu_tags">
                                                    {seoTagList.map((tag, index) => 
                                                        <Chip key={index} label={tag} variant="outlined" onDelete={() => handleSeoTagDelete(index)} />    
                                                    )}
                                                </div>
                                                <form onSubmit={(e) => addSeoTag(e)}>
                                                    <input className="pu_tag_input" type="text" placeholder="Enter Tag" value={seoTagInput} onChange={(e) => setSeoTagInput(e.target.value)} />
                                                </form>
                                            </div>
                                        </div>
                                        <button className="pu_btn" onClick={(e) => saveSeoTag(e)}>Save Settings</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                        {/* SEO Settings tab end */}
                        
                        {/* Analytics tab start */}
                        <div className={"pu_tab_content " + (activeTab === 'tab_analytics' ? 'active' : '')}>
                            <div className="pu_setting_content_header">
                                <h3>Analytics</h3>
                            </div>
                            <div className="pu_setting_content_body">
                                
                            </div>
                        </div>
                        {/* Analytics tab end */}
                        
                        {/* Integration tab start */}
                        <div className={"pu_tab_content " + (activeTab === 'tab_integration' ? 'active' : '')}>
                            <div className="pu_setting_content_header">
                                <h3>Integration</h3>
                            </div>
                            <div className="pu_setting_content_body">
                                
                            </div>
                        </div>
                        {/* Integration tab end */}
                        
                        {/* Domain Settings tab start */}
                        <div className={"pu_tab_content " + (activeTab === 'tab_domainsettings' ? 'active' : '')}>
                            <div className="pu_setting_content_header">
                                <h3>Domain Settings</h3>
                            </div>
                            <div className="pu_setting_content_body">
                                
                            </div>
                        </div>
                        {/* Domain Settings tab end */}


                          
                        {/* Animations Settings tab start */}
                        <div className={"pu_tab_content " + (activeTab === 'animation_settings' ? 'active' : '')}>
                            <div className="pu_setting_content_header">
                                <h3>Animation Settings</h3>
                            </div>
                            <div className="pu_setting_content_body">
                              <AnimationSetting data={cData.editor.sectionList} page={cData.editor.pageData}/>
                            </div>
                        </div>
                        {/* Animations Settings tab end */}

                    </div>
                    <div className="pu_setting_preview">
                        <PagePreview />
                    </div>
                </div>
            </div>
        </>
    );
}

const mapStateToProps = (state) => {
    return {
		...state.editor,
	};
};
export default compose(connect(mapStateToProps , null))(Settings);
