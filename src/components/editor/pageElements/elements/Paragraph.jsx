import { useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { saveSectionACT } from "../../../../redux/actions/editorAction";

import { Editor } from '@tinymce/tinymce-react';

const Paragraph = (props) => {
    let dispatch = useDispatch();
    const editorRef = useRef(null);
    const [pragraph, setPragraph] = useState(props.data.sectionData);

    const updateParagraph = (e) => {
        e.preventDefault();
        if(props.data.sectionData !== pragraph){
            const data = {...props.data};
            data.sectionData = pragraph;
            dispatch(saveSectionACT(data));
        }
    }

    return (
        <form onSubmit={(e) => updateParagraph(e)}>
            <div className="pu_input_wrapper">
                {/* <textarea rows="5" id={'el_' + props.data._id} className="pu_input" value={pragraph} onChange={(e) => setPragraph(e.target.value)} onBlur={(e) => updateParagraph(e)}></textarea> */}

                <Editor
                    apiKey= {process.env.tinymce_key}
                    onInit={(evt, editor) => editorRef.current = editor}
                    onEditorChange={(newText) => setPragraph(newText)}
                    onBlur={(e) => updateParagraph(e)}
                    value={pragraph}
                    init={{
                    height: 250,
                    menubar: false,
                    plugins: [
                        'advlist', 'lists'],
                    toolbar: 'bold italic | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | ',
                    content_style: 'body { font-family: Poppins, sans-serif; font-size:14px }'
                    }}
                />

            </div>
        </form>
    );
}

export default Paragraph;