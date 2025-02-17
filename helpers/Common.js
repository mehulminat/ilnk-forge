import Jwt from 'jsonwebtoken';
import { 
	Users,
	Campaigns,
	CampaignLink,
	CampaignLinkDetail,
	CampaignVisit,
	CampaignVisitDetail,
	CampaignPageVisit,
	CampaignPageVisitDetail,
	CampaignPage,
	CampaignSection,
	TemplatePage,
	TemplateSection
} from '../models/DB';

const Common = {};

Common.getUserByJwt = (token) => {
	return new Promise((resolve, reject) => {
		let decoded = Jwt.verify(token, process.env.SESSION_SECRET);
		// Fetch the user by id
		Users.findOne({ _id: decoded.user_id })
			.then((user) => {
				resolve(user);
			})
			.catch(reject);
	});
}

Common.getShortName = (name) => {
	let s = name.split(" ");
	let nm = "";
	s.forEach((n) => {
		nm += n[0];
	});
	return nm;
}

Common.replaceItemByObj = (str = "", obj) => {
	var keys = Object.keys(obj);
	keys.forEach((e) => {
		str = str.replaceAll(e, obj[e]);
	});
	return str;
}

Common.requestFieldsValidation = async (fields, postData) => {
	let flag = {status: true, message: ''};
	if(fields.length) {
		for (let field of fields) {
			if(typeof postData[field] == 'undefined' || postData[field] === "") {
				flag.status = false;
			}
		}
	}
	return flag;
}

Common.isSpecialCharsPresent = (string) => {
	let format = /[`!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/;
	return format.test(string);
}

Common.getCurrentDate = () => {
	let today = new Date();
	let dd = today.getDate();
	let mm = today.getMonth()+1; 
	let yyyy = today.getFullYear();
	if(dd<10) 
	{
		dd='0'+dd;
	} 
	if(mm<10) 
	{
		mm='0'+mm;
	} 
	today = yyyy+'-'+mm+'-'+dd;
	return today;
}

Common.deleteCampaignDBData = async (params) => {
	try {
		await CampaignLink.deleteMany({ templateId: params.campaignId });
		await CampaignLinkDetail.deleteMany({ templateId: params.campaignId });
		await CampaignVisit.deleteMany({ templateId: params.campaignId });
		await CampaignVisitDetail.deleteMany({ templateId: params.campaignId });
		await CampaignPageVisit.deleteMany({ templateId: params.campaignId });
		await CampaignPageVisitDetail.deleteMany({ templateId: params.campaignId });
		await CampaignPage.deleteMany({ templateId: params.campaignId });
		await CampaignSection.deleteMany({ templateId: params.campaignId });

		return {status: 'success', message: 'Records deleted successfully.'};
	}catch(err) {
		return {status: 'error', message: err};
	}
}

Common.deleteUserDBData = async (params) => {
	try {
		await Campaigns.deleteMany({ userId: params.userId });
		await CampaignLink.deleteMany({ userId: params.userId });
		await CampaignLinkDetail.deleteMany({ userId: params.userId });
		await CampaignVisit.deleteMany({ userId: params.userId });
		await CampaignVisitDetail.deleteMany({ userId: params.userId });
		await CampaignPageVisit.deleteMany({ userId: params.userId });
		await CampaignPageVisitDetail.deleteMany({ userId: params.userId });
		await CampaignPage.deleteMany({ userId: params.userId });
		await CampaignSection.deleteMany({ userId: params.userId });

		return {status: 'success', message: 'Records deleted successfully.'};
	}catch(err) {
		return {status: 'error', message: err};
	}
}

Common.deleteTemplateDBData = async (params) => {
	try {
		await TemplatePage.deleteMany({ templateId: params.templateId });
		await TemplateSection.deleteMany({ templateId: params.templateId });

		return {status: 'success', message: 'Records deleted successfully.'};
	}catch(err) {
		return {status: 'error', message: err};
	}
}

export default Common;
