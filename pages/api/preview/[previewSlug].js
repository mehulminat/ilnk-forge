import requestIp from "request-ip";
import dbConnect from '../../../lib/dbConnect';
import { 
  Users,
  Templates,
	TemplatePage,
	TemplateSection,
  Campaigns,
  CampaignPage,
  CampaignSection,
  CampaignVisit,
  CampaignVisitDetail,
  CampaignPageVisit,
  CampaignPageVisitDetail,
  CampaignLink,
  CampaignLinkDetail,
  AdminSettings
} from '../../../models/DB';
import Common from "../../../helpers/Common";
import moment from "moment";
import CommonAPI from "../../../helpers/CommonAPI";
const routeHandler = {}

const updateVisitorAnalytics = async (templatePageData, otherData) => {
  let today = Common.getCurrentDate();
  let sDate = new Date(today+` 00:00:00`);
  let eDate = new Date(today+` 23:59:59`);

  // Campaign Visit 
  let where = {
    templateId: templatePageData.templateId,
  };
  let visitData = await CampaignVisit.findOne(where);
  if(visitData && typeof visitData._id != 'undefined') {
    let visitCount = visitData.visitCount + 1;
    await CampaignVisit.updateOne(where, {
      $set: { visitCount: visitCount },
    }).then(() => {
      //console.log("Update visit");
    });
  }else {
    let visitFields = {
      userId: templatePageData.userId,
      templateId: templatePageData.templateId,
      visitCount: 1
    };
    await CampaignVisit.create(visitFields).then((visitresult) => {
      //console.log("Create visit");
    });
  }

  // Campaign Visit Detail
  let where2 = {
    templateId: templatePageData.templateId,
    createdAt: {
      $gte: sDate,
      $lt: eDate
    }
  };
  let visitDetailsData = await CampaignVisitDetail.findOne(where2);
  if(visitDetailsData && typeof visitDetailsData._id != 'undefined') {
    let visitDetailCount = visitDetailsData.visitCount + 1;
    await CampaignVisitDetail.updateOne({_id: visitDetailsData._id}, {
      $set: { visitCount: visitDetailCount },
    }).then(() => {
      //console.log("Update visitDetail");
    });
  }else {
    let visitDetailFields = {
      userId: templatePageData.userId,
      templateId: templatePageData.templateId,
      visitCount: 1,
      ipAddress: otherData.clientIp
    };
    await CampaignVisitDetail.create(visitDetailFields).then((visitDetailresult) => {
      //console.log("Create visitDetail");
    });
  }

  // Campaign Page Visit 
  let where3 = {
    templateId: templatePageData.templateId,
    pageId: templatePageData._id
  };
  let visitPageData = await CampaignPageVisit.findOne(where3);
  if(visitPageData && typeof visitPageData._id != 'undefined') {
    let visitPageCount = visitPageData.visitCount + 1;
    await CampaignPageVisit.updateOne(where3, {
      $set: { visitCount: visitPageCount },
    }).then(() => {
      //console.log("Update visit page");
    });
  }else {
    let visitPageFields = {
      userId: templatePageData.userId,
      templateId: templatePageData.templateId,
      pageId: templatePageData._id,
      visitCount: 1
    };
    await CampaignPageVisit.create(visitPageFields).then((visitpageresult) => {
      //console.log("Create visit page");
    });
  }

  // Campaign Visit Detail
  let where4 = {
    templateId: templatePageData.templateId,
    pageId: templatePageData._id,
    createdAt: {
      $gte: sDate,
      $lt: eDate
    }
  };
  let visitPageDetailsData = await CampaignPageVisitDetail.findOne(where4);
  if(visitPageDetailsData && typeof visitPageDetailsData._id != 'undefined') {
    let visitPageDetailCount = visitPageDetailsData.visitCount + 1;
    await CampaignPageVisitDetail.updateOne({_id: visitPageDetailsData._id}, {
      $set: { visitCount: visitPageDetailCount },
    }).then(() => {
      //console.log("Update visitDetail");
    });
  }else {
    let visitPageDetailFields = {
      userId: templatePageData.userId,
      templateId: templatePageData.templateId,
      pageId: templatePageData._id,
      visitCount: 1,
      ipAddress: otherData.clientIp
    };
    await CampaignPageVisitDetail.create(visitPageDetailFields).then((visitPageDetailresult) => {
      //console.log("Create visitDetail");
    });
  }
}

const updateClickAnalytics = async (templatePageData, otherData) => {
  let today = Common.getCurrentDate();
  let sDate = new Date(today+` 00:00:00`);
  let eDate = new Date(today+` 23:59:59`);

  // Campaign Link 
  let where = {
    templateId: templatePageData.templateId,
    pageId: templatePageData._id,
    url: otherData.linkUrl
  };
  let linkData = await CampaignLink.findOne(where);
  if(linkData && typeof linkData._id != 'undefined') {
    let visitCount = linkData.visitCount + 1;
    await CampaignLink.updateOne(where, {
      $set: { visitCount: visitCount },
    }).then(() => {
      //console.log("Update link");
    });

    // Campaign link Detail
    let where2 = {
      linkId: linkData._id,
      createdAt: {
        $gte: sDate,
        $lt: eDate
      }
    };
    let linkDetailsData = await CampaignLinkDetail.findOne(where2);
    if(linkDetailsData && linkDetailsData._id != 'undefined') {
      let linkDetailsCount = linkDetailsData.visitCount + 1;
      await CampaignLinkDetail.updateOne({_id: linkDetailsData._id}, {
        $set: { visitCount: linkDetailsCount },
      }).then(() => {
        //console.log("Update linkDetail");
      });
    }else {
      let linkDetailFields = {
        userId: templatePageData.userId,
        templateId: templatePageData.templateId,
        pageId: templatePageData._id,
        linkId: linkData._id,
        visitCount: 1
      };
      await CampaignLinkDetail.create(linkDetailFields).then((linkDetailresult) => {
        //console.log("Create linkDetail");
      });
    }
  }else {
    let linkFields = {
      userId: templatePageData.userId,
      templateId: templatePageData.templateId,
      pageId: templatePageData._id,
      url: otherData.linkUrl,
      visitCount: 1
    };
    await CampaignLink.create(linkFields).then(async (linkresult) => {
      //console.log("Create link");
      let linkDetailFields = {
        userId: templatePageData.userId,
        templateId: templatePageData.templateId,
        pageId: templatePageData._id,
        linkId: linkresult._id,
        visitCount: 1
      };
      await CampaignLinkDetail.create(linkDetailFields).then((linkDetailresult) => {
        //console.log("Create linkDetail");
      });
    });
  }
}

routeHandler.getTemplatePage = async (req, res) => {
  const clientIp = requestIp.getClientIp(req);
	let postdata = req.body;
  let otherData = {
    clientIp: clientIp
  };
    
	try {
    let isAdmin = false;
    let where = {};
    let where2 = {
      isDefault: 1
    };
    if(typeof postdata.link_slug != 'undefined' && postdata.link_slug != '') {
      where = {
        slug: postdata.link_slug
      }
    }
    let templateTbl = Templates;
    let templatePageTbl = TemplatePage;
    let templateSectionTbl = TemplateSection;
    if(typeof postdata.template_id == 'undefined' || postdata.template_id == '') {
      templateTbl = Campaigns;
      templatePageTbl = CampaignPage;
      templateSectionTbl = CampaignSection;

      if(typeof postdata.page_slug != 'undefined' && postdata.page_slug != '') {
        where2 = {
          slug: postdata.page_slug
        }
      }
    }else {
      isAdmin = true;
      where = {
        _id: postdata.template_id
      }
      if(typeof postdata.page_slug != 'undefined' && postdata.page_slug != '') {
        where2 = {
          slug: postdata.page_slug
        }
      }
    }
    
    let templateData = await templateTbl.findOne(where, {_id: 1, profile: 1, templateStyle: 1, themeId: 1, SocialIconData: 1, html_theme_id: 1, status: 1, userId: 1});
    
    if(templateData) {

      if(templateData.profile != ''){
        try {
          const url = await CommonAPI.getObjectSignedURL(templateData.profile.image);
          templateData.profile.image = url;
        } catch (error) {
          console.error(`Error updating image at index ${index}:`, error);
        }
      }
      let check = await AdminSettings.findOne()
      let checkExpire = await Users.findOne({'_id' : templateData.userId});
      if(!postdata.action && postdata.action !== "previewPage"){
        if(check.isEnabled == true){
    
          if(!checkExpire?.validityDate) {
            if(check.isAdEnabled == false){
              return res.json({
                status : 'success',
                message: '',
                data : 0,
                userid: checkExpire._id
              });
            }
          }
    
          if(checkExpire.validityDate && checkExpire.validityDate !== ''){
            var date = moment(checkExpire.validityDate)
            var now = moment();
            if(now > date){
              await Users.findOneAndUpdate({'_id': checkExpire._id},{'validityDate' : ''})
              if (check.isAdEnabled == false) {
                return res.json({
                  status : 'success',
                  message: '',
                  data : 0,
                  userid: checkExpire._id
                })
              }
            }
          }
        }
      }

      where2.templateId = templateData._id;
      let templatePageData = await templatePageTbl.findOne(where2);
      if(templatePageData && typeof templatePageData._id != 'undefined') {
        let pageSections = await templateSectionTbl.find({ templateId: templateData._id, pageId: templatePageData._id }).sort({ sort: 1 });

      for (let i=0; i< pageSections.length; i++){
        if(pageSections[i].otherBusiness.length > 0){
          for (const [index, element] of pageSections[i].otherBusiness.entries()) {
            try {
                const url = await CommonAPI.getObjectSignedURL(element.image);
                pageSections[i].otherBusiness[index].image = url;
            } catch (error) {
                console.error(`Error updating image at index ${index}:`, error);
            }
         }				
				}
      }
        if(typeof postdata.isVisitor != 'undefined' && postdata.isVisitor == true) {
          if(isAdmin == false) {
            await updateVisitorAnalytics(templatePageData, otherData);
          }
        }
        res.json({
          status: 'success',
          message: '',
          data: {template: templateData, page: templatePageData, sections: pageSections, isAdmin: isAdmin, adEnable : check?.isAdEnabled, adScript : check?.adScript, adScriptCode : check?.adScriptCode ,validity : checkExpire?.validityDate}
        });
     
      }else {
        res.json({
          status: 'error',
          message: 'We have not found template page.'
        });
      }
    }else {
      res.json({
        status: 'error',
        message: 'We have not found template page.'
      });
    }
	}catch(err) {
		console.log(err);
		res.json({
			status: 'error',
			message: 'Server error'
		});
	}
}

routeHandler.clicklink = async (req, res) => {
  const clientIp = requestIp.getClientIp(req);
	let postdata = req.body;
  let otherData = {
    clientIp: clientIp
  };

  try {
    let validateFields = ["page_id", "link_url"];
    let response = await Common.requestFieldsValidation(
      validateFields,
      postdata
    );
    if (response.status) {
      let page_id = postdata.page_id;
      let link_url = postdata.link_url.trim();
      otherData.linkUrl = link_url;
      let where = {
        _id: page_id
      };
      let templatePageData = await CampaignPage.findOne(where);
      if(templatePageData && templatePageData._id != 'undefined') {
        await updateClickAnalytics(templatePageData, otherData);
        res.json({
          status: 'success',
          message: 'recorded successfully.'
        });
      }else {
        res.json({
          status: 'error',
          message: 'We have not found template page.'
        });
      }
    }else {
      res.json({
        status: "error",
        message: "Something went wrong.",
      });
    }
  }catch(err) {
    console.log(err);
    res.json({
      status: 'error',
      message: 'Server error'
    });
  }
}

async function handler(req, res) {
  const { previewSlug } = req.query
  let routeFlag = true
  await dbConnect();

  if (req.method === 'POST') {
    switch (previewSlug) {
      case 'getTemplatePage': 
        await routeHandler.getTemplatePage(req, res)
        break;
      case 'clicklink': 
        await routeHandler.clicklink(req, res)
        break;
      default:
        routeFlag = false
    }
  } else {
    routeFlag = false
  }

  if(!routeFlag) {
		res.status(404).send('No route found.')
  }
}

export default handler
