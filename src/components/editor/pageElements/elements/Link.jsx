import { useEffect, useState } from "react";
import { connect, useDispatch } from "react-redux";
import { compose } from "redux";
import { saveSectionACT } from "../../../../redux/actions/editorAction";

const Link = (props) => {
    let dispatch = useDispatch();
    const [linkType, setLinkType] = useState('');
    const [name, setName] = useState('');
    const [link, setLink] = useState('');
    const [pageSlug, setPageSlug] = useState('');
    const [isPageEnable, setIsPageEnable] = useState(false);

    useEffect(() => {
        const data = props.data.sectionData;
        setLinkType(data.type);
        if(data.type === 'page'){
            setIsPageEnable(true);
        }else{
            setIsPageEnable(false);
        }
        setName(data.linkTitle);
        setLink(data.link);
        setPageSlug(data.pageSlug);
    }, [props]);

    const updateName = (e) => {
        if(props.data.sectionData.linkTitle !== name){
            const data = {...props.data};
            data.sectionData.linkTitle = e.target.value;
            dispatch(saveSectionACT(data));
        }
    }
    const typeChangeHandle = (ltype) => {
        if(ltype === 'page'){
            setIsPageEnable(true);
            setLinkType('page');
        }else{
            setIsPageEnable(false);
            setLinkType('link');
        }        
        const data = {...props.data};
        data.sectionData.type = ltype;
        dispatch(saveSectionACT(data));
    }
    const updateLink = (e) => {
        if(props.data.sectionData.link !== link){
            const data = {...props.data};
            data.sectionData.link = e.target.value;
            data.sectionData.type = linkType;
            dispatch(saveSectionACT(data));
        }
    }
    const updatePageSlug = (e) => {
        if(props.data.sectionData.pageSlug !== pageSlug){
            const data = {...props.data};
            data.sectionData.pageSlug = e.target.value;
            data.sectionData.type = linkType;
            dispatch(saveSectionACT(data));
        }
    }
    const updateOpenNewTab = (st) => {
        const data = {...props.data};
        data.sectionData.openNewTab = st;
        dispatch(saveSectionACT(data));
    }
    return (
        <>  
            <form onSubmit={(e) => updateName(e)}>
                <div className="pu_input_wrapper">
                    <label>Link Title</label>
                    <input id={'el_' + props.data._id} type="text" className="pu_input" defaultValue={props.data.sectionData.linkTitle} onChange={(e) => setName(e.target.value)} onBlur={(e) => updateName(e)} />
                </div>
            </form>
            <div className="pu_input_wrapper">
                <div className="pu_radio_list">
                    <div className={"pu_radio " + (linkType === 'link' ? 'pu_active_radio' : '')} onClick={(e) => typeChangeHandle('link')}>
                        <label htmlFor={"link_type_link" + props.data._id}>Link</label>
                    </div>
                    <div className={"pu_radio " + (linkType === 'page' ? 'pu_active_radio' : '')} onClick={(e) => typeChangeHandle('page')}>
                        <label htmlFor={"link_type_page" + props.data._id}>Page</label>
                    </div>
                </div>
            </div>
            {isPageEnable === false ?
                <>
                    <form onSubmit={(e) => updateLink(e)}>
                        <div className="pu_input_wrapper">
                            <label>Link</label>
                            <input type="text" className="pu_input" defaultValue={props.data.sectionData.link} onChange={(e) => setLink(e.target.value)} onBlur={(e) => updateLink(e)} />
                        </div>
                    </form>
                    <div className="pu_input_wrapper">
                        <div className="pu_switch">
                            <input 
                                type="checkbox" 
                                id={'link_open_'+ props.data._id} 
                                defaultChecked={props.data.sectionData.openNewTab === true ? true : false}
                                onClick={(e) => updateOpenNewTab(props.data.sectionData.openNewTab === false ? true : false)} 
                            />
                            <label htmlFor={'link_open_'+ props.data._id}>
                                <div className="pu_switch_icon"></div>
                                <span className="pu_switch_text">Open in a New Tab</span>
                            </label>
                        </div>
                    </div>
                </> : null
            }
            {isPageEnable === true ?
                <div className="pu_input_wrapper">
                    <label>Select Page</label>
                    <select className="pu_input" onBlur={(e) => updatePageSlug(e)} defaultValue={props.data.sectionData.pageSlug} onChange={(e) => setPageSlug(e.target.value)}>
                        {props.pages.map(page =>
                            <option key={page._id} value={page.slug}>{page.title}</option>                        
                        )}
                    </select>
                </div> : null
            }
        </>
    );
}

const mapStateToProps = (state) => {
    return {
		pages : state.editor.pages
	};
};
export default compose(connect(mapStateToProps , null))(Link)