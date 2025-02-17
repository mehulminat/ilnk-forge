import React, { useEffect, useState } from "react";
import validator from "validator";
import { AlertMsg } from "../../../../helper/helper";
import { useDispatch } from "react-redux";
import { saveSectionACT } from "../../../../redux/actions/editorAction";
import svg from "../../../../helper/svg";
import style from "../../../../../styles/elements/videoElement.module.css"

function Video(props) {
  const [videoType, setVideoType] = useState("YouTube");
  const [vimeoVideo, setVimeoVideo] = useState("");
  const [youTubeVideo, setYouTubeVideo] = useState("");

  let dispatch = useDispatch();

  useEffect(() => {
    if (props.data.sectionData.title.split(" ")[0] == "Vimeo") {
      setVideoType("Vimeo");
      setVimeoVideo(props.data.sectionData.url);
    } else {
      setVideoType("YouTube");
      setYouTubeVideo(props.data.sectionData.url);
    }
  }, []);

  const handleUploadVideo = () => {
    const VimeoEmpty = validator.isEmpty(vimeoVideo, {
      ignore_whitespace: true,
    });
    const YouTubeEmpty = validator.isEmpty(youTubeVideo, {
      ignore_whitespace: true,
    });

    if (videoType == "YouTube") {
      if (YouTubeEmpty) {
        AlertMsg("error", "Oops!", "URL Field can not be empty!");
        return false;
      }
      let isVAlid = youTubeVideo.includes("youtube.com") || youTubeVideo.includes("youtu.be");
      if (!isVAlid) {
        AlertMsg("error", "Oops!", "Invalid YouTube URL!");
        return false;
      }
      const match = youTubeVideo.match(
        /(?:[?&]v=|\/embed\/|\/live\/)([a-zA-Z0-9_-]+)/
      );
      if (match) {
        const videoID = match[1];
        var url = `https://www.youtube.com/embed/${videoID}`;
      }
    }

    if (videoType == "Vimeo") {
      if (VimeoEmpty) {
        AlertMsg("error", "Oops!", "URL Field can not be empty!");
        return false;
      }
      let isVAlidVimeo =
      vimeoVideo.includes("vimeo.com") || vimeoVideo.includes("player.vimeo.com");
      if (!isVAlidVimeo) {
        AlertMsg("error", "Oops!", "Invalid Vimeo URL!");
        return false;
      }
      const matchVimeo = vimeoVideo.match(/vimeo\.com\/(\d+)|video\/(\d+)/);
      if (matchVimeo) {
        const videoID = matchVimeo[1] || matchVimeo[2];
        var url = `https://player.vimeo.com/video/${videoID}`;
      }
    }
    const data = { ...props.data };
    data.sectionData = { title: `${videoType} Video`, url: url };
    dispatch(saveSectionACT(data));
  };

  return (
    <div>
      <div className={style.vedio_element_btn_wrapper}>
        <div className={`${style.btn_box}  ${videoType == "YouTube" && style.active_btn}`}  onClick={() => setVideoType("YouTube")}>{svg.youTubeIcon} YouTube</div>
        <div className={`${style.btn_box}  ${videoType == "Vimeo" && style.active_btn}`}  onClick={() => setVideoType("Vimeo")}>{svg.VimeoIcon} Vimeo</div>
      </div>
      <div className={`pu_input_wrapper_list`}>
        <div className={`pu_input_wrapper`} style={{ flex: 2 }}>
          {
            <input
              type="text"
              value={videoType == "YouTube" ? youTubeVideo : vimeoVideo}
              className="pu_input"
              placeholder={
                videoType == "YouTube"
                  ? "Enter YouTube video URL ."
                  : "Enter Vimeo video URL ."
              }
              onChange={(e) => {
                videoType == "YouTube"
                  ? setYouTubeVideo(e.target.value)
                  : setVimeoVideo(e.target.value);
              }}
            />
          }
        </div>

        <div className="text-center" style={{ marginBottom: "25px" }}>
          <button type="submit" className="pu_btn" onClick={handleUploadVideo}>
            Upload
          </button>
        </div>
      </div>
    </div>
  );
}

export default Video;
