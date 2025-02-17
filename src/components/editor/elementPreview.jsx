import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from "react";
import { getNameInitials } from '../../../src/helper/helper';

import styles from '../../../styles/pages/Preview.module.css';
import svg from '../../helper/svg';
import Heading from './elementPreviewTemplates/heading/Heading';
import LinkElement from './elementPreviewTemplates/link/Link';
import Paragraph from './elementPreviewTemplates/paragraph/Paragraph';
import Profile from './elementPreviewTemplates/profile/Profile';
import ShareIcon from './elementPreviewTemplates/share_icon/ShareIcon';
import Images from './elementPreviewTemplates/images/Images';
import QRCode from './elementPreviewTemplates/qrcode/QRCode';
import VideoPreview from './elementPreviewTemplates/video/video';
import Head from 'next/head';

const ElementPreview = (props) => { 
    const router = useRouter();
    const [pageData, setPageData] = useState([]);

    const [name, setName] = useState('');
    const [tagline, setTagline] = useState('');
    const [imageURL, setImageURL] = useState('');

    const [bgColor, setBgColor] = useState('');
    const [headingColor, setHeadingColor] = useState('');
    const [headingFont, setHeadingFont] = useState('');
    const [headingFontSize, setHeadingFontSize] = useState('');
    const [headingFontWeight, setHeadingFontWeight] = useState('');

    const [textColor, setTextColor] = useState('');
    const [textFont, setTextFont] = useState('');
    const [textFontSize, setTextFontSize] = useState('');
    const [textFontWeight, setTextFontWeight] = useState('');

    const [tempId, setTempId] = useState('');

    const [socialIcons, setSocialIcons] = useState([]);
    
    const [gradientStatus, setGradientStatus] = useState('');
    const [gradient, setGradient] = useState('');

    const [primaryColor, setPrimaryColor] = useState('');
    const [secondaryColor, setSecondaryColor] = useState('');
    const [defaultGradientStatus, setDefaultGradientStatus] = useState('');
    const [defaultGradient, setDefaultGradient] = useState('');

    const [isSocialBoxHide, setIsSocialBoxHide] = useState(false);

    const [url, setUrl] = useState('');
    const [size, setSize] = useState('');

    const [shareIconPageUrl, setshareIconPageUrl] = useState('');
    const [htmlThemeId, setHtmlThemeId] = useState('');

    const [boxCss, setBoxCss] = useState({});

    useEffect(() => {
        (window.adsbygoogle = window.adsbygoogle || []).push({});
      }, []);

    useEffect(() => {
        /* update section list state start */ 
        setPageData(props.sections);
        /* update section list state end */ 

        /* update tempId state start */ 
        if(props.template){
            setTempId(props.template._id);
        }
        /* update tempId state end */

        /* update social icon state start */ 
        if(props.template){
            if(props.template){
                if(props.template.SocialIconData){
                    const data = props.template.SocialIconData.filter(item => item.status === 1);
                    if(data.length === 0){
                        setIsSocialBoxHide(true);
                    }else{
                        setIsSocialBoxHide(false);
                    }
                }
                setSocialIcons(props.template.SocialIconData);
            }
        }
        /* update social icon state end */

        /* update profile state start */ 
        const profile = props.template ? props.template.profile : '';
        if(profile){
            setName(profile.name);
            setTagline(profile.tagline);
            setImageURL(profile.image ? profile.image : '');
        }
        /* update profile state end */ 

        /* update style state start */
        const data = props.template ? props.template.templateStyle : '';
        if(data){
            setBgColor(data.bgcolor);
            setHeadingColor(data.headingcolor);
            setHeadingFont(data.headingfont);
            setHeadingFontSize(data.headingsize);
            setHeadingFontWeight(data.headingfontweight);
            setTextColor(data.textcolor);
            setTextFont(data.textfont);
            setTextFontSize(data.textsize);
            setTextFontWeight(data.textfontweight);

            setPrimaryColor(data.primary_color);
            setSecondaryColor(data.secondary_color);
            
            if(data.bg_gradient){
                setGradientStatus(data.bg_gradient.status);
                var gcss = '';
                if(data.bg_gradient.type === "linear"){
                    gcss = 'linear-gradient(' + data.bg_gradient.angle +'deg,'+(data.bg_gradient.colors.map(gcolor => 
                        gcolor.color +' '+ gcolor.stop + '%'
                    ))+')';
                }else{
                    gcss = 'radial-gradient(circle,'+(data.bg_gradient.colors.map(gcolor => 
                        gcolor.color +' '+ gcolor.stop + '%'
                    ))+')';
                }
                setGradient(gcss);
            }
            if(data.default_gradient){
                setDefaultGradientStatus(data.default_gradient.status);
                var gcss = '';
                if(data.default_gradient.type === "linear"){
                    gcss = 'linear-gradient(' + data.default_gradient.angle +'deg,'+(data.default_gradient.colors.map(gcolor => 
                        gcolor.color +' '+ gcolor.stop + '%'
                    ))+')';
                }else{
                    gcss = 'radial-gradient(circle,'+(data.default_gradient.colors.map(gcolor => 
                        gcolor.color +' '+ gcolor.stop + '%'
                    ))+')';
                }
                setDefaultGradient(gcss);
            }

            if(data.bgimage){
                setUrl(data.bgimage.url);
                setSize(data.bgimage.size);
            }
        }
        /* update style state end */

        if(props.template){
            setHtmlThemeId(props.template.html_theme_id);
        }

        if(htmlThemeId){

        }
        

    }, [props]);

    /* content box css start */
    useEffect(() => {
        if(htmlThemeId === '2'){
            setBoxCss({
                backgroundColor: secondaryColor,
                padding: 15,
                borderRadius: 15
            });
        }else{
            setBoxCss({});
        }
    }, [htmlThemeId]);
    /* content box css end */
    

    useEffect(() => {
        if(router.query.link_preview){
            setshareIconPageUrl(process.env.APP_URL + router.query.link_preview);
        }
    }, [router.query]);
  
      function extractScriptSrc(scriptTag) {
        
        const srcRegex = /src="([^"]+)"/;
        const match = scriptTag.match(srcRegex);
        if (match && match[1]) {
          return match[1];
        } else {
          return null;
        }
      }
      console.log(props);

    return (
        <>
            <div 
                className={styles.template_bg +' '+ styles['theme_' + htmlThemeId]}
                style={{
                    position: (props.editorPreview === true ? 'absolute' : 'fixed'),
                    top:(props.editorPreview === true ? 10 : 0),
                    left:(props.editorPreview === true ? 10 : 0),
                    right:(props.editorPreview === true ? 10 : 0),
                    bottom:(props.editorPreview === true ? 10 : 0),
                    backgroundColor: bgColor ? bgColor : '#ffebd5',
                    backgroundImage: (gradientStatus === 1 ? gradient : 'none'),
                    zIndex : (props.editorPreview === true ? 0 : -1),
                    borderRadius: (props.editorPreview === true ? 60 : 0)
                }}>
                    <div className={styles.bg_pattern}></div>
            </div>
            <div className={styles.wrapper +' '+ styles['theme_' + htmlThemeId] +' '+ (props.editorPreview === true ? styles.editor_wrapper : '')}>
                
                <ShareIcon 
                    name={name}
                    tagline={tagline}
                    primaryColor={primaryColor} 
                    secondaryColor={secondaryColor}
                    defaultGradient={defaultGradient} 
                    pageurl={shareIconPageUrl ? shareIconPageUrl : ''}
                    htmlId={htmlThemeId}
                    isEditorPreview={props.editorPreview}
                />

                <Profile 
                    name={name}
                    tagline={tagline}
                    imageURL={imageURL}
                    primaryColor={primaryColor}
                    secondaryColor={secondaryColor}
                    headingColor={headingColor}
                    pragraphColor={textColor}
                    defaultGradient={defaultGradient}
                    htmlId={htmlThemeId}
                    bgColor={bgColor}
                    textFont={textFont}
                    headingFont={headingFont}

                    isEditorPreview={props.editorPreview}
                    
                    isSocialBoxHide={isSocialBoxHide}
                    socialIcons={socialIcons}
                />

                { (props.validity === undefined) ? (props.adEnable ) ? (props.adEnable == true) && <Head>
                     {(props.adScript) &&  <script async src={extractScriptSrc(props.adScript)} crossorigin="anonymous"></script>}
               </Head> : null :''}

                {(props.validity === undefined) && (props.adEnable) && (props.adEnable == true) ?
                    <div style={{ overflow: 'hidden' }} className={styles.element_box}  dangerouslySetInnerHTML={{ __html: props.adScriptCode }}>
                    </div>
                    : ''
                }
     
              
                <div className={styles.element_box} style={boxCss}>
                    {pageData.map(item =>
                        <React.Fragment key={item._id}>
                            
                            {
                                ((item.type == "el_heading") && item.status === 1)
                                ?
                                <>
                                    <Heading
                                        item={item}
                                        htmlId={htmlThemeId}
                                        headingColor={headingColor}
                                        headingFont={headingFont}
                                        headingFontSize={headingFontSize}
                                        headingFontWeight={headingFontWeight}
                                        isEditorPreview={props.editorPreview}
                                    />
                                </> : null
                            }
                            {
                                ((item.type == "el_paragraph") && item.status === 1)
                                ?
                                <>
                                    <Paragraph
                                        item={item}
                                        htmlId={htmlThemeId}
                                        textColor={textColor}
                                        textFont={textFont}
                                        textFontSize={textFontSize}
                                        textFontWeight={textFontWeight}
                                        primaryColor={primaryColor}
                                        secondaryColor={secondaryColor}
                                        isEditorPreview={props.editorPreview}
                                    />
                                </> : null
                            }
                            {
                                ((item.type === "el_link") && item.status === 1)
                                ?
                          
                                <LinkElement
                                    item={item}
                                    tempId={tempId}
                                    pageId={props.page._id}
                                    isAdmin={props.isAdmin}
                                    linkSlug={props.linkSlug}
                                    htmlId={htmlThemeId}
                                    textFont={textFont}
                                    primaryColor={primaryColor}
                                    secondaryColor={secondaryColor}
                                    defaultGradient={defaultGradient}
                                    isEditorPreview={props.editorPreview}
                                /> : null
                                            
                            }
                             {
                                ((item.type === "el_image") && item.status === 1)
                                ?
                          
                                <Images
                                    item={item}
                                    tempId={tempId}
                                    pageId={props.page._id}
                                    isAdmin={props.isAdmin}
                                   
                                    isEditorPreview={props.editorPreview}
                                /> : null
                                            
                            }
                            {
                                ((item.type === "el_qrcode") && item.status === 1)
                                ?
                          
                                <QRCode
                                    item={item}
                                    tempId={tempId}
                                    pageId={props.page._id}
                                    isAdmin={props.isAdmin}
                                   
                                    isEditorPreview={props.editorPreview}
                                /> : null
                                            
                            }
                            {
                                ((item.type === "el_video") && item.status === 1)
                                ?
                          
                                <VideoPreview
                                    item={item}
                                    tempId={tempId}
                                    pageId={props.page._id}
                                    isAdmin={props.isAdmin}
                                    isEditorPreview={props.editorPreview}
                                /> : null
                                            
                            }
                           
                        </React.Fragment>
                    )}
                </div>

                <a href={process.env.APP_URL} target="_blank" rel="noreferrer" className={styles.pu_branding}>
                    {svg.logo}
                </a>



            </div>        
        </>
    );
}
export default ElementPreview;