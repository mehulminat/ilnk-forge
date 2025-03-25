import React, { useEffect, useState } from "react";
import svg from "../../../helper/svg";
import Popup from "../popup/Popup";
import validator from 'validator';
import { AlertMsg } from "../../../helper/helper";
import styles from './CreateLink.module.css'
import { createLinkNameACT } from "../../../redux/actions/commonAction";
import { useDispatch } from "react-redux";
import {useRouter} from 'next/router';

const CreateLink = (props) => {
    const router = useRouter();
    const dispatch = useDispatch();
    const [name, setName] = useState('');
    const [createLinkPopup , setCreateLinkPopup] = useState(false);

    const createLinkPopupCloseHandler = (e) => {
        setCreateLinkPopup(false);
    };
    const createLinkButton = (props) => {
        setCreateLinkPopup(!createLinkPopup);
    }

    /* add template start */
    const createLinkFormSubmit = (e) => {
        e.preventDefault();
        const emptyname = validator.isEmpty(name, {ignore_whitespace:true});
        if(emptyname){
            AlertMsg('error', 'Oops!', 'Field can not be empty!');
            return false;
        }else{
            dispatch(createLinkNameACT(name));
            createLinkPopupCloseHandler();
            router.push('/templates');
        }
    }
    /* add template end */

    return (
        <>
            <span onClick={() => createLinkButton()}>
                {props.children}
            </span>

            <Popup
                heading="Create New Link"
                subHeading="Enter Your URL Below to Continue"
                show={createLinkPopup}
                maxWidth={570}
                onClose={createLinkPopupCloseHandler}
            >
                <form onSubmit={createLinkFormSubmit}>
                    <div className={styles.create_link_input}>
                        <div className={styles.cli_text}>{process.env.APP_URL}</div>
                        <input type="text" className={styles.cli_input} name="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Your URL" />
                    </div>
                    <div className="text-center">
                        <button type="submit" className="pu_btn">Continue {svg.btn_arrow_right}</button>
                    </div>
                </form>
            </Popup>
        </>
    );
}

export default CreateLink;