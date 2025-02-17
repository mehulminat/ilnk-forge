const db = {};

import Users from './User';
import Campaign from './Campaign';
import Template from './Template';
import TemplateCategory from './TemplateCategory';
import TemplatePage from './TemplatePage';
import TemplateSection from './TemplateSection';
import CampaignLink from './CampaignLink';
import CampaignLinkDetail from './CampaignLinkDetail';
import CampaignVisit from './CampaignVisit';
import CampaignVisitDetail from './CampaignVisitDetail';
import CampaignPageVisit from './CampaignPageVisit';
import CampaignPageVisitDetail from './CampaignPageVisitDetail';
import CampaignPage from './CampaignPage';
import CampaignSection from './CampaignSection';
import Theme from './Theme';
import SocialType from './SocialType';
import SocialPack from './SocialPack';
import Plans from './Plan';
import AdminSettings from './AdminSettings';
import OrderList from './OrderList';
import AutoIncreament from './AutoIncrement';
import Coupons from './Coupons';
import BillingModel from './OrderList';
// Models/tables
db.Users = Users;
db.Campaigns = Campaign;
db.Templates = Template;
db.TemplateCategory = TemplateCategory;
db.TemplatePage = TemplatePage;
db.TemplateSection = TemplateSection;
db.CampaignLink = CampaignLink;
db.CampaignLinkDetail = CampaignLinkDetail;
db.CampaignVisit = CampaignVisit;
db.CampaignVisitDetail = CampaignVisitDetail;
db.CampaignPageVisit = CampaignPageVisit;
db.CampaignPageVisitDetail = CampaignPageVisitDetail;
db.CampaignPage = CampaignPage;
db.CampaignSection = CampaignSection;
db.Theme = Theme;
db.SocialType = SocialType;
db.SocialPack = SocialPack;
db.Plans = Plans;
db.AdminSettings = AdminSettings;
db.OrderList = OrderList;
db.AutoIncreament = AutoIncreament;
db.Coupons = Coupons;
db.BillingModel = BillingModel
// for first time when tables are empty
for (let collectionname in db) {
	db[collectionname].createCollection();
}

module.exports = db;
