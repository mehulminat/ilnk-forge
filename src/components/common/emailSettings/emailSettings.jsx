import { useEffect, useState, React } from 'react';
import { connect, useDispatch, useSelector } from 'react-redux';
import { compose } from 'redux';
import { setPageHeading } from '../../../redux/actions/commonAction';
import styles from './EmailSettings.module.css';
import { common } from '../../../helper/Common';

import { Loading } from '../../../helper/helper';
import '../../../../node_modules/cropperjs/dist/cropper.css';

// import React from 'react';

const EmailSettings = (props) => {

    const [value, setValue] = useState('');

    const handleChange = (data) => {
      setValue(data);
    };

    let dispatch = useDispatch();
    useEffect(() => {
        dispatch(setPageHeading({
            pageHeading: "LinkForge - Email Setting",
            title: "LinkForge - Email Setting",
        }));
    }, [dispatch]);

    const store = useSelector(store => store);

    const [mandrillKey, setMandrillKey] = useState('');
    const [sendgridKey, setSendgridKey] = useState('');
    const [sendgridSecret, setSendgridSecret] = useState('');
    const [smtpHost, setSmtpHost] = useState('');
    const [smtpPort, setSmtpPort] = useState('');
    const [smtpUsername, setSmtpUsername] = useState('');
    const [smtpPassword, setSmtpPassword] = useState('');
    const [error, setError] = useState('')

    const handleSubmit = () =>{
        let data = {}
        if(value == 'Mandrill'){
            if(mandrillKey == ''){
                setError('Fields should not be empty!')
                return
            }
            data = {
                user_id : store.userData.user_id,
                mandrillKey: mandrillKey,
                name : value
            }
        } else if(value == 'Sendgrid'){
            if(sendgridKey == '' ){
                setError('Fields should not be empty!')
                return
            }
            data = {
                user_id : store.userData.user_id,
                sendgridKey: sendgridKey,
                // sendgridSecret: sendgridSecret,
                name : value
            }
        } else if(value == 'SMTP'){
            if(smtpHost == '' || smtpPort == '' || smtpUsername == '' || smtpPassword == ''){
                setError('Fields should not be empty!')
                return
            }
            data = {
                user_id : store.userData.user_id,
                smtpHost: smtpHost,
                smtpPort: smtpPort,
                smtpUsername : smtpUsername,
                smtpPassword: smtpPassword,
                name : value
            }
        }

            Loading(true);
            common.getAPI({
                method: 'POST',
                url: 'admin/updateEmailSettings',
                data: data
            }, (resp) => {
                setError('')
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
                    if(resp.data.emailSettings != ''){
                        setValue(resp.data.emailSettings.name)
                        setMandrillKey(resp.data.emailSettings.mandrillKey ? resp.data.emailSettings.mandrillKey : '')
                        setSendgridKey(resp.data.emailSettings.sendgridKey ? resp.data.emailSettings.sendgridKey : '')
                        setSendgridSecret(resp.data.emailSettings.sendgridSecret ? resp.data.emailSettings.sendgridSecret : '')
                        setSmtpHost(resp.data.emailSettings.smtpHost ? resp.data.emailSettings.smtpHost : '')
                        setSmtpPort(resp.data.emailSettings.smtpPort ? resp.data.emailSettings.smtpPort : '')
                        setSmtpUsername(resp.data.emailSettings.smtpUsername ? resp.data.emailSettings.smtpUsername : '')
                        setSmtpPassword(resp.data.emailSettings.smtpPassword ? resp.data.emailSettings.smtpPassword : '')
                    }
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
                                    <h3>Email Settings</h3>
                                </div>
                            </div>
                            <div className={styles.profile_box}>
                            <div className={styles.profile_box_body}>
                            <div className="pu_input_wrapper" style={{ marginBottom: 20 }}>
                                    <label>Setup Email Setting</label>
                                            <select className=" pu_input" value={value ? value :''} onChange={(e) => handleChange(e.target.value)}>
                                                <option value={''}>Select email settings</option>
                                                <option value={"Mandrill"}>Mandrill</option>
                                                {/* <option value={'Sendgrid'}>Sendgrid</option> */}
                                                <option value={'SMTP'}>SMTP</option>
                                            </select>

                                    </div>
                          
                                    {(value == 'Mandrill') ? 
                                      <div className={styles.profile_box_body}>
                                      <div className="pu_input_wrapper_list">
                                          <div className="pu_input_wrapper">
                                              <label>Mandrill Key</label>
                                              <input type="text" className="pu_input" placeholder='Enter Mandrill Key' value={mandrillKey} onChange={(e) => setMandrillKey(e.target.value)} />
                                          </div>
                                      </div>
                                      <span style={{color:'red'}}>{error}</span><br />

                                      <button type="button" className="pu_btn" onClick={() => handleSubmit()}>Save Changes</button>
                                      <br/><br/>
  
                                  </div> 
                                  : (value == 'Sendgrid') ?
                                  <div className={styles.profile_box_body}>
                                  <div className="pu_input_wrapper_list">
                                      <div className="pu_input_wrapper">
                                          <label>Sendgrid Key</label>
                                          <input type="text" className="pu_input" placeholder='Enter Sendgrid Key' value={sendgridKey} onChange={(e) => setSendgridKey(e.target.value)} />
                                      </div>
                                  </div>
                                  {/* <div className="pu_input_wrapper_list">
                                      <div className="pu_input_wrapper">
                                          <label>Sendgrid Secret</label>
                                          <input type="text" className="pu_input" placeholder='Enter Sendgrid Secret' value={sendgridSecret} onChange={(e) => setSendgridSecret(e.target.value)} />
                                      </div>
                                  </div> */}
                                  <span style={{color:'red'}}>{error}</span><br />

                                  <button type="button" className="pu_btn" onClick={() => handleSubmit()}>Save Changes</button>
                                  <br/><br/>

                              </div> 
                              : (value == 'SMTP') ?
                              <div className={styles.profile_box_body}>
                                    <div className="pu_input_wrapper_list">
                                        <div className="pu_input_wrapper">
                                            <label>Host</label>
                                            <input type="text" className="pu_input" placeholder='Enter Smtp Host' value={smtpHost} onChange={(e) => setSmtpHost(e.target.value)} />
                                        </div>
                                    </div>
                                    <div className="pu_input_wrapper_list">
                                        <div className="pu_input_wrapper">
                                            <label>Port</label>
                                            <input type="text" className="pu_input" placeholder='Enter Smtp Port' value={smtpPort} onChange={(e) => setSmtpPort(e.target.value)} />
                                        </div>
                                    </div>
                                    <div className="pu_input_wrapper_list">
                                        <div className="pu_input_wrapper">
                                            <label>Smtp User name</label>
                                            <input type="text" className="pu_input" placeholder='Enter Smtp Username' value={smtpUsername} onChange={(e) => setSmtpUsername(e.target.value)} />
                                        </div>
                                    </div>
                                    <div className="pu_input_wrapper_list">
                                        <div className="pu_input_wrapper">
                                            <label>Smtp Password</label>
                                            <input type="text" className="pu_input" placeholder='Enter Smtp Password' value={smtpPassword} onChange={(e) => setSmtpPassword(e.target.value)} />
                                        </div>
                                    </div>
                                    <span style={{color:'red'}}>{error}</span><br />

                                    <button type="button" className="pu_btn" onClick={() => handleSubmit()}>Save Changes</button>
                                    <br/><br/>

                                </div> 
                                : ''}
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
export default compose(connect(mapStateToProps, null))(EmailSettings)
