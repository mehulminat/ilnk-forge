import styles from './Heading.module.css'
import 'animate.css';

const Heading = (props) => 
{ 
    
    return (
        <>
            <div className={styles[props.item.type] +' '+ styles['head_themes_'+ props.htmlId] +' '+ (props.isEditorPreview === true ? styles.editor_head : '') + "  " + (props.item?.animation ? `animate__animated animate__${(props.item?.animation?.animationRepeat?.length == 1) ? `repeat-${props.item?.animation.animationRepeat}` : props.item?.animation.animationRepeat}  animate__${props.item?.animation.name}` :"")} 
                style={{
                    color : props.headingColor ? props.headingColor : '#222222',
                    fontFamily: props.headingFont ? props.headingFont : 'Nunito',
                    fontSize: props.headingFontSize ? props.headingFontSize+'px' : 16,
                    fontWeight: props.headingFontWeight ? props.headingFontWeight : 400,
                    animationDuration: props.item?.animation ? `${props.item?.animation.animationDuration}ms` : "", animationDelay: props.item?.animation ? `${props.item?.animation.animationDelay}ms` : ""
                }}
                >
                {props.item.sectionData}
            </div>
        </>
    );
}

export default Heading;