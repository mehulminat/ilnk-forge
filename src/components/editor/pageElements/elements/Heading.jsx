import { useState } from "react";
import { useDispatch } from "react-redux";
import { saveSectionACT } from "../../../../redux/actions/editorAction";

const Heading = (props) => {
    let dispatch = useDispatch();
    const [heading, setHeading] = useState(props.data.sectionData);

    const updateHeading = (e) => {
        e.preventDefault();
        if(props.data.sectionData !== heading){
            const data = {...props.data};
            data.sectionData = heading;
            dispatch(saveSectionACT(data));
        }
    }
    return (
        <form onSubmit={(e) => updateHeading(e)}>
            <div className="pu_input_wrapper">
                    <input id={'el_' + props.data._id} type="text" className="pu_input" value={heading} onChange={(e) => setHeading(e.target.value)} onBlur={(e) => updateHeading(e)} />
            </div>
        </form>
    );
}

export default Heading;