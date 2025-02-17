import Link from "next/link";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import LinkList from "../src/components/common/linklist/LinkList";
import { setPageHeading } from "../src/redux/actions/commonAction";
import { common } from "../src/helper/Common";
import PlanAlert from "../src/components/common/PlanAlert";

const MyLinks = () => {
    let dispatch = useDispatch();
    useEffect(() => {
        dispatch(setPageHeading({
            pageHeading: "PixaURL - My Links",
            title: "PixaURL - My Links",
        }));
    }, [dispatch]);
    const [linkCount, setLinkCount] = useState('0');
    const [showAlertBar, setShowAlertBar] = useState(false);

    const alertBarCloseHandler = () => {
        setShowAlertBar(false);
    }
    const getCurrentPlan = () => {
        common.getAPI({
          method: 'POST',
          url: 'user/getCurrentPlan',
          data: {}
        }, (resp) => {
          if (resp.status === "success") {
            if(resp.data?.adminPlanStatus) {
              if(resp.data.isPlan && resp.data.isExpired) {
                setShowAlertBar(true);
              }
            }
          }
        })
    }
    
    useEffect(() => {
        getCurrentPlan();
    }, []);

    return (
        <div className="pu_container">
            <PlanAlert show={showAlertBar} onClose={alertBarCloseHandler} />
            <div className="pu_pagetitle_wrapper">
                <h3>My Links ({linkCount})</h3>
                <div className="pu_pagetitle_right">
                    {/* <div className="pu_search_wrapper">
                        <input type="text" placeholder="Search"/>
                        <span className="pu_search_icon">{svg.search_icon}</span>
                    </div> */}
                    <Link href="/templates"><a className="pu_btn">Add New</a></Link>
                    {/* <CreateLink>
                    </CreateLink> */}
                </div>
            </div>
            <LinkList setLinkCount={setLinkCount} />
        </div>
    );
}
export default MyLinks;
