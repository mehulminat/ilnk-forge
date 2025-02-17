import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

import styles from '../../styles/pages/Editor.module.css';

import { connect, useDispatch, useSelector } from 'react-redux';
import { contentPlaceholder, editorDataUpdate, getPageDataACT, getSectionListACT, resetEditorData, updatePageListACT, updatePageStyleACT } from '../../src/redux/actions/editorAction';

import { Loading } from '../../src/helper/helper';
import { common } from '../../src/helper/Common';
import { compose } from 'redux';

import PageEditor from '../../src/components/editor/pageEditor';
import PagePreview from '../../src/components/editor/pagePreview';
import PageList from '../../src/components/editor/pageList';
import { setPageHeading } from '../../src/redux/actions/commonAction';
import svg from '../../src/helper/svg';

const Editor = (props) => {
    const router = useRouter();
    let dispatch = useDispatch();
    const [editId, setEditId] = useState('');
    const [activeTab, setActiveTab] = useState('tab_appearance');

    useEffect(() => {
        var eid = router.query.edit;   
        setEditId(eid);
        dispatch(resetEditorData(true));
    }, [router.query]);

    useEffect(() => {
        /* get template data start */
        var eid = router.query.edit;
        if(eid){
            Loading(true);
            common.getAPI(
                {
                    method: "POST",
                    url: 'editor/getTemplate',
                    data: {id : eid}
                },
                (resp) => {
                    if(resp.status === 'success'){

                        dispatch(setPageHeading({
                            pageHeading: "PixaURL - "+ resp.data.title,
                            title: "PixaURL - "+ resp.data.title,
                        }));

                        dispatch(editorDataUpdate(resp.data));
                        dispatch(updatePageStyleACT(resp.data.templateStyle));
                        dispatch(contentPlaceholder({pageData : true}));

                        /* get page list start */
                        dispatch(contentPlaceholder({pages : true}));
                        common.getAPI({
                            method: "POST",
                            url: 'editor/getTemplatePages',
                            loading : false,
                            data: {
                                template_id : eid,
                                page : 1,
                                listPerPage : -1
                            }
                        },
                        (resp) => {
                            if(resp.status === 'success'){
                                dispatch(updatePageListACT(resp.data));
                                dispatch(contentPlaceholder({pages : false}));
                                dispatch(getPageDataACT(resp.data[0]));
                                dispatch(getSectionListACT(resp.data[0]));
                            }
                        });
                        /* get page list end */

                    }
                    Loading(false);
                }
            );
        }
        /* get template data end */
    }, [router.query]);

    /* tab click start */
    const tabClick = (tabid) => {
        setActiveTab(tabid);
    }
    /* tab click end */

    
    return (
        <>
            <div className="pu_tab_nav pu_tab_nav_editor_mobile" style={{display : 'none'}}>
                <ul>
                    <li className={activeTab === 'tab_appearance' ? 'active' : ''}>
                        <a onClick={(e) => tabClick('tab_appearance')}>Edit</a>
                    </li>
                    <li className={activeTab === 'tab_socialsettings' ? 'active' : ''}>
                        <a onClick={(e) => tabClick('tab_socialsettings')}>Pages</a>
                    </li>
                </ul>
            </div>
            <div className={styles.mobile_header_action} style={{display : 'none'}}>
                <a className={"pu_back_arrow " + styles.pu_back_arrow_editor_mobile}><span className="pu_back_arrow_icon">{svg.back_arrow}</span>Back</a>
                <a className={"pu_btn pu_btn_border " + styles.pu_btn +' '+ styles.pu_btn_settings}>{svg.icon_page_setting} Pages</a>
                <a className={"pu_btn pu_btn_border " + styles.pu_btn +' '+ styles.pu_btn_settings}>{svg.icon_page_setting} Preview</a>
            </div>
            <div className={styles.editor_wrapper}>
                <div className={styles.editor_sidebar}>
                    <PageList templateId={editId} />
                </div>
                <div className={styles.editor_body}>
                    <PageEditor templateId={editId} />
                </div>
                <div className={styles.editor_preview}>
                    <PagePreview />
                </div>
            </div>
        </>
    );
}

const mapStateToProps = (state) => {
    return {
		...state,
	};
};

export default compose(connect(mapStateToProps , null))(Editor)