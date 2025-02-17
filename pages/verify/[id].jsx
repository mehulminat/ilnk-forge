import Head from 'next/head';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { common } from '../../src/helper/Common';
import svg from '../../src/helper/svg';
import styles from '../../styles/Auth.module.css';
const AuthVerify = () => {
    const router = useRouter();
    const [invalidToken, setInvalidToken] = useState(false);
    useEffect(() => {
        if(router.query.id){
            common.getAPI({
                method: "POST",
                url: 'auth/userAccountActive',
                data: {
                    token : router.query.id
                }
            },
            (resp) => {
                if(resp.status === "success"){
                    router.push('/auth/login');
                }else{
                    setInvalidToken(true);
                }
            });
        }
    },[router.query]);
    return (
        <>
            <Head> 
                <title>PixaURL - Verify</title>   
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
                        {svg.logo}
                    </div>
                </div>
                <div className={styles.auth_inner}>
                    <div className={styles.auth_box}>
                        {!invalidToken ? 
                        <>
                            <p>Invalid Token</p>
                        </> 
                        : 
                        <>
                            <p>Redirecting...</p>
                        </>
                        }
                    </div>
                </div>
            </div>
        </>
    );
}

export default AuthVerify;