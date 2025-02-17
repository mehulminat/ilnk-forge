import svg from "../../helper/svg";

const Alert = () => {
    return (
        <div className="pu_alert_wrapper">
            <p className="pu_alert_inner">
                <span className="pu_alert_icon error">{svg.alert_error}</span>
                <span className="pu_alert_icon success">{svg.alert_success}</span>
                <span className="pu_alert_content">
                    <span className="pu_alert_title"></span>
                    <span className="pu_alert_message"></span>
                </span>
                <span className="pu_alert_close"></span>
            </p>
        </div>
    );
}

export default Alert;