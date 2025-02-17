import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";
import svg from "../../src/helper/svg";
import styles from '../../styles/Auth.module.css';
import validator from 'validator';
import { AlertMsg } from "../../src/helper/helper";
import { common } from '../../src/helper/Common';

const ResetPassword = () => {
    const router = useRouter();
    const [password, setPassword] = useState('');
    const [cpassword, setCPassword] = useState('');

    const onFormSubmit = async (e, submitType) => {
        e.preventDefault();
        const emptypassword = validator.isEmpty(password, {ignore_whitespace:true});
        const emptycpassword = validator.isEmpty(cpassword, {ignore_whitespace:true});
        const passlength = validator.isLength(password, {min:3, max:15});
        const cpasslength = validator.isLength(cpassword, {min:3, max:15});

        if(emptypassword || emptycpassword){
            AlertMsg('error', 'Oops!', 'Field can not be empty!');
            return false;
        }
        if(!passlength || !cpasslength){
            AlertMsg('error', 'Oops!', 'Password should be between 3 to 15 characters.');
            return false;
        }
        if(password !== cpassword){
            AlertMsg('error', 'Oops!', 'Password should match with confirm password.');
            return false;
        }

        await common.getAPI({
            method : 'POST',
            url : 'auth/resetPassword',
            data : {
                token : router.query.token,
                password : password
            }
        }, (resp) => {
            if(resp.status === "success"){
                router.push('/auth/login');
            }
        });
    }

    return (
        <>
            <Head> 
                <title>PixaURL - Reset Password</title>   
                <meta httpEquiv="X-UA-Compatible" content="IE=edge"/>
                <meta name="viewport" content="width=device-width, initial-scale=1"/>
                <meta content="width=device-width, initial-scale=1.0" name="viewport" />
                <meta name="description" content=""/>
                <meta name="keywords" content=""/>
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
                        <form onSubmit={(e) => onFormSubmit(e)}>
                            <h3>Reset password</h3>
                            <p>Enter your new password.</p>
                            <div className={styles.auth_input_wrapper}>
                                <input type="password" className={styles.auth_input} placeholder="Password" name="password" value={password} onChange={(e) => setPassword(e.target.value)} />
                            </div>
                            <div className={styles.auth_input_wrapper}>
                                <input type="password" className={styles.auth_input} placeholder="Confirm Password" name="cpassword" value={cpassword} onChange={(e) => setCPassword(e.target.value)} />
                            </div>
                            <button type="submit" className="pu_btn pu_btn_big">Reset Password</button>
                            <div className={styles.auth_footer}>Already Have Account? <Link href="/auth/login"><a>Login</a></Link></div>
                        </form>
                    </div>
                </div>
            </div>
        </>
    );
}

export default ResetPassword;