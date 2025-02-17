import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Router, { useRouter } from 'next/router';
import $ from "jquery";

import Cookies from 'js-cookie';
import Head from 'next/head';
import Alert from './common/Alert';

import { logout} from '../redux/actions/authAction';
import Header from './common/header/Header';
import RemovePopup from './common/removePopup';
import { jwtDecode } from 'jwt-decode'

let Layout = function({children}){

    useEffect(() => {
        /* dropdown start */
        $(document).on('click', '.pu_dropdown_toggle', function(){
            $(this).parent().addClass('open');
        });
        $(document).on('click', '.pu_dropdown_link', function(){
            $('.pu_dropdown_wrapper').removeClass('open');
        });

        $(document).mouseup(function(e){
            var container = $(".pu_dropdown_dd");
            if (!container.is(e.target) && container.has(e.target).length === 0){
                $('.pu_dropdown_wrapper').removeClass('open');
            }
        });
        /* dropdown end */

        /* color picker start */
        $(document).on('click', '.pu_color_picker_toggle', function(){
            $(this).parent().addClass('open');
        });
        $(document).mouseup(function(e){
            var container = $(".pu_color_picker_dropdown");
            if (!container.is(e.target) && container.has(e.target).length === 0){
                $('.pu_color_picker_wrapper').removeClass('open');
            }
        });
        /* color picker end */
    }, [])

    let dispatch = useDispatch();
    const store = useSelector(store => store);
    const router = useRouter();
    let adminUrl = router.pathname.split('/admin/').length >= 2 ? 1 : 0;
    let userUrl = router.pathname.split('/user/').length >= 2 ? 1 : 0;
    let adminDashboard = "/admin/dashboard";
    let userDashboard = "/dashboard";
    let isAuthPage = ['/' ,'/pricing', '/auth/[auth]', '/verify/[id]', '/reset-password/[token]'].includes(router.pathname);
    let tokenCookie = Cookies.get('accessToken') ? Cookies.get('accessToken') : false;
    let tokenData
    if(tokenCookie){
        tokenData = jwtDecode(tokenCookie)
    }
    if (router.pathname.split('/preview/[template_id]/[id]').length > 1 || router.pathname === '/[link_preview]' || router.pathname === '/[link_preview]/[id]') { //preview page
        return ( 
            <> 
                <Head>
                    <title>{store.common.title}</title>
                    <meta httpEquiv="X-UA-Compatible" content="IE=edge"/>
                    <meta name="viewport" content="width=device-width, initial-scale=1"/>
                    <meta content="width=device-width, initial-scale=1.0" name="viewport" />
                    <meta name="description" content={store.common.description}/>
                    <meta name="keywords" content={store.common.keywords}/>
                    <meta name="author" content="PixelNX Pvt. Ltd."/>
                    <meta name="MobileOptimized" content="320"/>
                    <link rel="shortcut icon" type="image/ico" href="/images/favicon.png" />
                </Head>
                <div className="pu_preloader">
                    <div className="pu_preloader_inner">
                        <svg width="54" height="54" viewBox="0 0 54 54" fill="none" xmlns="http://www.w3.org/2000/svg"><g filter="url(#filter0_d_41_8)"><path className="pu_preloader_box" fillRule="evenodd" clipRule="evenodd" d="M21.593 1.003H32.399C40.467 1.003 47.007 7.538 47.007 15.6C47.007 15.6 47.007 17.981 47.007 20.507C47.007 23.36 47.007 26.397 47.007 26.397C47.007 34.459 40.467 40.994 32.399 40.994H21.593C13.525 40.994 6.985 34.459 6.985 26.397V15.6C6.985 7.538 13.525 1.003 21.593 1.003Z" fill="white"/></g><path className="pu_preloader_box" d="M21.593 1.003H32.399C40.467 1.003 47.007 7.538 47.007 15.6C47.007 15.6 47.007 17.981 47.007 20.507C47.007 23.36 47.007 26.397 47.007 26.397C47.007 34.459 40.467 40.994 32.399 40.994H21.593C13.525 40.994 6.985 34.459 6.985 26.397V15.6C6.985 7.538 13.525 1.003 21.593 1.003Z" fill="url(#paint0_linear_41_8)"/><g filter="url(#filter1_d_41_8)"><path fillRule="evenodd" clipRule="evenodd" d="M35.743 20.391C35.579 20.958 35.338 21.501 35.026 22.005C34.415 22.994 33.548 23.809 32.517 24.364C32.077 24.608 31.592 24.8 31.074 24.936C31.03 24.948 30.975 24.963 30.912 24.978C30.906 24.979 30.899 24.981 30.893 24.982C30.887 24.984 30.88 24.986 30.873 24.987C30.672 25.035 30.467 25.073 30.263 25.102C30.162 25.117 30.06 25.13 29.956 25.141V26.657C29.956 27.225 29.875 27.757 29.715 28.237C29.515 28.837 29.195 29.36 28.764 29.791C28.541 30.015 28.288 30.211 28.014 30.376C27.758 30.53 27.48 30.657 27.188 30.754C26.696 30.918 26.152 31.002 25.571 31.002C23.957 31.002 22.962 30.348 22.412 29.801C22.186 29.575 21.987 29.321 21.822 29.044C21.669 28.789 21.543 28.511 21.447 28.219C21.287 27.733 21.209 27.196 21.215 26.623V24.308H21.214C21.214 24.308 21.214 23.756 21.214 22.882H21.219C21.426 22.882 21.633 22.882 21.633 22.882V22.057H21.214V15.007H21.233C21.267 14.678 21.35 14.357 21.482 14.05C21.653 13.652 21.898 13.295 22.209 12.989C22.519 12.683 22.882 12.443 23.287 12.274C23.707 12.099 24.152 12.011 24.609 12.011H24.878H25.818H25.949H29.311C29.763 12.011 30.215 12.056 30.656 12.144C31.086 12.231 31.51 12.36 31.914 12.529C32.311 12.694 32.694 12.898 33.051 13.136C33.405 13.371 33.737 13.641 34.039 13.938C34.341 14.235 34.615 14.562 34.854 14.91C35.095 15.262 35.303 15.638 35.47 16.028C35.642 16.427 35.773 16.843 35.861 17.267C35.951 17.7 35.997 18.145 35.997 18.59C35.997 19.201 35.911 19.807 35.743 20.391ZM21.772 17.378V18.341H22.748V17.378H21.772ZM22.469 19.855V20.405H23.027V19.855H22.469ZM23.167 15.176H22.469V15.864H23.167V15.176ZM23.167 24.809H22.33V25.635H23.167V24.809ZM29.311 14.561H25.949H25.818H24.878H24.609C24.164 14.561 23.803 14.916 23.803 15.354V16.478V16.544H23.806C23.84 16.948 24.181 17.266 24.598 17.271C24.602 17.271 24.605 17.271 24.609 17.271C25.027 17.271 25.432 17.271 25.818 17.271C27.745 17.271 29.177 17.271 29.177 17.271C29.956 17.271 30.587 17.893 30.587 18.66C30.587 19.426 29.956 20.048 29.177 20.048C29.177 20.048 27.534 20.048 26.065 20.048C25.759 20.048 25.46 20.048 25.186 20.048C24.977 20.048 24.783 20.048 24.609 20.048C24.554 20.048 24.501 20.048 24.451 20.048L24.436 20.067C24.074 20.144 23.803 20.462 23.803 20.841C23.803 20.852 23.804 20.863 23.805 20.874L23.803 20.876C23.803 21.63 23.803 22.626 23.803 22.626V26.64C23.788 27.839 24.387 28.459 25.571 28.459C26.769 28.459 27.368 27.859 27.368 26.66V22.652H28.935C29.275 22.652 29.593 22.63 29.889 22.586C30.021 22.567 30.152 22.542 30.28 22.512C30.284 22.511 30.289 22.51 30.293 22.509C30.328 22.5 30.364 22.491 30.399 22.482C30.716 22.398 31.004 22.285 31.262 22.141C32.54 21.458 33.409 20.126 33.409 18.594C33.409 16.366 31.574 14.561 29.311 14.561ZM20.099 22.057H20.935V22.882H20.099V22.057ZM19.82 19.304H20.377V19.855H19.82V19.304ZM19.68 13.524H20.377V14.212H19.68V13.524ZM20.099 16.827H19.122V15.864H20.099V16.827ZM19.401 24.258H18.565V23.433H19.401V24.258ZM18.007 21.231H18.565V21.781H18.007V21.231ZM18.007 18.203H18.565V18.754H18.007V18.203Z" fill="white"/></g><defs><filter id="filter0_d_41_8" x="0.661001" y="0.679" width="52.67" height="52.639" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB"><feFlood floodOpacity="0" result="BackgroundImageFix"/><feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/><feOffset dy="6"/><feGaussianBlur stdDeviation="3.162"/><feColorMatrix type="matrix" values="0 0 0 0 1 0 0 0 0 0.568627 0 0 0 0 0.392157 0 0 0 0.3 0"/><feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_41_8"/><feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_41_8" result="shape"/></filter><filter id="filter1_d_41_8" x="16.007" y="12.011" width="21.99" height="22.991" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB"><feFlood floodOpacity="0" result="BackgroundImageFix"/><feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/><feOffset dy="2"/><feGaussianBlur stdDeviation="1"/><feComposite in2="hardAlpha" operator="out"/><feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.05 0"/><feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_41_8"/><feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_41_8" result="shape"/></filter><linearGradient id="paint0_linear_41_8" x1="34.7867" y1="29.7701" x2="7.00729" y2="0.981489" gradientUnits="userSpaceOnUse"><stop stopColor="#FF5874"/><stop offset="1" stopColor="#FFAD5D"/></linearGradient></defs></svg>
                        <p className="pu_preloader_text hide">Loading...</p>
                    </div>
                </div>
                {children}
            </> 
        )
    }else{
        if((!tokenCookie || !store.userData.token) && !isAuthPage){//member page withoud token
            dispatch(logout())
        }else if(store.userData.token && tokenCookie && store.userData.token != tokenCookie ){
            dispatch(logout())
        }else{
            if(tokenCookie && store.userData.token && isAuthPage){//check user login and access any auth pages
                //Router.push(store.userData.role == true?adminDashboard : userDashboard);
                if(tokenData?.role == 1){
                    Router.push(adminDashboard);
                }else if(tokenData?.role == 2){
                    if(router.pathname !== '/'){
                        Router.push(adminDashboard);
                    }
                }
            }else{
                if(tokenData?.role == 2 && adminUrl) { //restriction user for admin page access
                    Router.push(userDashboard);
                } else if (tokenData?.role == 1 && userUrl) { //restriction admin for user page access
                    Router.push(adminDashboard);
                }
            }
        }

        return (
            <>
                <Head>
                    <title>{store.common.title}</title>
                    <meta httpEquiv="X-UA-Compatible" content="IE=edge"/>
                    <meta name="viewport" content="width=device-width, initial-scale=1"/>
                    <meta content="width=device-width, initial-scale=1.0" name="viewport" />
                    <meta name="description" content={store.common.description}/>
                    <meta name="keywords" content={store.common.keywords}/>
                    <meta name="author" content="PixelNX Pvt. Ltd."/>
                    <meta name="MobileOptimized" content="320"/>
                    <link rel="shortcut icon" type="image/ico" href="/images/favicon.png" />
                </Head>
                <div className="pu_preloader">
                    <div className="pu_preloader_inner">
                        <svg width="54" height="54" viewBox="0 0 54 54" fill="none" xmlns="http://www.w3.org/2000/svg"><g filter="url(#filter0_d_41_8)"><path className="pu_preloader_box" fillRule="evenodd" clipRule="evenodd" d="M21.593 1.003H32.399C40.467 1.003 47.007 7.538 47.007 15.6C47.007 15.6 47.007 17.981 47.007 20.507C47.007 23.36 47.007 26.397 47.007 26.397C47.007 34.459 40.467 40.994 32.399 40.994H21.593C13.525 40.994 6.985 34.459 6.985 26.397V15.6C6.985 7.538 13.525 1.003 21.593 1.003Z" fill="white"/></g><path className="pu_preloader_box" d="M21.593 1.003H32.399C40.467 1.003 47.007 7.538 47.007 15.6C47.007 15.6 47.007 17.981 47.007 20.507C47.007 23.36 47.007 26.397 47.007 26.397C47.007 34.459 40.467 40.994 32.399 40.994H21.593C13.525 40.994 6.985 34.459 6.985 26.397V15.6C6.985 7.538 13.525 1.003 21.593 1.003Z" fill="url(#paint0_linear_41_8)"/><g filter="url(#filter1_d_41_8)"><path fillRule="evenodd" clipRule="evenodd" d="M35.743 20.391C35.579 20.958 35.338 21.501 35.026 22.005C34.415 22.994 33.548 23.809 32.517 24.364C32.077 24.608 31.592 24.8 31.074 24.936C31.03 24.948 30.975 24.963 30.912 24.978C30.906 24.979 30.899 24.981 30.893 24.982C30.887 24.984 30.88 24.986 30.873 24.987C30.672 25.035 30.467 25.073 30.263 25.102C30.162 25.117 30.06 25.13 29.956 25.141V26.657C29.956 27.225 29.875 27.757 29.715 28.237C29.515 28.837 29.195 29.36 28.764 29.791C28.541 30.015 28.288 30.211 28.014 30.376C27.758 30.53 27.48 30.657 27.188 30.754C26.696 30.918 26.152 31.002 25.571 31.002C23.957 31.002 22.962 30.348 22.412 29.801C22.186 29.575 21.987 29.321 21.822 29.044C21.669 28.789 21.543 28.511 21.447 28.219C21.287 27.733 21.209 27.196 21.215 26.623V24.308H21.214C21.214 24.308 21.214 23.756 21.214 22.882H21.219C21.426 22.882 21.633 22.882 21.633 22.882V22.057H21.214V15.007H21.233C21.267 14.678 21.35 14.357 21.482 14.05C21.653 13.652 21.898 13.295 22.209 12.989C22.519 12.683 22.882 12.443 23.287 12.274C23.707 12.099 24.152 12.011 24.609 12.011H24.878H25.818H25.949H29.311C29.763 12.011 30.215 12.056 30.656 12.144C31.086 12.231 31.51 12.36 31.914 12.529C32.311 12.694 32.694 12.898 33.051 13.136C33.405 13.371 33.737 13.641 34.039 13.938C34.341 14.235 34.615 14.562 34.854 14.91C35.095 15.262 35.303 15.638 35.47 16.028C35.642 16.427 35.773 16.843 35.861 17.267C35.951 17.7 35.997 18.145 35.997 18.59C35.997 19.201 35.911 19.807 35.743 20.391ZM21.772 17.378V18.341H22.748V17.378H21.772ZM22.469 19.855V20.405H23.027V19.855H22.469ZM23.167 15.176H22.469V15.864H23.167V15.176ZM23.167 24.809H22.33V25.635H23.167V24.809ZM29.311 14.561H25.949H25.818H24.878H24.609C24.164 14.561 23.803 14.916 23.803 15.354V16.478V16.544H23.806C23.84 16.948 24.181 17.266 24.598 17.271C24.602 17.271 24.605 17.271 24.609 17.271C25.027 17.271 25.432 17.271 25.818 17.271C27.745 17.271 29.177 17.271 29.177 17.271C29.956 17.271 30.587 17.893 30.587 18.66C30.587 19.426 29.956 20.048 29.177 20.048C29.177 20.048 27.534 20.048 26.065 20.048C25.759 20.048 25.46 20.048 25.186 20.048C24.977 20.048 24.783 20.048 24.609 20.048C24.554 20.048 24.501 20.048 24.451 20.048L24.436 20.067C24.074 20.144 23.803 20.462 23.803 20.841C23.803 20.852 23.804 20.863 23.805 20.874L23.803 20.876C23.803 21.63 23.803 22.626 23.803 22.626V26.64C23.788 27.839 24.387 28.459 25.571 28.459C26.769 28.459 27.368 27.859 27.368 26.66V22.652H28.935C29.275 22.652 29.593 22.63 29.889 22.586C30.021 22.567 30.152 22.542 30.28 22.512C30.284 22.511 30.289 22.51 30.293 22.509C30.328 22.5 30.364 22.491 30.399 22.482C30.716 22.398 31.004 22.285 31.262 22.141C32.54 21.458 33.409 20.126 33.409 18.594C33.409 16.366 31.574 14.561 29.311 14.561ZM20.099 22.057H20.935V22.882H20.099V22.057ZM19.82 19.304H20.377V19.855H19.82V19.304ZM19.68 13.524H20.377V14.212H19.68V13.524ZM20.099 16.827H19.122V15.864H20.099V16.827ZM19.401 24.258H18.565V23.433H19.401V24.258ZM18.007 21.231H18.565V21.781H18.007V21.231ZM18.007 18.203H18.565V18.754H18.007V18.203Z" fill="white"/></g><defs><filter id="filter0_d_41_8" x="0.661001" y="0.679" width="52.67" height="52.639" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB"><feFlood floodOpacity="0" result="BackgroundImageFix"/><feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/><feOffset dy="6"/><feGaussianBlur stdDeviation="3.162"/><feColorMatrix type="matrix" values="0 0 0 0 1 0 0 0 0 0.568627 0 0 0 0 0.392157 0 0 0 0.3 0"/><feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_41_8"/><feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_41_8" result="shape"/></filter><filter id="filter1_d_41_8" x="16.007" y="12.011" width="21.99" height="22.991" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB"><feFlood floodOpacity="0" result="BackgroundImageFix"/><feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/><feOffset dy="2"/><feGaussianBlur stdDeviation="1"/><feComposite in2="hardAlpha" operator="out"/><feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.05 0"/><feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_41_8"/><feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_41_8" result="shape"/></filter><linearGradient id="paint0_linear_41_8" x1="34.7867" y1="29.7701" x2="7.00729" y2="0.981489" gradientUnits="userSpaceOnUse"><stop stopColor="#FF5874"/><stop offset="1" stopColor="#FFAD5D"/></linearGradient></defs></svg>
                        <p className="pu_preloader_text hide">Loading...</p>
                    </div>
                </div>
    
                <Alert />
                <div className="pu_main_wrapper">
                    {isAuthPage ?'': 
                        <>
                            <Header />
                        </>
                    }
                    
                    <div className={!isAuthPage ? 'pu_content_wrapper' : ''}>
                        {children}
                    </div>
                </div>
                <RemovePopup />
            </>
        )

    }

}
export default Layout
