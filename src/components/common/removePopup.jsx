import { useEffect } from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { confirmPopupStatus, removeMe } from '../../redux/actions/commonAction'
import Popup from './popup/Popup';

const RemovePopup = (props) => {
    useEffect(() => {
        props.confirmPopupStatus(false)
    }, []);

    const closeDeletePopup = () => {
        props.confirmPopupStatus(false)
    }

    return (
        <Popup
            heading={"Delete " + (props.common.removeData.type ? props.common.removeData.type : 'Loading')}
            show={props.common.removeModalStatus}
            onClose={closeDeletePopup}
        >
            <p style={{ textAlign:'center'}}>Are you sure you want to delete this {props.common.removeData.type}?<br/> This action cannot be undone.</p><br/>
            <div style={{ display: 'flex', gap: 10, justifyContent: 'center' }}>
                <button type="button" className="pu_btn pu_btn_gray" onClick={closeDeletePopup} >Cancel</button>
                <button type="button" className="pu_btn" onClick={() => props.removeMe(props.common.removeData)}>Delete</button>
            </div>
        </Popup>
    );
}

const mapStateToProps = (state) => {
    return {
		...state,
	};
};

const mapDispatchToProps = (dispatch) => {
	return {
        confirmPopupStatus: (params) => dispatch( confirmPopupStatus(params) ),
        removeMe: (params) => {
            dispatch(removeMe(params))
        },
	};
};

export default compose(connect(mapStateToProps , mapDispatchToProps))(RemovePopup)