import { useDispatch } from "react-redux";
import { saveSectionACT } from "../../../../redux/actions/editorAction";

const Profile = (props) => {
    let dispatch = useDispatch();
    const updateName = (e) => {
        const data = {...props.data};
        data.sectionData.name = e.target.value;
        dispatch(saveSectionACT(data));
    }
    
    return (
        <div className="pu_input_wrapper">
            <label>Full Name</label>
            <input type="text" className="pu_input" defaultValue={props.data.sectionData.name} onBlur={(e) => updateName(e)} />
        </div>
    );
}

export default Profile;