import styles from './ThemeEditor.module.css';
import { useEffect, useState } from "react";
import fontList from '../../../helper/googleFontList';
import { SketchPicker, HuePicker, TwitterPicker } from 'react-color';

import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import { Autocomplete, TextField, Typography } from '@mui/material';

import Slider from '@mui/material/Slider';
import { useDispatch, useSelector } from 'react-redux';
import { updateMetaDataACT } from '../../../redux/actions/themeAction';
import svg from '../../../helper/svg';
import ThemePreview from '../themePreview';
import { common } from '../../../helper/Common';
import { useRouter } from 'next/router';
import { updatePageStyleACT } from '../../../redux/actions/editorAction';

const ThemeEditor = (props) => {
    let dispatch = useDispatch();
    const router = useRouter();
    const store = useSelector(store => store);
    
    const [themeTitle, setThemeTitle] = useState('');
    const [editThemeId, setEditThemeId] = useState('');

    const [metaData, setMetaData] = useState([]);

    const [bgColorSt, setBgColorSt] = useState('');
    const [headingColorSt, setHeadingColorSt] = useState('');
    const [textColorSt, setTextColorSt] = useState('');

    const [primaryColorSt, setPrimaryColorSt] = useState('');
    const [secondaryColorSt, setSecondaryColorSt] = useState('');

    const [gradientColors, setGradientColors] = useState([]);
    const [gradientType, setGradientType] = useState('');
    const [gradientAngle, setGradientAngle] = useState('');

    const [defaultGradientColors, setDefaultGradientColors] = useState([]);
    const [defaultGradientType, setDefaultGradientType] = useState('');
    const [defaultGradientAngle, setDefaultGradientAngle] = useState('');

    const [isGradientEnable, setIsGradientEnable] = useState(false);
    const [isDefaultGradientEnable, setIsDefaultGradientEnable] = useState(false);

    const [fontListSt, setFontListSt] = useState([]);
    
    const [headingFont, setHeadingFont] = useState('');
    const [headingFontWeight, setHeadingFontWeight] = useState('');
    const [headingSize, setHeadingSize] = useState('');

    const [textFont, setTextFont] = useState('');
    const [textFontWeight, setTextFontWeight] = useState('');
    const [textSize, setTextSize] = useState('');


    const [headingFontInputValue, setHeadingFontInputValue] = useState('');
    const [fontWeightList, setFontWeightList] = useState([]);

    const [textFontInputValue, setTextFontInputValue] = useState('');
    const [textFontWeightList, setTextFontWeightList] = useState([]);

    const materialColors = ['#EF5350', '#EC407A', '#AB47BC', '#7E57C2', '#5C6BC0', '#42A5F5', '#29B6F6', '#26C6DA', '#26A69A', '#66BB6A', '#9CCC65', '#D4E157', '#FFEE58', '#FFCA28', '#FFA726', '#FF7043', '#8D6E63', '#78909C'];

    const resetThemeState = () => {
        setBgColorSt('#ffffff');
        setPrimaryColorSt('#2bdcf0');
        setHeadingColorSt('#222222');
        setTextColorSt('#333333');
        setGradientColors([
            { color : '#8EC5FC', stop : 0 },
            { color : '#E0C3FC', stop : 100 },
        ]);
        setDefaultGradientColors([
            { color : '#fa8bff', stop : 0 },
            { color : '#2bd2ff', stop : 50 },
            { color : '#2bff88', stop : 100 },
        ]);
        setGradientType('linear');
        setGradientAngle(62);
        setDefaultGradientAngle(90);
        setIsGradientEnable(false);
        setIsDefaultGradientEnable(false);
        setHeadingFont('Nunito');
        setHeadingFontWeight(400);
        setHeadingSize(16);
        setTextFont('Nunito');
        setTextFontWeight(400);
        setTextSize(14);
    }

    useEffect(() => {
        setFontListSt(fontList);
    }, []);

    useEffect(() => {
        if(props.data){
            setThemeTitle(props.data.title);
            if(props.data._id){
                setEditThemeId(props.data._id);
            }
        }
        
        if(props.data){
            var themeEditorData = props.data.metaData !== undefined ? props.data.metaData : props.data;
            if(themeEditorData){  
                //dispatch(updateMetaDataACT(themeEditorData));
                setMetaData(themeEditorData);
                setBgColorSt(themeEditorData?.bgcolor);
                setPrimaryColorSt(themeEditorData?.primary_color);
                setSecondaryColorSt(themeEditorData?.secondary_color);
                setHeadingColorSt(themeEditorData?.headingcolor);
                setTextColorSt(themeEditorData?.textcolor);
                setGradientColors(themeEditorData?.bg_gradient?.colors);
                setGradientType(themeEditorData?.bg_gradient?.type);
                setGradientAngle(themeEditorData?.bg_gradient?.angle);
                setDefaultGradientColors(themeEditorData?.default_gradient?.colors);
                setDefaultGradientType(themeEditorData?.default_gradient?.type);
                setDefaultGradientAngle(themeEditorData?.default_gradient?.angle);
                
                if(themeEditorData.headingfont){
                    setHeadingFont(themeEditorData.headingfont);
                    let findFont = fontList.find(item => item.label === themeEditorData.headingfont);
                    setHeadingFontInputValue(findFont.label);
                    setFontWeightList(findFont.weight);
                    setHeadingFontWeight(themeEditorData.headingfontweight);
                }
                if(themeEditorData.textfont){
                    setTextFont(themeEditorData.textfont);
                    let findFont1 = fontList.find(item => item.label === themeEditorData.textfont);
                    setTextFontInputValue(findFont1.label);
                    setTextFontWeightList(findFont1.weight);
                    setTextFontWeight(themeEditorData.textfontweight);
                }
                setHeadingSize(themeEditorData.headingsize);
                setTextSize(themeEditorData.textsize);
        
                if(themeEditorData.bg_gradient.status === 1){
                    setIsGradientEnable(true);
                }else{
                    setIsGradientEnable(false);
                }
            }
        }
        
    }, [props]);

    /* color picker start */
    const colorPickerChange = (type, color) => {
        if(color.hex){
            var color = color.hex;
            if(type === "bgcolor"){
                setBgColorSt(color.toString());
            }else if(type === "headingcolor"){
                setHeadingColorSt(color.toString());
            }else if(type === "textcolor"){
                setTextColorSt(color.toString());
            }else if(type === "primary_color"){
                setPrimaryColorSt(color.toString());
            }else if(type === "secondary_color"){
                setSecondaryColorSt(color.toString());
            }else if(type.includes('gradientcolorbg_')){
                const spt = type.split('_');
                const index = spt[1];
                const colors = [...gradientColors];
                colors[index].color = color.toString();
                setGradientColors(colors);
            }else if(type.includes('defaultgradientcolor_')){
                const spt = type.split('_');
                const index = spt[1];
                const colors = [...defaultGradientColors];
                colors[index].color = color.toString();
                setDefaultGradientColors(colors);
            }
        }
    }
    const colorPickerComplete = (type, color) => {
        if(color.hex){
            var color = color.hex;
            const copyMetaData = {...metaData};
            if(type === 'bgcolor'){
                copyMetaData.bgcolor = color.toString();
            }else if(type === 'headingcolor'){
                copyMetaData.headingcolor = color.toString();
            }else if(type === 'textcolor'){
                copyMetaData.textcolor = color.toString();
            }else if(type === 'primary_color'){
                copyMetaData.primary_color = color.toString();
            }else if(type === 'secondary_color'){
                copyMetaData.secondary_color = color.toString();
            }else if(type.includes('gradientcolorbg_')){
                const colors = [...gradientColors];
                copyMetaData.bg_gradient.colors = colors;
            }else if(type.includes('defaultgradientcolor_')){
                const colors = [...defaultGradientColors];
                copyMetaData.default_gradient.colors = colors;
            }
            setMetaData(copyMetaData);
        }
    }
    /* color picker end */

    /* save theme start */
    const saveTheme = () => {
        if(editThemeId){
            common.getAPI({
                method : 'POST',
                url : 'admin/editTheme',
                data : {
                    id : editThemeId,
                    metaData : metaData,
                    title : themeTitle
                }
            }, (resp) => {
                
            })
        }else{
            if(store.editor.editorData){
                var tempId = store.editor.editorData._id;
                if(tempId === router.query.id){
                    dispatch(updatePageStyleACT(metaData));
                    common.getAPI({
                        method: "POST",
                        url: 'editor/applyTheme',
                        data: {
                            template_id : tempId,
                            themeData : metaData
                        }
                    },
                    (resp) => {
                        
                    });
                }
            }
        }
    }
    /* save theme end */

    const colorPickerOpener = (type) => {
        var typeColor = '';
        if(type === 'bgcolor'){
            typeColor = metaData.bgcolor;
        }else if(type === 'headingcolor'){
            typeColor = metaData.headingcolor;
        }else if(type === 'textcolor'){
            typeColor = metaData.textcolor;
        }
    }

    /* background type change start */
    const backgroundTypeHandle = (e) => {
        const data = {...metaData};
        if(e.target.value === 'gradient'){
            setIsGradientEnable(true);
            data.bg_gradient.status = 1
        }else{
            data.bg_gradient.status = 0
            setIsGradientEnable(false);
        }
    }
    /* background type change end */

    /* default color type change start */
    const defaultColorTypeHandle = (e) => {
        const data = {...metaData};
        if(e.target.value === 'gradient'){
            setIsDefaultGradientEnable(true);
            data.default_gradient.status = 1
        }else{
            data.default_gradient.status = 0
            setIsDefaultGradientEnable(false);
        }
    }
    /* default color type change end */

    function valuetext(value) {
        return `${value}°C`;
    }
    function valuetext1(value) {
        return `${value}°C`;
    }
    function valuetext2(value) {
        return `${value}°C`;
    }

    const gradientAngleChange = (event, newValue) => {
        setGradientAngle(newValue);
        const data = {...metaData};
        data.bg_gradient.angle = newValue;
        setMetaData(data);
    }
    const defaultGradientAngleChange = (event, newValue) => {
        setDefaultGradientAngle(newValue);
        const data = {...metaData};
        data.default_gradient.angle = newValue;
        setMetaData(data);
    }

    const gradientTypeChange = (event, newValue) => {
        setGradientType(newValue);
        const data = {...metaData};
        data.bg_gradient.type = newValue;
        setMetaData(data);
    }
    const defaultGradientTypeChange = (event, newValue) => {
        setDefaultGradientType(newValue);
        const data = {...metaData};
        data.default_gradient.type = newValue;
        setMetaData(data);
    }

    const updateGradientStop = (index, color, value) => {
        const colors = [...gradientColors];
        colors[index].stop = value;
        setGradientColors(colors);
        
        const data = {...metaData};
        data.bg_gradient.colors = colors;
        setMetaData(data);
    }
    const updateDefaultGradientStop = (index, color, value) => {
        const colors = [...defaultGradientColors];
        colors[index].stop = value;
        setDefaultGradientColors(colors);
        
        const data = {...metaData};
        data.default_gradient.colors = colors;
        setMetaData(data);
    }
    
    const addGradientColor = () => {
        const colors = [...gradientColors];
        const new_color = {
            color : materialColors[Math.floor(Math.random()*materialColors.length)],
            stop : 50
        }
        colors.push(new_color);
        setGradientColors(colors);

        const data = {...metaData};
        data.bg_gradient.colors = colors;
        setMetaData(data);
    }
    const addDefaultGradientColor = () => {
        const colors = [...defaultGradientColors];
        const new_color = {
            color : materialColors[Math.floor(Math.random()*materialColors.length)],
            stop : 50
        }
        colors.push(new_color);
        setDefaultGradientColors(colors);

        const data = {...metaData};
        data.default_gradient.colors = colors;
        setMetaData(data);
    }

    const removeGradientColor = (index, color) => {
        const colors = [...gradientColors];
        colors.splice(index, 1);
        setGradientColors(colors);

        const data = {...metaData};
        data.bg_gradient.colors = colors;
        setMetaData(data);
    }
    const removeDefaultGradientColor = (index, color) => {
        const colors = [...defaultGradientColors];
        colors.splice(index, 1);
        setDefaultGradientColors(colors);

        const data = {...metaData};
        data.default_gradient.colors = colors;
        setMetaData(data);
    }

    /* heading font change start */
    const handleHeadingFontChange = (event, newValue) => {
        if(newValue){
            setHeadingFont(newValue.label);
            setHeadingFontWeight(400);
            //dispatch(updateHeadingFontWeightACT(400));
            setFontWeightList(newValue.weight);
            //dispatch(updateHeadingFontACT(newValue.label));

            const data = {...metaData};
            data.headingfont = newValue.label;
            setMetaData(data);
        }
    };
    /* heading font change end */
    
    /* heading font weight start */
    const handleHeadingFontWeightChange = (event) => {
        if(event){
            setHeadingFontWeight(event.target.value);
            //dispatch(updateHeadingFontWeightACT(event.target.value));
            const data = {...metaData};
            data.headingfontweight = event.target.value;
            setMetaData(data);
        }
    };
    /* heading font weight end */

    /* heading font size change start */
    const headingFontSizeChange = (event) => {
        if(event){
            setHeadingSize(event.target.value);
            //dispatch(updateHeadingFontSizeACT(event.target.value));
            const data = {...metaData};
            data.headingsize = event.target.value;
            setMetaData(data);
        }
    };
    /* heading font size change end */

    /* text font change start */
    const handleTextFontChange = (event, newValue) => {
        if(newValue){
            setTextFont(newValue.label);
            setTextFontWeight(400);
            setTextFontWeightList(newValue.weight);
            const data = {...metaData};
            data.textfont = newValue.label;
            setMetaData(data);
        }
    };
    /* text font change end */

    /* text font weight start */
    const handleTextFontWeightChange = (event) => {
        if(event){
            setTextFontWeight(event.target.value);
            const data = {...metaData};
            data.textfontweight = event.target.value;
            setMetaData(data);
        }
    };
    /* text font weight end */

    /* text font size change start */
    const textFontSizeChange = (event) => {
        if(event){
            setTextSize(event.target.value);
            const data = {...metaData};
            data.textsize = event.target.value;
            setMetaData(data);
        }
    };
    /* text font size change end */

    return (
        <>
            <div className={styles.theme_editor_wrapper +' '+ ((store.userData.role === 2 || router.pathname === '/settings/[id]') ? styles.theme_editor_user : '')}>
                <div className={styles.theme_editor_content}>
                    {/* {props.data.isDefault === 0 ?
                        <div className="pu_input_wrapper">
                            <label>Theme Name</label>
                            <input type="text" className="pu_input" value={themeTitle} onChange={(e) => setThemeTitle(e.target.value)} />
                        </div> : null
                    } */}
                    <div className={styles.theme_editor_box}>
                        <h3 className={styles.theme_editor_box_title}>Default Colors</h3>

                        {/* <div className="pu_input_wrapper">
                            <div className="pu_radio_list">
                                <div className="pu_radio">
                                    <input type="radio" name="default_type" id="default_type_color" value="color" checked={isDefaultGradientEnable === false} onChange={(e) => defaultColorTypeHandle(e)} />
                                    <label htmlFor="default_type_color">Color</label>
                                </div>
                                <div className="pu_radio">
                                    <input type="radio" name="default_type" id="default_type_gradient" value="gradient" checked={isDefaultGradientEnable === true} onChange={(e) => defaultColorTypeHandle(e)} />
                                    <label htmlFor="default_type_gradient">Gradient</label>
                                </div>
                            </div>
                        </div> */}

                        <div className="pu_input_wrapper_list">
                            <div className="pu_input_wrapper">
                                <label>Primary Color</label>
                                <div className="pu_color_picker_wrapper">
                                    <div className="pu_color_picker_toggle" onClick={() => colorPickerOpener('primary_color')}>
                                        <span className="pu_color_name">{primaryColorSt}</span>
                                        <span className="pu_color_preview" style={{backgroundColor : primaryColorSt}}></span>
                                    </div>
                                    <div className="pu_color_picker_dropdown">
                                        <SketchPicker
                                            color={primaryColorSt}
                                            onChange={(color) => colorPickerChange('primary_color', color)}
                                            onChangeComplete={(color) => colorPickerComplete('primary_color', color)}
                                        />
                                        <HuePicker
                                            color={primaryColorSt}
                                            onChange={(color) => colorPickerChange('primary_color', color)}
                                            onChangeComplete={(color) => colorPickerComplete('primary_color', color)}
                                            width = {276}
                                        />
                                        <TwitterPicker
                                            color={primaryColorSt}
                                            onChange={(color) => colorPickerChange('primary_color', color)}
                                            onChangeComplete={(color) => colorPickerComplete('primary_color', color)}
                                            width = {276}
                                            colors= {materialColors}
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="pu_input_wrapper">
                                <label>Secondary Color</label>
                                <div className="pu_color_picker_wrapper">
                                    <div className="pu_color_picker_toggle" onClick={() => colorPickerOpener('secondary_color')}>
                                        <span className="pu_color_name">{secondaryColorSt}</span>
                                        <span className="pu_color_preview" style={{backgroundColor : secondaryColorSt}}></span>
                                    </div>
                                    <div className="pu_color_picker_dropdown">
                                        <SketchPicker
                                            color={secondaryColorSt}
                                            onChange={(color) => colorPickerChange('secondary_color', color)}
                                            onChangeComplete={(color) => colorPickerComplete('secondary_color', color)}
                                        />
                                        <HuePicker
                                            color={secondaryColorSt}
                                            onChange={(color) => colorPickerChange('secondary_color', color)}
                                            onChangeComplete={(color) => colorPickerComplete('secondary_color', color)}
                                            width = {276}
                                        />
                                        <TwitterPicker
                                            color={secondaryColorSt}
                                            onChange={(color) => colorPickerChange('secondary_color', color)}
                                            onChangeComplete={(color) => colorPickerComplete('secondary_color', color)}
                                            width = {276}
                                            colors= {materialColors}
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="pu_input_wrapper"></div>
                        </div>
                    </div>

                    <div className={styles.theme_editor_box}>
                        <h3 className={styles.theme_editor_box_title}>Default Gradient</h3>
                        <div className="pu_input_wrapper_list">
                            <div className="pu_input_wrapper">
                                <label>Type</label>
                                <select className="pu_input" onChange={(e) => defaultGradientTypeChange(e, e.target.value)} value={defaultGradientType}>
                                    <option value="linear">Linear</option>
                                    <option value="radial">Radial</option>
                                </select>
                            </div>
                            {defaultGradientType === 'linear' ? 
                                <div className="pu_input_wrapper">
                                    <label>Angle</label>
                                    <div className="pu_mui_slider">
                                        <Slider
                                            aria-label="Custom marks"
                                            value={defaultGradientAngle}
                                            getAriaValueText={valuetext2}
                                            valueLabelDisplay="auto"
                                            onChange={(e) => defaultGradientAngleChange(e, e.target.value)}
                                            min={0}
                                            max={360}
                                        />
                                        <input 
                                            type="number" 
                                            value={defaultGradientAngle} 
                                            onChange={(e) => defaultGradientAngleChange(e, e.target.value)}
                                            min={0}
                                            max={360}
                                        />
                                    </div>
                                </div> : <div className="pu_input_wrapper"></div> 
                            }
                            <div className="pu_input_wrapper"></div>
                        </div>
                        <div className="pu_gradient_editor_wrapper">
                            <div className="pu_input_wrapper_list" style={{backgroundColor: 'transparent', padding: '0 10px', fontWeight: '600'}}>
                                <div className="pu_input_wrapper">Color</div>
                                <div className="pu_input_wrapper">Stop</div>
                                <div className="">Remove</div>
                            </div>
                            {defaultGradientColors.map((gcolor, index) => 
                                <div key={index} className="pu_input_wrapper_list">
                                    <div className="pu_input_wrapper">
                                        <div className="pu_color_picker_wrapper">
                                            <div className="pu_color_picker_toggle" onClick={() => colorPickerOpener('color1')}>
                                                <span className="pu_color_name">{gcolor.color}</span>
                                                <span className="pu_color_preview" style={{backgroundColor : gcolor.color}}></span>
                                            </div>
                                            <div className="pu_color_picker_dropdown">
                                                <SketchPicker
                                                    color={gcolor.color}
                                                    onChange={(color) => colorPickerChange('defaultgradientcolor_'+index , color)}
                                                    onChangeComplete={(color) => colorPickerComplete('defaultgradientcolor_'+index , color)}
                                                />
                                                <HuePicker
                                                    color={gcolor.color}
                                                    onChange={(color) => colorPickerChange('defaultgradientcolor_'+index , color)}
                                                    onChangeComplete={(color) => colorPickerComplete('defaultgradientcolor_'+index , color)}
                                                    width = {276}
                                                />
                                                <TwitterPicker
                                                    color={gcolor.color}
                                                    onChange={(color) => colorPickerChange('defaultgradientcolor_'+index, color)}
                                                    onChangeComplete={(color) => colorPickerComplete('defaultgradientcolor_'+index, color)}
                                                    width = {276}
                                                    colors= {materialColors}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="pu_input_wrapper">
                                        <div className="pu_mui_slider">
                                            <Slider
                                                aria-label="Custom marks"
                                                value={gcolor.stop}
                                                getAriaValueText={valuetext1}
                                                valueLabelDisplay="auto"
                                                onChange={(e) => updateDefaultGradientStop(index, gcolor, e.target.value)}
                                                min={0}
                                                max={100}
                                            />
                                            <input 
                                                type="number" 
                                                value={gcolor.stop} 
                                                onChange={(e) => updateDefaultGradientStop(index, gcolor, e.target.value)}
                                                min={0}
                                                max={100}
                                            />
                                        </div>
                                    </div>
                                    <div className="pu_remove" onClick={() => removeDefaultGradientColor(index, gcolor)}>{svg.popup_close}</div>
                                </div>
                            )}
                            <div className="pu_add_color" onClick={() => addDefaultGradientColor()}>
                                {svg.plus_icon} <span>Add New Color</span>
                            </div>    
                        </div>
                    </div>

                    <div className={styles.theme_editor_box}>
                        <h3 className={styles.theme_editor_box_title}>Background</h3>

                        <div className="pu_input_wrapper">
                            <div className="pu_radio_list">
                                <div className="pu_radio">
                                    <input type="radio" name="background_type" id="background_type_color" value="color" checked={isGradientEnable === false} onChange={(e) => backgroundTypeHandle(e)} />
                                    <label htmlFor="background_type_color">Color</label>
                                </div>
                                <div className="pu_radio">
                                    <input type="radio" name="background_type" id="background_type_gradient" value="gradient" checked={isGradientEnable === true} onChange={(e) => backgroundTypeHandle(e)} />
                                    <label htmlFor="background_type_gradient">Gradient</label>
                                </div>
                            </div>
                        </div>
                        {isGradientEnable === false ?
                            <div className="pu_input_wrapper">
                                <label>Background Color</label>
                                <div className="pu_color_picker_wrapper">
                                    <div className="pu_color_picker_toggle" onClick={() => colorPickerOpener('bgcolor')}>
                                        <span className="pu_color_name">{bgColorSt}</span>
                                        <span className="pu_color_preview" style={{backgroundColor : bgColorSt}}></span>
                                    </div>
                                    <div className="pu_color_picker_dropdown">
                                        <SketchPicker
                                            color={bgColorSt}
                                            onChange={(color) => colorPickerChange('bgcolor', color)}
                                            onChangeComplete={(color) => colorPickerComplete('bgcolor', color)}
                                        />
                                        <HuePicker
                                            color={bgColorSt}
                                            onChange={(color) => colorPickerChange('bgcolor', color)}
                                            onChangeComplete={(color) => colorPickerComplete('bgcolor', color)}
                                            width = {276}
                                        />
                                        <TwitterPicker
                                            color={bgColorSt}
                                            onChange={(color) => colorPickerChange('bgcolor', color)}
                                            onChangeComplete={(color) => colorPickerComplete('bgcolor', color)}
                                            width = {276}
                                            colors= {materialColors}
                                        />
                                    </div>
                                </div>
                            </div>
                            :                                         
                            <>
                                <div className="pu_input_wrapper_list">
                                    <div className="pu_input_wrapper">
                                        <label>Type</label>
                                        <select className="pu_input" onChange={(e) => gradientTypeChange(e, e.target.value)} value={gradientType}>
                                            <option value="linear">Linear</option>
                                            <option value="radial">Radial</option>
                                        </select>
                                    </div>
                                    {gradientType === 'linear' ? 
                                        <div className="pu_input_wrapper">
                                            <label>Angle</label>
                                            <div className="pu_mui_slider">
                                                <Slider
                                                    aria-label="Custom marks"
                                                    value={gradientAngle}
                                                    getAriaValueText={valuetext}
                                                    valueLabelDisplay="auto"
                                                    onChange={(e) => gradientAngleChange(e, e.target.value)}
                                                    min={0}
                                                    max={360}
                                                />
                                                <input 
                                                    type="number" 
                                                    value={gradientAngle} 
                                                    onChange={(e) => gradientAngleChange(e, e.target.value)}
                                                    min={0}
                                                    max={360}
                                                />
                                            </div>
                                        </div>
                                        : 
                                        <div className="pu_input_wrapper"></div>
                                    }
                                    <div className="pu_input_wrapper"></div>
                                </div>
                                <div className="pu_gradient_editor_wrapper">
                                    <div className="pu_input_wrapper_list" style={{backgroundColor: 'transparent', padding: '0 10px', fontWeight: '600'}}>
                                        <div className="pu_input_wrapper">Color</div>
                                        <div className="pu_input_wrapper">Stop</div>
                                        <div className="">Remove</div>
                                    </div>
                                    {gradientColors.map((gcolor, index) => 
                                        <div key={index} className="pu_input_wrapper_list">
                                            <div className="pu_input_wrapper">
                                                <div className="pu_color_picker_wrapper">
                                                    <div className="pu_color_picker_toggle" onClick={() => colorPickerOpener('color1')}>
                                                        <span className="pu_color_name">{gcolor.color}</span>
                                                        <span className="pu_color_preview" style={{backgroundColor : gcolor.color}}></span>
                                                    </div>
                                                    <div className="pu_color_picker_dropdown">
                                                        <SketchPicker
                                                            color={gcolor.color}
                                                            onChange={(color) => colorPickerChange('gradientcolorbg_'+index , color)}
                                                            onChangeComplete={(color) => colorPickerComplete('gradientcolorbg_'+index , color)}
                                                        />
                                                        <HuePicker
                                                            color={gcolor.color}
                                                            onChange={(color) => colorPickerChange('gradientcolorbg_'+index , color)}
                                                            onChangeComplete={(color) => colorPickerComplete('gradientcolorbg_'+index , color)}
                                                            width = {276}
                                                        />
                                                        <TwitterPicker
                                                            color={gcolor.color}
                                                            onChange={(color) => colorPickerChange('gradientcolorbg_'+index, color)}
                                                            onChangeComplete={(color) => colorPickerComplete('gradientcolorbg_'+index, color)}
                                                            width = {276}
                                                            colors= {materialColors}
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="pu_input_wrapper">
                                                <div className="pu_mui_slider">
                                                    <Slider
                                                        aria-label="Custom marks"
                                                        value={gcolor.stop}
                                                        getAriaValueText={valuetext1}
                                                        valueLabelDisplay="auto"
                                                        onChange={(e) => updateGradientStop(index, gcolor, e.target.value)}
                                                        min={0}
                                                        max={100}
                                                    />
                                                    <input 
                                                        type="number" 
                                                        value={gcolor.stop} 
                                                        onChange={(e) => updateGradientStop(index, gcolor, e.target.value)}
                                                        min={0}
                                                        max={100}
                                                    />
                                                </div>
                                            </div>
                                            <div className="pu_remove" onClick={() => removeGradientColor(index, gcolor)}>{svg.popup_close}</div>
                                        </div>
                                    )}
                                    <div className="pu_add_color" onClick={() => addGradientColor()}>
                                        {svg.plus_icon} <span>Add New Color</span>
                                    </div>    
                                </div>
                            </>
                        }

                    </div>

                    <div className={styles.theme_editor_box}>
                        <h3 className={styles.theme_editor_box_title}>Heading Style</h3>
                        <div className="pu_input_wrapper_list">
                            <div className="pu_input_wrapper">
                                <label>Color</label>
                                <div className="pu_color_picker_wrapper">
                                    <div className="pu_color_picker_toggle" onClick={() => colorPickerOpener('headingcolor')}>
                                        <span className="pu_color_name">{headingColorSt}</span>
                                        <span className="pu_color_preview" style={{backgroundColor : headingColorSt}}></span>
                                    </div>
                                    <div className="pu_color_picker_dropdown">
                                        <SketchPicker
                                            color={headingColorSt}
                                            onChange={(color) => colorPickerChange('headingcolor', color)}
                                            onChangeComplete={(color) => colorPickerComplete('headingcolor', color)}
                                        />
                                        <HuePicker
                                            color={headingColorSt}
                                            onChange={(color) => colorPickerChange('headingcolor', color)}
                                            onChangeComplete={(color) => colorPickerComplete('headingcolor', color)}
                                            width = {276}
                                        />
                                        <TwitterPicker
                                            color={headingColorSt}
                                            onChange={(color) => colorPickerChange('headingcolor', color)}
                                            onChangeComplete={(color) => colorPickerComplete('headingcolor', color)}
                                            width = {276}
                                            colors= {materialColors}
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="pu_input_wrapper"></div>
                        </div>

                        <div className="pu_input_wrapper_list">
                            <div className="pu_input_wrapper">
                                <label>Family</label>
                                <div className="pu_mui_autocomplete">
                                    <Autocomplete
                                        value={headingFont}
                                        onChange={handleHeadingFontChange}
                                        options={fontListSt}
                                        isOptionEqualToValue={(option, value) =>
                                            value === undefined || value === "" || option.id === value.id
                                        }
                                        inputValue={headingFontInputValue}
                                        onInputChange={(event, newInputValue) => {
                                            setHeadingFontInputValue(newInputValue);
                                        }}
                                        renderInput={(params) => <TextField {...params} />}
                                        renderOption={(props, option) => (
                                            <li style={{fontFamily: option.label+', sans-serif'}} {...props}>{option.label}</li>
                                        )}
                                    />
                                </div>
                            </div>
                            <div className="pu_input_wrapper">
                                <label>Weight</label>
                                <div className="pu_mui_select">
                                    <FormControl fullWidth>
                                        <Select
                                            value={headingFontWeight}
                                            onChange={handleHeadingFontWeightChange}
                                        >
                                            {fontWeightList.map((weight, index) => (
                                                <MenuItem key={index} value={weight}> {weight} </MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>
                                </div>
                            </div>
                            <div className="pu_input_wrapper">
                                <label>Size</label>
                                <input type="number" className="pu_input" min="10" max="80" value={headingSize} onChange={(e) => headingFontSizeChange(e)} />
                            </div>
                        </div>

                    </div>

                    <div className={styles.theme_editor_box}>
                        <h3 className={styles.theme_editor_box_title}>Paragraph Style</h3>
                        <div className="pu_input_wrapper_list">
                            <div className="pu_input_wrapper">
                                <label>Text Color</label>
                                <div className="pu_color_picker_wrapper">
                                    <div className="pu_color_picker_toggle" onClick={() => colorPickerOpener('textcolor')}>
                                        <span className="pu_color_name">{textColorSt}</span>
                                        <span className="pu_color_preview" style={{backgroundColor : textColorSt}}></span>
                                    </div>
                                    <div className="pu_color_picker_dropdown">
                                        <SketchPicker
                                            color={textColorSt}
                                            onChange={(color) => colorPickerChange('textcolor', color)}
                                            onChangeComplete={(color) => colorPickerComplete('textcolor', color)}
                                        />
                                        <HuePicker
                                            color={textColorSt}
                                            onChange={(color) => colorPickerChange('textcolor', color)}
                                            onChangeComplete={(color) => colorPickerComplete('textcolor', color)}
                                            width = {276}
                                        />
                                        <TwitterPicker
                                            color={textColorSt}
                                            onChange={(color) => colorPickerChange('textcolor', color)}
                                            onChangeComplete={(color) => colorPickerComplete('textcolor', color)}
                                            width = {276}
                                            colors= {materialColors}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="pu_input_wrapper_list">
                            <div className="pu_input_wrapper">
                                <label>Family</label>
                                <div className="pu_mui_autocomplete">
                                    <Autocomplete
                                        value={textFont}
                                        onChange={handleTextFontChange}
                                        options={fontListSt}
                                        isOptionEqualToValue={(option, value) =>
                                            value === undefined || value === "" || option.id === value.id
                                        }
                                        inputValue={textFontInputValue}
                                        onInputChange={(event, newInputValue) => {
                                            setTextFontInputValue(newInputValue);
                                        }}
                                        renderInput={(params) => <TextField {...params} />}
                                        renderOption={(props, option) => (
                                            <li style={{fontFamily: option.label+', sans-serif'}} {...props}>{option.label}</li>
                                        )}
                                    />
                                </div>
                            </div>
                            <div className="pu_input_wrapper">
                                <label>Weight</label>
                                <div className="pu_mui_select">
                                    <FormControl fullWidth>
                                        <Select
                                            value={textFontWeight}
                                            onChange={handleTextFontWeightChange}
                                        >
                                            {textFontWeightList.map((weight, index) => (
                                                <MenuItem key={index} value={weight}> {weight} </MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>
                                </div>
                            </div>
                            <div className="pu_input_wrapper">
                                <label>Size</label>
                                <input type="number" className="pu_input" min="10" max="80" value={textSize} onChange={(e) => textFontSizeChange(e)} />
                            </div>
                        </div>
                    </div>

                    <div className="pu_setting_theme_save">
                        <button className="pu_btn" onClick={() => saveTheme()}>Save Theme</button>
                    </div>
                </div>
                {(store.userData.role === 1 && router.pathname !== '/settings/[id]') ? 
                    <div className={styles.theme_editor_preview}>
                        <p className="text-center">Theme Preview</p>
                        <div style={{height: 400, position: 'relative', border: '1px solid #dbe2ed', borderRadius: 10, overflow: 'hidden'}}>
                            <ThemePreview data={metaData} />
                        </div>
                    </div> : null
                }
            </div>
        </>
    );
}

export default ThemeEditor;