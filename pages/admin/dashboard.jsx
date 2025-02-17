import { useState } from "react";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import LinkList from "../../src/components/admin/linklist/LinkList";
import { common } from "../../src/helper/Common";
import svg from "../../src/helper/svg";
import { setPageHeading } from "../../src/redux/actions/commonAction";

const Dashboard = () => {
    let dispatch = useDispatch();
    useEffect(() => {
        dispatch(setPageHeading({
            pageHeading: "Dashboard",
            title: "Dashboard",
        }));
    }, [dispatch]);
    const [monthlyVisitor, setMonthlyVisitor] = useState(0)
    const [weeklyClicks, setWeeklyClicks] = useState(0)
    const [weeklyVisitor, setWeeklyVisitor] = useState(0)
    const [linkCount, setLinkCount] = useState(0)
    useEffect(() => {
        common.getAPI(
            {
                method: "POST",
                url: 'admin/getDashboardAnalytics',
            },
            (resp) => {
                if(resp.status === "success"){
                    setMonthlyVisitor(resp.data.totalMonthlyVisitor)
                    setWeeklyClicks(resp.data.totalWeeklyClicks)
                    setWeeklyVisitor(resp.data.totalWeeklyVisitor)
                }
            }
        );

    }, []);

    return (
        <div className="pu_container">
            <div className="pu_pagetitle_wrapper">
                <h3>Overall Analytics</h3>
            </div>
            <div className="pu_analytics_white_box_list">
                <div className="pu_analytics_white_box">
                    <div className="pu_awb_icon">
                        {svg.analysis_click}
                    </div>
                    <div className="pu_awb_details">
         
                        <h3>{weeklyClicks}</h3>
                        <p>Weekly Clicks</p>
                    </div>
                </div>
                <div className="pu_analytics_white_box">
                    <div className="pu_awb_icon">
                        {svg.analysis_weekly_visitor}
                    </div>
                    <div className="pu_awb_details">
                        <h3>{weeklyVisitor}</h3>
                        <p>Weekly Visitor</p>
                    </div>
                </div>
                <div className="pu_analytics_white_box">
                    <div className="pu_awb_icon">
                        {svg.analysis_monthly_visitor}
                    </div>
                    <div className="pu_awb_details">
                        <h3>{monthlyVisitor}</h3>
                        <p>Monthly Visitor</p>
                    </div>
                </div>
                <div className="pu_analytics_white_box">
                    <div className="pu_awb_icon">
                        {svg.analysis_links}
                    </div>
                    <div className="pu_awb_details">
                        <h3>{linkCount}</h3>
                        <p>All Created Links</p>
                    </div>
                </div>
            </div>

            <div className="pu_pagetitle_wrapper">
                <h3>All Links ({linkCount})</h3>
            </div>
            <LinkList setLinkCount={setLinkCount} />

        </div>
    );
}
export default Dashboard;