import { useEffect, useState, React } from 'react';
import { connect, useDispatch, useSelector } from 'react-redux';
import { compose } from 'redux';
import { setPageHeading } from '../../../redux/actions/commonAction';
import styles from './Settings.module.css';
import { common } from '../../../helper/Common';

import { AlertMsg, Loading } from '../../../helper/helper';
import '../../../../node_modules/cropperjs/dist/cropper.css';
import currencies from '../../../helper/currencies'
import Tab from '@mui/material/Tab';
import { Tabs } from '@mui/material';
// import React from 'react';

const Settings = (props) => {
    let dispatch = useDispatch();
    useEffect(() => {
        dispatch(setPageHeading({
            pageHeading: "LinkForge - Setting",
            title: "LinkForge - Setting",
        }));
    }, [dispatch]);

    const store = useSelector(store => store);

    const [stripeKey, setStripeKey] = useState('');
    const [stripeSecret, setStripeSecret] = useState('');
    const [currencyCode, setCurrencyCode] = useState({});
    const [isEnable, setIsEnabled] = useState(false);
    const [isAdsEnable, setIsAdsEnable] = useState(false)
    const [adScript, setAdScript] = useState('')
    const [adScriptCode, setAdScriptcode] = useState('')
    const [message, setMessage] = useState('')

    const [paypalTestMode, setPaypalTestMode] = useState(false)
    const [paypalKey, setPaypalKey] = useState('')
    const [paypalSecret, setPaypalSecret] = useState('')
    const [tabValue, setTabValue] = useState(0);
    const [isEnableBankTransfer,setisEnableBankTransfer] = useState(false)
    const [bankTransferIns, setBankTransferIns] = useState('')
    const [razorpayKey, setRazorpayVendorID] = useState('')
    const [razorpaySecret, setRazorpayKey] = useState('')

    const handleChange = (event, newValue) => {
        setTabValue(newValue);
    };

    const handleCurrency = (currency) => {
        currencies.map(val => {
            if (val.title === currency) {
                setCurrencyCode(val)
            }
        })
    } 

    const handleSubmit = () =>{
        if(isAdsEnable == true){
            console.log(adScriptCode ,'rffr');
            if(adScriptCode === '' || adScript ===''){
                setMessage('All fields are required')
                return false;
            }
        }
        if(stripeKey == ''  && paypalKey == ''){
            AlertMsg('error','Oops!','Payment details required.')
            return
        }
            const data = {
                user_id     : store.userData.user_id,
                stripeKey   : stripeKey,
                stripeSecret: stripeSecret,
                currency    : currencyCode,
                isEnable    : isEnable,
                isAdEnable  : isAdsEnable,
                adScript    : adScript,
                adScriptCode: adScriptCode,
                paypalKey   : paypalKey,
                paypalSecret: paypalSecret,
                paypalTestMode : paypalTestMode,
                isEnableBankTransfer : isEnableBankTransfer,
                instructions : bankTransferIns,
                razorpayKey: razorpayKey,
                razorpaySecret: razorpaySecret
            }

            Loading(true);
            common.getAPI({
                method: 'POST',
                url: 'admin/updateSettings',
                data: data
            }, (resp) => {
                if (resp.status === "success") {
                }
            })
        
    }
    useEffect(()=>{
        getSettings()
    },[])

    const getSettings = () =>{
            const data = {
                user_id : store.userData.user_id,
            }
            Loading(true);
            common.getAPI({
                method: 'POST',
                url: 'admin/getSettings',
                data: data
            }, (resp) => {
                if (resp.status === "success") {

                    if(resp.data.stripeKey){
                        setStripeKey(resp.data.stripeKey)
                    }
                    if(resp.data.stripeSecret){
                        setStripeSecret(resp.data.stripeSecret)
                    }
                    if(resp.data.paypalKey){
                        setPaypalKey(resp.data?.paypalKey)
                    }
                    if(resp.data.paypalSecret){
                        setPaypalSecret(resp.data?.paypalSecret)
                    }
                    setCurrencyCode(resp.data.currency)
                    setIsEnabled(resp.data.isEnabled)
                    setIsAdsEnable(resp.data.isAdEnabled)
                    setAdScript(resp.data.adScript)
                    setAdScriptcode(resp.data.adScriptCode)
                    setPaypalTestMode(resp.data.paypalTestMode)
                    setisEnableBankTransfer(resp.data.isEnableBankTransfer)
                    setBankTransferIns(resp.data.bankTransferIns)
                    setRazorpayVendorID(resp.data?.razorpayKey)
                    setRazorpayKey(resp.data?.razorpaySecret)
                }
            })
        
    }

    return (
        <>
            <div className="pu_container">
                <div className={styles.profile_wrapper}>
                    <div className={styles.profile_left}>

                    </div>

                    <div className={styles.profile_right}>
                        <form >
                            <div className={styles.profile_box}>
                                <div className={styles.profile_box_title}>
                                    <h3>Payment Settings</h3>
                                </div>
                            </div>
                            <div className={styles.profile_box}>
                                <div className={styles.profile_box_body}>
                                    <Tabs textColor="" indicatorColor="primary" style={{marginLeft:0}} className='Select_tab' value={tabValue} onChange={handleChange} aria-label="disabled tabs example" >
                                        <Tab label="Stripe"/>
                                        <Tab label="Paypal" />
                                        <Tab label="Razorpay" />
                                        <Tab label="Bank Transfer" />
                                    </Tabs>
                                    {tabValue == 0 ?
                                    <div>
                                        <div className="pu_input_wrapper_list">
                                            <div className="pu_input_wrapper">
                                                <label>Stripe Key</label>
                                                <input type="text" className="pu_input" placeholder='Enter Key' value={stripeKey} onChange={(e) => setStripeKey(e.target.value)} />
                                            </div>
                                        </div>
                                        <div className="pu_input_wrapper_list">
                                            <div className="pu_input_wrapper">
                                                <label>Stripe Secret</label>
                                                <input type="text" className="pu_input" placeholder='Enter Secret Key' value={stripeSecret} onChange={(e) => setStripeSecret(e.target.value)} />
                                            </div>
                                        </div>
                                    </div>
                                    : tabValue == 1 ?
                                    <div>
                                        <div className="pu_input_wrapper_list">
                                            <div className="pu_input_wrapper">
                                                <label>Paypal Key</label>
                                                <input type="text" className="pu_input" placeholder='Enter Key' value={paypalKey} onChange={(e) => setPaypalKey(e.target.value)} />
                                            </div>
                                        </div>
                                        <div className="pu_input_wrapper_list">
                                            <div className="pu_input_wrapper">
                                                <label>Paypal Secret</label>
                                                <input type="text" className="pu_input" placeholder='Enter Secret Key' value={paypalSecret} onChange={(e) => setPaypalSecret(e.target.value)} />
                                            </div>
                                        </div>
                                        <div className={styles.profile_box_title}>
                                        <div className={styles.profile_box_title}>

                                            <div className="pu_switch">
                                                <input
                                                    id={'paypalChk_0'}
                                                    type="checkbox"
                                                    checked={paypalTestMode}
                                                    onChange={(e) => setPaypalTestMode(!paypalTestMode)}
                                                />
                                                <label htmlFor={'paypalChk_0'}>
                                                    <span className="pu_switch_icon"></span>
                                                    <span className="pu_switch_text">PayPal test mode</span>
                                                </label>
                                            <div>
                                                <label>Allows testing PayPal payments with sandbox accounts.</label>
                                            </div>
                                            </div>
                                        </div>
                                    </div><br />
                                    </div>
                                    : tabValue == 2 ?
                                        <div>
                                            <div className="pu_input_wrapper_list">
                                                <div className="pu_input_wrapper">
                                                    <label>API Key</label>
                                                    <input type="text" className="pu_input" placeholder='Enter Api Key' value={razorpayKey || ''} onChange={(e) => setRazorpayVendorID(e.target.value)} />
                                                </div>
                                            </div>
                                            <div className="pu_input_wrapper_list">
                                                <div className="pu_input_wrapper">
                                                    <label>Secret Key</label>
                                                    <input type="text" className="pu_input" placeholder='Enter Secret Key' value={razorpaySecret || ''} onChange={(e) => setRazorpayKey(e.target.value)} />
                                                </div>
                                            </div>
                                        </div>
                                        :
                                        <div className='pu_input_wrapper'>
                                            <div className={styles.profile_box_title}>
                                                <div className="pu_switch">
                                                    <input
                                                        id={'paypalChk_0'}
                                                        type="checkbox"
                                                        checked={isEnableBankTransfer}
                                                        onChange={(e) => setisEnableBankTransfer(!isEnableBankTransfer)}
                                                    />
                                                    <label htmlFor={'paypalChk_0'}>
                                                        <span className="pu_switch_icon"></span>
                                                        <span className="pu_switch_text">{isEnableBankTransfer ? `Bank Transfer Disable ` : 'Bank Transfer Enable '}</span>
                                                    </label>
                                                </div>
                                            </div>
                                            {isEnableBankTransfer ?
                                                <div className='pu_input_wrapper'>
                                                    <div>
                                                        <label>Instructions for bank tranfer.</label>
                                                    </div>
                                                    <textarea rows="2" className="pu_input" placeholder='Enter Your instructions here.' value={bankTransferIns} onChange={(e) => setBankTransferIns(e.target.value)}></textarea>
                                                </div>
                                                : ''}
                                    </div>
                                    }

                                    <div className="pu_input_wrapper_list">
                                    <div className="pu_input_wrapper" style={{ marginBottom: 0 }}>
                                    <label>Select Currency</label>
                                            <select className=" pu_input" value={currencyCode.title || ""} onChange={(e) => handleCurrency(e.target.value)}>
                                                <option value={''}>Select currency code</option>
                                                {currencies.map((code, i) => {
                                                    return (
                                                        <option key={i}>{code.title}</option>
                                                    )
                                                })}
                                            </select>
                                    </div>
                                    </div><br />
                                    <div className={styles.profile_box_title}>
                                        <div className={styles.profile_box_title}>

                                            <div className="pu_switch">
                                                <input
                                                    id={'planChk_0'}
                                                    type="checkbox"
                                                    checked={isEnable}
                                                    onChange={(e) => setIsEnabled(!isEnable)}
                                                />
                                                <label htmlFor={'planChk_0'}>
                                                    <span className="pu_switch_icon"></span>
                                                    <span className="pu_switch_text">{isEnable ? `Plan Disable ` : 'Plan Enable '}</span>
                                                </label>
                                            </div>
                                            <div>
                                                <label>{isEnable ? `Disable ` : 'Enable '} all subscription related functionality across the site.</label>
                                            </div>
                                        </div>
                                    </div><br />
                                    {isEnable ? 
                                    <div >
                                           <div className={styles.profile_box_title}>
                                            <div className="pu_switch">
                                                <input
                                                    id={'adsChk_0'}
                                                    type="checkbox"
                                                    checked={isAdsEnable}
                                                    onChange={(e) => setIsAdsEnable(!isAdsEnable)}
                                                />
                                                <label htmlFor={'adsChk_0'}>
                                                    <span className="pu_switch_icon"></span>
                                                    <span className="pu_switch_text">{isAdsEnable ? `Ads Disable ` : 'Ads Enable '}</span>
                                                </label>
                                                <input />
                                            </div>
                                            <div>
                                                <label>{isAdsEnable ? `Disable` : 'Enable '} ads for free users</label>
                                            </div>
                                               
                                                 </div>
                                                 {isAdsEnable ? 
                                                <div className='pu_input_wrapper' style={{marginTop :'18px'}}>
                                                    <label>This code will be added in head section.</label>
                                                    <input rows="2" className="pu_input" placeholder='Enter Your Script Library.' value={adScript} onChange={(e) => setAdScript(e.target.value)}></input>
                                                    <br /><br />
                                                    <label>Add your ins script.</label>
                                                    <textarea rows="2" className="pu_input" placeholder='Enter Your ins Script.' value={adScriptCode} onChange={(e) => setAdScriptcode(e.target.value)}></textarea>
                                                    {message !='' ? <span style={{color:'red'}}>{message}</span> : ''}
                                                    {/* <input type="text" className="pu_input" placeholder='Enter Your Adsense Script' value={adScript} onChange={(e) => setAdScript(e.target.value)} /> */}
                                                </div>
                                                    : ''
                                                }
                                           
                                    </div>
                                    :''
                                    }
                                    <br />
                                    <button type="button" className="pu_btn" onClick={() => handleSubmit()}>Save Changes</button>
                                    <br/><br/>

                                </div>
                            </div>
                        </form>
                        
                    </div>
                </div>
            </div>
        </>
    );
}

const mapStateToProps = (state) => {
    return {
        ...state.userData,
    };
};
export default compose(connect(mapStateToProps, null))(Settings)
