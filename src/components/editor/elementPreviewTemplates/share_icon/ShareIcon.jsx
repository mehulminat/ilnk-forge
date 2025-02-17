import { useEffect, useState } from "react";
import svg from "../../../../helper/svg";
import styles from './ShareIcon.module.css';

const ShareIcon = (props) => {
    const [bgColor, setBgColor] = useState({});
    const [svgFill, setSvgFill] = useState('');
    const shareURLClick = () => {
        const pageurl = props.pageurl;
        if(pageurl){
            let shareData = {
                title: props.name,
                text: props.tagline,
                url: pageurl
            }
            navigator.share(shareData)
        }
    }

    /* set bgcolor start */
    useEffect(() => {
        var bgcolor = {};
        var svgfill = '#ffffff';
        if(props.htmlId == 1){
            bgcolor = {backgroundImage : props.defaultGradient}
            
        }else if(props.htmlId == '2'){
            bgcolor = { }
        }else if(props.htmlId == '3'){
            bgcolor = {backgroundColor : props.primaryColor}
        }else if(props.htmlId == '4'){
            bgcolor = { }
        }else if(props.htmlId == '5'){
            bgcolor = {backgroundColor : props.secondaryColor}
            svgfill = props.primaryColor
        }else if(props.htmlId == '6'){
            bgcolor = {backgroundColor : props.primaryColor}
        }else if(props.htmlId == '7'){
            bgcolor = { }
        }else if(props.htmlId == '8'){
            svgfill = props.primaryColor
        }else if(props.htmlId == '9'){
            bgcolor = {backgroundColor : props.primaryColor}
            
        }else if(props.htmlId == '10'){
            bgcolor = {backgroundColor : props.primaryColor}
        }else if(props.htmlId == '11'){
            bgcolor = {backgroundColor : props.primaryColor}
            svgfill = props.secondaryColor
        }else if(props.htmlId == '12'){
            bgcolor = { }
            svgfill = props.primaryColor
        }else if(props.htmlId == '13'){
            bgcolor = { }
            svgfill = props.primaryColor
        }else if(props.htmlId == '14'){
            bgcolor = {backgroundColor : props.primaryColor}
        }else if(props.htmlId == '15'){
            bgcolor = {}
            svgfill = props.secondaryColor
        }else if(props.htmlId == '16'){
            bgcolor = {}
            svgfill = props.primaryColor
        }else if(props.htmlId == '17'){
            bgcolor = {}
            svgfill = props.primaryColor
        }else if(props.htmlId == '18'){
            bgcolor = {backgroundImage : props.defaultGradient}
        }else if(props.htmlId == '19'){
            bgcolor = {}
        }else if(props.htmlId == '20'){
            bgcolor = {backgroundColor : props.defaultGradient}
        }else{
            bgcolor = {backgroundImage : props.defaultGradient}
        }
        setBgColor(bgcolor);
        setSvgFill(svgfill);
    }, [props])
    /* set bgcolor end */

    return (
        <>
            <div className={styles.share_icon +' '+ styles['html_theme_t' + props.htmlId] +' '+ (props.isEditorPreview === true ? styles.editor_icon : '')} style={bgColor} onClick={() => shareURLClick()}>
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" clipRule="evenodd" d="M12.558 5.10702C11.436 5.88402 9.927 5.64002 9.085 4.59202L5.418 6.30002C5.567 6.79402 5.567 7.31602 5.416 7.81002L9.088 9.52002C9.576 8.91202 10.303 8.54202 11.088 8.54202C11.235 8.54202 11.381 8.55402 11.526 8.57902C12.935 8.82302 13.881 10.168 13.639 11.584C13.397 13 12.058 13.951 10.649 13.707C9.324 13.478 8.423 12.275 8.518 10.957L4.531 9.10002C3.537 9.87602 2.12 9.83502 1.183 8.95802C0.136999 7.97802 0.0799994 6.33102 1.056 5.28102C1.977 4.28802 3.484 4.19402 4.53 5.01102L8.517 3.15402C8.512 3.09202 8.501 3.03002 8.501 2.96702C8.501 2.11102 8.919 1.31002 9.62 0.825022C10.797 0.0100217 12.409 0.307022 13.22 1.49002C14.032 2.67302 13.735 4.29202 12.558 5.10702Z" fill={svgFill}></path></svg>
                {props.htmlId == '5' ? 
                    <span style={{ border : '1px solid' + props.primaryColor }}></span>
                    : null
                }
                {props.htmlId == '12' ? 
                    <span style={{ border : '1px solid' + props.primaryColor }}></span>
                    : null
                }
               {props.htmlId == '13' ? 
                    <span style={{ border : '1px solid' + props.primaryColor }}></span>
                    : null
                }
               {props.htmlId == '17' ? 
                    <span style={{ border : '1px solid' + props.primaryColor }}></span>
                    : null
                }
            </div>
        </>
    );
}

export default ShareIcon;