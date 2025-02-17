import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import ElementPreview from "../../src/components/editor/elementPreview";
import { common } from "../../src/helper/Common";
import { setPageHeading } from "../../src/redux/actions/commonAction";
import Cookies from "js-cookie";
import svg from "../../src/helper/svg";
import ErrorComp from "../../src/components/common/404/404";
import Link from "next/link";

const PreviewTemplate = () => {
    const router = useRouter();
    let dispatch = useDispatch();
    const [tempData, setTempData] = useState('');

    //0=not available, 1=available with status
    const [linkStatus, setLinkStatus] = useState('');

    const [show404, setShow404] = useState(false);
    const store = useSelector(store => store);
    const [ hasExpired, setExpired] = useState(false)
    useEffect(() => {
        dispatch(setPageHeading({
            pageHeading: "Loading...",
            title: "Loading...",
        }));
        if (router.pathname === '/[link_preview]') {
            var linkSlug = router.query.link_preview;
            if(linkSlug){
                /* track if new visitor start */
                const vc_item = router.asPath;
                var isVisitor = false;
                if(Cookies.get('visitordata')){
                    const cdata = [...JSON.parse(Cookies.get('visitordata'))];
                    var findcItem = cdata.find(item => item === vc_item);
                    if(findcItem === undefined){
                        isVisitor = true;
                        cdata.push(vc_item);
                        Cookies.set('visitordata', JSON.stringify(cdata));
                    }
                }else{
                    isVisitor = true;
                    Cookies.set('visitordata', JSON.stringify([vc_item]));
                }
                /* track if new visitor end */

                common.getAPI({
                    method: 'POST',
                    url: 'preview/getTemplatePage',
                    data: {
                        link_slug : linkSlug,
                        page_slug : 'home',
                        isVisitor : isVisitor,
                    }
                }, (resp) => {
                    if(resp.status === 'success'){
                        if(resp.data == 0){
                            if(store.userData.user_id) {
                                if(resp.userid == store.userData.user_id){
                                    setExpired(true)
                                } else {
                                    setShow404(true);
                                }
                            } else {
                                setShow404(true);
                            }
                            dispatch(setPageHeading({
                                title: 'PixaURL',
                                pageHeading: 'PixaURL',
                            }));
                        }
                        if(resp.data){
                            setTempData(resp.data);
                            var pageTitle = '', pageDescription = '', pageKeywords = '';
                            if(resp.data.page.seoData){
                                pageTitle = resp.data.page.seoData.title;
                                pageDescription = resp.data.page.seoData.description;
                                pageKeywords = resp.data.page.seoData.tags;
                                var keywordsList = pageKeywords.join(', ');
                                pageKeywords = keywordsList;
                            }else{
                                pageTitle = resp.data.template.profile.name + '-' + resp.data.template.profile.tagline;
                            }
                            setLinkStatus(resp.data.template.status);
                            dispatch(setPageHeading({
                                title: pageTitle,
                                description : pageDescription,
                                keywords : pageKeywords,
                                pageHeading: pageTitle,
                            }));
                        }
                    }
                }, (resp) => {

                    if(resp.status === 'error'){
                        setShow404(true);
                        dispatch(setPageHeading({
                            title: 'PixaURL - Page Not Found',
                            pageHeading: 'PixaURL - Page Not Found',
                        }));
                    }
                });
            }
        }
    }, [router.query]);

    if(hasExpired == true){ 

        return (
            <>
                <div className="pu_noData">
                    <span>{svg.noData}</span>
                    <p>You do not have any active plan. Purchase a new plan to access the link.</p>
                    <button className="pu_btn " style={{marginTop : "10px"}}><Link href={'/checkout'}>Buy new plan</Link></button>
                </div>
            </>
        )
    }

    if(linkStatus !== ''){
        if(linkStatus === 0){
            return (
                <>
                    <div className="pu_noData">
                        <span>{svg.noData}</span>
                        <h3>No Records Found.</h3>
                        <p>Create a new link, OR connect with link admin.</p>
                        
                    </div>
                </>
            )
        }else{
            return (
                <>
                    {tempData ? 
                        <ElementPreview linkSlug={router.query.link_preview} {...tempData} editorPreview={false} /> : null
                    }
                </>
            );
        }
    }else{
        if(show404 === true){
            return <ErrorComp />;
        }else{
            return null;
        }
    }
}

export default PreviewTemplate;
