import Link from 'next/link';
import { useRouter } from 'next/router';
import { common } from '../../../../helper/Common';
import styles from './Link.module.css';
const LinkElement = (props) => {  
    const router = useRouter();
    const linkClick = (url) => {
        var adata = {
            page_id : props.pageId,
            link_url : url
        }
        if(props.item.sectionData.type === 'link'){
            window.open(url, (props.item.sectionData.openNewTab ? '_blank' : '_self'));
        }else{
            adata.link_url = process.env.APP_URL + url;
            router.push('/'+url);
        }
        if(props.isAdmin === false){
            common.getAPI({
                method: 'POST',
                loading : false,
                url: 'preview/clicklink',
                data: adata
            });
        }
    }
    if(props.htmlId == '1'){
        return (
            <>
                <div className={styles.link_wrapper +' '+ styles['themes_'+ props.htmlId] +' '+ (props.isEditorPreview === true ? styles.editor_link : '') + "  " + (props.item?.animation ? `animate__animated animate__${(props.item?.animation?.animationRepeat?.length == 1) ? `repeat-${props.item?.animation.animationRepeat}` : props.item?.animation.animationRepeat}  animate__${props.item?.animation.name}` :"")} style={{fontFamily : props.textFont , animationDuration: props.item?.animation ? `${props.item?.animation?.animationDuration}ms` : "",
            animationDelay: props.item?.animation ? `${props.item?.animation?.animationDelay}ms` : "",}}>
                    {props.item.sectionData.type === 'link'?
                        <>
                            <a onClick={() => linkClick(props.item.sectionData.link)} style={{color: props.primaryColor}}>
                               
                                <span style={{backgroundImage : props.defaultGradient}}>{props.item.sectionData.linkTitle}</span> 
                              

                            </a>
                            <span className={styles.link_bg}  style={{backgroundImage : props.defaultGradient}}></span>

                        </>
                        :
                        <>
                            <div onClick={() => linkClick((props.isAdmin === true ? '/preview/'+ props.tempId : props.linkSlug) +'/'+ props.item.sectionData.pageSlug)}>
                                <a target={props.item.sectionData.openNewTab === true ? '_blank' : '_self'} rel="noopener noreferrer" style={{color: props.primaryColor}}>
                                    <span style={{backgroundImage : props.defaultGradient}}>{props.item.sectionData.linkTitle}</span>

                                </a>
                                <span className={styles.link_bg}  style={{backgroundImage : props.defaultGradient}}></span>

                            </div>

                        </> 
                    }
              </div>

           </>
        );
    }
    else if(props.htmlId == '2'){
        return (
            <>
                <div className={styles.link_wrapper +' '+ styles['themes_'+ props.htmlId] +' '+ (props.isEditorPreview === true ? styles.editor_link : '') + "  " + (props.item?.animation ? `animate__animated animate__${(props.item?.animation?.animationRepeat?.length == 1) ? `repeat-${props.item?.animation.animationRepeat}` : props.item?.animation.animationRepeat}  animate__${props.item?.animation.name}` :"")} style={{fontFamily : props.textFont, animationDuration: props.item?.animation ? `${props.item?.animation?.animationDuration}ms` : "",
            animationDelay: props.item?.animation ? `${props.item?.animation?.animationDelay}ms` : "",}}>
                    {props.item.sectionData.type === 'link'?
                        <a onClick={() => linkClick(props.item.sectionData.link)} style={{color: props.primaryColor}}>
                            {props.item.sectionData.linkTitle}
                        </a>
                        : 
                        <div onClick={() => linkClick((props.isAdmin === true ? '/preview/'+ props.tempId : props.linkSlug) +'/'+ props.item.sectionData.pageSlug)}>
                            <a target={props.item.sectionData.openNewTab === true ? '_blank' : '_self'} rel="noopener noreferrer" style={{color: props.primaryColor}}>
                                {props.item.sectionData.linkTitle}
                            </a>
                        </div>
                    }
                </div>
            </>
        );
    }
    else if(props.htmlId == '3'){
        return (
            <>
                <div className={styles.link_wrapper +' '+ styles['themes_'+ props.htmlId] +' '+ (props.isEditorPreview === true ? styles.editor_link : '') + "  " + (props.item?.animation ? `animate__animated animate__${(props.item?.animation?.animationRepeat?.length == 1) ? `repeat-${props.item?.animation.animationRepeat}` : props.item?.animation.animationRepeat}  animate__${props.item?.animation.name}` :"")} style={{fontFamily : props.textFont, animationDuration: props.item?.animation ? `${props.item?.animation?.animationDuration}ms` : "",
            animationDelay: props.item?.animation ? `${props.item?.animation?.animationDelay}ms` : "",}}>
                    {props.item.sectionData.type === 'link'?
                        <>
                            <a onClick={() => linkClick(props.item.sectionData.link)} style={{boxShadow: '0px 4px 12px' + props.primaryColor , backgroundColor: props.primaryColor, color: props.secondaryColor}}>
                                {props.item.sectionData.linkTitle}
                            </a>
                        </>
                        :
                        <>
                            <div onClick={() => linkClick((props.isAdmin === true ? '/preview/'+ props.tempId : props.linkSlug) +'/'+ props.item.sectionData.pageSlug)}>
                                <a target={props.item.sectionData.openNewTab === true ? '_blank' : '_self'} rel="noopener noreferrer" style={{ boxShadow: '0px 4px 12px' + props.primaryColor , backgroundColor: props.primaryColor, color: props.secondaryColor}}>
                                    {props.item.sectionData.linkTitle}
                                </a>
                            </div>
                        </> 
                    }
                </div>
            </>
        );
    }
    else if(props.htmlId == '4'){
        return (
            <>
                <div className={styles.link_wrapper +' '+ styles['themes_'+ props.htmlId] +' '+ (props.isEditorPreview === true ? styles.editor_link : '') + "  " + (props.item?.animation ? `animate__animated animate__${(props.item?.animation?.animationRepeat?.length == 1) ? `repeat-${props.item?.animation.animationRepeat}` : props.item?.animation.animationRepeat}  animate__${props.item?.animation.name}` :"")} style={{fontFamily : props.textFont, animationDuration: props.item?.animation ? `${props.item?.animation?.animationDuration}ms` : "",
            animationDelay: props.item?.animation ? `${props.item?.animation?.animationDelay}ms` : "",}}>
                    {props.item.sectionData.type === 'link'?
                        <>
                         <div className={styles.link_bg} style={{color: props.primaryColor}}>
                                <a onClick={() => linkClick(props.item.sectionData.link)} style={{backgroundColor: props.primaryColor, color: props.secondaryColor}}>
                                    {props.item.sectionData.linkTitle}
                                </a>
                         </div>

                        </>
                        :
                        <>
                         <div className={styles.link_bg} style={{color: props.primaryColor}}>
                            <div onClick={() => linkClick((props.isAdmin === true ? '/preview/'+ props.tempId : props.linkSlug) +'/'+ props.item.sectionData.pageSlug)}>
                                <a target={props.item.sectionData.openNewTab === true ? '_blank' : '_self'} rel="noopener noreferrer" style={{backgroundColor: props.primaryColor, color: props.secondaryColor}}>
                                    {props.item.sectionData.linkTitle}
                                </a>
                            </div>
                            

                        </div>
                        </> 
                    }
                </div>
            </>
        );
    }
    else if(props.htmlId == '5'){
        return (
            <>
                <div className={styles.link_wrapper +' '+ styles['themes_'+ props.htmlId] +' '+ (props.isEditorPreview === true ? styles.editor_link : '') + "  " + (props.item?.animation ? `animate__animated animate__${(props.item?.animation?.animationRepeat?.length == 1) ? `repeat-${props.item?.animation.animationRepeat}` : props.item?.animation.animationRepeat}  animate__${props.item?.animation.name}` :"")} style={{fontFamily : props.textFont, animationDuration: props.item?.animation ? `${props.item?.animation?.animationDuration}ms` : "",
            animationDelay: props.item?.animation ? `${props.item?.animation?.animationDelay}ms` : "",}}>
                    {props.item.sectionData.type === 'link'?
                        <>
                                <a onClick={() => linkClick(props.item.sectionData.link)} style={{backgroundColor: props.secondaryColor, color: props.primaryColor}}>
                                    {props.item.sectionData.linkTitle}
                                </a>
                         <span className={styles.link_bg} style={{color: props.primaryColor}}></span>
                        </>
                        :
                        <>
                            <div onClick={() => linkClick((props.isAdmin === true ? '/preview/'+ props.tempId : props.linkSlug) +'/'+ props.item.sectionData.pageSlug)}>
                                <a target={props.item.sectionData.openNewTab === true ? '_blank' : '_self'} rel="noopener noreferrer" style={{backgroundColor: props.secondaryColor, color: props.primaryColor}}>
                                    {props.item.sectionData.linkTitle}
                                </a>
                            </div>
                            <span className={styles.link_bg} style={{color: props.primaryColor}}></span>

                        </> 
                    }
                </div>
            </>
        );
    }
    else if(props.htmlId == '6'){
        return (
            <>
            <div className={styles.link_wrapper +' '+ styles['themes_'+ props.htmlId] +' '+ (props.isEditorPreview === true ? styles.editor_link : '') + "  " + (props.item?.animation ? `animate__animated animate__${(props.item?.animation?.animationRepeat?.length == 1) ? `repeat-${props.item?.animation.animationRepeat}` : props.item?.animation.animationRepeat}  animate__${props.item?.animation.name}` :"")} style={{fontFamily : props.textFont, animationDuration: props.item?.animation ? `${props.item?.animation?.animationDuration}ms` : "",
            animationDelay: props.item?.animation ? `${props.item?.animation?.animationDelay}ms` : "",}}>
                {props.item.sectionData.type === 'link'?
                    <>
                            <a onClick={() => linkClick(props.item.sectionData.link)} style={{color: props.secondaryColor}}>
                                {props.item.sectionData.linkTitle}
                            </a>
                            <span className={styles.link_bg} style={{color: props.primaryColor}}></span>


                    </>
                    :
                    <>
                        <div onClick={() => linkClick((props.isAdmin === true ? '/preview/'+ props.tempId : props.linkSlug) +'/'+ props.item.sectionData.pageSlug)}>
                            <a target={props.item.sectionData.openNewTab === true ? '_blank' : '_self'} rel="noopener noreferrer" style={{color: props.secondaryColor}}>
                                {props.item.sectionData.linkTitle}
                            </a>
                        </div>
                        <span className={styles.link_bg} style={{color: props.primaryColor}}></span>

                    </> 
                }
            </div>
           </>
        );
    }
    else if(props.htmlId == '7'){
        return (
            <>
            <div className={styles.link_wrapper +' '+ styles['themes_'+ props.htmlId] +' '+ (props.isEditorPreview === true ? styles.editor_link : '') + "  " + (props.item?.animation ? `animate__animated animate__${(props.item?.animation?.animationRepeat?.length == 1) ? `repeat-${props.item?.animation.animationRepeat}` : props.item?.animation.animationRepeat}  animate__${props.item?.animation.name}` :"")} style={{fontFamily : props.textFont, animationDuration: props.item?.animation ? `${props.item?.animation?.animationDuration}ms` : "",
            animationDelay: props.item?.animation ? `${props.item?.animation?.animationDelay}ms` : "",}}>
                {props.item.sectionData.type === 'link'?
                    <>
                        <a onClick={() => linkClick(props.item.sectionData.link)} style={{backgroundImage: props.defaultGradient, color: props.secondaryColor}}>
                            <span className={styles.svg__icons}> <svg width="20" height="20" viewBox="0 0 26 25" fill="none" xmlns="http://www.w3.org/2000/svg"><path opacity="0.302" fillRule="evenodd" clipRule="evenodd" d="M23.173 10.875L19.49 14.558C19.233 14.814 18.95 15.036 18.656 15.241C18.836 14.053 18.757 12.832 18.384 11.679L21.181 8.883C22.555 7.508 22.555 5.277 21.181 3.903C19.806 2.528 17.575 2.528 16.201 3.903L12.518 7.586C11.143 8.96 11.143 11.191 12.518 12.566C13.344 13.393 13.344 14.727 12.518 15.554L12.279 15.793C11.631 15.484 11.034 15.066 10.526 14.558C8.826 12.858 8.247 10.361 9.01 8.064C9.016 8.062 9.021 8.059 9.027 8.058C9.362 7.057 9.883 6.237 10.526 5.594L14.209 1.911C16.68 -0.561001 20.701 -0.561001 23.173 1.911C25.644 4.383 25.644 8.403 23.173 10.875ZM10.707 3.451C10.627 3.472 10.546 3.483 10.466 3.483C10.219 3.483 9.978 3.386 9.799 3.207C9.683 3.091 9.599 2.946 9.557 2.787L9.192 1.426C9.127 1.184 9.16 0.930999 9.286 0.713999C9.411 0.496999 9.614 0.340999 9.856 0.275999C10.358 0.142999 10.874 0.440999 11.006 0.940999L11.371 2.301C11.436 2.543 11.403 2.796 11.277 3.014C11.152 3.231 10.949 3.386 10.707 3.451ZM4.842 15.262C3.467 16.637 3.467 18.868 4.842 20.242C6.216 21.616 8.447 21.616 9.822 20.242C10.931 19.133 12.35 17.713 13.514 16.55C14.888 15.175 14.888 12.944 13.514 11.57C12.687 10.743 12.687 9.409 13.514 8.582L13.743 8.353C14.4 8.652 14.998 9.07 15.506 9.578C17.206 11.278 17.785 13.775 17.022 16.072C17.016 16.073 17.011 16.076 17.005 16.078C16.669 17.079 16.148 17.899 15.506 18.542L11.814 22.234C9.342 24.706 5.321 24.706 2.85 22.234C0.378002 19.762 0.378002 15.742 2.85 13.27L6.542 9.578C6.798 9.322 7.081 9.1 7.376 8.894C7.196 10.083 7.274 11.303 7.647 12.456L4.842 15.262ZM6.044 6.034C5.803 6.034 5.563 5.943 5.38 5.76L4.384 4.764C4.206 4.586 4.109 4.351 4.109 4.1C4.109 3.849 4.206 3.613 4.384 3.436C4.561 3.258 4.797 3.161 5.048 3.161C5.298 3.161 5.534 3.258 5.712 3.436L6.708 4.432C6.885 4.609 6.983 4.845 6.983 5.096C6.983 5.347 6.885 5.582 6.708 5.76C6.525 5.943 6.284 6.034 6.044 6.034ZM4.399 9.759C4.287 10.178 3.906 10.455 3.492 10.455C3.412 10.455 3.33 10.445 3.249 10.423L1.888 10.058C1.389 9.925 1.091 9.409 1.224 8.908C1.289 8.666 1.444 8.463 1.662 8.338C1.879 8.213 2.132 8.179 2.374 8.244L3.735 8.609C3.975 8.672 4.177 8.826 4.303 9.042C4.43 9.261 4.464 9.515 4.399 9.759ZM15.324 20.684C15.825 20.55 16.341 20.848 16.475 21.348L16.839 22.709C16.973 23.209 16.675 23.725 16.175 23.859C16.095 23.881 16.013 23.891 15.933 23.891C15.518 23.891 15.137 23.614 15.025 23.195L14.66 21.835C14.527 21.334 14.824 20.818 15.324 20.684ZM19.988 18.101C20.238 18.101 20.474 18.198 20.652 18.376L21.648 19.372C22.014 19.738 22.014 20.334 21.648 20.7C21.47 20.877 21.235 20.975 20.984 20.975C20.733 20.975 20.497 20.877 20.32 20.7L19.324 19.704C19.146 19.526 19.049 19.291 19.049 19.04C19.049 18.789 19.146 18.553 19.324 18.376C19.501 18.198 19.737 18.101 19.988 18.101ZM21.632 14.377C21.766 13.876 22.282 13.579 22.783 13.712L24.143 14.077C24.384 14.14 24.585 14.294 24.711 14.51C24.838 14.728 24.872 14.983 24.807 15.227C24.695 15.646 24.315 15.923 23.9 15.923C23.82 15.923 23.738 15.913 23.657 15.891L22.296 15.527C21.797 15.393 21.499 14.877 21.632 14.377Z" fill="white"/></svg>
                            </span>
                            <span>{props.item.sectionData.linkTitle}</span>
                        </a>
                    </>
                    :
                    <>
                        <div onClick={() => linkClick((props.isAdmin === true ? '/preview/'+ props.tempId : props.linkSlug) +'/'+ props.item.sectionData.pageSlug)}>
                            
                            <a target={props.item.sectionData.openNewTab === true ? '_blank' : '_self'} rel="noopener noreferrer" style={{backgroundImage: props.defaultGradient,color: props.secondaryColor}}>
                                <span className={styles.svg__icons}> <svg width="20" height="20" viewBox="0 0 26 25" fill="none" xmlns="http://www.w3.org/2000/svg"><path opacity="0.302" fillRule="evenodd" clipRule="evenodd" d="M23.173 10.875L19.49 14.558C19.233 14.814 18.95 15.036 18.656 15.241C18.836 14.053 18.757 12.832 18.384 11.679L21.181 8.883C22.555 7.508 22.555 5.277 21.181 3.903C19.806 2.528 17.575 2.528 16.201 3.903L12.518 7.586C11.143 8.96 11.143 11.191 12.518 12.566C13.344 13.393 13.344 14.727 12.518 15.554L12.279 15.793C11.631 15.484 11.034 15.066 10.526 14.558C8.826 12.858 8.247 10.361 9.01 8.064C9.016 8.062 9.021 8.059 9.027 8.058C9.362 7.057 9.883 6.237 10.526 5.594L14.209 1.911C16.68 -0.561001 20.701 -0.561001 23.173 1.911C25.644 4.383 25.644 8.403 23.173 10.875ZM10.707 3.451C10.627 3.472 10.546 3.483 10.466 3.483C10.219 3.483 9.978 3.386 9.799 3.207C9.683 3.091 9.599 2.946 9.557 2.787L9.192 1.426C9.127 1.184 9.16 0.930999 9.286 0.713999C9.411 0.496999 9.614 0.340999 9.856 0.275999C10.358 0.142999 10.874 0.440999 11.006 0.940999L11.371 2.301C11.436 2.543 11.403 2.796 11.277 3.014C11.152 3.231 10.949 3.386 10.707 3.451ZM4.842 15.262C3.467 16.637 3.467 18.868 4.842 20.242C6.216 21.616 8.447 21.616 9.822 20.242C10.931 19.133 12.35 17.713 13.514 16.55C14.888 15.175 14.888 12.944 13.514 11.57C12.687 10.743 12.687 9.409 13.514 8.582L13.743 8.353C14.4 8.652 14.998 9.07 15.506 9.578C17.206 11.278 17.785 13.775 17.022 16.072C17.016 16.073 17.011 16.076 17.005 16.078C16.669 17.079 16.148 17.899 15.506 18.542L11.814 22.234C9.342 24.706 5.321 24.706 2.85 22.234C0.378002 19.762 0.378002 15.742 2.85 13.27L6.542 9.578C6.798 9.322 7.081 9.1 7.376 8.894C7.196 10.083 7.274 11.303 7.647 12.456L4.842 15.262ZM6.044 6.034C5.803 6.034 5.563 5.943 5.38 5.76L4.384 4.764C4.206 4.586 4.109 4.351 4.109 4.1C4.109 3.849 4.206 3.613 4.384 3.436C4.561 3.258 4.797 3.161 5.048 3.161C5.298 3.161 5.534 3.258 5.712 3.436L6.708 4.432C6.885 4.609 6.983 4.845 6.983 5.096C6.983 5.347 6.885 5.582 6.708 5.76C6.525 5.943 6.284 6.034 6.044 6.034ZM4.399 9.759C4.287 10.178 3.906 10.455 3.492 10.455C3.412 10.455 3.33 10.445 3.249 10.423L1.888 10.058C1.389 9.925 1.091 9.409 1.224 8.908C1.289 8.666 1.444 8.463 1.662 8.338C1.879 8.213 2.132 8.179 2.374 8.244L3.735 8.609C3.975 8.672 4.177 8.826 4.303 9.042C4.43 9.261 4.464 9.515 4.399 9.759ZM15.324 20.684C15.825 20.55 16.341 20.848 16.475 21.348L16.839 22.709C16.973 23.209 16.675 23.725 16.175 23.859C16.095 23.881 16.013 23.891 15.933 23.891C15.518 23.891 15.137 23.614 15.025 23.195L14.66 21.835C14.527 21.334 14.824 20.818 15.324 20.684ZM19.988 18.101C20.238 18.101 20.474 18.198 20.652 18.376L21.648 19.372C22.014 19.738 22.014 20.334 21.648 20.7C21.47 20.877 21.235 20.975 20.984 20.975C20.733 20.975 20.497 20.877 20.32 20.7L19.324 19.704C19.146 19.526 19.049 19.291 19.049 19.04C19.049 18.789 19.146 18.553 19.324 18.376C19.501 18.198 19.737 18.101 19.988 18.101ZM21.632 14.377C21.766 13.876 22.282 13.579 22.783 13.712L24.143 14.077C24.384 14.14 24.585 14.294 24.711 14.51C24.838 14.728 24.872 14.983 24.807 15.227C24.695 15.646 24.315 15.923 23.9 15.923C23.82 15.923 23.738 15.913 23.657 15.891L22.296 15.527C21.797 15.393 21.499 14.877 21.632 14.377Z" fill="white"/></svg>
                                </span>                       
                                 <span>{props.item.sectionData.linkTitle}</span>
                            </a>
                        </div>
                    </> 
                }
            </div>
           </>
        );
    }
    else if(props.htmlId == '8'){
        return (
            <>
            <div className={styles.link_wrapper +' '+ styles['themes_'+ props.htmlId] +' '+ (props.isEditorPreview === true ? styles.editor_link : '') + "  " + (props.item?.animation ? `animate__animated animate__${(props.item?.animation?.animationRepeat?.length == 1) ? `repeat-${props.item?.animation.animationRepeat}` : props.item?.animation.animationRepeat}  animate__${props.item?.animation.name}` :"")} style={{fontFamily : props.textFont, animationDuration: props.item?.animation ? `${props.item?.animation?.animationDuration}ms` : "",
            animationDelay: props.item?.animation ? `${props.item?.animation?.animationDelay}ms` : "",}}>
                {props.item.sectionData.type === 'link'?
                    <>
                        <a onClick={() => linkClick(props.item.sectionData.link)} >
                            <span className={styles.link_icon} style={{backgroundImage : props.defaultGradient}}>
                              <svg width="20" height="20" viewBox="0 0 26 25" fill="none" xmlns="http://www.w3.org/2000/svg"><path  fillRule="evenodd" clipRule="evenodd" d="M23.173 10.875L19.49 14.558C19.233 14.814 18.95 15.036 18.656 15.241C18.836 14.053 18.757 12.832 18.384 11.679L21.181 8.883C22.555 7.508 22.555 5.277 21.181 3.903C19.806 2.528 17.575 2.528 16.201 3.903L12.518 7.586C11.143 8.96 11.143 11.191 12.518 12.566C13.344 13.393 13.344 14.727 12.518 15.554L12.279 15.793C11.631 15.484 11.034 15.066 10.526 14.558C8.826 12.858 8.247 10.361 9.01 8.064C9.016 8.062 9.021 8.059 9.027 8.058C9.362 7.057 9.883 6.237 10.526 5.594L14.209 1.911C16.68 -0.561001 20.701 -0.561001 23.173 1.911C25.644 4.383 25.644 8.403 23.173 10.875ZM10.707 3.451C10.627 3.472 10.546 3.483 10.466 3.483C10.219 3.483 9.978 3.386 9.799 3.207C9.683 3.091 9.599 2.946 9.557 2.787L9.192 1.426C9.127 1.184 9.16 0.930999 9.286 0.713999C9.411 0.496999 9.614 0.340999 9.856 0.275999C10.358 0.142999 10.874 0.440999 11.006 0.940999L11.371 2.301C11.436 2.543 11.403 2.796 11.277 3.014C11.152 3.231 10.949 3.386 10.707 3.451ZM4.842 15.262C3.467 16.637 3.467 18.868 4.842 20.242C6.216 21.616 8.447 21.616 9.822 20.242C10.931 19.133 12.35 17.713 13.514 16.55C14.888 15.175 14.888 12.944 13.514 11.57C12.687 10.743 12.687 9.409 13.514 8.582L13.743 8.353C14.4 8.652 14.998 9.07 15.506 9.578C17.206 11.278 17.785 13.775 17.022 16.072C17.016 16.073 17.011 16.076 17.005 16.078C16.669 17.079 16.148 17.899 15.506 18.542L11.814 22.234C9.342 24.706 5.321 24.706 2.85 22.234C0.378002 19.762 0.378002 15.742 2.85 13.27L6.542 9.578C6.798 9.322 7.081 9.1 7.376 8.894C7.196 10.083 7.274 11.303 7.647 12.456L4.842 15.262ZM6.044 6.034C5.803 6.034 5.563 5.943 5.38 5.76L4.384 4.764C4.206 4.586 4.109 4.351 4.109 4.1C4.109 3.849 4.206 3.613 4.384 3.436C4.561 3.258 4.797 3.161 5.048 3.161C5.298 3.161 5.534 3.258 5.712 3.436L6.708 4.432C6.885 4.609 6.983 4.845 6.983 5.096C6.983 5.347 6.885 5.582 6.708 5.76C6.525 5.943 6.284 6.034 6.044 6.034ZM4.399 9.759C4.287 10.178 3.906 10.455 3.492 10.455C3.412 10.455 3.33 10.445 3.249 10.423L1.888 10.058C1.389 9.925 1.091 9.409 1.224 8.908C1.289 8.666 1.444 8.463 1.662 8.338C1.879 8.213 2.132 8.179 2.374 8.244L3.735 8.609C3.975 8.672 4.177 8.826 4.303 9.042C4.43 9.261 4.464 9.515 4.399 9.759ZM15.324 20.684C15.825 20.55 16.341 20.848 16.475 21.348L16.839 22.709C16.973 23.209 16.675 23.725 16.175 23.859C16.095 23.881 16.013 23.891 15.933 23.891C15.518 23.891 15.137 23.614 15.025 23.195L14.66 21.835C14.527 21.334 14.824 20.818 15.324 20.684ZM19.988 18.101C20.238 18.101 20.474 18.198 20.652 18.376L21.648 19.372C22.014 19.738 22.014 20.334 21.648 20.7C21.47 20.877 21.235 20.975 20.984 20.975C20.733 20.975 20.497 20.877 20.32 20.7L19.324 19.704C19.146 19.526 19.049 19.291 19.049 19.04C19.049 18.789 19.146 18.553 19.324 18.376C19.501 18.198 19.737 18.101 19.988 18.101ZM21.632 14.377C21.766 13.876 22.282 13.579 22.783 13.712L24.143 14.077C24.384 14.14 24.585 14.294 24.711 14.51C24.838 14.728 24.872 14.983 24.807 15.227C24.695 15.646 24.315 15.923 23.9 15.923C23.82 15.923 23.738 15.913 23.657 15.891L22.296 15.527C21.797 15.393 21.499 14.877 21.632 14.377Z" fill="#fff"/></svg>
                              </span>
                              <span className={styles.text__link} style={{backgroundImage: props.defaultGradient}}> {props.item.sectionData.linkTitle}</span>
                        </a>
                    </>
                    :
                    <>
                        <div onClick={() => linkClick((props.isAdmin === true ? '/preview/'+ props.tempId : props.linkSlug) +'/'+ props.item.sectionData.pageSlug)}>
                            
                            <a target={props.item.sectionData.openNewTab === true ? '_blank' : '_self'} rel="noopener noreferrer">
                               <span className={styles.link_icon} style={{backgroundImage : props.defaultGradient}}>
                                  <svg width="20" height="20" viewBox="0 0 26 25" fill="none" xmlns="http://www.w3.org/2000/svg"><path  fillRule="evenodd" clipRule="evenodd" d="M23.173 10.875L19.49 14.558C19.233 14.814 18.95 15.036 18.656 15.241C18.836 14.053 18.757 12.832 18.384 11.679L21.181 8.883C22.555 7.508 22.555 5.277 21.181 3.903C19.806 2.528 17.575 2.528 16.201 3.903L12.518 7.586C11.143 8.96 11.143 11.191 12.518 12.566C13.344 13.393 13.344 14.727 12.518 15.554L12.279 15.793C11.631 15.484 11.034 15.066 10.526 14.558C8.826 12.858 8.247 10.361 9.01 8.064C9.016 8.062 9.021 8.059 9.027 8.058C9.362 7.057 9.883 6.237 10.526 5.594L14.209 1.911C16.68 -0.561001 20.701 -0.561001 23.173 1.911C25.644 4.383 25.644 8.403 23.173 10.875ZM10.707 3.451C10.627 3.472 10.546 3.483 10.466 3.483C10.219 3.483 9.978 3.386 9.799 3.207C9.683 3.091 9.599 2.946 9.557 2.787L9.192 1.426C9.127 1.184 9.16 0.930999 9.286 0.713999C9.411 0.496999 9.614 0.340999 9.856 0.275999C10.358 0.142999 10.874 0.440999 11.006 0.940999L11.371 2.301C11.436 2.543 11.403 2.796 11.277 3.014C11.152 3.231 10.949 3.386 10.707 3.451ZM4.842 15.262C3.467 16.637 3.467 18.868 4.842 20.242C6.216 21.616 8.447 21.616 9.822 20.242C10.931 19.133 12.35 17.713 13.514 16.55C14.888 15.175 14.888 12.944 13.514 11.57C12.687 10.743 12.687 9.409 13.514 8.582L13.743 8.353C14.4 8.652 14.998 9.07 15.506 9.578C17.206 11.278 17.785 13.775 17.022 16.072C17.016 16.073 17.011 16.076 17.005 16.078C16.669 17.079 16.148 17.899 15.506 18.542L11.814 22.234C9.342 24.706 5.321 24.706 2.85 22.234C0.378002 19.762 0.378002 15.742 2.85 13.27L6.542 9.578C6.798 9.322 7.081 9.1 7.376 8.894C7.196 10.083 7.274 11.303 7.647 12.456L4.842 15.262ZM6.044 6.034C5.803 6.034 5.563 5.943 5.38 5.76L4.384 4.764C4.206 4.586 4.109 4.351 4.109 4.1C4.109 3.849 4.206 3.613 4.384 3.436C4.561 3.258 4.797 3.161 5.048 3.161C5.298 3.161 5.534 3.258 5.712 3.436L6.708 4.432C6.885 4.609 6.983 4.845 6.983 5.096C6.983 5.347 6.885 5.582 6.708 5.76C6.525 5.943 6.284 6.034 6.044 6.034ZM4.399 9.759C4.287 10.178 3.906 10.455 3.492 10.455C3.412 10.455 3.33 10.445 3.249 10.423L1.888 10.058C1.389 9.925 1.091 9.409 1.224 8.908C1.289 8.666 1.444 8.463 1.662 8.338C1.879 8.213 2.132 8.179 2.374 8.244L3.735 8.609C3.975 8.672 4.177 8.826 4.303 9.042C4.43 9.261 4.464 9.515 4.399 9.759ZM15.324 20.684C15.825 20.55 16.341 20.848 16.475 21.348L16.839 22.709C16.973 23.209 16.675 23.725 16.175 23.859C16.095 23.881 16.013 23.891 15.933 23.891C15.518 23.891 15.137 23.614 15.025 23.195L14.66 21.835C14.527 21.334 14.824 20.818 15.324 20.684ZM19.988 18.101C20.238 18.101 20.474 18.198 20.652 18.376L21.648 19.372C22.014 19.738 22.014 20.334 21.648 20.7C21.47 20.877 21.235 20.975 20.984 20.975C20.733 20.975 20.497 20.877 20.32 20.7L19.324 19.704C19.146 19.526 19.049 19.291 19.049 19.04C19.049 18.789 19.146 18.553 19.324 18.376C19.501 18.198 19.737 18.101 19.988 18.101ZM21.632 14.377C21.766 13.876 22.282 13.579 22.783 13.712L24.143 14.077C24.384 14.14 24.585 14.294 24.711 14.51C24.838 14.728 24.872 14.983 24.807 15.227C24.695 15.646 24.315 15.923 23.9 15.923C23.82 15.923 23.738 15.913 23.657 15.891L22.296 15.527C21.797 15.393 21.499 14.877 21.632 14.377Z" fill="#fff"/>
                                  </svg>
                                </span>

                                <span className={styles.text__link} style={{backgroundImage: props.defaultGradient}}>{props.item.sectionData.linkTitle} </span>
                            </a>
                        </div>
                    </> 
                }
            </div>
           </>
        );
    }
    else if(props.htmlId == '9'){
        return (
            <>
            <div className={styles.link_wrapper +' '+ styles['themes_'+ props.htmlId] +' '+ (props.isEditorPreview === true ? styles.editor_link : '') + "  " + (props.item?.animation ? `animate__animated animate__${(props.item?.animation?.animationRepeat?.length == 1) ? `repeat-${props.item?.animation.animationRepeat}` : props.item?.animation.animationRepeat}  animate__${props.item?.animation.name}` :"")} style={{fontFamily : props.textFont, animationDuration: props.item?.animation ? `${props.item?.animation?.animationDuration}ms` : "",
            animationDelay: props.item?.animation ? `${props.item?.animation?.animationDelay}ms` : "",}}>
                {props.item.sectionData.type === 'link'?
                    <>
                            <a onClick={() => linkClick(props.item.sectionData.link)} style={{color: props.secondaryColor}}>
                               
                                <svg width="20" height="20" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" clipRule="evenodd" d="M21.845 30H8.155C3.658 30 0 26.342 0 21.845V8.156C0 3.659 3.658 0 8.155 0H9.505C9.83 0 10.135 0.127 10.364 0.357C10.6 0.594 10.729 0.912 10.728 1.303C10.729 1.643 10.6 1.961 10.364 2.198C10.135 2.428 9.83 2.555 9.505 2.555H8.154C5.066 2.555 2.553 5.067 2.553 8.156L2.554 21.845C2.554 24.933 5.066 27.445 8.155 27.445H21.844C24.933 27.445 27.445 24.933 27.445 21.845V20.494C27.445 20.169 27.572 19.864 27.803 19.634C28.038 19.4 28.352 19.271 28.659 19.271C28.661 19.271 28.661 19.271 28.662 19.271H28.748C28.75 19.271 28.752 19.271 28.754 19.271C29.092 19.271 29.407 19.401 29.643 19.635C29.873 19.865 30 20.17 30 20.494V21.845C30 26.342 26.342 30 21.845 30ZM28.722 14.051C28.029 14.051 27.444 13.466 27.444 12.774V4.372L11.421 20.395C10.947 20.87 10.081 20.871 9.605 20.394C9.367 20.156 9.236 19.833 9.236 19.486C9.236 19.138 9.367 18.815 9.605 18.577L25.628 2.555H17.225C16.532 2.555 15.948 1.97 15.948 1.277C15.948 0.585 16.532 0 17.225 0H28.722C29.414 0 29.999 0.585 29.999 1.277V12.774C29.999 13.466 29.414 14.051 28.722 14.051Z" fill="#888B9C"/><path d="M21.845 30H8.155C3.658 30 0 26.342 0 21.845V8.156C0 3.659 3.658 0 8.155 0H9.505C9.83 0 10.135 0.127 10.364 0.357C10.6 0.594 10.729 0.912 10.728 1.303C10.729 1.643 10.6 1.961 10.364 2.198C10.135 2.428 9.83 2.555 9.505 2.555H8.154C5.066 2.555 2.553 5.067 2.553 8.156L2.554 21.845C2.554 24.933 5.066 27.445 8.155 27.445H21.844C24.933 27.445 27.445 24.933 27.445 21.845V20.494C27.445 20.169 27.572 19.864 27.803 19.634C28.038 19.4 28.352 19.271 28.659 19.271C28.661 19.271 28.661 19.271 28.662 19.271H28.748C28.75 19.271 28.752 19.271 28.754 19.271C29.092 19.271 29.407 19.401 29.643 19.635C29.873 19.865 30 20.17 30 20.494V21.845C30 26.342 26.342 30 21.845 30ZM28.722 14.051C28.029 14.051 27.444 13.466 27.444 12.774V4.372L11.421 20.395C10.947 20.87 10.081 20.871 9.605 20.394C9.367 20.156 9.236 19.833 9.236 19.486C9.236 19.138 9.367 18.815 9.605 18.577L25.628 2.555H17.225C16.532 2.555 15.948 1.97 15.948 1.277C15.948 0.585 16.532 0 17.225 0H28.722C29.414 0 29.999 0.585 29.999 1.277V12.774C29.999 13.466 29.414 14.051 28.722 14.051Z" fill={props.secondaryColor}/></svg>
                               
                                <span>{props.item.sectionData.linkTitle}</span>
                           
                            </a>
                            
                            <span className={styles.link_bg} style={{border :('4px solid' + props.primaryColor)}}></span>


                    </>
                    :
                    <>
                        <div onClick={() => linkClick((props.isAdmin === true ? '/preview/'+ props.tempId : props.linkSlug) +'/'+ props.item.sectionData.pageSlug)}>
                            <a target={props.item.sectionData.openNewTab === true ? '_blank' : '_self'} rel="noopener noreferrer" style={{color: props.secondaryColor}}>
                               <svg width="20" height="20" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" clipRule="evenodd" d="M21.845 30H8.155C3.658 30 0 26.342 0 21.845V8.156C0 3.659 3.658 0 8.155 0H9.505C9.83 0 10.135 0.127 10.364 0.357C10.6 0.594 10.729 0.912 10.728 1.303C10.729 1.643 10.6 1.961 10.364 2.198C10.135 2.428 9.83 2.555 9.505 2.555H8.154C5.066 2.555 2.553 5.067 2.553 8.156L2.554 21.845C2.554 24.933 5.066 27.445 8.155 27.445H21.844C24.933 27.445 27.445 24.933 27.445 21.845V20.494C27.445 20.169 27.572 19.864 27.803 19.634C28.038 19.4 28.352 19.271 28.659 19.271C28.661 19.271 28.661 19.271 28.662 19.271H28.748C28.75 19.271 28.752 19.271 28.754 19.271C29.092 19.271 29.407 19.401 29.643 19.635C29.873 19.865 30 20.17 30 20.494V21.845C30 26.342 26.342 30 21.845 30ZM28.722 14.051C28.029 14.051 27.444 13.466 27.444 12.774V4.372L11.421 20.395C10.947 20.87 10.081 20.871 9.605 20.394C9.367 20.156 9.236 19.833 9.236 19.486C9.236 19.138 9.367 18.815 9.605 18.577L25.628 2.555H17.225C16.532 2.555 15.948 1.97 15.948 1.277C15.948 0.585 16.532 0 17.225 0H28.722C29.414 0 29.999 0.585 29.999 1.277V12.774C29.999 13.466 29.414 14.051 28.722 14.051Z" fill="#888B9C"/><path d="M21.845 30H8.155C3.658 30 0 26.342 0 21.845V8.156C0 3.659 3.658 0 8.155 0H9.505C9.83 0 10.135 0.127 10.364 0.357C10.6 0.594 10.729 0.912 10.728 1.303C10.729 1.643 10.6 1.961 10.364 2.198C10.135 2.428 9.83 2.555 9.505 2.555H8.154C5.066 2.555 2.553 5.067 2.553 8.156L2.554 21.845C2.554 24.933 5.066 27.445 8.155 27.445H21.844C24.933 27.445 27.445 24.933 27.445 21.845V20.494C27.445 20.169 27.572 19.864 27.803 19.634C28.038 19.4 28.352 19.271 28.659 19.271C28.661 19.271 28.661 19.271 28.662 19.271H28.748C28.75 19.271 28.752 19.271 28.754 19.271C29.092 19.271 29.407 19.401 29.643 19.635C29.873 19.865 30 20.17 30 20.494V21.845C30 26.342 26.342 30 21.845 30ZM28.722 14.051C28.029 14.051 27.444 13.466 27.444 12.774V4.372L11.421 20.395C10.947 20.87 10.081 20.871 9.605 20.394C9.367 20.156 9.236 19.833 9.236 19.486C9.236 19.138 9.367 18.815 9.605 18.577L25.628 2.555H17.225C16.532 2.555 15.948 1.97 15.948 1.277C15.948 0.585 16.532 0 17.225 0H28.722C29.414 0 29.999 0.585 29.999 1.277V12.774C29.999 13.466 29.414 14.051 28.722 14.051Z" fill={props.secondaryColor}/></svg>
                             
                               <span> {props.item.sectionData.linkTitle}</span>
                              

                            </a>
                        </div>
                        
                        <span className={styles.link_bg} style={{border :('4px solid' + props.primaryColor)}}></span>

                    </> 
                }
            </div>
           </>
        );
    }
    else if(props.htmlId == '10'){
        return (
            <>
            <div className={styles.link_wrapper +' '+ styles['themes_'+ props.htmlId] +' '+ (props.isEditorPreview === true ? styles.editor_link : '') + "  " + (props.item?.animation ? `animate__animated animate__${(props.item?.animation?.animationRepeat?.length == 1) ? `repeat-${props.item?.animation.animationRepeat}` : props.item?.animation.animationRepeat}  animate__${props.item?.animation.name}` :"")} style={{fontFamily : props.textFont, animationDuration: props.item?.animation ? `${props.item?.animation?.animationDuration}ms` : "",
            animationDelay: props.item?.animation ? `${props.item?.animation?.animationDelay}ms` : "",}}>
                {props.item.sectionData.type === 'link'?
                    <>
                    <div className={styles.link_inner} >
                        <span> {props.item.sectionData.linkTitle}</span>
                        <a onClick={() => linkClick(props.item.sectionData.link)} style={{backgroundColor : props.primaryColor , boxShadow: '-4px 9px 25px -6px' + props.primaryColor }}>
                           View
                        </a>
                    </div>
                    </>
                    :
                    <>
                        <div className={styles.link_inner} >
                          <span> {props.item.sectionData.linkTitle}</span>
                          <div onClick={() => linkClick((props.isAdmin === true ? '/preview/'+ props.tempId : props.linkSlug) +'/'+ props.item.sectionData.pageSlug)}>
                            <a target={props.item.sectionData.openNewTab === true ? '_blank' : '_self'} rel="noopener noreferrer" style={{backgroundColor : props.primaryColor , boxShadow: '-4px 9px 25px -6px' + props.primaryColor }}>
                              View
                            </a>
                        </div>
                        </div>
                    </> 
                }
            </div>
           </>
        );
    }
    else if(props.htmlId == '11'){
        return (
            <>
                <div style={{backgroundColor : props.primaryColor, animationDuration: props.item?.animation ? `${props.item?.animation?.animationDuration}ms` : "",
            animationDelay: props.item?.animation ? `${props.item?.animation?.animationDelay}ms` : "",}} className={styles.link_wrapper +' '+ styles['themes_'+ props.htmlId] +' '+ (props.isEditorPreview === true ? styles.editor_link : '') + "  " + (props.item?.animation ? `animate__animated animate__${(props.item?.animation?.animationRepeat?.length == 1) ? `repeat-${props.item?.animation.animationRepeat}` : props.item?.animation.animationRepeat}  animate__${props.item?.animation.name}` :"")}>
                    {props.item.sectionData.type === 'link'?
                        <>
                                <a onClick={() => linkClick(props.item.sectionData.link)} style={{color: props.secondaryColor}}>
                                 {props.item.sectionData.linkTitle}
                                    <svg width="20" height="20" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" clipRule="evenodd" d="M21.845 30H8.155C3.658 30 0 26.342 0 21.845V8.156C0 3.659 3.658 0 8.155 0H9.505C9.83 0 10.135 0.127 10.364 0.357C10.6 0.594 10.729 0.912 10.728 1.303C10.729 1.643 10.6 1.961 10.364 2.198C10.135 2.428 9.83 2.555 9.505 2.555H8.154C5.066 2.555 2.553 5.067 2.553 8.156L2.554 21.845C2.554 24.933 5.066 27.445 8.155 27.445H21.844C24.933 27.445 27.445 24.933 27.445 21.845V20.494C27.445 20.169 27.572 19.864 27.803 19.634C28.038 19.4 28.352 19.271 28.659 19.271C28.661 19.271 28.661 19.271 28.662 19.271H28.748C28.75 19.271 28.752 19.271 28.754 19.271C29.092 19.271 29.407 19.401 29.643 19.635C29.873 19.865 30 20.17 30 20.494V21.845C30 26.342 26.342 30 21.845 30ZM28.722 14.051C28.029 14.051 27.444 13.466 27.444 12.774V4.372L11.421 20.395C10.947 20.87 10.081 20.871 9.605 20.394C9.367 20.156 9.236 19.833 9.236 19.486C9.236 19.138 9.367 18.815 9.605 18.577L25.628 2.555H17.225C16.532 2.555 15.948 1.97 15.948 1.277C15.948 0.585 16.532 0 17.225 0H28.722C29.414 0 29.999 0.585 29.999 1.277V12.774C29.999 13.466 29.414 14.051 28.722 14.051Z" fill="#fff"/><path d="M21.845 30H8.155C3.658 30 0 26.342 0 21.845V8.156C0 3.659 3.658 0 8.155 0H9.505C9.83 0 10.135 0.127 10.364 0.357C10.6 0.594 10.729 0.912 10.728 1.303C10.729 1.643 10.6 1.961 10.364 2.198C10.135 2.428 9.83 2.555 9.505 2.555H8.154C5.066 2.555 2.553 5.067 2.553 8.156L2.554 21.845C2.554 24.933 5.066 27.445 8.155 27.445H21.844C24.933 27.445 27.445 24.933 27.445 21.845V20.494C27.445 20.169 27.572 19.864 27.803 19.634C28.038 19.4 28.352 19.271 28.659 19.271C28.661 19.271 28.661 19.271 28.662 19.271H28.748C28.75 19.271 28.752 19.271 28.754 19.271C29.092 19.271 29.407 19.401 29.643 19.635C29.873 19.865 30 20.17 30 20.494V21.845C30 26.342 26.342 30 21.845 30ZM28.722 14.051C28.029 14.051 27.444 13.466 27.444 12.774V4.372L11.421 20.395C10.947 20.87 10.081 20.871 9.605 20.394C9.367 20.156 9.236 19.833 9.236 19.486C9.236 19.138 9.367 18.815 9.605 18.577L25.628 2.555H17.225C16.532 2.555 15.948 1.97 15.948 1.277C15.948 0.585 16.532 0 17.225 0H28.722C29.414 0 29.999 0.585 29.999 1.277V12.774C29.999 13.466 29.414 14.051 28.722 14.051Z" fill={props.secondaryColor}/></svg>

                                </a>
                        </>
                        :
                        <>
                            <div onClick={() => linkClick((props.isAdmin === true ? '/preview/'+ props.tempId : props.linkSlug) +'/'+ props.item.sectionData.pageSlug)}>
                                <a target={props.item.sectionData.openNewTab === true ? '_blank' : '_self'} rel="noopener noreferrer" style={{color: props.secondaryColor}}>
                                   {props.item.sectionData.linkTitle}
                                    <svg width="20" height="20" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" clipRule="evenodd" d="M21.845 30H8.155C3.658 30 0 26.342 0 21.845V8.156C0 3.659 3.658 0 8.155 0H9.505C9.83 0 10.135 0.127 10.364 0.357C10.6 0.594 10.729 0.912 10.728 1.303C10.729 1.643 10.6 1.961 10.364 2.198C10.135 2.428 9.83 2.555 9.505 2.555H8.154C5.066 2.555 2.553 5.067 2.553 8.156L2.554 21.845C2.554 24.933 5.066 27.445 8.155 27.445H21.844C24.933 27.445 27.445 24.933 27.445 21.845V20.494C27.445 20.169 27.572 19.864 27.803 19.634C28.038 19.4 28.352 19.271 28.659 19.271C28.661 19.271 28.661 19.271 28.662 19.271H28.748C28.75 19.271 28.752 19.271 28.754 19.271C29.092 19.271 29.407 19.401 29.643 19.635C29.873 19.865 30 20.17 30 20.494V21.845C30 26.342 26.342 30 21.845 30ZM28.722 14.051C28.029 14.051 27.444 13.466 27.444 12.774V4.372L11.421 20.395C10.947 20.87 10.081 20.871 9.605 20.394C9.367 20.156 9.236 19.833 9.236 19.486C9.236 19.138 9.367 18.815 9.605 18.577L25.628 2.555H17.225C16.532 2.555 15.948 1.97 15.948 1.277C15.948 0.585 16.532 0 17.225 0H28.722C29.414 0 29.999 0.585 29.999 1.277V12.774C29.999 13.466 29.414 14.051 28.722 14.051Z" fill="#fff"/><path d="M21.845 30H8.155C3.658 30 0 26.342 0 21.845V8.156C0 3.659 3.658 0 8.155 0H9.505C9.83 0 10.135 0.127 10.364 0.357C10.6 0.594 10.729 0.912 10.728 1.303C10.729 1.643 10.6 1.961 10.364 2.198C10.135 2.428 9.83 2.555 9.505 2.555H8.154C5.066 2.555 2.553 5.067 2.553 8.156L2.554 21.845C2.554 24.933 5.066 27.445 8.155 27.445H21.844C24.933 27.445 27.445 24.933 27.445 21.845V20.494C27.445 20.169 27.572 19.864 27.803 19.634C28.038 19.4 28.352 19.271 28.659 19.271C28.661 19.271 28.661 19.271 28.662 19.271H28.748C28.75 19.271 28.752 19.271 28.754 19.271C29.092 19.271 29.407 19.401 29.643 19.635C29.873 19.865 30 20.17 30 20.494V21.845C30 26.342 26.342 30 21.845 30ZM28.722 14.051C28.029 14.051 27.444 13.466 27.444 12.774V4.372L11.421 20.395C10.947 20.87 10.081 20.871 9.605 20.394C9.367 20.156 9.236 19.833 9.236 19.486C9.236 19.138 9.367 18.815 9.605 18.577L25.628 2.555H17.225C16.532 2.555 15.948 1.97 15.948 1.277C15.948 0.585 16.532 0 17.225 0H28.722C29.414 0 29.999 0.585 29.999 1.277V12.774C29.999 13.466 29.414 14.051 28.722 14.051Z" fill={props.secondaryColor}/></svg>

                                </a>
                            </div>

                        </> 
                    }
              </div>

           </>
        );
    }
    else if(props.htmlId == '12'){
        return (
            <>
                <div className={styles.link_wrapper +' '+ styles['themes_'+ props.htmlId] +' '+ (props.isEditorPreview === true ? styles.editor_link : '') + "  " + (props.item?.animation ? `animate__animated animate__${(props.item?.animation?.animationRepeat?.length == 1) ? `repeat-${props.item?.animation.animationRepeat}` : props.item?.animation.animationRepeat}  animate__${props.item?.animation.name}` :"")} style={{fontFamily : props.textFont, animationDuration: props.item?.animation ? `${props.item?.animation?.animationDuration}ms` : "",
            animationDelay: props.item?.animation ? `${props.item?.animation?.animationDelay}ms` : "",}}>
                    {props.item.sectionData.type === 'link'?
                        <>
                                <a onClick={() => linkClick(props.item.sectionData.link)} style={{color: props.secondaryColor}}>
                                  {props.item.sectionData.linkTitle}
                                    <svg width="20" height="20" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" clipRule="evenodd" d="M21.845 30H8.155C3.658 30 0 26.342 0 21.845V8.156C0 3.659 3.658 0 8.155 0H9.505C9.83 0 10.135 0.127 10.364 0.357C10.6 0.594 10.729 0.912 10.728 1.303C10.729 1.643 10.6 1.961 10.364 2.198C10.135 2.428 9.83 2.555 9.505 2.555H8.154C5.066 2.555 2.553 5.067 2.553 8.156L2.554 21.845C2.554 24.933 5.066 27.445 8.155 27.445H21.844C24.933 27.445 27.445 24.933 27.445 21.845V20.494C27.445 20.169 27.572 19.864 27.803 19.634C28.038 19.4 28.352 19.271 28.659 19.271C28.661 19.271 28.661 19.271 28.662 19.271H28.748C28.75 19.271 28.752 19.271 28.754 19.271C29.092 19.271 29.407 19.401 29.643 19.635C29.873 19.865 30 20.17 30 20.494V21.845C30 26.342 26.342 30 21.845 30ZM28.722 14.051C28.029 14.051 27.444 13.466 27.444 12.774V4.372L11.421 20.395C10.947 20.87 10.081 20.871 9.605 20.394C9.367 20.156 9.236 19.833 9.236 19.486C9.236 19.138 9.367 18.815 9.605 18.577L25.628 2.555H17.225C16.532 2.555 15.948 1.97 15.948 1.277C15.948 0.585 16.532 0 17.225 0H28.722C29.414 0 29.999 0.585 29.999 1.277V12.774C29.999 13.466 29.414 14.051 28.722 14.051Z" fill="#fff"/><path d="M21.845 30H8.155C3.658 30 0 26.342 0 21.845V8.156C0 3.659 3.658 0 8.155 0H9.505C9.83 0 10.135 0.127 10.364 0.357C10.6 0.594 10.729 0.912 10.728 1.303C10.729 1.643 10.6 1.961 10.364 2.198C10.135 2.428 9.83 2.555 9.505 2.555H8.154C5.066 2.555 2.553 5.067 2.553 8.156L2.554 21.845C2.554 24.933 5.066 27.445 8.155 27.445H21.844C24.933 27.445 27.445 24.933 27.445 21.845V20.494C27.445 20.169 27.572 19.864 27.803 19.634C28.038 19.4 28.352 19.271 28.659 19.271C28.661 19.271 28.661 19.271 28.662 19.271H28.748C28.75 19.271 28.752 19.271 28.754 19.271C29.092 19.271 29.407 19.401 29.643 19.635C29.873 19.865 30 20.17 30 20.494V21.845C30 26.342 26.342 30 21.845 30ZM28.722 14.051C28.029 14.051 27.444 13.466 27.444 12.774V4.372L11.421 20.395C10.947 20.87 10.081 20.871 9.605 20.394C9.367 20.156 9.236 19.833 9.236 19.486C9.236 19.138 9.367 18.815 9.605 18.577L25.628 2.555H17.225C16.532 2.555 15.948 1.97 15.948 1.277C15.948 0.585 16.532 0 17.225 0H28.722C29.414 0 29.999 0.585 29.999 1.277V12.774C29.999 13.466 29.414 14.051 28.722 14.051Z" fill={props.secondaryColor}/></svg>
                                    <span className={styles.bg_12} style={{backgroundColor : props.primaryColor}}></span>

                                </a>
                        </>
                        :
                        <>
                            <div onClick={() => linkClick((props.isAdmin === true ? '/preview/'+ props.tempId : props.linkSlug) +'/'+ props.item.sectionData.pageSlug)}>
                                <a target={props.item.sectionData.openNewTab === true ? '_blank' : '_self'} rel="noopener noreferrer" style={{color: props.secondaryColor}}>
                                   {props.item.sectionData.linkTitle}
                                    <svg width="20" height="20" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" clipRule="evenodd" d="M21.845 30H8.155C3.658 30 0 26.342 0 21.845V8.156C0 3.659 3.658 0 8.155 0H9.505C9.83 0 10.135 0.127 10.364 0.357C10.6 0.594 10.729 0.912 10.728 1.303C10.729 1.643 10.6 1.961 10.364 2.198C10.135 2.428 9.83 2.555 9.505 2.555H8.154C5.066 2.555 2.553 5.067 2.553 8.156L2.554 21.845C2.554 24.933 5.066 27.445 8.155 27.445H21.844C24.933 27.445 27.445 24.933 27.445 21.845V20.494C27.445 20.169 27.572 19.864 27.803 19.634C28.038 19.4 28.352 19.271 28.659 19.271C28.661 19.271 28.661 19.271 28.662 19.271H28.748C28.75 19.271 28.752 19.271 28.754 19.271C29.092 19.271 29.407 19.401 29.643 19.635C29.873 19.865 30 20.17 30 20.494V21.845C30 26.342 26.342 30 21.845 30ZM28.722 14.051C28.029 14.051 27.444 13.466 27.444 12.774V4.372L11.421 20.395C10.947 20.87 10.081 20.871 9.605 20.394C9.367 20.156 9.236 19.833 9.236 19.486C9.236 19.138 9.367 18.815 9.605 18.577L25.628 2.555H17.225C16.532 2.555 15.948 1.97 15.948 1.277C15.948 0.585 16.532 0 17.225 0H28.722C29.414 0 29.999 0.585 29.999 1.277V12.774C29.999 13.466 29.414 14.051 28.722 14.051Z" fill="#fff"/><path d="M21.845 30H8.155C3.658 30 0 26.342 0 21.845V8.156C0 3.659 3.658 0 8.155 0H9.505C9.83 0 10.135 0.127 10.364 0.357C10.6 0.594 10.729 0.912 10.728 1.303C10.729 1.643 10.6 1.961 10.364 2.198C10.135 2.428 9.83 2.555 9.505 2.555H8.154C5.066 2.555 2.553 5.067 2.553 8.156L2.554 21.845C2.554 24.933 5.066 27.445 8.155 27.445H21.844C24.933 27.445 27.445 24.933 27.445 21.845V20.494C27.445 20.169 27.572 19.864 27.803 19.634C28.038 19.4 28.352 19.271 28.659 19.271C28.661 19.271 28.661 19.271 28.662 19.271H28.748C28.75 19.271 28.752 19.271 28.754 19.271C29.092 19.271 29.407 19.401 29.643 19.635C29.873 19.865 30 20.17 30 20.494V21.845C30 26.342 26.342 30 21.845 30ZM28.722 14.051C28.029 14.051 27.444 13.466 27.444 12.774V4.372L11.421 20.395C10.947 20.87 10.081 20.871 9.605 20.394C9.367 20.156 9.236 19.833 9.236 19.486C9.236 19.138 9.367 18.815 9.605 18.577L25.628 2.555H17.225C16.532 2.555 15.948 1.97 15.948 1.277C15.948 0.585 16.532 0 17.225 0H28.722C29.414 0 29.999 0.585 29.999 1.277V12.774C29.999 13.466 29.414 14.051 28.722 14.051Z" fill={props.secondaryColor}/></svg>
                                    <span className={styles.bg_12} style={{backgroundColor : props.primaryColor}}></span>

                                </a>
                            </div>

                        </> 
                    }
              </div>

           </>
        );
    }
    else if(props.htmlId == '13'){
        return (
            <>
                <div className={styles.link_wrapper +' '+ styles['themes_'+ props.htmlId] +' '+ (props.isEditorPreview === true ? styles.editor_link : '') + "  " + (props.item?.animation ? `animate__animated animate__${(props.item?.animation?.animationRepeat?.length == 1) ? `repeat-${props.item?.animation.animationRepeat}` : props.item?.animation.animationRepeat}  animate__${props.item?.animation.name}` :"")} style={{fontFamily : props.textFont, animationDuration: props.item?.animation ? `${props.item?.animation?.animationDuration}ms` : "",
            animationDelay: props.item?.animation ? `${props.item?.animation?.animationDelay}ms` : "",}}>
                    {props.item.sectionData.type === 'link'?
                        <a onClick={() => linkClick(props.item.sectionData.link)} style={{color: props.secondaryColor , border: '2px solid' + props.primaryColor}} >                        
                            <span style={{backgroundColor : props.primaryColor}}>
                                <svg width="20" height="20" viewBox="0 0 26 25" fill="none" xmlns="http://www.w3.org/2000/svg"><path  fillRule="evenodd" clipRule="evenodd" d="M23.173 10.875L19.49 14.558C19.233 14.814 18.95 15.036 18.656 15.241C18.836 14.053 18.757 12.832 18.384 11.679L21.181 8.883C22.555 7.508 22.555 5.277 21.181 3.903C19.806 2.528 17.575 2.528 16.201 3.903L12.518 7.586C11.143 8.96 11.143 11.191 12.518 12.566C13.344 13.393 13.344 14.727 12.518 15.554L12.279 15.793C11.631 15.484 11.034 15.066 10.526 14.558C8.826 12.858 8.247 10.361 9.01 8.064C9.016 8.062 9.021 8.059 9.027 8.058C9.362 7.057 9.883 6.237 10.526 5.594L14.209 1.911C16.68 -0.561001 20.701 -0.561001 23.173 1.911C25.644 4.383 25.644 8.403 23.173 10.875ZM10.707 3.451C10.627 3.472 10.546 3.483 10.466 3.483C10.219 3.483 9.978 3.386 9.799 3.207C9.683 3.091 9.599 2.946 9.557 2.787L9.192 1.426C9.127 1.184 9.16 0.930999 9.286 0.713999C9.411 0.496999 9.614 0.340999 9.856 0.275999C10.358 0.142999 10.874 0.440999 11.006 0.940999L11.371 2.301C11.436 2.543 11.403 2.796 11.277 3.014C11.152 3.231 10.949 3.386 10.707 3.451ZM4.842 15.262C3.467 16.637 3.467 18.868 4.842 20.242C6.216 21.616 8.447 21.616 9.822 20.242C10.931 19.133 12.35 17.713 13.514 16.55C14.888 15.175 14.888 12.944 13.514 11.57C12.687 10.743 12.687 9.409 13.514 8.582L13.743 8.353C14.4 8.652 14.998 9.07 15.506 9.578C17.206 11.278 17.785 13.775 17.022 16.072C17.016 16.073 17.011 16.076 17.005 16.078C16.669 17.079 16.148 17.899 15.506 18.542L11.814 22.234C9.342 24.706 5.321 24.706 2.85 22.234C0.378002 19.762 0.378002 15.742 2.85 13.27L6.542 9.578C6.798 9.322 7.081 9.1 7.376 8.894C7.196 10.083 7.274 11.303 7.647 12.456L4.842 15.262ZM6.044 6.034C5.803 6.034 5.563 5.943 5.38 5.76L4.384 4.764C4.206 4.586 4.109 4.351 4.109 4.1C4.109 3.849 4.206 3.613 4.384 3.436C4.561 3.258 4.797 3.161 5.048 3.161C5.298 3.161 5.534 3.258 5.712 3.436L6.708 4.432C6.885 4.609 6.983 4.845 6.983 5.096C6.983 5.347 6.885 5.582 6.708 5.76C6.525 5.943 6.284 6.034 6.044 6.034ZM4.399 9.759C4.287 10.178 3.906 10.455 3.492 10.455C3.412 10.455 3.33 10.445 3.249 10.423L1.888 10.058C1.389 9.925 1.091 9.409 1.224 8.908C1.289 8.666 1.444 8.463 1.662 8.338C1.879 8.213 2.132 8.179 2.374 8.244L3.735 8.609C3.975 8.672 4.177 8.826 4.303 9.042C4.43 9.261 4.464 9.515 4.399 9.759ZM15.324 20.684C15.825 20.55 16.341 20.848 16.475 21.348L16.839 22.709C16.973 23.209 16.675 23.725 16.175 23.859C16.095 23.881 16.013 23.891 15.933 23.891C15.518 23.891 15.137 23.614 15.025 23.195L14.66 21.835C14.527 21.334 14.824 20.818 15.324 20.684ZM19.988 18.101C20.238 18.101 20.474 18.198 20.652 18.376L21.648 19.372C22.014 19.738 22.014 20.334 21.648 20.7C21.47 20.877 21.235 20.975 20.984 20.975C20.733 20.975 20.497 20.877 20.32 20.7L19.324 19.704C19.146 19.526 19.049 19.291 19.049 19.04C19.049 18.789 19.146 18.553 19.324 18.376C19.501 18.198 19.737 18.101 19.988 18.101ZM21.632 14.377C21.766 13.876 22.282 13.579 22.783 13.712L24.143 14.077C24.384 14.14 24.585 14.294 24.711 14.51C24.838 14.728 24.872 14.983 24.807 15.227C24.695 15.646 24.315 15.923 23.9 15.923C23.82 15.923 23.738 15.913 23.657 15.891L22.296 15.527C21.797 15.393 21.499 14.877 21.632 14.377Z" fill="#00000061"/></svg>
                            </span>
                            {props.item.sectionData.linkTitle}
                        </a>
                        : 
                        <div onClick={() => linkClick((props.isAdmin === true ? '/preview/'+ props.tempId : props.linkSlug) +'/'+ props.item.sectionData.pageSlug)} style={{color: props.secondaryColor}}>
                            <a target={props.item.sectionData.openNewTab === true ? '_blank' : '_self'} rel="noopener noreferrer" style={{color: props.secondaryColor , border: '2px solid' + props.primaryColor}}>
                                <span style={{backgroundColor : props.primaryColor}}>
                                    <svg width="20" height="20" viewBox="0 0 26 25" fill="none" xmlns="http://www.w3.org/2000/svg"><path  fillRule="evenodd" clipRule="evenodd" d="M23.173 10.875L19.49 14.558C19.233 14.814 18.95 15.036 18.656 15.241C18.836 14.053 18.757 12.832 18.384 11.679L21.181 8.883C22.555 7.508 22.555 5.277 21.181 3.903C19.806 2.528 17.575 2.528 16.201 3.903L12.518 7.586C11.143 8.96 11.143 11.191 12.518 12.566C13.344 13.393 13.344 14.727 12.518 15.554L12.279 15.793C11.631 15.484 11.034 15.066 10.526 14.558C8.826 12.858 8.247 10.361 9.01 8.064C9.016 8.062 9.021 8.059 9.027 8.058C9.362 7.057 9.883 6.237 10.526 5.594L14.209 1.911C16.68 -0.561001 20.701 -0.561001 23.173 1.911C25.644 4.383 25.644 8.403 23.173 10.875ZM10.707 3.451C10.627 3.472 10.546 3.483 10.466 3.483C10.219 3.483 9.978 3.386 9.799 3.207C9.683 3.091 9.599 2.946 9.557 2.787L9.192 1.426C9.127 1.184 9.16 0.930999 9.286 0.713999C9.411 0.496999 9.614 0.340999 9.856 0.275999C10.358 0.142999 10.874 0.440999 11.006 0.940999L11.371 2.301C11.436 2.543 11.403 2.796 11.277 3.014C11.152 3.231 10.949 3.386 10.707 3.451ZM4.842 15.262C3.467 16.637 3.467 18.868 4.842 20.242C6.216 21.616 8.447 21.616 9.822 20.242C10.931 19.133 12.35 17.713 13.514 16.55C14.888 15.175 14.888 12.944 13.514 11.57C12.687 10.743 12.687 9.409 13.514 8.582L13.743 8.353C14.4 8.652 14.998 9.07 15.506 9.578C17.206 11.278 17.785 13.775 17.022 16.072C17.016 16.073 17.011 16.076 17.005 16.078C16.669 17.079 16.148 17.899 15.506 18.542L11.814 22.234C9.342 24.706 5.321 24.706 2.85 22.234C0.378002 19.762 0.378002 15.742 2.85 13.27L6.542 9.578C6.798 9.322 7.081 9.1 7.376 8.894C7.196 10.083 7.274 11.303 7.647 12.456L4.842 15.262ZM6.044 6.034C5.803 6.034 5.563 5.943 5.38 5.76L4.384 4.764C4.206 4.586 4.109 4.351 4.109 4.1C4.109 3.849 4.206 3.613 4.384 3.436C4.561 3.258 4.797 3.161 5.048 3.161C5.298 3.161 5.534 3.258 5.712 3.436L6.708 4.432C6.885 4.609 6.983 4.845 6.983 5.096C6.983 5.347 6.885 5.582 6.708 5.76C6.525 5.943 6.284 6.034 6.044 6.034ZM4.399 9.759C4.287 10.178 3.906 10.455 3.492 10.455C3.412 10.455 3.33 10.445 3.249 10.423L1.888 10.058C1.389 9.925 1.091 9.409 1.224 8.908C1.289 8.666 1.444 8.463 1.662 8.338C1.879 8.213 2.132 8.179 2.374 8.244L3.735 8.609C3.975 8.672 4.177 8.826 4.303 9.042C4.43 9.261 4.464 9.515 4.399 9.759ZM15.324 20.684C15.825 20.55 16.341 20.848 16.475 21.348L16.839 22.709C16.973 23.209 16.675 23.725 16.175 23.859C16.095 23.881 16.013 23.891 15.933 23.891C15.518 23.891 15.137 23.614 15.025 23.195L14.66 21.835C14.527 21.334 14.824 20.818 15.324 20.684ZM19.988 18.101C20.238 18.101 20.474 18.198 20.652 18.376L21.648 19.372C22.014 19.738 22.014 20.334 21.648 20.7C21.47 20.877 21.235 20.975 20.984 20.975C20.733 20.975 20.497 20.877 20.32 20.7L19.324 19.704C19.146 19.526 19.049 19.291 19.049 19.04C19.049 18.789 19.146 18.553 19.324 18.376C19.501 18.198 19.737 18.101 19.988 18.101ZM21.632 14.377C21.766 13.876 22.282 13.579 22.783 13.712L24.143 14.077C24.384 14.14 24.585 14.294 24.711 14.51C24.838 14.728 24.872 14.983 24.807 15.227C24.695 15.646 24.315 15.923 23.9 15.923C23.82 15.923 23.738 15.913 23.657 15.891L22.296 15.527C21.797 15.393 21.499 14.877 21.632 14.377Z" fill="#00000061"/></svg>
                                </span>
                                {props.item.sectionData.linkTitle}
                            </a>
                        </div>
                    }
                </div>

           </>
        );
    }
    else if(props.htmlId == '14'){
        return (
            <>
                <div className={styles.link_wrapper +' '+ styles['themes_'+ props.htmlId] +' '+ (props.isEditorPreview === true ? styles.editor_link : '') + "  " + (props.item?.animation ? `animate__animated animate__${(props.item?.animation?.animationRepeat?.length == 1) ? `repeat-${props.item?.animation.animationRepeat}` : props.item?.animation.animationRepeat}  animate__${props.item?.animation.name}` :"")} style={{fontFamily : props.textFont, animationDuration: props.item?.animation ? `${props.item?.animation?.animationDuration}ms` : "",
            animationDelay: props.item?.animation ? `${props.item?.animation?.animationDelay}ms` : "",}}>
                    {props.item.sectionData.type === 'link'?
                        <>
                                <a onClick={() => linkClick(props.item.sectionData.link)} style={{ color: props.primaryColor}}>
                                    {props.item.sectionData.linkTitle}
                                </a>
                        <span className={styles.link_bg} style={{backgroundColor: props.primaryColor, color: props.primaryColor}}></span>
                        </>
                        :
                        <>
                            <div onClick={() => linkClick((props.isAdmin === true ? '/preview/'+ props.tempId : props.linkSlug) +'/'+ props.item.sectionData.pageSlug)}>
                                <a target={props.item.sectionData.openNewTab === true ? '_blank' : '_self'} rel="noopener noreferrer" style={{color: props.primaryColor}}>
                                    {props.item.sectionData.linkTitle}
                                </a>
                            </div>
                            <span className={styles.link_bg} style={{backgroundColor: props.primaryColor, color: props.primaryColor}}></span>

                        </> 
                    }
                </div>
            </>
        );
    }
    else if(props.htmlId == '15'){
        return (
            <>
                <div className={styles.link_wrapper +' '+ styles['themes_'+ props.htmlId] +' '+ (props.isEditorPreview === true ? styles.editor_link : '')+ "  " + (props.item?.animation ? `animate__animated animate__${(props.item?.animation?.animationRepeat?.length == 1) ? `repeat-${props.item?.animation.animationRepeat}` : props.item?.animation.animationRepeat}  animate__${props.item?.animation.name}` :"")} style={{fontFamily : props.textFont, animationDuration: props.item?.animation ? `${props.item?.animation?.animationDuration}ms` : "",
            animationDelay: props.item?.animation ? `${props.item?.animation?.animationDelay}ms` : "",}}>
                    {props.item.sectionData.type === 'link'?
                        <>
                            <a onClick={() => linkClick(props.item.sectionData.link)} style={{ backgroundImage : props.defaultGradient, color: props.secondaryColor}}>
                               
                                {props.item.sectionData.linkTitle}
                                <svg width="20" height="20" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" clipRule="evenodd" d="M21.845 30H8.155C3.658 30 0 26.342 0 21.845V8.156C0 3.659 3.658 0 8.155 0H9.505C9.83 0 10.135 0.127 10.364 0.357C10.6 0.594 10.729 0.912 10.728 1.303C10.729 1.643 10.6 1.961 10.364 2.198C10.135 2.428 9.83 2.555 9.505 2.555H8.154C5.066 2.555 2.553 5.067 2.553 8.156L2.554 21.845C2.554 24.933 5.066 27.445 8.155 27.445H21.844C24.933 27.445 27.445 24.933 27.445 21.845V20.494C27.445 20.169 27.572 19.864 27.803 19.634C28.038 19.4 28.352 19.271 28.659 19.271C28.661 19.271 28.661 19.271 28.662 19.271H28.748C28.75 19.271 28.752 19.271 28.754 19.271C29.092 19.271 29.407 19.401 29.643 19.635C29.873 19.865 30 20.17 30 20.494V21.845C30 26.342 26.342 30 21.845 30ZM28.722 14.051C28.029 14.051 27.444 13.466 27.444 12.774V4.372L11.421 20.395C10.947 20.87 10.081 20.871 9.605 20.394C9.367 20.156 9.236 19.833 9.236 19.486C9.236 19.138 9.367 18.815 9.605 18.577L25.628 2.555H17.225C16.532 2.555 15.948 1.97 15.948 1.277C15.948 0.585 16.532 0 17.225 0H28.722C29.414 0 29.999 0.585 29.999 1.277V12.774C29.999 13.466 29.414 14.051 28.722 14.051Z" fill="#fff"/><path d="M21.845 30H8.155C3.658 30 0 26.342 0 21.845V8.156C0 3.659 3.658 0 8.155 0H9.505C9.83 0 10.135 0.127 10.364 0.357C10.6 0.594 10.729 0.912 10.728 1.303C10.729 1.643 10.6 1.961 10.364 2.198C10.135 2.428 9.83 2.555 9.505 2.555H8.154C5.066 2.555 2.553 5.067 2.553 8.156L2.554 21.845C2.554 24.933 5.066 27.445 8.155 27.445H21.844C24.933 27.445 27.445 24.933 27.445 21.845V20.494C27.445 20.169 27.572 19.864 27.803 19.634C28.038 19.4 28.352 19.271 28.659 19.271C28.661 19.271 28.661 19.271 28.662 19.271H28.748C28.75 19.271 28.752 19.271 28.754 19.271C29.092 19.271 29.407 19.401 29.643 19.635C29.873 19.865 30 20.17 30 20.494V21.845C30 26.342 26.342 30 21.845 30ZM28.722 14.051C28.029 14.051 27.444 13.466 27.444 12.774V4.372L11.421 20.395C10.947 20.87 10.081 20.871 9.605 20.394C9.367 20.156 9.236 19.833 9.236 19.486C9.236 19.138 9.367 18.815 9.605 18.577L25.628 2.555H17.225C16.532 2.555 15.948 1.97 15.948 1.277C15.948 0.585 16.532 0 17.225 0H28.722C29.414 0 29.999 0.585 29.999 1.277V12.774C29.999 13.466 29.414 14.051 28.722 14.051Z" fill={props.secondaryColor}/></svg>
                              
                                <span className={styles.link_bg} style={{backgroundImage : props.defaultGradient}}></span>

                            </a>
                        </>
                        :
                        <>
                            <div onClick={() => linkClick((props.isAdmin === true ? '/preview/'+ props.tempId : props.linkSlug) +'/'+ props.item.sectionData.pageSlug)}>
                                <a target={props.item.sectionData.openNewTab === true ? '_blank' : '_self'} rel="noopener noreferrer" style={{backgroundImage : props.defaultGradient, color: props.secondaryColor}}>
                                    {props.item.sectionData.linkTitle}
                                    <svg width="20" height="20" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" clipRule="evenodd" d="M21.845 30H8.155C3.658 30 0 26.342 0 21.845V8.156C0 3.659 3.658 0 8.155 0H9.505C9.83 0 10.135 0.127 10.364 0.357C10.6 0.594 10.729 0.912 10.728 1.303C10.729 1.643 10.6 1.961 10.364 2.198C10.135 2.428 9.83 2.555 9.505 2.555H8.154C5.066 2.555 2.553 5.067 2.553 8.156L2.554 21.845C2.554 24.933 5.066 27.445 8.155 27.445H21.844C24.933 27.445 27.445 24.933 27.445 21.845V20.494C27.445 20.169 27.572 19.864 27.803 19.634C28.038 19.4 28.352 19.271 28.659 19.271C28.661 19.271 28.661 19.271 28.662 19.271H28.748C28.75 19.271 28.752 19.271 28.754 19.271C29.092 19.271 29.407 19.401 29.643 19.635C29.873 19.865 30 20.17 30 20.494V21.845C30 26.342 26.342 30 21.845 30ZM28.722 14.051C28.029 14.051 27.444 13.466 27.444 12.774V4.372L11.421 20.395C10.947 20.87 10.081 20.871 9.605 20.394C9.367 20.156 9.236 19.833 9.236 19.486C9.236 19.138 9.367 18.815 9.605 18.577L25.628 2.555H17.225C16.532 2.555 15.948 1.97 15.948 1.277C15.948 0.585 16.532 0 17.225 0H28.722C29.414 0 29.999 0.585 29.999 1.277V12.774C29.999 13.466 29.414 14.051 28.722 14.051Z" fill="#fff"/><path d="M21.845 30H8.155C3.658 30 0 26.342 0 21.845V8.156C0 3.659 3.658 0 8.155 0H9.505C9.83 0 10.135 0.127 10.364 0.357C10.6 0.594 10.729 0.912 10.728 1.303C10.729 1.643 10.6 1.961 10.364 2.198C10.135 2.428 9.83 2.555 9.505 2.555H8.154C5.066 2.555 2.553 5.067 2.553 8.156L2.554 21.845C2.554 24.933 5.066 27.445 8.155 27.445H21.844C24.933 27.445 27.445 24.933 27.445 21.845V20.494C27.445 20.169 27.572 19.864 27.803 19.634C28.038 19.4 28.352 19.271 28.659 19.271C28.661 19.271 28.661 19.271 28.662 19.271H28.748C28.75 19.271 28.752 19.271 28.754 19.271C29.092 19.271 29.407 19.401 29.643 19.635C29.873 19.865 30 20.17 30 20.494V21.845C30 26.342 26.342 30 21.845 30ZM28.722 14.051C28.029 14.051 27.444 13.466 27.444 12.774V4.372L11.421 20.395C10.947 20.87 10.081 20.871 9.605 20.394C9.367 20.156 9.236 19.833 9.236 19.486C9.236 19.138 9.367 18.815 9.605 18.577L25.628 2.555H17.225C16.532 2.555 15.948 1.97 15.948 1.277C15.948 0.585 16.532 0 17.225 0H28.722C29.414 0 29.999 0.585 29.999 1.277V12.774C29.999 13.466 29.414 14.051 28.722 14.051Z" fill={props.secondaryColor}/></svg>
                                    <span className={styles.link_bg} style={{backgroundImage : props.defaultGradient}}></span>

                                </a>
                            </div>

                        </> 
                    }
              </div>

           </>
        );
    }
    else if(props.htmlId == '16'){
        return (
            <>
                <div className={styles.link_wrapper +' '+ styles['themes_'+ props.htmlId] +' '+ (props.isEditorPreview === true ? styles.editor_link : '')+ "  " + (props.item?.animation ? `animate__animated animate__${(props.item?.animation?.animationRepeat?.length == 1) ? `repeat-${props.item?.animation.animationRepeat}` : props.item?.animation.animationRepeat}  animate__${props.item?.animation.name}` :"")} style={{fontFamily : props.textFont, animationDuration: props.item?.animation ? `${props.item?.animation?.animationDuration}ms` : "",
            animationDelay: props.item?.animation ? `${props.item?.animation?.animationDelay}ms` : "",}}>
                    {props.item.sectionData.type === 'link'?
                        <>
                            <a onClick={() => linkClick(props.item.sectionData.link)} style={{ backgroundColor : props.secondaryColor, color: props.primaryColor}}>
                               
                                {props.item.sectionData.linkTitle}
                                <svg width="20" height="20" viewBox="0 0 26 25" fill="none" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" clipRule="evenodd" d="M23.173 10.875L19.49 14.558C19.233 14.814 18.95 15.036 18.656 15.241C18.836 14.053 18.757 12.832 18.384 11.679L21.181 8.883C22.555 7.508 22.555 5.277 21.181 3.903C19.806 2.528 17.575 2.528 16.201 3.903L12.518 7.586C11.143 8.96 11.143 11.191 12.518 12.566C13.344 13.393 13.344 14.727 12.518 15.554L12.279 15.793C11.631 15.484 11.034 15.066 10.526 14.558C8.826 12.858 8.247 10.361 9.01 8.064C9.016 8.062 9.021 8.059 9.027 8.058C9.362 7.057 9.883 6.237 10.526 5.594L14.209 1.911C16.68 -0.561001 20.701 -0.561001 23.173 1.911C25.644 4.383 25.644 8.403 23.173 10.875ZM10.707 3.451C10.627 3.472 10.546 3.483 10.466 3.483C10.219 3.483 9.978 3.386 9.799 3.207C9.683 3.091 9.599 2.946 9.557 2.787L9.192 1.426C9.127 1.184 9.16 0.930999 9.286 0.713999C9.411 0.496999 9.614 0.340999 9.856 0.275999C10.358 0.142999 10.874 0.440999 11.006 0.940999L11.371 2.301C11.436 2.543 11.403 2.796 11.277 3.014C11.152 3.231 10.949 3.386 10.707 3.451ZM4.842 15.262C3.467 16.637 3.467 18.868 4.842 20.242C6.216 21.616 8.447 21.616 9.822 20.242C10.931 19.133 12.35 17.713 13.514 16.55C14.888 15.175 14.888 12.944 13.514 11.57C12.687 10.743 12.687 9.409 13.514 8.582L13.743 8.353C14.4 8.652 14.998 9.07 15.506 9.578C17.206 11.278 17.785 13.775 17.022 16.072C17.016 16.073 17.011 16.076 17.005 16.078C16.669 17.079 16.148 17.899 15.506 18.542L11.814 22.234C9.342 24.706 5.321 24.706 2.85 22.234C0.378002 19.762 0.378002 15.742 2.85 13.27L6.542 9.578C6.798 9.322 7.081 9.1 7.376 8.894C7.196 10.083 7.274 11.303 7.647 12.456L4.842 15.262ZM6.044 6.034C5.803 6.034 5.563 5.943 5.38 5.76L4.384 4.764C4.206 4.586 4.109 4.351 4.109 4.1C4.109 3.849 4.206 3.613 4.384 3.436C4.561 3.258 4.797 3.161 5.048 3.161C5.298 3.161 5.534 3.258 5.712 3.436L6.708 4.432C6.885 4.609 6.983 4.845 6.983 5.096C6.983 5.347 6.885 5.582 6.708 5.76C6.525 5.943 6.284 6.034 6.044 6.034ZM4.399 9.759C4.287 10.178 3.906 10.455 3.492 10.455C3.412 10.455 3.33 10.445 3.249 10.423L1.888 10.058C1.389 9.925 1.091 9.409 1.224 8.908C1.289 8.666 1.444 8.463 1.662 8.338C1.879 8.213 2.132 8.179 2.374 8.244L3.735 8.609C3.975 8.672 4.177 8.826 4.303 9.042C4.43 9.261 4.464 9.515 4.399 9.759ZM15.324 20.684C15.825 20.55 16.341 20.848 16.475 21.348L16.839 22.709C16.973 23.209 16.675 23.725 16.175 23.859C16.095 23.881 16.013 23.891 15.933 23.891C15.518 23.891 15.137 23.614 15.025 23.195L14.66 21.835C14.527 21.334 14.824 20.818 15.324 20.684ZM19.988 18.101C20.238 18.101 20.474 18.198 20.652 18.376L21.648 19.372C22.014 19.738 22.014 20.334 21.648 20.7C21.47 20.877 21.235 20.975 20.984 20.975C20.733 20.975 20.497 20.877 20.32 20.7L19.324 19.704C19.146 19.526 19.049 19.291 19.049 19.04C19.049 18.789 19.146 18.553 19.324 18.376C19.501 18.198 19.737 18.101 19.988 18.101ZM21.632 14.377C21.766 13.876 22.282 13.579 22.783 13.712L24.143 14.077C24.384 14.14 24.585 14.294 24.711 14.51C24.838 14.728 24.872 14.983 24.807 15.227C24.695 15.646 24.315 15.923 23.9 15.923C23.82 15.923 23.738 15.913 23.657 15.891L22.296 15.527C21.797 15.393 21.499 14.877 21.632 14.377Z" fill={props.primaryColor}/></svg>
                              
                                <span className={styles.link_bg} style={{borderBottom :('5px solid' + props.primaryColor)}}></span>

                            </a>
                        </>
                        :
                        <>
                            <div onClick={() => linkClick((props.isAdmin === true ? '/preview/'+ props.tempId : props.linkSlug) +'/'+ props.item.sectionData.pageSlug)}>
                                <a target={props.item.sectionData.openNewTab === true ? '_blank' : '_self'} rel="noopener noreferrer" style={{backgroundColor : props.secondaryColor, color: props.primaryColor}}>
                                    {props.item.sectionData.linkTitle}
                                    <svg width="20" height="20" viewBox="0 0 26 25" fill="none" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" clipRule="evenodd" d="M23.173 10.875L19.49 14.558C19.233 14.814 18.95 15.036 18.656 15.241C18.836 14.053 18.757 12.832 18.384 11.679L21.181 8.883C22.555 7.508 22.555 5.277 21.181 3.903C19.806 2.528 17.575 2.528 16.201 3.903L12.518 7.586C11.143 8.96 11.143 11.191 12.518 12.566C13.344 13.393 13.344 14.727 12.518 15.554L12.279 15.793C11.631 15.484 11.034 15.066 10.526 14.558C8.826 12.858 8.247 10.361 9.01 8.064C9.016 8.062 9.021 8.059 9.027 8.058C9.362 7.057 9.883 6.237 10.526 5.594L14.209 1.911C16.68 -0.561001 20.701 -0.561001 23.173 1.911C25.644 4.383 25.644 8.403 23.173 10.875ZM10.707 3.451C10.627 3.472 10.546 3.483 10.466 3.483C10.219 3.483 9.978 3.386 9.799 3.207C9.683 3.091 9.599 2.946 9.557 2.787L9.192 1.426C9.127 1.184 9.16 0.930999 9.286 0.713999C9.411 0.496999 9.614 0.340999 9.856 0.275999C10.358 0.142999 10.874 0.440999 11.006 0.940999L11.371 2.301C11.436 2.543 11.403 2.796 11.277 3.014C11.152 3.231 10.949 3.386 10.707 3.451ZM4.842 15.262C3.467 16.637 3.467 18.868 4.842 20.242C6.216 21.616 8.447 21.616 9.822 20.242C10.931 19.133 12.35 17.713 13.514 16.55C14.888 15.175 14.888 12.944 13.514 11.57C12.687 10.743 12.687 9.409 13.514 8.582L13.743 8.353C14.4 8.652 14.998 9.07 15.506 9.578C17.206 11.278 17.785 13.775 17.022 16.072C17.016 16.073 17.011 16.076 17.005 16.078C16.669 17.079 16.148 17.899 15.506 18.542L11.814 22.234C9.342 24.706 5.321 24.706 2.85 22.234C0.378002 19.762 0.378002 15.742 2.85 13.27L6.542 9.578C6.798 9.322 7.081 9.1 7.376 8.894C7.196 10.083 7.274 11.303 7.647 12.456L4.842 15.262ZM6.044 6.034C5.803 6.034 5.563 5.943 5.38 5.76L4.384 4.764C4.206 4.586 4.109 4.351 4.109 4.1C4.109 3.849 4.206 3.613 4.384 3.436C4.561 3.258 4.797 3.161 5.048 3.161C5.298 3.161 5.534 3.258 5.712 3.436L6.708 4.432C6.885 4.609 6.983 4.845 6.983 5.096C6.983 5.347 6.885 5.582 6.708 5.76C6.525 5.943 6.284 6.034 6.044 6.034ZM4.399 9.759C4.287 10.178 3.906 10.455 3.492 10.455C3.412 10.455 3.33 10.445 3.249 10.423L1.888 10.058C1.389 9.925 1.091 9.409 1.224 8.908C1.289 8.666 1.444 8.463 1.662 8.338C1.879 8.213 2.132 8.179 2.374 8.244L3.735 8.609C3.975 8.672 4.177 8.826 4.303 9.042C4.43 9.261 4.464 9.515 4.399 9.759ZM15.324 20.684C15.825 20.55 16.341 20.848 16.475 21.348L16.839 22.709C16.973 23.209 16.675 23.725 16.175 23.859C16.095 23.881 16.013 23.891 15.933 23.891C15.518 23.891 15.137 23.614 15.025 23.195L14.66 21.835C14.527 21.334 14.824 20.818 15.324 20.684ZM19.988 18.101C20.238 18.101 20.474 18.198 20.652 18.376L21.648 19.372C22.014 19.738 22.014 20.334 21.648 20.7C21.47 20.877 21.235 20.975 20.984 20.975C20.733 20.975 20.497 20.877 20.32 20.7L19.324 19.704C19.146 19.526 19.049 19.291 19.049 19.04C19.049 18.789 19.146 18.553 19.324 18.376C19.501 18.198 19.737 18.101 19.988 18.101ZM21.632 14.377C21.766 13.876 22.282 13.579 22.783 13.712L24.143 14.077C24.384 14.14 24.585 14.294 24.711 14.51C24.838 14.728 24.872 14.983 24.807 15.227C24.695 15.646 24.315 15.923 23.9 15.923C23.82 15.923 23.738 15.913 23.657 15.891L22.296 15.527C21.797 15.393 21.499 14.877 21.632 14.377Z" fill={props.primaryColor}/></svg>
                                    <span className={styles.link_bg} style={{borderBottom :('5px solid' + props.primaryColor)}}></span>

                                </a>
                            </div>

                        </> 
                    }
              </div>

           </>
        );
    }
    else if(props.htmlId == '17'){
        return (
            <>
                <div className={styles.link_wrapper +' '+ styles['themes_'+ props.htmlId] +' '+ (props.isEditorPreview === true ? styles.editor_link : '')+ "  " + (props.item?.animation ? `animate__animated animate__${(props.item?.animation?.animationRepeat?.length == 1) ? `repeat-${props.item?.animation.animationRepeat}` : props.item?.animation.animationRepeat}  animate__${props.item?.animation.name}` :"")} style={{fontFamily : props.textFont, animationDuration: props.item?.animation ? `${props.item?.animation?.animationDuration}ms` : "",
            animationDelay: props.item?.animation ? `${props.item?.animation?.animationDelay}ms` : "",}}>
                    {props.item.sectionData.type === 'link'?
                        <>
                            <a onClick={() => linkClick(props.item.sectionData.link)} style={{ backgroundColor : props.secondaryColor, color: props.primaryColor , border :('2px solid' + props.primaryColor )}}>
                               
                                  {props.item.sectionData.linkTitle}
                                <svg width="20" height="20" viewBox="0 0 26 25" fill="none" xmlns="http://www.w3.org/2000/svg"><path  fillRule="evenodd" clipRule="evenodd" d="M23.173 10.875L19.49 14.558C19.233 14.814 18.95 15.036 18.656 15.241C18.836 14.053 18.757 12.832 18.384 11.679L21.181 8.883C22.555 7.508 22.555 5.277 21.181 3.903C19.806 2.528 17.575 2.528 16.201 3.903L12.518 7.586C11.143 8.96 11.143 11.191 12.518 12.566C13.344 13.393 13.344 14.727 12.518 15.554L12.279 15.793C11.631 15.484 11.034 15.066 10.526 14.558C8.826 12.858 8.247 10.361 9.01 8.064C9.016 8.062 9.021 8.059 9.027 8.058C9.362 7.057 9.883 6.237 10.526 5.594L14.209 1.911C16.68 -0.561001 20.701 -0.561001 23.173 1.911C25.644 4.383 25.644 8.403 23.173 10.875ZM10.707 3.451C10.627 3.472 10.546 3.483 10.466 3.483C10.219 3.483 9.978 3.386 9.799 3.207C9.683 3.091 9.599 2.946 9.557 2.787L9.192 1.426C9.127 1.184 9.16 0.930999 9.286 0.713999C9.411 0.496999 9.614 0.340999 9.856 0.275999C10.358 0.142999 10.874 0.440999 11.006 0.940999L11.371 2.301C11.436 2.543 11.403 2.796 11.277 3.014C11.152 3.231 10.949 3.386 10.707 3.451ZM4.842 15.262C3.467 16.637 3.467 18.868 4.842 20.242C6.216 21.616 8.447 21.616 9.822 20.242C10.931 19.133 12.35 17.713 13.514 16.55C14.888 15.175 14.888 12.944 13.514 11.57C12.687 10.743 12.687 9.409 13.514 8.582L13.743 8.353C14.4 8.652 14.998 9.07 15.506 9.578C17.206 11.278 17.785 13.775 17.022 16.072C17.016 16.073 17.011 16.076 17.005 16.078C16.669 17.079 16.148 17.899 15.506 18.542L11.814 22.234C9.342 24.706 5.321 24.706 2.85 22.234C0.378002 19.762 0.378002 15.742 2.85 13.27L6.542 9.578C6.798 9.322 7.081 9.1 7.376 8.894C7.196 10.083 7.274 11.303 7.647 12.456L4.842 15.262ZM6.044 6.034C5.803 6.034 5.563 5.943 5.38 5.76L4.384 4.764C4.206 4.586 4.109 4.351 4.109 4.1C4.109 3.849 4.206 3.613 4.384 3.436C4.561 3.258 4.797 3.161 5.048 3.161C5.298 3.161 5.534 3.258 5.712 3.436L6.708 4.432C6.885 4.609 6.983 4.845 6.983 5.096C6.983 5.347 6.885 5.582 6.708 5.76C6.525 5.943 6.284 6.034 6.044 6.034ZM4.399 9.759C4.287 10.178 3.906 10.455 3.492 10.455C3.412 10.455 3.33 10.445 3.249 10.423L1.888 10.058C1.389 9.925 1.091 9.409 1.224 8.908C1.289 8.666 1.444 8.463 1.662 8.338C1.879 8.213 2.132 8.179 2.374 8.244L3.735 8.609C3.975 8.672 4.177 8.826 4.303 9.042C4.43 9.261 4.464 9.515 4.399 9.759ZM15.324 20.684C15.825 20.55 16.341 20.848 16.475 21.348L16.839 22.709C16.973 23.209 16.675 23.725 16.175 23.859C16.095 23.881 16.013 23.891 15.933 23.891C15.518 23.891 15.137 23.614 15.025 23.195L14.66 21.835C14.527 21.334 14.824 20.818 15.324 20.684ZM19.988 18.101C20.238 18.101 20.474 18.198 20.652 18.376L21.648 19.372C22.014 19.738 22.014 20.334 21.648 20.7C21.47 20.877 21.235 20.975 20.984 20.975C20.733 20.975 20.497 20.877 20.32 20.7L19.324 19.704C19.146 19.526 19.049 19.291 19.049 19.04C19.049 18.789 19.146 18.553 19.324 18.376C19.501 18.198 19.737 18.101 19.988 18.101ZM21.632 14.377C21.766 13.876 22.282 13.579 22.783 13.712L24.143 14.077C24.384 14.14 24.585 14.294 24.711 14.51C24.838 14.728 24.872 14.983 24.807 15.227C24.695 15.646 24.315 15.923 23.9 15.923C23.82 15.923 23.738 15.913 23.657 15.891L22.296 15.527C21.797 15.393 21.499 14.877 21.632 14.377Z" fill={props.primaryColor}/></svg>
                            </a>
                        </>
                        :
                        <>
                            <div onClick={() => linkClick((props.isAdmin === true ? '/preview/'+ props.tempId : props.linkSlug) +'/'+ props.item.sectionData.pageSlug)}>
                                <a target={props.item.sectionData.openNewTab === true ? '_blank' : '_self'} rel="noopener noreferrer" style={{backgroundColor : props.secondaryColor, color: props.primaryColor , border :('2px solid' + props.primaryColor )}}>
                                    {props.item.sectionData.linkTitle}
                                    <svg width="20" height="20" viewBox="0 0 26 25" fill="none" xmlns="http://www.w3.org/2000/svg"><path  fillRule="evenodd" clipRule="evenodd" d="M23.173 10.875L19.49 14.558C19.233 14.814 18.95 15.036 18.656 15.241C18.836 14.053 18.757 12.832 18.384 11.679L21.181 8.883C22.555 7.508 22.555 5.277 21.181 3.903C19.806 2.528 17.575 2.528 16.201 3.903L12.518 7.586C11.143 8.96 11.143 11.191 12.518 12.566C13.344 13.393 13.344 14.727 12.518 15.554L12.279 15.793C11.631 15.484 11.034 15.066 10.526 14.558C8.826 12.858 8.247 10.361 9.01 8.064C9.016 8.062 9.021 8.059 9.027 8.058C9.362 7.057 9.883 6.237 10.526 5.594L14.209 1.911C16.68 -0.561001 20.701 -0.561001 23.173 1.911C25.644 4.383 25.644 8.403 23.173 10.875ZM10.707 3.451C10.627 3.472 10.546 3.483 10.466 3.483C10.219 3.483 9.978 3.386 9.799 3.207C9.683 3.091 9.599 2.946 9.557 2.787L9.192 1.426C9.127 1.184 9.16 0.930999 9.286 0.713999C9.411 0.496999 9.614 0.340999 9.856 0.275999C10.358 0.142999 10.874 0.440999 11.006 0.940999L11.371 2.301C11.436 2.543 11.403 2.796 11.277 3.014C11.152 3.231 10.949 3.386 10.707 3.451ZM4.842 15.262C3.467 16.637 3.467 18.868 4.842 20.242C6.216 21.616 8.447 21.616 9.822 20.242C10.931 19.133 12.35 17.713 13.514 16.55C14.888 15.175 14.888 12.944 13.514 11.57C12.687 10.743 12.687 9.409 13.514 8.582L13.743 8.353C14.4 8.652 14.998 9.07 15.506 9.578C17.206 11.278 17.785 13.775 17.022 16.072C17.016 16.073 17.011 16.076 17.005 16.078C16.669 17.079 16.148 17.899 15.506 18.542L11.814 22.234C9.342 24.706 5.321 24.706 2.85 22.234C0.378002 19.762 0.378002 15.742 2.85 13.27L6.542 9.578C6.798 9.322 7.081 9.1 7.376 8.894C7.196 10.083 7.274 11.303 7.647 12.456L4.842 15.262ZM6.044 6.034C5.803 6.034 5.563 5.943 5.38 5.76L4.384 4.764C4.206 4.586 4.109 4.351 4.109 4.1C4.109 3.849 4.206 3.613 4.384 3.436C4.561 3.258 4.797 3.161 5.048 3.161C5.298 3.161 5.534 3.258 5.712 3.436L6.708 4.432C6.885 4.609 6.983 4.845 6.983 5.096C6.983 5.347 6.885 5.582 6.708 5.76C6.525 5.943 6.284 6.034 6.044 6.034ZM4.399 9.759C4.287 10.178 3.906 10.455 3.492 10.455C3.412 10.455 3.33 10.445 3.249 10.423L1.888 10.058C1.389 9.925 1.091 9.409 1.224 8.908C1.289 8.666 1.444 8.463 1.662 8.338C1.879 8.213 2.132 8.179 2.374 8.244L3.735 8.609C3.975 8.672 4.177 8.826 4.303 9.042C4.43 9.261 4.464 9.515 4.399 9.759ZM15.324 20.684C15.825 20.55 16.341 20.848 16.475 21.348L16.839 22.709C16.973 23.209 16.675 23.725 16.175 23.859C16.095 23.881 16.013 23.891 15.933 23.891C15.518 23.891 15.137 23.614 15.025 23.195L14.66 21.835C14.527 21.334 14.824 20.818 15.324 20.684ZM19.988 18.101C20.238 18.101 20.474 18.198 20.652 18.376L21.648 19.372C22.014 19.738 22.014 20.334 21.648 20.7C21.47 20.877 21.235 20.975 20.984 20.975C20.733 20.975 20.497 20.877 20.32 20.7L19.324 19.704C19.146 19.526 19.049 19.291 19.049 19.04C19.049 18.789 19.146 18.553 19.324 18.376C19.501 18.198 19.737 18.101 19.988 18.101ZM21.632 14.377C21.766 13.876 22.282 13.579 22.783 13.712L24.143 14.077C24.384 14.14 24.585 14.294 24.711 14.51C24.838 14.728 24.872 14.983 24.807 15.227C24.695 15.646 24.315 15.923 23.9 15.923C23.82 15.923 23.738 15.913 23.657 15.891L22.296 15.527C21.797 15.393 21.499 14.877 21.632 14.377Z" fill={props.primaryColor}/></svg>
                                </a>
                            </div>

                        </> 
                    }
              </div>

           </>
        );
    }
    
    else if(props.htmlId == '18'){
        return (
            <>
                <div className={styles.link_wrapper +' '+ styles['themes_'+ props.htmlId] +' '+ (props.isEditorPreview === true ? styles.editor_link : '')+ "  " + (props.item?.animation ? `animate__animated animate__${(props.item?.animation?.animationRepeat?.length == 1) ? `repeat-${props.item?.animation.animationRepeat}` : props.item?.animation.animationRepeat}  animate__${props.item?.animation.name}` :"")} style={{fontFamily : props.textFont, animationDuration: props.item?.animation ? `${props.item?.animation?.animationDuration}ms` : "",
            animationDelay: props.item?.animation ? `${props.item?.animation?.animationDelay}ms` : "",}}>
                    {props.item.sectionData.type === 'link'?
                        <>
                            <a onClick={() => linkClick(props.item.sectionData.link)} style={{backgroundColor : props.secondaryColor, color: props.primaryColor}}>
                               
                                <span style={{backgroundImage : props.defaultGradient}}>{props.item.sectionData.linkTitle}</span> 
                              

                            </a>
                            <span className={styles.link_bg}  style={{backgroundImage : props.defaultGradient}}></span>

                        </>
                        :
                        <>
                            <div onClick={() => linkClick((props.isAdmin === true ? '/preview/'+ props.tempId : props.linkSlug) +'/'+ props.item.sectionData.pageSlug)}>
                                <a target={props.item.sectionData.openNewTab === true ? '_blank' : '_self'} rel="noopener noreferrer" style={{backgroundColor : props.secondaryColor, color: props.primaryColor}}>
                                    <span style={{backgroundImage : props.defaultGradient}}>{props.item.sectionData.linkTitle}</span>

                                </a>
                                <span className={styles.link_bg}  style={{backgroundImage : props.defaultGradient}}></span>

                            </div>

                        </> 
                    }
              </div>

           </>
        );
    }
    else if(props.htmlId == '19'){
        return (
            <>
                <div className={styles.link_wrapper +' '+ styles['themes_'+ props.htmlId] +' '+ (props.isEditorPreview === true ? styles.editor_link : '')+ "  " + (props.item?.animation ? `animate__animated animate__${(props.item?.animation?.animationRepeat?.length == 1) ? `repeat-${props.item?.animation.animationRepeat}` : props.item?.animation.animationRepeat}  animate__${props.item?.animation.name}` :"")} style={{fontFamily : props.textFont, animationDuration: props.item?.animation ? `${props.item?.animation?.animationDuration}ms` : "",
            animationDelay: props.item?.animation ? `${props.item?.animation?.animationDelay}ms` : "",}}>
                    {props.item.sectionData.type === 'link'?
                        <>
                            <a onClick={() => linkClick(props.item.sectionData.link)} style={{ backgroundColor : props.secondaryColor}}>
                               
                                <span>{props.item.sectionData.linkTitle}</span> 
                              
                                <span className={styles.link_bg} style={{border :('2px solid' + props.primaryColor)}}></span>

                            </a>
                        </>
                        :
                        <>
                            <div onClick={() => linkClick((props.isAdmin === true ? '/preview/'+ props.tempId : props.linkSlug) +'/'+ props.item.sectionData.pageSlug)}>
                                <a target={props.item.sectionData.openNewTab === true ? '_blank' : '_self'} rel="noopener noreferrer" style={{backgroundColor : props.secondaryColor}}>
                                    <span>{props.item.sectionData.linkTitle}</span>
                                    <span className={styles.link_bg} style={{border :('2px solid' + props.primaryColor)}}></span>

                                </a>
                            </div>

                        </> 
                    }
              </div>

           </>
        );
    }
    else if(props.htmlId == '20'){
        return (
            <>
                <div className={styles.link_wrapper +' '+ styles['themes_'+ props.htmlId] +' '+ (props.isEditorPreview === true ? styles.editor_link : '')+ "  " + (props.item?.animation ? `animate__animated animate__${(props.item?.animation?.animationRepeat?.length == 1) ? `repeat-${props.item?.animation.animationRepeat}` : props.item?.animation.animationRepeat}  animate__${props.item?.animation.name}` :"")} style={{fontFamily : props.textFont, animationDuration: props.item?.animation ? `${props.item?.animation?.animationDuration}ms` : "",
            animationDelay: props.item?.animation ? `${props.item?.animation?.animationDelay}ms` : "",}}>
                    {props.item.sectionData.type === 'link'?
                        <>
                            <a onClick={() => linkClick(props.item.sectionData.link)} style={{ color: props.secondaryColor}}>
                               
                               {props.item.sectionData.linkTitle}
                                <svg width="20" height="20" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" clipRule="evenodd" d="M21.845 30H8.155C3.658 30 0 26.342 0 21.845V8.156C0 3.659 3.658 0 8.155 0H9.505C9.83 0 10.135 0.127 10.364 0.357C10.6 0.594 10.729 0.912 10.728 1.303C10.729 1.643 10.6 1.961 10.364 2.198C10.135 2.428 9.83 2.555 9.505 2.555H8.154C5.066 2.555 2.553 5.067 2.553 8.156L2.554 21.845C2.554 24.933 5.066 27.445 8.155 27.445H21.844C24.933 27.445 27.445 24.933 27.445 21.845V20.494C27.445 20.169 27.572 19.864 27.803 19.634C28.038 19.4 28.352 19.271 28.659 19.271C28.661 19.271 28.661 19.271 28.662 19.271H28.748C28.75 19.271 28.752 19.271 28.754 19.271C29.092 19.271 29.407 19.401 29.643 19.635C29.873 19.865 30 20.17 30 20.494V21.845C30 26.342 26.342 30 21.845 30ZM28.722 14.051C28.029 14.051 27.444 13.466 27.444 12.774V4.372L11.421 20.395C10.947 20.87 10.081 20.871 9.605 20.394C9.367 20.156 9.236 19.833 9.236 19.486C9.236 19.138 9.367 18.815 9.605 18.577L25.628 2.555H17.225C16.532 2.555 15.948 1.97 15.948 1.277C15.948 0.585 16.532 0 17.225 0H28.722C29.414 0 29.999 0.585 29.999 1.277V12.774C29.999 13.466 29.414 14.051 28.722 14.051Z" fill="#fff"/><path d="M21.845 30H8.155C3.658 30 0 26.342 0 21.845V8.156C0 3.659 3.658 0 8.155 0H9.505C9.83 0 10.135 0.127 10.364 0.357C10.6 0.594 10.729 0.912 10.728 1.303C10.729 1.643 10.6 1.961 10.364 2.198C10.135 2.428 9.83 2.555 9.505 2.555H8.154C5.066 2.555 2.553 5.067 2.553 8.156L2.554 21.845C2.554 24.933 5.066 27.445 8.155 27.445H21.844C24.933 27.445 27.445 24.933 27.445 21.845V20.494C27.445 20.169 27.572 19.864 27.803 19.634C28.038 19.4 28.352 19.271 28.659 19.271C28.661 19.271 28.661 19.271 28.662 19.271H28.748C28.75 19.271 28.752 19.271 28.754 19.271C29.092 19.271 29.407 19.401 29.643 19.635C29.873 19.865 30 20.17 30 20.494V21.845C30 26.342 26.342 30 21.845 30ZM28.722 14.051C28.029 14.051 27.444 13.466 27.444 12.774V4.372L11.421 20.395C10.947 20.87 10.081 20.871 9.605 20.394C9.367 20.156 9.236 19.833 9.236 19.486C9.236 19.138 9.367 18.815 9.605 18.577L25.628 2.555H17.225C16.532 2.555 15.948 1.97 15.948 1.277C15.948 0.585 16.532 0 17.225 0H28.722C29.414 0 29.999 0.585 29.999 1.277V12.774C29.999 13.466 29.414 14.051 28.722 14.051Z" fill={props.secondaryColor}/></svg>
                              
                                <span className={styles.link_bg} ></span>

                            </a>
                        </>
                        :
                        <>
                            <div onClick={() => linkClick((props.isAdmin === true ? '/preview/'+ props.tempId : props.linkSlug) +'/'+ props.item.sectionData.pageSlug)}>
                                <a target={props.item.sectionData.openNewTab === true ? '_blank' : '_self'} rel="noopener noreferrer" style={{ color: props.secondaryColor}}>
                                    {props.item.sectionData.linkTitle}
                                    <svg width="20" height="20" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" clipRule="evenodd" d="M21.845 30H8.155C3.658 30 0 26.342 0 21.845V8.156C0 3.659 3.658 0 8.155 0H9.505C9.83 0 10.135 0.127 10.364 0.357C10.6 0.594 10.729 0.912 10.728 1.303C10.729 1.643 10.6 1.961 10.364 2.198C10.135 2.428 9.83 2.555 9.505 2.555H8.154C5.066 2.555 2.553 5.067 2.553 8.156L2.554 21.845C2.554 24.933 5.066 27.445 8.155 27.445H21.844C24.933 27.445 27.445 24.933 27.445 21.845V20.494C27.445 20.169 27.572 19.864 27.803 19.634C28.038 19.4 28.352 19.271 28.659 19.271C28.661 19.271 28.661 19.271 28.662 19.271H28.748C28.75 19.271 28.752 19.271 28.754 19.271C29.092 19.271 29.407 19.401 29.643 19.635C29.873 19.865 30 20.17 30 20.494V21.845C30 26.342 26.342 30 21.845 30ZM28.722 14.051C28.029 14.051 27.444 13.466 27.444 12.774V4.372L11.421 20.395C10.947 20.87 10.081 20.871 9.605 20.394C9.367 20.156 9.236 19.833 9.236 19.486C9.236 19.138 9.367 18.815 9.605 18.577L25.628 2.555H17.225C16.532 2.555 15.948 1.97 15.948 1.277C15.948 0.585 16.532 0 17.225 0H28.722C29.414 0 29.999 0.585 29.999 1.277V12.774C29.999 13.466 29.414 14.051 28.722 14.051Z" fill="#fff"/><path d="M21.845 30H8.155C3.658 30 0 26.342 0 21.845V8.156C0 3.659 3.658 0 8.155 0H9.505C9.83 0 10.135 0.127 10.364 0.357C10.6 0.594 10.729 0.912 10.728 1.303C10.729 1.643 10.6 1.961 10.364 2.198C10.135 2.428 9.83 2.555 9.505 2.555H8.154C5.066 2.555 2.553 5.067 2.553 8.156L2.554 21.845C2.554 24.933 5.066 27.445 8.155 27.445H21.844C24.933 27.445 27.445 24.933 27.445 21.845V20.494C27.445 20.169 27.572 19.864 27.803 19.634C28.038 19.4 28.352 19.271 28.659 19.271C28.661 19.271 28.661 19.271 28.662 19.271H28.748C28.75 19.271 28.752 19.271 28.754 19.271C29.092 19.271 29.407 19.401 29.643 19.635C29.873 19.865 30 20.17 30 20.494V21.845C30 26.342 26.342 30 21.845 30ZM28.722 14.051C28.029 14.051 27.444 13.466 27.444 12.774V4.372L11.421 20.395C10.947 20.87 10.081 20.871 9.605 20.394C9.367 20.156 9.236 19.833 9.236 19.486C9.236 19.138 9.367 18.815 9.605 18.577L25.628 2.555H17.225C16.532 2.555 15.948 1.97 15.948 1.277C15.948 0.585 16.532 0 17.225 0H28.722C29.414 0 29.999 0.585 29.999 1.277V12.774C29.999 13.466 29.414 14.051 28.722 14.051Z" fill={props.secondaryColor}/></svg>
                                    <span className={styles.link_bg}></span>

                                </a>
                            </div>

                        </> 
                    }
              </div>

           </>
        );
    }
    else{
        return (
            <>
                <div className={styles.link_wrapper +' '+ styles['themes_'+ props.htmlId] +' '+ (props.isEditorPreview === true ? styles.editor_link : '')+ "  " + (props.item?.animation ? `animate__animated animate__${(props.item?.animation?.animationRepeat?.length == 1) ? `repeat-${props.item?.animation.animationRepeat}` : props.item?.animation.animationRepeat}  animate__${props.item?.animation.name}` :"")} style={{backgroundImage : props.defaultGradient, animationDuration: props.item?.animation ? `${props.item?.animation?.animationDuration}ms` : "",
            animationDelay: props.item?.animation ? `${props.item?.animation?.animationDelay}ms` : "",}}>
                    {props.item.sectionData.type === 'link'?
                        <a onClick={() => linkClick(props.item.sectionData.link)} style={{color: props.primaryColor}}>
                            {props.item.sectionData.linkTitle}
                            <span className={styles.link_bg} style={{backgroundImage : props.defaultGradient}}></span>
                        </a>
                        : 
                        <div onClick={() => linkClick((props.isAdmin === true ? '/preview/'+ props.tempId : props.linkSlug) +'/'+ props.item.sectionData.pageSlug)}>
                            <a target={props.item.sectionData.openNewTab === true ? '_blank' : '_self'} rel="noopener noreferrer" style={{color: props.primaryColor}}>
                                {props.item.sectionData.linkTitle}
                                <span className={styles.link_bg} style={{backgroundImage : props.defaultGradient}}></span>
                            </a>
                        </div>
                    }
                </div>
            </>
        );
    }
}

export default LinkElement;