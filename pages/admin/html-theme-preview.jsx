import { useState } from 'react';
import HTML_THEME_LIST from '../../src/helper/htmlThemeList';
import styles from '../../styles/pages/HtmlThemePreview.module.css';

const HtmlThemePreview = () => {

    const [themeList, setThemeList] = useState(HTML_THEME_LIST);
    return (
        <>
            <div className="pu_container" >
            <div className="pu_pagetitle_wrapper"><h3>HTML Themes</h3></div>
                <div className={styles.themelayfix} >
                {themeList.map(theme =>
                        <div key={theme.id} className={styles.themelaybox} >
                            <img src={'/images/html_template_preview/theme'+theme.id+'.jpg'} alt="" />
                            <h3>{theme.title}</h3>
                        </div>
                )}
                </div>
            </div>
        </>
    );
}

export default HtmlThemePreview;