import React from 'react'
import { useQRCode } from 'next-qrcode';
import styles from './QRCode.module.css'
import validator from 'validator';

function QRCode(props) {
    const { Image } = useQRCode();
    
 
    return (
        <div className={styles.qrcode_box + "  " + (props.item?.animation ? `animate__animated animate__${(props.item?.animation?.animationRepeat?.length == 1) ? `repeat-${props.item?.animation?.animationRepeat}` : props.item?.animation?.animationRepeat}  animate__${props.item?.animation.name}` :"")}
        style={{
            animationDuration: props.item?.animation ? `${props.item?.animation?.animationDuration}ms` : "",
            animationDelay: props.item?.animation ? `${props.item?.animation?.animationDelay}ms` : "",
        }}
        >
            {
                (validator.isURL(props.item.sectionData, { protocols: ['http', 'https', 'ftp'], require_protocol: false })) &&  <Image
                text={props.item.sectionData}
                options={{
                    type: 'image/jpeg',
                    quality: 0.3,
                    errorCorrectionLevel: 'M',
                    margin: 3,
                    scale: 4,
                    width: 200,
                    color: {
                        dark: '#000',
                        light: '#fff',
                    },
                }}
            />

        }
           
        </div>
    )
}

export default QRCode