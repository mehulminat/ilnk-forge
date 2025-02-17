import React, {Component, useState, useEffect} from 'react';
import Router , { useRouter, withRouter } from 'next/router';
import { connect } from 'react-redux';
import { compose } from 'redux';
import Head from 'next/head';
import Link from 'next/link';
import validator from 'validator';
import Cookies from 'js-cookie';

import svg from '../../src/helper/svg';
import styles from '../../styles/Auth.module.css';
import { authAction } from '../../src/redux/actions/authAction';
import { AlertMsg } from '../../src/helper/helper';

const Auth = (props) => {
    const router = useRouter();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [isRememberMe, setIsRememberMe] = useState(false);

    const [isVerify, setIsVerify] = useState(false);

    const onFormSubmit = async (e, submitType) => {
        e.preventDefault();

        const emptyemail = validator.isEmpty(email, {ignore_whitespace:true});
        const emptypassword = validator.isEmpty(password, {ignore_whitespace:true});
        const isemail = validator.isEmail(email);
        const passlength = validator.isLength(password, {min:3, max:15});
        
        if(authType === 'forgot-password'){
            if(emptyemail){
                AlertMsg('error', 'Oops!', 'Field can not be empty!');
                return false;
            }
        }else{
            if(emptyemail || emptypassword){
                AlertMsg('error', 'Oops!', 'Field can not be empty!');
                return false;
            }
            if(!passlength){
                AlertMsg('error', 'Oops!', 'Password should be between 3 to 15 characters.');
                return false;
            }
        }
        if(!isemail){
            AlertMsg('error', 'Oops!', 'Email Is not valid!');
            return false;
        }
        
        props.authAction(submitType, {email,password,name});
        setIsVerify(true);
    }
    let authType = props.router.query.auth
        authType = typeof authType == 'undefined'?'login':authType;

    let authTitle = '';
    if(authType === 'login'){
        authTitle = 'PixaURL - Login'
    }else if(authType === 'registration'){
        authTitle = 'PixaURL - SignUp'
    }else if(authType === 'forgot-password'){
        authTitle = 'PixaURL - Forgot Password'
    }

    /* show/hide password start */
    const showHidePassword = () => {
        if(showPassword === true){
            setShowPassword(false);
        }else{
            setShowPassword(true);
        }
    }
    /* show/hide password end */

    /* remember password start */
    const rememberMe = (e) => {
        if(e.target.checked){
            const data = { 
                "email" : email, 
                "password" : password 
            }
            Cookies.set('remember_me', JSON.stringify(data));
            setIsRememberMe(true);
        }else{
            Cookies.remove('remember_me');
            setIsRememberMe(false);
        }
    }
    /* remember password end */

    /* remember me start */
    useEffect(() => {
        if(router.query.auth === 'login'){
            if(Cookies.get('remember_me')){
                const rememberMeData = JSON.parse(Cookies.get('remember_me'));
                if(rememberMeData.email){
                    setIsRememberMe(true);
                    setEmail(rememberMeData.email);
                    setPassword(rememberMeData.password);
                }
            }
        }else{
            setEmail('');
            setPassword('');
        }
    }, [router.query]);
    /* remember me end */

    return (
        <>
            <Head> 
                <title>{authTitle}</title>   
                <meta httpEquiv="X-UA-Compatible" content="IE=edge"/>
                <meta name="viewport" content="width=device-width, initial-scale=1"/>
                <meta content="width=device-width, initial-scale=1.0" name="viewport" />
                <meta name="description" content="Connect and manage all your social links in one place. Organize your social handles into a single tap. Get a link and work smart."/>
                <meta name="keywords" content="pixaurl, pixaurl.com, pixa url, biolink, bio link, miniwebsite, mini website, social link, personal link, portfolio link, bio link generator"/>
                <meta name="author" content="PixelNX Pvt. Ltd."/>
                <meta name="MobileOptimized" content="320"/>   
            </Head>
            <div className={styles.auth_bg}>
                <span className={styles.auth_bg_circle +' '+ styles.auth_bg_circle_1}></span>
                <span className={styles.auth_bg_circle +' '+ styles.auth_bg_circle_2}></span>
                <span className={styles.auth_bg_circle +' '+ styles.auth_bg_circle_3}></span>
            </div>
            <div className={styles.auth_wrapper}>
                <div className={styles.auth_header}>
                    <div className={styles.auth_header_logo}>
                        <Link href="/"><a>{svg.logo}</a></Link>
                    </div>
                </div>
                <div className={styles.auth_inner}>
                    <div className={styles.auth_box}>
                        <form onSubmit={(e) => onFormSubmit(e , authType)}>
                        {
                        authType == 'registration' ?
                            <>
                                {!isVerify ? 
                                    <>
                                        <h3>Let’s Started with <span>PixaURL.</span></h3>
                                        <p>Connect and manage all your social links at one place</p>
                                        <div className={styles.auth_input_wrapper}>
                                            <input type="text" className={styles.auth_input} placeholder="Enter Name" name="name" value={name} onChange={(e) => setName(e.target.value)} />
                                        </div>
                                        <div className={styles.auth_input_wrapper}>
                                            <input type="text" className={styles.auth_input} placeholder="Enter Email" name="email" value={email} onChange={(e) => setEmail(e.target.value)} />
                                        </div>
                                        <div className={styles.auth_input_wrapper}>
                                            <input type={showPassword === true ? "text" : "password"} className={styles.auth_input} placeholder="Password" name="password" value={password} onChange={(e) => setPassword(e.target.value)} />
                                            <span className={styles.pu_auth_icon +' '+ styles.pu_auth_showhide_password} onClick={() => showHidePassword()} >{svg.password_eye}</span>
                                        </div>
                                        <br/>
                                        <button type="submit" className="pu_btn pu_btn_big">Create Account</button>
                                        <div className={styles.auth_footer}>Already Have Account? <Link href="/auth/login"><a>Login</a></Link></div>
                                    </> : 
                                    <>
                                        <div className={styles.isverify_wrapper}>
                                            <h3>Verify Your Email</h3><br/>
                                            <p>We send an email with a link to verify your account. If you have not received the email after a few minutes, please check your spam folder.</p>
                                            <p>If you already verify your email.</p>
                                            <Link href="/auth/login"><a className="pu_btn">Login Now</a></Link>
                                        </div>
                                    </>
                                }
                                
                            </>

                        : (authType == 'forgot-password' ?
                            <>
                                <h3>Forgot Your Password?</h3>
                                <p>Enter your account email, We will send you instructions <br/>to reset your password.</p>
                                <div className={styles.auth_input_wrapper}>
                                    <input type="text" className={styles.auth_input} placeholder="Enter Email" value={email} onChange={(e) => setEmail(e.target.value)} />
                                </div>
                                <br/>
                                <button type="submit" className="pu_btn pu_btn_big">Submit</button>
                                <div className={styles.auth_footer}>Already Have Account? <Link href="/auth/login"><a>Login</a></Link></div>
                            </>
                            
                            :

                            <>
                                <h3>Welcome Back to <span>PixaURL</span></h3>
                                <p>Connect and manage all your social links at one place</p>
                                <div className={styles.auth_input_wrapper}>
                                    <input type="text" className={styles.auth_input} placeholder="Your Email" name="email" value={email} onChange={(e) => setEmail(e.target.value)} />
                                </div>
                                <div className={styles.auth_input_wrapper}>
                                    <input type={showPassword === true ? "text" : "password"} className={styles.auth_input} placeholder="Password" name="password" value={password} onChange={(e) => setPassword(e.target.value)} />
                                    <span className={styles.pu_auth_icon +' '+ styles.pu_auth_showhide_password} onClick={() => showHidePassword()} >{svg.password_eye}</span>
                                </div>
                                <div className={styles.auth_forgotremember}>
                                    <div className="pu_checkbox">
                                        <input type="checkbox" id="remember_me" checked={isRememberMe === true ? 'checked' : ''} onChange={(e) => rememberMe(e)} />
                                        <label htmlFor="remember_me">Remember me</label>
                                    </div>
                                    <Link href="/auth/forgot-password"><a className={styles.auth_forgot}>Forgot Password?</a></Link>
                                </div>
                                <button type="submit" className="pu_btn pu_btn_big">Login</button>
                                <div className={styles.auth_footer}>Don’t have an Account? <Link href="/auth/registration"><a>Sign up</a></Link></div>
                            </>
                            
                        )
                        }
                        </form>
                    </div>


                </div>
            </div>
        </>
    )
}

const mapStateToProps = (state) => {
    return {
		...state,
	};
};

const mapDispatchToProps = (dispatch) => {
	return {
        authAction: (type , data) => dispatch( authAction(type , data) )
	};
};

export default compose(withRouter,connect(mapStateToProps,mapDispatchToProps))(Auth)