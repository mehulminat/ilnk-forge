import { CircularProgress } from '@mui/material';
import { connect } from 'react-redux';
import { compose } from 'redux';

import styles from '../../../styles/common/autoSave.module.css';
import { editorAutoSave } from '../../redux/actions/editorAction';

const autoSaveLoader = (props) => {
    if(props.editor.autoSaveStatus === true) {
        return (
            <>
                <div className={styles.autosave +' '+ styles.saving}>
                    <CircularProgress
                        size={20}
                        thickness={3}
                    />
                    <p>Saving</p>
                </div>
            </>
        );
    }else{
        return (
            <>
                <div className={styles.autosave +' '+ styles.saved}>
                    <svg width="26" height="16" viewBox="0 0 26 16" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M20 16H7C5.49267 16.0008 4.04022 15.4344 2.93152 14.4132C1.82283 13.392 1.13912 11.9909 1.01637 10.4886C0.893621 8.98623 1.34083 7.49274 2.26906 6.30511C3.19729 5.11749 4.53852 4.32275 6.026 4.07895C6.72322 2.8424 7.73623 1.81312 8.96151 1.09628C10.1868 0.379455 11.5804 0.000778932 13 -0.00104575C14.8021 -0.00763077 16.5526 0.600896 17.962 1.72395C19.3461 2.82181 20.3301 4.34493 20.762 6.05795C22.0078 6.24937 23.1353 6.90422 23.9189 7.89142C24.7025 8.87863 25.0843 10.1253 24.988 11.3821C24.8917 12.6388 24.3243 13.8127 23.3994 14.669C22.4745 15.5252 21.2604 16.0006 20 16V16ZM13 1.99995C11.935 2.00121 10.8894 2.28526 9.97015 2.82307C9.0509 3.36089 8.29095 4.13316 7.768 5.06095L7.3 5.89995L6.35 6.05495C5.36127 6.22061 4.47079 6.7515 3.85487 7.5425C3.23896 8.33351 2.94253 9.32695 3.02428 10.3261C3.10602 11.3253 3.55998 12.2574 4.29627 12.9377C5.03256 13.6181 5.99749 13.9972 7 14H20C20.7563 14.0007 21.4849 13.7159 22.0401 13.2024C22.5953 12.6889 22.9361 11.9846 22.9942 11.2306C23.0524 10.4766 22.8236 9.72845 22.3537 9.1359C21.8838 8.54335 21.2074 8.15013 20.46 8.03495L19.144 7.83495L18.822 6.54295C18.499 5.24393 17.75 4.0906 16.6947 3.26712C15.6394 2.44364 14.3386 1.9975 13 1.99995V1.99995ZM11.528 12.71L8.028 9.20995L9.438 7.79995L11.528 9.88995L16.128 5.28995L17.538 6.69995L11.528 12.709V12.71V12.71Z" fill="black"/></svg>
                    <p>Saved</p>
                </div>
            </>
        );
    }
}

const mapStateToProps = (state) => {
    return {
		...state,
	};
};

/* const mapDispatchToProps = (dispatch) => {
	return {
        editorAutoSave: (params) => dispatch(editorAutoSave(params)),
	};
}; */

export default compose(connect(mapStateToProps , null))(autoSaveLoader)