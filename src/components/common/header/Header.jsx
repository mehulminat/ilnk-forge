import styles from './Header.module.css';
import { connect, useDispatch, useSelector } from 'react-redux';
import { logout } from '../../../redux/actions/authAction';
import svg from '../../../helper/svg';
import Link from 'next/link';
import Router, { useRouter } from 'next/router';

import { getNameInitials } from '../../../helper/helper';
import { useEffect, useRef, useState } from 'react';

import AutoSaveLoader from '../../../components/editor/autoSaveLoader';
import { editorDataUpdate, resetEditorData, updatePageListACT } from '../../../redux/actions/editorAction';
import { compose } from 'redux';
import CopyURLBox from '../elements/copyURLBox';
import { resetCreateLinkDataACT } from '../../../redux/actions/commonAction';
import { common } from '../../../helper/Common';
import Cookies from 'js-cookie';
import { jwtDecode } from 'jwt-decode';

const Header = (props) => {
    const router = useRouter();
    let dispatch = useDispatch();
    const cData = useSelector((state) => state);
    let pathname = router.route;
    let tempId = router.query.edit;
    const [editorHeaderStatus, setEditorHeaderStatus] = useState(false);
    const headerContainer = useRef();
    const headerNav = useRef();
    const [isEnabled, setIsEnabled] = useState(false)

    const isActive = (route) => {
        if(route == pathname){
            return styles.active
        }
        else ""
    }

    const checkPlanFeature = () =>{
        common.getAPI(
            {
                method: "POST",
                url: 'auth/checkPlanFeature',
                data: {}
            },
            (resp) => {
                if(resp.status === 'success'){
                    setIsEnabled(resp.data.isEnabled);
                }
            }
        );
    }

    let tokenCookie = Cookies.get('accessToken') ? Cookies.get('accessToken') : false;
    let tokenData
    if(tokenCookie){
        tokenData = jwtDecode(tokenCookie)
    }

    /* editor header show/hide start */
    useEffect(() => {
        if(pathname === '/edit/[edit]' || pathname === '/settings/[id]'){
            setEditorHeaderStatus(true);
            headerContainer.current.style.maxWidth = '1550px';
        }else{
            setEditorHeaderStatus(false);
            headerContainer.current.style.maxWidth = '1200px';
        }
    },[router]);
    /* editor header show/hide end */

    /* reset create link data from store start */
    useEffect(() => {
        dispatch(resetCreateLinkDataACT(true));
        checkPlanFeature();
    }, []);
    /* reset create link data from store end */

    useEffect(() => {
        /* if(pathname !== '/edit/[edit]'){
            dispatch(resetEditorData(true));
        } */
        headerContainer.current.classList.remove(styles.openNav);
    }, [router.route]);
    
    /* menu toggle outside click start */
    useEffect(() => {
        function handleClickOutside(event) {
            if (headerNav.current && !headerNav.current.contains(event.target)) {
                headerContainer.current.classList.remove(styles.openNav);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [headerNav]);
    /* menu toggle outside click end */

    const navToggle = () => {
        headerContainer.current.classList.add(styles.openNav);
    }

    const shareURLClick = () => {
        const pageurl = process.env.APP_URL + (props.editor.editorData ? props.editor.editorData.slug : '');
        if(pageurl){
            let name = props.editor.editorData.profile.name;
            let tagline = props.editor.editorData.profile.tagline;
            let shareData = {
                title: name,
                text: tagline,
                url: pageurl
            }
            navigator.share(shareData);
        }
    }

    const editorHeaderBackBtn = () => {
        if(router.pathname === '/edit/[edit]'){
            if(tokenData?.role === 1){
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
            <div className={styles.header_wrapper} style={pathname === '/settings/[id]'? {marginBottom : 0} : {marginBottom : 50}}>
                <div className="pu_container" ref={headerContainer}>
                    <div className={styles.header_inner}>
                        <Link href={tokenData?.role === 2 ? "/dashboard" :"/admin/dashboard"}>
                            <a className={styles.header_logo}>
                                {/* {svg.logo} */}
                                <img src="/images/fl.png" alt="" />
                            </a>                        
                        </Link>
                        {editorHeaderStatus === false ?
                            <div className={styles.nav_toggle} onClick={() => navToggle()}>
                                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M0.833403 8.33236C0.612371 8.33236 0.400392 8.24456 0.244098 8.08826C0.0878049 7.93197 0 7.71999 0 7.49896V0.833403C0 0.612371 0.0878049 0.400392 0.244098 0.244098C0.400392 0.0878048 0.612371 0 0.833403 0H7.50063C7.72166 0 7.93364 0.0878048 8.08993 0.244098C8.24622 0.400392 8.33403 0.612371 8.33403 0.833403V7.49896C8.33403 7.71999 8.24622 7.93197 8.08993 8.08826C7.93364 8.24456 7.72166 8.33236 7.50063 8.33236H0.833403ZM12.501 8.33236C12.28 8.33236 12.068 8.24456 11.9117 8.08826C11.7554 7.93197 11.6676 7.71999 11.6676 7.49896V0.833403C11.6676 0.612371 11.7554 0.400392 11.9117 0.244098C12.068 0.0878048 12.28 0 12.501 0H19.1666C19.3876 0 19.5996 0.0878048 19.7559 0.244098C19.9122 0.400392 20 0.612371 20 0.833403V7.49896C20 7.71999 19.9122 7.93197 19.7559 8.08826C19.5996 8.24456 19.3876 8.33236 19.1666 8.33236H12.501ZM0.833403 20C0.612371 20 0.400392 19.9122 0.244098 19.7559C0.0878049 19.5996 0 19.3876 0 19.1666V12.4994C0 12.2783 0.0878049 12.0664 0.244098 11.9101C0.400392 11.7538 0.612371 11.666 0.833403 11.666H7.50063C7.72166 11.666 7.93364 11.7538 8.08993 11.9101C8.24622 12.0664 8.33403 12.2783 8.33403 12.4994V19.1666C8.33403 19.3876 8.24622 19.5996 8.08993 19.7559C7.93364 19.9122 7.72166 20 7.50063 20H0.833403ZM12.501 20C12.28 20 12.068 19.9122 11.9117 19.7559C11.7554 19.5996 11.6676 19.3876 11.6676 19.1666V12.4994C11.6676 12.2783 11.7554 12.0664 11.9117 11.9101C12.068 11.7538 12.28 11.666 12.501 11.666H19.1666C19.3876 11.666 19.5996 11.7538 19.7559 11.9101C19.9122 12.0664 20 12.2783 20 12.4994V19.1666C20 19.3876 19.9122 19.5996 19.7559 19.7559C19.5996 19.9122 19.3876 20 19.1666 20H12.501Z" fill="#F9913A"/></svg>
                                <span>Menu</span>
                            </div> : null 
                        }
                        {editorHeaderStatus === false ? 
                            <>
                                <div className={styles.header_nav} ref={headerNav}>
                                    <ul>
                                        {tokenData?.role === 2 ? 
                                            <>
                                                <li>
                                                    <Link href="/dashboard">
                                                        <a className={isActive('/dashboard')}>Dashboard</a>
                                                    </Link>
                                                </li>
                                                <li>
                                                    <Link href="/links">
                                                        <a className={isActive('/links')}>My Links</a>
                                                    </Link>
                                                </li>
                                                <li>
                                                    <Link href="/templates">
                                                        <a className={isActive('/templates')}>Templates</a>
                                                    </Link>
                                                </li>
                                                {isEnabled ? 
                                                <li>
                                                    <Link href="/checkout">
                                                        <a className={isActive('/checkout')}>Pricing</a>
                                                    </Link>
                                                </li>
                                                : ''
                                                }
                                            </>
                                            :
                                            <>
                                                <li>
                                                    <Link href="/admin/dashboard">
                                                        <a className={isActive('/admin/dashboard')}>Dashboard</a>
                                                    </Link>
                                                </li>
                                                <li>
                                                    <Link href="/admin/users">
                                                        <a className={isActive('/admin/users')}>Users</a>
                                                    </Link>
                                                </li>
                                                <li>
                                                    <Link href="/admin/template-categories">
                                                        <a className={isActive('/admin/template-categories')}>Categories</a>
                                                    </Link>
                                                </li>
                                                <li className={styles.nav_dropdown}>
                                                <a className={isActive('/admin/plans') || isActive('/admin/coupons')}>Plans</a>
                                                    <ul>
                                                        <li>
                                                            <Link href="/admin/plans">
                                                                <a className={isActive('/admin/plans')}>All Plans</a>
                                                            </Link>
                                                        </li>
                                                        <li>
                                                            <Link href="/admin/coupons">
                                                                <a className={isActive('/admin/coupons')}>Coupons</a>
                                                            </Link>
                                                        </li>
                                                        <li>
                                                            <Link href="/admin/pendingPayments">
                                                                <a className={isActive('/admin/pendingPayments')}>Payments</a>
                                                            </Link>
                                                        </li>
                                                    </ul>
                                                </li>
                                                <li>
                                                    <Link href="/admin/templates">
                                                        <a className={isActive('/admin/templates')}>Templates</a>
                                                    </Link>
                                                </li>
                                                <li className={styles.nav_dropdown}>
                                                    <a className={isActive('/admin/themes') || isActive('/admin/iconpack')}>Resources</a>
                                                    <ul>
                                                        {/* <li>
                                                            <Link href="/admin/themes">
                                                                <a className={isActive('/admin/themes')}>Themes</a>
                                                            </Link> 
                                                        </li> */}
                                                        <li>
                                                            <Link href="/admin/icontype">
                                                                <a className={isActive('/admin/icontype')}>Icon Type</a>
                                                            </Link> 
                                                        </li>
                                                        <li>
                                                            <Link href="/admin/iconpack">
                                                                <a className={isActive('/admin/iconpack')}>Icon Pack</a>
                                                            </Link> 
                                                        </li>
                                                    </ul>
                                                </li>
                                            </>
                                        }
                                        
                                    </ul>
                                </div>
                                <div className={styles.header_right_action}>
                                    <div className={'pu_dropdown_wrapper ' + styles.header_profile}>
                                        <div className={'pu_dropdown_toggle ' + styles.header_avatar} data-toggle="dropdown">
                                            <div className={styles.header_avatar_icon}>
                                                <span className={styles.header_avatar_icon_initial}>{getNameInitials(cData.userData ? cData.userData.name : 'Unknown')}</span>
                                                {cData.userData.profile_img ? <img src={cData.userData.profile_img} alt="" /> : '' }
                                            </div>
                                            <div className={styles.header_avatar_details}>
                                                <p>Hi, <span>{cData.userData.name.split(' ')[0]}</span></p>
                                            </div>
                                            <div className={styles.header_avatar_arrow}>
                                                <svg width="8" height="5" viewBox="0 0 8 5" fill="none" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" clipRule="evenodd" d="M4.46201 4.99102L0.988007 0.986023H7.99701L4.46201 4.99102Z" fill="#9AA4CC"/></svg>
                                            </div>
                                        </div>
                                        <div className={'pu_dropdown_dd ' + styles.profile_dropdown}>
                                            <div className={styles.profile_dropdown_details}>
                                                <h3>{cData.userData.name}</h3>
                                                <p>{cData.userData.email}</p>
                                            </div>
                                            <ul>
                                                <li><Link href={tokenData?.role === 2 ? "/profile" :"/admin/profile"}><a className="pu_dropdown_link">Profile</a></Link></li>
                                                {tokenData?.role === 1 ?
                                                <li><Link href={"/admin/settings"}><a className="pu_dropdown_link">Payment Settings</a></Link>
                                                <Link href={"/admin/emailSettings"}><a className="pu_dropdown_link">Email Settings</a></Link></li>

                                                : ''
                                                }
                                                {tokenData?.role === 2 ?
                                                <li><Link href={"/billings"}><a className="pu_dropdown_link">Billing History</a></Link></li>
                                                : ''
                                                }
                                                <li><a onClick={ () => dispatch(logout())}>Logout</a></li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>                        
                            </>
                            :
                            <>
                                <div className={styles.editor_title}>
                                    <span onClick={() => editorHeaderBackBtn()} ><a className="pu_back_arrow">
                                        <span className="pu_back_arrow_icon">{svg.back_arrow}</span> 
                                        {pathname === '/settings/[id]' ? 'Back to Editor' : 'Back'}
                                    </a></span>
                                    <p>{props.editor.editorData ? props.editor.editorData.title : 'Unknown'}</p>
                                </div>
                                <div className={styles.header_right_action +' '+ styles.editor_header_right}>
                                    <AutoSaveLoader />
                                    {pathname !== '/settings/[id]' ?
                                        <Link href={"/settings/" + tempId}><a className={"pu_btn pu_btn_border " + styles.pu_btn +' '+ styles.pu_btn_settings}>{svg.icon_page_setting} Settings</a></Link>  : null
                                    }
                                    <div className={styles.copy_url_box_wrapper}>
                                        <CopyURLBox url={process.env.APP_URL + (props.editor.editorData ? props.editor.editorData.slug : '')} />
                                    </div>

                                    <button className={"pu_btn " + styles.pu_btn +' '+ styles.pu_btn_share} onClick={() => shareURLClick()}>{svg.icon_share} Share</button>

                                    <div className={styles.header_right_action_mobile}>
                                        <Link href={"/settings/" + tempId}>
                                            <a className="pu_btn_icon">{svg.icon_page_setting}</a>
                                        </Link>
                                        <a href={process.env.APP_URL + (props.editor.editorData ? props.editor.editorData.slug : '')} target="_blank" rel="noreferrer" className="pu_btn_icon">{svg.header_icon_link}</a>
                                        <div className="pu_btn_icon" onClick={() => shareURLClick()}>{svg.header_icon_share}</div>
                                    </div>

                                </div>
                            </>

                        }
                    </div>
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
//export default Header;
export default compose(connect(mapStateToProps , null))(Header)
