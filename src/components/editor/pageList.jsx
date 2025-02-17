import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { connect, useDispatch } from 'react-redux';
import { compose } from 'redux';
import styles from '../../../styles/editor/pageList.module.css';
import svg from '../../helper/svg';
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { addPageACT, contentPlaceholder, editorAutoSaveStatus, getPageDataACT, getSectionListACT, reorderPageListACT, updateActivePage, updatePageListACT } from '../../redux/actions/editorAction';
import validator from 'validator';
import { AlertMsg } from '../../helper/helper';
import { common } from '../../helper/Common';
import ContentLoader from 'react-content-loader';

const PageList = (props) => {
    let dispatch = useDispatch();
    const router = useRouter();
    const [pageName, setPageName] = useState('');
    const [pageList, setPageList] = useState([]);
    const [activePage, setActivePage] = useState(props.pageData ? props.pageData._id : '');

    const [firstPage, setFirstPage] = useState('');
    
    /* update page state start */
    useEffect(() => {
        const propPages = props.pages;
        if(propPages.length){
            setPageList(propPages);
        }
        /* active home page after action start */
        if(props.updateActivePage === true){
            pageClickHandle(propPages[0]);
            dispatch(updateActivePage(false));
        }
        /* active home page after action end */
    }, [props]);
    /* update page state end */

    useEffect(() => {
        if(pageList.length){
            setActivePage(pageList[0]._id);
            setFirstPage(pageList[0]);
        }
    }, [pageList]);

    const handlePageNameChange = (e) => {
        setPageName(e.target.value);
    }

    /* add page submit start */
    const pageNameSubmit = (e) => {
        e.preventDefault();
        const emptyPageName = validator.isEmpty(pageName, {ignore_whitespace:true});
        if(emptyPageName){
            AlertMsg('error', 'Oops!', 'Field can not be empty!');
            return false;
        }else{
            if(props.templateId){
                const data = {
                    name : pageName,
                    id : props.templateId
                }
                dispatch(addPageACT(data));
                dispatch(editorAutoSaveStatus(true));
                setPageName('');
            }
        }
    }
    /* add page submit end */

    // a little function to help us with reordering the result
    const reorder = (list, startIndex, endIndex) => {
        const result = Array.from(list);
        const [removed] = result.splice(startIndex, 1);
        result.splice(endIndex, 0, removed);
        return result;
    };
    const pageDragHandle = (result) => {
        if (!result.destination) {
            return;
        }
        const items = reorder(
            pageList,
            result.source.index,
            result.destination.index
        );
        setPageList(items);
        /* send page list to store start */
        dispatch(editorAutoSaveStatus(true));
        dispatch(reorderPageListACT(items));
        /* send page list to store end */
    }

    
    const isActive = (id) => {
        if(id == activePage){
            return styles.active
        }
        else ""
    }

    const pageClickHandle = (page) => {
        setActivePage(page._id);
        dispatch(getPageDataACT(page));
        dispatch(getSectionListACT(page));
    }

    return (
        <>
            <div className={styles.page_list_heading}>
                {svg.editor_page_icon}
                <p>Pages</p>
                <span>{pageList ? pageList.length : '0'}</span>
            </div>
            
            <div className={styles.page_list}>
                {!props.content_placeholder.pages ? 
                    <>
                        <DragDropContext onDragEnd={pageDragHandle}>
                            <Droppable droppableId="droppable">
                                {(provided, snapshot) => (
                                    <div 
                                        {...provided.droppableProps}
                                        ref={provided.innerRef}
                                    >
                                        {pageList.map((page, index) => 
                                            <Draggable key={page._id} draggableId={(page._id).toString()} index={index}>
                                                {(provided, snapshot) => (
                                                    <div 
                                                        ref={provided.innerRef}
                                                        {...provided.draggableProps}
                                                        className={styles.page_item +' '+ (isActive(page._id))}
                                                        onClick={() => pageClickHandle(page)}
                                                        title={page.slug}
                                                    >
                                                        {page.title}
                                                        <span className={styles.page_drag_icon} {...provided.dragHandleProps}>
                                                            <span></span>
                                                            <span></span>
                                                        </span>
                                                    </div>
                                                )}
                                            </Draggable>
                                        )}
                                        {provided.placeholder}
                                    </div>
                                )}
                            </Droppable>
                        </DragDropContext>
                    </>
                    : 
                    <>
                        <ContentLoader viewBox="0 0 220 164">
                            <rect x="0" y="0" rx="8" ry="8" width="220" height="48" />
                            <rect x="0" y="58" rx="8" ry="8" width="220" height="48" />
                            <rect x="0" y="116" rx="8" ry="8" width="220" height="48" />
                        </ContentLoader><br/><br/>
                    </> 
                }
                
                <form onSubmit={(e) => pageNameSubmit(e)}>
                    <div className={styles.add_page}>
                        <span className={styles.add_page_icon}></span>
                            <input type="text" placeholder="Add New Page" value={pageName} onChange={(e) => handlePageNameChange(e)} />
                    </div>
                    {pageName !== '' ? <button type="submit" className="pu_btn pu_btn_block">Add Page</button> : null}
                </form>
            </div>
        </>
    );
}

const mapStateToProps = (state) => {
    return {
		...state.editor,
	};
};
export default compose(connect(mapStateToProps , null))(PageList)