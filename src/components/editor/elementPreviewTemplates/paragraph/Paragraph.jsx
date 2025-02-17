import { hexToRgbA } from '../../../../helper/helper';
import styles from './Paragraph.module.css';

const Paragraph = (props) => { 
    var customCss = {};
    if(props.htmlId === '19'){
        customCss = {
            boxShadow: '10px 10px 40px ' + hexToRgbA(props.primaryColor, 0.06)
        }
    }
    return (
        <>
            <div className={styles[props.item.type] +' '+ styles['para_themes_'+ props.htmlId] +' '+ (props.isEditorPreview === true ? styles.editor_para : '') + "  " + (props.item?.animation ? `animate__animated animate__${(props.item?.animation?.animationRepeat?.length == 1) ? `repeat-${props.item?.animation.animationRepeat}` : props.item?.animation.animationRepeat}  animate__${props.item?.animation.name}` :"")} 
                style={{
                    color : (props.textColor ? props.textColor : '#333333'),
                    fontFamily: props.textFont ? props.textFont : 'Nunito',
                    fontSize: props.textFontSize ? props.textFontSize+'px' : 14,
                    fontWeight: props.textFontWeight ? props.textFontWeight : 400,
                    animationDuration: props.item?.animation ? `${props.item?.animation.animationDuration}ms` : "",
                   animationDelay: props.item?.animation ? `${props.item?.animation.animationDelay}ms` : "",
                    ...customCss
                }}
                >
                <div dangerouslySetInnerHTML={{__html: props.item.sectionData}}></div>
            </div>
        </>
    );
}

export default Paragraph;