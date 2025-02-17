import { FormControl, MenuItem, Select, Slider } from "@mui/material";
import styles from "../../../../styles/pages/Settings.module.css";
import svg from "../../../helper/svg";
import { useState } from "react";
import { AlertMsg } from "../../../helper/helper";
import { common } from "../../../helper/Common";
import validator from 'validator';
import { useDispatch } from "react-redux";
import { getSectionListACT } from "../../../redux/actions/editorAction";

function AnimationSetting({ data, page }) {
  let dispatch = useDispatch();

  const [animation, setAnimation] = useState("");
  const [speedCurve, setSpeedCurve] = useState("");
  const [animDuration, setAnimDuration] = useState("100");
  const [animDelay, setAnimDelay] = useState("0");
  const[animRepeat,setAnimRepeat] = useState('1');
  const[activeElement,setActiveElement] = useState({});
 

  const animationList = ["fadeIn","fadeOut","zoomIn","zoomOut","bounce","flash","pulse","rubberBand","shakeX","shakeY","headShake","swing","tada","wobble","jello","heartBeat" ];
  const speedCurveList = ["ease","ease-in","ease-out","ease-in-out","linear",];

  const saveAnimationData = () => {
    const URlEmpty = validator.isEmpty(animation, { ignore_whitespace: true });

    if(URlEmpty){
        AlertMsg("error", "Oops!", "Animation Name can not be empty.");
        return false;
    }
    if(Object.keys(activeElement).length === 0){
      AlertMsg("error", "Oops!", "Select element first!");
      return false;
  }
    let animationData = {name:animation,speedCurve:speedCurve,animationDuration:animDuration,animationDelay:animDelay , animationRepeat:animRepeat}
    common.getAPI({
      method : 'POST',
      url : 'editor/updateAnimation',
      loading:false,
      data : {
        section_id : activeElement._id,
        sectionData:activeElement.sectionData,
        animation : animationData,
      }
  }, (resp) => {
    if(resp.status == "success"){
      dispatch(getSectionListACT({ _id: page._id }));
      // setActiveElement({});
      // emptyStates()
    }
      
  })
   
  };
  function emptyStates(){
    setAnimation('');
    setAnimDuration('100');
    setAnimDelay('0');
    setSpeedCurve('');
    setAnimRepeat('1')
  }

  const handleElementClick =(ele)=>{ 
      setActiveElement(ele); 
      if(ele.animation){
        setAnimation(ele.animation?.name);
        setAnimDuration(ele.animation?.animationDuration);
        setAnimDelay(ele.animation?.animationDelay);
        setSpeedCurve(ele.animation?.speedCurve);
        setAnimRepeat(ele.animation?.animationRepeat)
      }else{
           emptyStates();
      }
  }

  return (
    <div className={styles.seo_wrapper}>
      <div className={styles.seo_pagelist_wrapper}>
        <h3>Select Page</h3>

        <div className={styles.seo_pagelist}>
          <div className={`${styles.seo_page_item} ${styles.active}`}>
            {page.title}
          </div>
        </div>
        <div className={styles.element_wrapper_outer}> 
       {data.map((ele) => (
          <div className={`${styles.element_wrap} ${activeElement._id == ele._id && styles.activeElement}`} key={ele._id} onClick={()=>handleElementClick(ele)}>
            <div className={styles.element_icon_box}>
              {svg["icon_" + ele.type]}
            </div>
            <div className={styles.element_section_title}>{ele.title}</div>
          </div>
        ))}
      </div>
      </div>

      <div className={styles.seo_settings}>
        <div className="pu_input_wrapper_list">
          <div className="pu_input_wrapper">
            <label>Animation Name</label>
            <div className="pu_mui_select">
              <FormControl fullWidth>
                <Select
                  value={animation}
                  onChange={(e) => setAnimation(e.target.value)}
                >
                  {animationList.map((val, index) => (
                    <MenuItem key={index} value={val}>
                      {val}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </div>
          </div>
          <div className="pu_input_wrapper">
            <label>Animation Duration (in ms)</label>
            <div className="pu_mui_slider" >
              <Slider
                aria-label="Animation Duration"
                value={animDuration}
                valueLabelDisplay="auto"
                onChange={(e) => setAnimDuration(e.target.value)}
                min={0}
                max={3000}
              />
              <input
                type="number"
                value={animDuration}
                onChange={(e) => setAnimDuration(e.target.value)}
                min={0}
                max={360}
              />
            </div>
          </div>
          
        </div>

        <div className="pu_input_wrapper_list">
         
          <div className="pu_input_wrapper">
            <label>Animation Speed Curve</label>
            <div className="pu_mui_select">
              <FormControl fullWidth>
                <Select
                  value={speedCurve}
                  onChange={(e) => setSpeedCurve(e.target.value)}
                >
                  {speedCurveList.map((val, index) => (
                    <MenuItem key={index} value={val}>
                      {val}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </div>
          </div>
          <div className="pu_input_wrapper">
            <label>Animation Delay (in ms)</label>
            <div className="pu_mui_slider">
              <Slider
                aria-label="Animation Delay"
                value={animDelay}
                valueLabelDisplay="auto"
                onChange={(e) => setAnimDelay(e.target.value)}
                min={0}
                max={3000}
              />
              <input
                type="number"
                value={animDelay}
                onChange={(e) => setAnimDelay(e.target.value)}
                min={0}
                max={360}
              />
            </div>
          </div>
        </div>
        <div className="pu_input_wrapper_list">
         
         <div className="pu_input_wrapper">
           <label>Animation Repeat</label>
           <div className="pu_mui_select">
             <FormControl fullWidth>
               <Select
                 value={animRepeat}
                 onChange={(e) => setAnimRepeat(e.target.value)}
               >
                 {["1","2","3","infinite"].map((val, index) => (
                   <MenuItem key={index} value={val}>
                     {val}
                   </MenuItem>
                 ))}
               </Select>
             </FormControl>
           </div>
         </div>
         </div>

        <button className="pu_btn" onClick={saveAnimationData}>
          Save Settings
        </button>
      </div>
    </div>
  );
}

export default AnimationSetting;
