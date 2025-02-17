import { red } from "@mui/material/colors";
import { getNameInitials } from "../../../../helper/helper";
import styles from './Profile.module.css';
const Profile = (props) => {
    if(props.htmlId == '1'){
        return (
            <>
                <div className={styles.profile_wrapper +' '+ styles['html_theme_t' + props.htmlId] +' '+ (props.isEditorPreview === true ? styles.editor_wrapper : '')}>
                    <div className={styles.avatar +' '+ (props.imageURL ? styles.has_image : '')}>
                        <div className={styles.profile_bg} style={{backgroundImage : props.defaultGradient}}></div>
                        <div className={styles.avatar_initial}>{getNameInitials(props.name)}</div>
                        {props.imageURL ? <img src={props.imageURL} alt="" /> : null}
                    </div>
                    <div className={styles.name} style={{color : props.headingColor,fontFamily: props.headingFont ? props.headingFont : 'Nunito'}}>
                        {props.name}
                    </div>
                    <div className={styles.tagline} style={{color : props.pragraphColor, fontFamily: props.textFont ? props.textFont : 'Nunito'}}>
                        {props.tagline}
                    </div>

                    {!props.isSocialBoxHide ? 
                        <div className={styles.social_icon_list}>
                            {props.socialIcons !== undefined ? 
                                props.socialIcons.filter(item => item.status === 1).map(icon =>
                                    <a key={icon.id} target="_blank" rel="noreferrer" 
                                        href={
                                            icon.itype === "phone" ?  "https://wa.me/" + icon.value
                                            : (icon.itype === "email" ? "mailto:"+icon.value : icon.value)}
                                    >
                                        <span dangerouslySetInnerHTML={{__html: icon.svg_code}}></span>
                                    </a>    
                                ) : null
                            }
                        </div> : null
                    }
                </div>
            </>
        );
    }else if(props.htmlId == '2'){
        return (
            <>
               <div className={styles.profile_wrapper +' '+ styles['html_theme_t' + props.htmlId] +' '+ (props.isEditorPreview === true ? styles.editor_wrapper : '')}>
                  <div className={styles.profile_bg} style={{backgroundImage : props.defaultGradient}}></div>

                    <div className={styles.avatar +' '+ (props.imageURL ? styles.has_image : '')}>
                        <div className={styles.avatar_initial}>{getNameInitials(props.name)}</div>
                        {props.imageURL ? <img src={props.imageURL} alt="" /> : null}
                    </div>
                    <div className={styles.profile_details}>
                        <div className={styles.name} style={{color : props.headingColor,fontFamily: props.headingFont ? props.headingFont : 'Nunito'}}>
                            {props.name}
                        </div>
                        <div className={styles.tagline} style={{color : props.pragraphColor, fontFamily: props.textFont ? props.textFont : 'Nunito'}}>
                            {props.tagline}
                        </div>

                        {!props.isSocialBoxHide ? 
                            <div className={styles.social_icon_list}>
                                {props.socialIcons !== undefined ? 
                                    props.socialIcons.filter(item => item.status === 1).map(icon =>
                                        <a key={icon.id} target="_blank" rel="noreferrer" 
                                            href={
                                                icon.itype === "phone" ?  "https://wa.me/" + icon.value
                                                : (icon.itype === "email" ? "mailto:"+icon.value : icon.value)}
                                        >
                                            <span dangerouslySetInnerHTML={{__html: icon.svg_code}}></span>
                                        </a>    
                                    ) : null
                                }
                            </div> : null
                        }
                    </div>
                </div>
            </>
        );

    }else if(props.htmlId == '3'){
        return (
            <>
               <div className={styles.profile_wrapper +' '+ styles['html_theme_t' + props.htmlId] +' '+ (props.isEditorPreview === true ? styles.editor_wrapper : '')}>
                    <div className={styles.avatar +' '+ (props.imageURL ? styles.has_image : '')}>
                        <div className={styles.avatar_initial}>{getNameInitials(props.name)}</div>
                        {props.imageURL ? <img src={props.imageURL} alt="" /> : null}
                    </div>
                    <div className={styles.profile_details}>
                        <div className={styles.name} style={{color : props.headingColor,fontFamily: props.headingFont ? props.headingFont : 'Nunito'}}>
                            {props.name}
                        </div>
                        <div className={styles.tagline} style={{color : props.pragraphColor, fontFamily: props.textFont ? props.textFont : 'Nunito'}}>
                            {props.tagline}
                        </div>

                        {!props.isSocialBoxHide ? 
                            <div className={styles.social_icon_list}>
                                {props.socialIcons !== undefined ? 
                                    props.socialIcons.filter(item => item.status === 1).map(icon =>
                                        <a key={icon.id} target="_blank" rel="noreferrer" 
                                            href={
                                                icon.itype === "phone" ?  "https://wa.me/" + icon.value
                                                : (icon.itype === "email" ? "mailto:"+icon.value : icon.value)}
                                        >
                                            <span dangerouslySetInnerHTML={{__html: icon.svg_code}}></span>
                                        </a>    
                                    ) : null
                                }
                            </div> : null
                        }
                    </div>
                </div>
            </>
        );
    }else if(props.htmlId == '4'){
        return (
            <>
                <div className={styles.profile_wrapper +' '+ styles['html_theme_t' + props.htmlId] +' '+ (props.isEditorPreview === true ? styles.editor_wrapper : '')}>
                <div className={styles.profile_bg} style={{backgroundImage : props.defaultGradient}}>
                    <div className={styles.profile_fix}>
                        <div className={styles.avatar +' '+ (props.imageURL ? styles.has_image : '')}>
                            <div className={styles.avatar_initial}>{getNameInitials(props.name)}</div>
                            {props.imageURL ? <img src={props.imageURL} alt="" /> : null}
                        </div>
                        <div className={styles.name} style={{fontFamily: props.headingFont ? props.headingFont : 'Nunito'}}>
                            {props.name}
                        </div>
                        <div className={styles.tagline} style={{fontFamily: props.textFont ? props.textFont : 'Nunito'}}>
                            {props.tagline}
                        </div>
                    </div>
                </div>

                    {!props.isSocialBoxHide ? 
                        <div className={styles.social_icon_list}>
                            {props.socialIcons !== undefined ? 
                                props.socialIcons.filter(item => item.status === 1).map(icon =>
                                    <a key={icon.id} target="_blank" rel="noreferrer"  
                                        href={
                                            icon.itype === "phone" ?  "https://wa.me/" + icon.value
                                            : (icon.itype === "email" ? "mailto:"+icon.value : icon.value)}
                                    >
                                        <span dangerouslySetInnerHTML={{__html: icon.svg_code}}></span>
                                    </a>    
                                ) : null
                            }
                        </div> : null
                    }
                </div>
            </>
        );
    }else if(props.htmlId == '5'){
        return (
            <>
                <div className={styles.profile_wrapper +' '+ styles['html_theme_t' + props.htmlId] +' '+ (props.isEditorPreview === true ? styles.editor_wrapper : '')}>
                    <div className={styles.avatar +' '+ (props.imageURL ? styles.has_image : '')}>
                        <div className={styles.avatar_initial}>{getNameInitials(props.name)}</div>
                        {props.imageURL ? <img src={props.imageURL} alt="" /> : null}
                        <span className={styles.theme_border} style={{boxShadow :('0px 0px 0px 2px' + props.primaryColor)}}></span>
                    </div>
                    <div className={styles.name} style={{color : props.headingColor,fontFamily: props.headingFont ? props.headingFont : 'Nunito'}}>
                        {props.name}
                    </div>
                    <div className={styles.tagline} style={{color : props.pragraphColor, fontFamily: props.textFont ? props.textFont : 'Nunito'}}>
                        {props.tagline}
                    </div>

                    {!props.isSocialBoxHide ? 
                        <div className={styles.social_icon_list}>
                            {props.socialIcons !== undefined ? 
                                props.socialIcons.filter(item => item.status === 1).map(icon =>
                                    <a key={icon.id} target="_blank" rel="noreferrer" 
                                        href={
                                            icon.itype === "phone" ?  "https://wa.me/" + icon.value
                                            : (icon.itype === "email" ? "mailto:"+icon.value : icon.value)}
                                    >
                                        <span dangerouslySetInnerHTML={{__html: icon.svg_code}}></span>
                                    </a>    
                                ) : null
                            }
                        </div> : null
                    }
                </div>
            </>
        );
    }else if(props.htmlId == '6'){
        return (
            <>
                <div className={styles.profile_wrapper +' '+ styles['html_theme_t' + props.htmlId] +' '+ (props.isEditorPreview === true ? styles.editor_wrapper : '')}>
                    <div className={styles.avatar +' '+ (props.imageURL ? styles.has_image : '')}>
                        <div className={styles.avatar_initial}>{getNameInitials(props.name)}</div>
                        {props.imageURL ? <img src={props.imageURL} alt="" /> : null}
                        <span className={styles.theme_border} style={{border :('10px solid' + props.primaryColor)}}></span>
                    </div>
                    <div className={styles.name} style={{color : props.headingColor,fontFamily: props.headingFont ? props.headingFont : 'Nunito'}}>
                        {props.name}
                    </div>
                    <div className={styles.tagline} style={{color : props.pragraphColor, fontFamily: props.textFont ? props.textFont : 'Nunito'}}>
                        {props.tagline}
                    </div>

                    {!props.isSocialBoxHide ? 
                        <div className={styles.social_icon_list}>
                            {props.socialIcons !== undefined ? 
                                props.socialIcons.filter(item => item.status === 1).map(icon =>
                                    <a key={icon.id} target="_blank" rel="noreferrer" 
                                        href={
                                            icon.itype === "phone" ?  "https://wa.me/" + icon.value
                                            : (icon.itype === "email" ? "mailto:"+icon.value : icon.value)}
                                    >
                                        <span dangerouslySetInnerHTML={{__html: icon.svg_code}}></span>
                                    </a>    
                                ) : null
                            }
                        </div> : null
                    }
                </div>
            </>
        );
    }else if(props.htmlId == '7'){
        return (
            <>
                <div className={styles.profile_wrapper +' '+ styles['html_theme_t' + props.htmlId] +' '+ (props.isEditorPreview === true ? styles.editor_wrapper : '')}>
                    <div className={styles.avatar +' '+ (props.imageURL ? styles.has_image : '')}>
                        
                        {props.imageURL ? <img src={props.imageURL} alt="" /> : <div className={styles.avatar_initial} style={{backgroundImage : props.defaultGradient}}>{getNameInitials(props.name)}</div>}

                        <div className={styles.profile_headings}>
                            <div className={styles.name} style={{fontFamily: props.headingFont ? props.headingFont : 'Nunito'}}>
                                {props.name}
                            </div>
                            <div className={styles.tagline} style={{ fontFamily: props.textFont ? props.textFont : 'Nunito'}}>
                                {props.tagline}
                            </div>
                        </div>
                    </div>
          
                   
                    {!props.isSocialBoxHide ? 
                        <div className={styles.social_icon_list}>
                            {props.socialIcons !== undefined ? 
                                props.socialIcons.filter(item => item.status === 1).map(icon =>
                                    <a key={icon.id} target="_blank" rel="noreferrer" 
                                        href={
                                            icon.itype === "phone" ?  "https://wa.me/" + icon.value
                                            : (icon.itype === "email" ? "mailto:"+icon.value : icon.value)}
                                    >
                                        <span dangerouslySetInnerHTML={{__html: icon.svg_code}}></span>
                                    </a>    
                                ) : null
                            }
                        </div> : null
                    }
                </div>
            </>
        );  
     }else if(props.htmlId == '8'){
        return (
            <>
                <div className={styles.profile_wrapper +' '+ styles['html_theme_t' + props.htmlId] +' '+ (props.isEditorPreview === true ? styles.editor_wrapper : '')}>
                <div className={styles.profile_bg} style={{backgroundColor : props.secondaryColor}}></div>
                    <div className={styles.box_main_flx}>
                    <div className={styles.box_flx}>
           
                        <div className={styles.avatar +' '+ (props.imageURL ? styles.has_image : '')}>
                            <div className={styles.avatar_initial}>{getNameInitials(props.name)}</div>
                            {props.imageURL ? <img src={props.imageURL} alt="" /> : null}
                        </div>
                        <div className={styles.box_left_content}>
                            <div className={styles.name} style={{color : props.headingColor,fontFamily: props.headingFont ? props.headingFont : 'Nunito'}}>
                                {props.name}
                            </div>
                            <div className={styles.tagline} style={{color : props.pragraphColor, fontFamily: props.textFont ? props.textFont : 'Nunito'}}>
                                {props.tagline}
                            </div>
                        </div>
                   
                 
                    </div>
                    {!props.isSocialBoxHide ? 
                        <div className={styles.social_icon_list} style={{backgroundImage : props.defaultGradient}}>
                            {props.socialIcons !== undefined ? 
                                props.socialIcons.filter(item => item.status === 1).map(icon =>
                                    <a key={icon.id} target="_blank" rel="noreferrer" 
                                        href={
                                            icon.itype === "phone" ?  "https://wa.me/" + icon.value
                                            : (icon.itype === "email" ? "mailto:"+icon.value : icon.value)}
                                    >
                                        <span dangerouslySetInnerHTML={{__html: icon.svg_code}}></span>
                                    </a>    
                                ) : null
                            }
                        </div> : null
                    }
                   </div>
                </div>
            </>
        );     
    }else if(props.htmlId == '9'){
        return (
            <>
                <div className={styles.profile_wrapper +' '+ styles['html_theme_t' + props.htmlId] +' '+ (props.isEditorPreview === true ? styles.editor_wrapper : '')}>
                    <div className={styles.box_main_flx}>
                        <div className={styles.avatar +' '+ (props.imageURL ? styles.has_image : '')}>
                            <div className={styles.avatar_initial}>{getNameInitials(props.name)}</div>
                            {props.imageURL ? <img src={props.imageURL} alt="" /> : null}
                            <span className={styles.theme_border} style={{backgroundColor : props.primaryColor}}></span>
                        </div>
                        <div className={styles.box_left_content}>
                            <div className={styles.name} style={{color : props.headingColor,fontFamily: props.headingFont ? props.headingFont : 'Nunito'}}>
                                {props.name}
                            </div>
                            <div className={styles.tagline} style={{color : props.pragraphColor, fontFamily: props.textFont ? props.textFont : 'Nunito'}}>
                                {props.tagline}
                            </div>
                        </div>
                    </div>
                    {!props.isSocialBoxHide ? 
                        <div className={styles.social_icon_list}>
                            {props.socialIcons !== undefined ? 
                                props.socialIcons.filter(item => item.status === 1).map(icon =>
                                    <a key={icon.id} target="_blank" rel="noreferrer" 
                                        href={
                                            icon.itype === "phone" ?  "https://wa.me/" + icon.value
                                            : (icon.itype === "email" ? "mailto:"+icon.value : icon.value)}
                                    >
                                        <span dangerouslySetInnerHTML={{__html: icon.svg_code}}></span>
                                    </a>    
                                ) : null
                            }
                        </div> : null
                    }
                </div>
            </>
        );
    }else if(props.htmlId == '10'){
        return (
            <>
                <div className={styles.profile_wrapper +' '+ styles['html_theme_t' + props.htmlId] +' '+ (props.isEditorPreview === true ? styles.editor_wrapper : '')}>
                    <div className={styles.box_main_flx}>
                        <div className={styles.avatar +' '+ (props.imageURL ? styles.has_image : '')}>
                            <div className={styles.avatar_initial}>{getNameInitials(props.name)}</div>
                            {props.imageURL ? <img src={props.imageURL} alt="" /> : null}
                        </div>
                        <div className={styles.box_left_content}>
                            <div className={styles.name} style={{fontFamily: props.headingFont ? props.headingFont : 'Nunito'}}>
                                {props.name}
                            </div>
                            <div className={styles.tagline} style={{fontFamily: props.textFont ? props.textFont : 'Nunito'}}>
                                {props.tagline}
                            </div>
                        </div>
                    </div>
                    {!props.isSocialBoxHide ? 
                        <div className={styles.social_icon_list} style={{backgroundColor : props.primaryColor , boxShadow :('-4px 9px 25px -6px' + props.primaryColor)}}>
                            {props.socialIcons !== undefined ? 
                                props.socialIcons.filter(item => item.status === 1).map(icon =>
                                    <a key={icon.id} target="_blank" rel="noreferrer" 
                                        href={
                                            icon.itype === "phone" ?  "https://wa.me/" + icon.value
                                            : (icon.itype === "email" ? "mailto:"+icon.value : icon.value)}
                                    >
                                        <span dangerouslySetInnerHTML={{__html: icon.svg_code}}></span>
                                    </a>    
                                ) : null
                            }
                        </div> : null
                    }
                </div>
            </>
        ); 
    }else if(props.htmlId == '11'){
        return (
            <>
                <div className={styles.profile_wrapper +' '+ styles['html_theme_t' + props.htmlId] +' '+ (props.isEditorPreview === true ? styles.editor_wrapper : '')}>
                    <div className={styles.box_main_flx}>
                        <div className={styles.avatar +' '+ (props.imageURL ? styles.has_image : '')}>
                            <div className={styles.avatar_initial}>{getNameInitials(props.name)}</div>
                            {props.imageURL ? <img src={props.imageURL} alt="" /> : null}
                        </div>
                        <div className={styles.box_left_content}>
                            <div className={styles.name} style={{color : props.headingColor,fontFamily: props.headingFont ? props.headingFont : 'Nunito'}}>
                                {props.name}
                            </div>
                            <div className={styles.tagline} style={{color : props.pragraphColor, fontFamily: props.textFont ? props.textFont : 'Nunito'}}>
                                {props.tagline}
                            </div>
                        </div>
                   
                    {!props.isSocialBoxHide ? 
                        <div className={styles.social_icon_list}>
                            {props.socialIcons !== undefined ? 
                                props.socialIcons.filter(item => item.status === 1).map(icon =>
                                    <a key={icon.id} target="_blank" rel="noreferrer" 
                                        href={
                                            icon.itype === "phone" ?  "https://wa.me/" + icon.value
                                            : (icon.itype === "email" ? "mailto:"+icon.value : icon.value)}
                                    >
                                        <span dangerouslySetInnerHTML={{__html: icon.svg_code}}></span>
                                    </a>    
                                ) : null
                            }
                        </div> : null
                    }
                     </div>
                </div>
            </>
        );     
    }else if(props.htmlId == '12'){
        return (
            <>
                <div className={styles.profile_wrapper +' '+ styles['html_theme_t' + props.htmlId] +' '+ (props.isEditorPreview === true ? styles.editor_wrapper : '')}>
                    <div className={styles.box_main_flx}>
                        <div className={styles.avatar +' '+ (props.imageURL ? styles.has_image : '')}>
                            <div className={styles.avatar_initial}>{getNameInitials(props.name)}</div>
                            {props.imageURL ? <img src={props.imageURL} alt="" /> : null}
                            <span className={styles.theme_border} style={{border :('5px solid' + props.primaryColor)}}></span>
                        </div>
                        <div className={styles.box_left_content}>
                            <div className={styles.name} style={{color : props.headingColor,fontFamily: props.headingFont ? props.headingFont : 'Nunito'}}>
                                {props.name}
                            </div>
                            <div className={styles.tagline} style={{color : props.pragraphColor, fontFamily: props.textFont ? props.textFont : 'Nunito'}}>
                                {props.tagline}
                            </div>
                        </div>
                    </div>
                    {!props.isSocialBoxHide ? 
                        <div className={styles.social_icon_list}>
                            <div className={styles.social_icon_bg} style={{border : '2px solid' + props.primaryColor}}>
                                <span style={{backgroundColor : props.primaryColor}}></span>
                            </div>
                            {props.socialIcons !== undefined ? 
                                props.socialIcons.filter(item => item.status === 1).map(icon =>
                                    <a key={icon.id} target="_blank" rel="noreferrer" 
                                        href={
                                            icon.itype === "phone" ?  "https://wa.me/" + icon.value
                                            : (icon.itype === "email" ? "mailto:"+icon.value : icon.value)}
                                    >
                                        <span dangerouslySetInnerHTML={{__html: icon.svg_code}}></span>
                                    </a>    
                                ) : null
                            }
                        </div> : null
                    }
                </div>
            </>
        ); 
    }else if(props.htmlId == '13'){
        return (
            <>
                <div className={styles.profile_wrapper +' '+ styles['html_theme_t' + props.htmlId] +' '+ (props.isEditorPreview === true ? styles.editor_wrapper : '')}>
                    <div className={styles.box_main_flx}>
                        <div className={styles.avatar +' '+ (props.imageURL ? styles.has_image : '')}>
                            <div className={styles.avatar_initial}>{getNameInitials(props.name)}</div>
                            {props.imageURL ? <img src={props.imageURL} alt="" /> : null}
                        </div>
                        <div className={styles.box_left_content}>
                            <div className={styles.name} style={{color : props.headingColor,fontFamily: props.headingFont ? props.headingFont : 'Nunito'}}>
                                {props.name}
                            </div>
                            <div className={styles.tagline} style={{color : props.pragraphColor, fontFamily: props.textFont ? props.textFont : 'Nunito'}}>
                                {props.tagline}
                            </div>
                        </div>
                   
                    {!props.isSocialBoxHide ? 
                        <div className={styles.social_icon_list}>
                            {props.socialIcons !== undefined ? 
                                props.socialIcons.filter(item => item.status === 1).map(icon =>
                                    <a key={icon.id} target="_blank" rel="noreferrer" 
                                        href={
                                            icon.itype === "phone" ?  "https://wa.me/" + icon.value
                                            : (icon.itype === "email" ? "mailto:"+icon.value : icon.value)}
                                    >
                                        <span dangerouslySetInnerHTML={{__html: icon.svg_code}}></span>
                                    </a>    
                                ) : null
                            }
                        </div> : null
                    }
                     </div>
                </div>
            </>
        );         
    }else if(props.htmlId == '14'){
        return (
            <>
                <div className={styles.profile_wrapper +' '+ styles['html_theme_t' + props.htmlId] +' '+ (props.isEditorPreview === true ? styles.editor_wrapper : '')}>
                    <div className={styles.box_main_flx}>
                        <div className={styles.avatar +' '+ (props.imageURL ? styles.has_image : '')}>
                            <div className={styles.avatar_initial}>{getNameInitials(props.name)}</div>
                            {props.imageURL ? <img src={props.imageURL} alt="" /> : null}
                        </div>
                        <div className={styles.box_left_content}>
                        <h3 className={styles.socialicons_heading}>Follow Me</h3> 
                            {!props.isSocialBoxHide ? 
                            <div className={styles.social_icon_list} >
                              
                            {props.socialIcons !== undefined ? 
                                props.socialIcons.filter(item => item.status === 1).map(icon =>
                                    <a key={icon.id} target="_blank" rel="noreferrer" 
                                        href={
                                            icon.itype === "phone" ?  "https://wa.me/" + icon.value
                                            : (icon.itype === "email" ? "mailto:"+icon.value : icon.value)}
                                    >
                                        <span dangerouslySetInnerHTML={{__html: icon.svg_code}}></span>
                                    </a>    
                                ) : null
                            }
                            </div> : null
                            }
                        </div>
                    </div>
                    <div className={styles.profile_bg}>
                        <div className={styles.profile_bg_wr} style={{backgroundColor : props.primaryColor , boxShadow :('-4px 9px 25px -6px' + props.primaryColor)}}>
                            <div className={styles.name} style={{fontFamily: props.headingFont ? props.headingFont : 'Nunito'}}>
                                {props.name}
                            </div>
                            <div className={styles.tagline} style={{ fontFamily: props.textFont ? props.textFont : 'Nunito'}}>
                                {props.tagline}
                            </div>
                        </div>
                    </div>
                </div>
            </>
        );   
    }else if(props.htmlId == '15'){
        return (
            <>
               <div className={styles.profile_wrapper +' '+ styles['html_theme_t' + props.htmlId] +' '+ (props.isEditorPreview === true ? styles.editor_wrapper : '')}>
                  <div className={styles.profile_bg} style={{backgroundImage : props.defaultGradient}}></div>
                        <div className={styles.profile_main_fix}>
                            <div className={styles.avatar +' '+ (props.imageURL ? styles.has_image : '')}>
                                <div className={styles.avatar_initial}>{getNameInitials(props.name)}</div>
                                {props.imageURL ? <img src={props.imageURL} alt="" /> : null}
                            </div>
                            <div className={styles.profile_content}>
                                <div className={styles.name} style={{color : props.headingColor,fontFamily: props.headingFont ? props.headingFont : 'Nunito'}}>
                                    {props.name}
                                </div>
                                <div className={styles.tagline} style={{color : props.pragraphColor, fontFamily: props.textFont ? props.textFont : 'Nunito'}}>
                                    {props.tagline}
                                </div>
                            </div>
                        </div>
                    <div className={styles.profile_details}>
                        {!props.isSocialBoxHide ? 
                            <div className={styles.social_icon_list}>
                                {props.socialIcons !== undefined ? 
                                    props.socialIcons.filter(item => item.status === 1).map(icon =>
                                        <a key={icon.id} target="_blank" rel="noreferrer" 
                                            href={
                                                icon.itype === "phone" ?  "https://wa.me/" + icon.value
                                                : (icon.itype === "email" ? "mailto:"+icon.value : icon.value)}
                                        >
                                            <span dangerouslySetInnerHTML={{__html: icon.svg_code}}></span>
                                        </a>    
                                    ) : null
                                }
                            </div> : null
                        }
                    </div>
                </div>
            </>
        );
    }else if(props.htmlId == '16'){
        return (
            <>
                <div className={styles.profile_wrapper +' '+ styles['html_theme_t' + props.htmlId] +' '+ (props.isEditorPreview === true ? styles.editor_wrapper : '')}>
                    <div className={styles.box_main_flx}>
                        <div className={styles.avatar +' '+ (props.imageURL ? styles.has_image : '')}>
                            <div className={styles.avatar_initial}>{getNameInitials(props.name)}</div>
                            {props.imageURL ? <img src={props.imageURL} alt="" /> : null}
                        </div>
                        <div className={styles.box_left_content}>
                            <div className={styles.name} style={{color : props.headingColor,fontFamily: props.headingFont ? props.headingFont : 'Nunito'}}>
                                {props.name}
                            </div>
                            <div className={styles.tagline} style={{color : props.pragraphColor, fontFamily: props.textFont ? props.textFont : 'Nunito'}}>
                                {props.tagline}
                            </div>
                        </div>
                    </div>
                    {!props.isSocialBoxHide ? 
                        <div className={styles.social_icon_list}>
                            {props.socialIcons !== undefined ? 
                                props.socialIcons.filter(item => item.status === 1).map(icon =>
                                    <a key={icon.id} target="_blank" rel="noreferrer" 
                                        href={
                                            icon.itype === "phone" ?  "https://wa.me/" + icon.value
                                            : (icon.itype === "email" ? "mailto:"+icon.value : icon.value)}
                                    >
                                        <span dangerouslySetInnerHTML={{__html: icon.svg_code}}></span>
                                    </a>    
                                ) : null
                            }
                        </div> : null
                    }
                </div>
            </>
        );    
    }else if(props.htmlId == '17'){
        return (
            <>
                <div className={styles.profile_wrapper +' '+ styles['html_theme_t' + props.htmlId] +' '+ (props.isEditorPreview === true ? styles.editor_wrapper : '')}>
                    <div className={styles.box_main_flx}>
                        <div className={styles.avatar +' '+ (props.imageURL ? styles.has_image : '')}>
                            <div className={styles.avatar_initial}>{getNameInitials(props.name)}</div>
                            {props.imageURL ? <img src={props.imageURL} alt="" /> : null}
                        </div>
                        <div className={styles.box_left_content}>
                            <div className={styles.name} style={{color : props.headingColor,fontFamily: props.headingFont ? props.headingFont : 'Nunito'}}>
                                {props.name}
                            </div>
                            <div className={styles.tagline} style={{color : props.pragraphColor  ,fontFamily: props.textFont ? props.textFont : 'Nunito'}}>
                                {props.tagline}
                            </div>
                        </div>
                    </div>
                    {!props.isSocialBoxHide ? 
                        <div className={styles.social_icon_list}>
                            {props.socialIcons !== undefined ? 
                                props.socialIcons.filter(item => item.status === 1).map(icon =>
                                    <a key={icon.id} target="_blank" rel="noreferrer" 
                                        href={
                                            icon.itype === "phone" ?  "https://wa.me/" + icon.value
                                            : (icon.itype === "email" ? "mailto:"+icon.value : icon.value)}
                                    >
                                        <span dangerouslySetInnerHTML={{__html: icon.svg_code}}></span>
                                    </a>    
                                ) : null
                            }
                        </div> : null
                    }
                </div>
            </>
        );    
    }else if(props.htmlId == '18'){
        return (
            <>
                <div className={styles.profile_wrapper +' '+ styles['html_theme_t' + props.htmlId] +' '+ (props.isEditorPreview === true ? styles.editor_wrapper : '')}>
                    
                    <div className={styles.profile_bg} style={{backgroundImage : props.defaultGradient}}></div>


                    <div className={styles.avatar +' '+ (props.imageURL ? styles.has_image : '')}>
                        <div className={styles.avatar_initial}>{getNameInitials(props.name)}</div>
                        {props.imageURL ? <img src={props.imageURL} alt="" /> : null}
                        <span className={styles.theme_border}  style={{backgroundImage : props.defaultGradient}}></span>

                    </div>
                    <div className={styles.name} style={{color : props.headingColor,fontFamily: props.headingFont ? props.headingFont : 'Nunito'}}>
                        {props.name}
                    </div>
                    <div className={styles.bg_subtitle_color} style={{backgroundImage : props.defaultGradient }}>
                        <div className={styles.tagline} style={{ fontFamily: props.textFont ? props.textFont : 'Nunito'}}>
                           <span style={{backgroundImage : props.defaultGradient }}>{props.tagline}</span> 
                        </div>
                    </div>
                    {!props.isSocialBoxHide ? 
                        <div className={styles.social_icon_list}>
                            {props.socialIcons !== undefined ? 
                                props.socialIcons.filter(item => item.status === 1).map(icon =>
                                    <a key={icon.id} target="_blank" rel="noreferrer" 
                                        href={
                                            icon.itype === "phone" ?  "https://wa.me/" + icon.value
                                            : (icon.itype === "email" ? "mailto:"+icon.value : icon.value)}
                                    >
                                        <span dangerouslySetInnerHTML={{__html: icon.svg_code}}></span>
                                    </a>    
                                ) : null
                            }
                        </div> : null
                        
                    }
                </div>
            </>
        );
    }else if(props.htmlId == '19'){
        return (
            <>
                <div className={styles.profile_wrapper +' '+ styles['html_theme_t' + props.htmlId] +' '+ (props.isEditorPreview === true ? styles.editor_wrapper : '')}>
                    
                    <div className={styles.profile_bg}>
                        <div className={styles.avatar +' '+ (props.imageURL ? styles.has_image : '')}>
                            <div className={styles.avatar_initial}>{getNameInitials(props.name)}</div>
                            {props.imageURL ? <img src={props.imageURL} alt="" /> : null}
                            <span className={styles.theme_border} ></span>
                        </div>
                        <div className={styles.profile_bg_inner}>
                            <div className={styles.profile_bg_content}>
                                <div className={styles.name} style={{fontFamily: props.headingFont ? props.headingFont : 'Nunito'}}>
                                    {props.name}
                                </div>
                                <div className={styles.tagline} style={{fontFamily: props.textFont ? props.textFont : 'Nunito'}}>
                                    {props.tagline}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className={styles.socialicons__main}>
                        {!props.isSocialBoxHide ? 
                            <div className={styles.social_icon_list}>
                            {props.socialIcons !== undefined ? 
                            props.socialIcons.filter(item => item.status === 1).map(icon =>
                            <a key={icon.id} target="_blank" rel="noreferrer" 
                                href={
                                    icon.itype === "phone" ?  "https://wa.me/" + icon.value
                                    : (icon.itype === "email" ? "mailto:"+icon.value : icon.value)}
                            >
                                <span dangerouslySetInnerHTML={{__html: icon.svg_code}}></span>
                            </a>    
                            ) : null
                            }
                            </div> : null
                        }
                    </div>
                </div>
            </>
        );  
    }else if(props.htmlId == '20'){
        return (
            <>
                <div className={styles.profile_wrapper +' '+ styles['html_theme_t' + props.htmlId] +' '+ (props.isEditorPreview === true ? styles.editor_wrapper : '')}>                 
                <div className={styles.profile_bg}></div>

                    <div className={styles.name_fix}>
                        <div className={styles.name} style={{color : props.headingColor,fontFamily: props.headingFont ? props.headingFont : 'Nunito'}}>
                            {props.name}
                        </div>
                        <div className={styles.tagline} style={{color : props.pragraphColor, fontFamily: props.textFont ? props.textFont : 'Nunito'}}>
                            {props.tagline}
                        </div>
                    </div>

                    <div className={styles.avatar +' '+ (props.imageURL ? styles.has_image : '')}>
                        <div className={styles.avatar_initial}>{getNameInitials(props.name)}</div>
                        {props.imageURL ? <img src={props.imageURL} alt="" /> : null}

                    </div>
               
                    {!props.isSocialBoxHide ? 
                        <div className={styles.social_icon_list}>
                            {props.socialIcons !== undefined ? 
                                props.socialIcons.filter(item => item.status === 1).map(icon =>
                                    <a key={icon.id} target="_blank" rel="noreferrer" 
                                        href={
                                            icon.itype === "phone" ?  "https://wa.me/" + icon.value
                                            : (icon.itype === "email" ? "mailto:"+icon.value : icon.value)}
                                    >
                                        <span dangerouslySetInnerHTML={{__html: icon.svg_code}}></span>
                                    </a>    
                                ) : null
                            }
                        </div> : null
                    }
                </div>
            </>
        );  
    }else{
        return (
            <>
                <div className={styles.profile_wrapper +' '+ styles['share_icon_t' + props.htmlId]}>
                    <div className={styles.avatar +' '+ (props.imageURL ? styles.has_image : '')} style={{backgroundImage : props.defaultGradient}}>
                        <div className={styles.avatar_initial}>{getNameInitials(props.name)}</div>
                        {props.imageURL ? <img src={props.imageURL} alt="" /> : null}
                    </div>
                    <div className={styles.name} style={{color : props.headingColor,fontFamily: props.headingFont ? props.headingFont : 'Nunito'}}>
                        {props.name}
                    </div>
                    <div className={styles.tagline} style={{color : props.pragraphColor, fontFamily: props.textFont ? props.textFont : 'Nunito'}}>
                        {props.tagline}
                    </div>

                    {!props.isSocialBoxHide ? 
                        <div className={styles.social_icon_list}>
                            {props.socialIcons !== undefined ? 
                                props.socialIcons.filter(item => item.status === 1).map(icon =>
                                    <a key={icon.id} target="_blank" rel="noreferrer" 
                                        href={
                                            icon.itype === "phone" ?  "https://wa.me/" + icon.value
                                            : (icon.itype === "email" ? "mailto:"+icon.value : icon.value)}
                                    >
                                        <span dangerouslySetInnerHTML={{__html: icon.svg_code}}></span>
                                    </a>    
                                ) : null
                            }
                        </div> : null
                    }
                </div>
            </>
        );
    }
}

export default Profile;