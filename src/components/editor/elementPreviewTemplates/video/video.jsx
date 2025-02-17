
import style from './video.module.css'
function VideoPreview(props) {
 

  if (props.item.sectionData?.url) {
    return (
      <div className={(props.item?.animation ? `animate__animated animate__${(props.item?.animation?.animationRepeat?.length == 1) ? `repeat-${props.item?.animation.animationRepeat}` : props.item?.animation.animationRepeat}  animate__${props.item?.animation.name}` :"")}
      style={{
          animationDuration: props.item?.animation ? `${props.item?.animation?.animationDuration}ms` : "",
          animationDelay: props.item?.animation ? `${props.item?.animation?.animationDelay}ms` : "",
      }}>
        
          <div className={props.isEditorPreview ? style.editor_video_wrap   : style.video_wrap}>
          <iframe
            title="video-player"
            src={props.item.sectionData.url}
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen='1'
          ></iframe>
          
          </div>
      </div>
    );
  } else {
    return null;
  }
}

export default VideoPreview;
