import { useState } from 'react';
import styles from '../../../../styles/elements/copyURLBox.module.css';
import svg from '../../../helper/svg';
const CopyURLBox = (props) => {
    const [copyStatus, setCopyStatus] = useState(false);
    const copyURLHandle = () => {
        navigator.clipboard.writeText(props.url);
        setCopyStatus(true);
        setTimeout(() => {
            setCopyStatus(false);
        }, 2000);
    }
    return (
        <>
            <div className={styles.wrapper +' '+ (copyStatus === true ? styles.active : '')}>
                <span>{props.url}</span>
                <button onClick={() =>{copyURLHandle()}} className={'pu_btn pu_btn_gray ' + styles.pu_btn}>{svg.icon_duplicate} {copyStatus === true ? 'Copied' : 'Copy'}</button>
            </div>
        </>
    );
}

export default CopyURLBox;