import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import ElementPreview from "../../../src/components/editor/elementPreview";
import { common } from "../../../src/helper/Common";
import svg from "../../../src/helper/svg";
import { setPageHeading } from "../../../src/redux/actions/commonAction";

const PreviewTemplate = () => {
    let dispatch = useDispatch();

    useEffect(() => {
        dispatch(setPageHeading({
            pageHeading: "Loading...",
            title: "Loading...",
        }));
    }, [dispatch, setTempData]);

    const router = useRouter();
    document.body.style.zIndex = 1;
    document.body.style.backgroundColor = 'transparent';
    const [tempData, setTempData] = useState('');

    //0=not available, 1=available with status
    const [linkStatus, setLinkStatus] = useState('');
    
    useEffect(() => {
        if (router.pathname.split('/preview/[template_id]/[id]').length > 1) {
            var pageSlug = router.query.id;   
            var templateId = router.query.template_id;
            if(templateId && pageSlug){
                common.getAPI({
                    method: 'POST',
                    url: 'preview/getTemplatePage',
                    data: {
                        template_id : templateId,
                        page_slug : pageSlug,
                        action : "previewPage"
                    }
                }, (resp) => {
                    if(resp.status === 'success'){
                        if(resp.data){
                            if(resp.data?.isAdmin) {
                                setLinkStatus(1);
                            } else {
                                setLinkStatus(resp.data.template.status);
                            }
                            setTempData(resp.data);
                            dispatch(setPageHeading({
                                pageHeading: "DFY Templates Preview ~ " + resp.data.page.title,
                                title: "DFY Templates Preview ~ " + resp.data.page.title,
                            }));
                        }
                    }else{
                        setLinkStatus(0);
                    }
                });
            }
        }
    }, [router.query]);

    if(linkStatus !== ''){
        if(linkStatus === 0){
            return (
                <>
                    <div className="pu_noData">
                        <span>{svg.noData}</span>
                        <h3>No Records Found.</h3>
                        <p>Create a new link, OR connect with admin.</p>
                    </div>
                </>
            )
        }else{
            return (
                <>
                    {tempData ? 
                        <ElementPreview {...tempData} /> : null
                    }
                </>
            );
        }
        
    }else{
        return null;
    }
    
}
export default PreviewTemplate;
