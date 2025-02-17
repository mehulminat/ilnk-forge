import { 
  Users, 
  Campaigns, 
  Templates, 
  TemplatePage, 
  CampaignPage, 
  TemplateSection, 
  CampaignSection,
  CampaignVisit,
  CampaignLink,
  CampaignVisitDetail,
  CampaignPageVisit, 
  CampaignPageVisitDetail,
  CampaignLinkDetail,
  OrderList,
  Plans,
  AdminSettings,
  Coupons,
} from '../../../models/DB';
import mongoose from 'mongoose';
import { authMiddleware } from '../../../lib/authMiddleware';
import Common from '../../../helpers/Common';
import { v4 as uuidv4 } from 'uuid';
import { uuid } from 'uuidv4';
import CommonAPI from '../../../helpers/CommonAPI';
import md5 from 'md5';
import randomstring from 'randomstring';
import currencies, { defaultCurrency } from '../../../src/helper/currencies';
import Stripe from 'stripe'
import BillingModel from '../../../models/OrderList';
import invoiceHTMLStr from '../../../src/helper/invoiceHTML';
import puppeteer from 'puppeteer';
import fs from 'fs';
import path from 'path';
import axios from 'axios';
import request from 'request';
import crypto from 'crypto'
import Razorpay from 'razorpay';
var stripe, razorpay

const paypalCredentials = {
	mode: 'sandbox',
	apiURL: '',
	key: '',
	secretKey: ''
}

AdminSettings.findOne({}).then(async result=>{
	stripe = new Stripe(result.stripeSecret);
	let mode
	if(result?.razorpayKey != ''){
		 razorpay = new Razorpay({
			key_id: result.razorpayKey,
			key_secret: result.razorpaySecret,
		  });
	}
	if(result?.paypalTestMode == true){
		mode = 'sandbox'
		paypalCredentials.mode = 'sandbox';
		paypalCredentials.apiURL = process.env.paypal.sandboxURL;
	}else {
		paypalCredentials.mode = 'live';
		paypalCredentials.apiURL = process.env.paypal.liveURL;
		mode = 'live'
	}

	paypalCredentials.key = result.paypalKey;
	paypalCredentials.secretKey = result.paypalSecret;
});

const routeHandler = {}

routeHandler.updateProfile = async (req, res) => {
  let postdata = req.body;
	let user = req.vsuser;
	try {
		let validateFields = ["name"];
		let response = await Common.requestFieldsValidation(
			validateFields,
			postdata
		);
		if(response.status) {
			let where = {
				_id: user._id
			};

			let set = {
				name: postdata.name
			};

			if(typeof postdata.password != 'undefined' && postdata.password != "") {
				set.password = md5(postdata.password);
			}

			await Users.findOneAndUpdate(where, {
				$set: set
			},{new :true}).then(async(result) => {
				if(result.profilePicture != ''){
					try {
						const url = await CommonAPI.getObjectSignedURL(result.profilePicture.file);
						set.profilePicture = url;
					} catch (error) {
						console.error(`Error updating image :`, error);
					}	
				}
				if(set.password) {
					delete set.password;
				}
				res.json({
					status: 'success',
					message: 'We have updated profile successfully.',
					data: set
				});
			});
		}else {
			res.json({
				status: 'error',
				message: 'Something went wrong.'
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

routeHandler.planPurchase = async(req, res) => {
	try {
		let postdata = req.body;
		let plan_id = postdata.id;
		let plandata = await Plans.findOne({'_id' : plan_id});
		let amount = plandata.price;
		let plan = plandata.planname;
		
		let user = req.vsuser;
		let email = user.email;

		if(postdata.couponCode){
			let total
			let coupon = await Coupons.findOne({'couponCode' : postdata.couponCode, 'status' : 1})
			if(amount > coupon.minAmount){
				if(coupon.duration == 'Once per user'){
					let userdata = await BillingModel.findOne({customer_id : user._id, couponCode : postdata.couponCode})
					if(userdata){
						return res.json({
							message: 'Invalid coupon',
							status: "error",
						});
					}
				}
				if(coupon.discountType == 'By Percentage'){
					let discounted = amount * coupon.discount /100
					total = amount - discounted
					amount = total
				 }
				 else {
					let discountPrice = coupon.discount
					total = amount - discountPrice
					amount = total
				 }
				 if(amount < 0){
					amount = 0
				 }
			} else {
				return res.json({
					message: 'Invalid coupon',
					status: "error",
				});
			}

		}

		let curr_data = await AdminSettings.findOne({});
		let currency = defaultCurrency.code;
		if(curr_data?.currency?.code) {
			currency = curr_data.currency.code;
		}
		if(postdata.mode == 'Bank Transfer')
		{
			let querystr = `paymentId=${postdata.paymentId}&plan_id=${plan_id}`;
			if(postdata?.couponCode) {
				querystr = `paymentId=${postdata.paymentId}&plan_id=${plan_id}&couponCode=${postdata.couponCode}`
			}

			let redirectUri = `${process.env.APP_URL}success?${querystr}`
			if(postdata.paymentId !== '') {
				res.json({
					status: 'success',
					message: 'Bank transfer checkout',
					data: redirectUri
				});
			}
		}
		else if(postdata.mode == 'Stripe'){
			let querystr = `session_id={CHECKOUT_SESSION_ID}&plan_id=${plan_id}`;
			if(postdata?.couponCode) {
				querystr = `session_id={CHECKOUT_SESSION_ID}&plan_id=${plan_id}&couponCode=${postdata.couponCode}`
			}
			const checkoutsession = await stripe.checkout.sessions.create({
			  invoice_creation: {
				enabled: true
			  },
		
			  line_items: [{
				price_data: {
				  currency: currency,
				  unit_amount: amount * 100,
				  product_data: { 
					name: plan,
					description: 'PixaURL',
				  },
				},
				
				quantity: 1,
			  }],
			  phone_number_collection: {
				enabled: true,
			  },
			  customer_email: email,
			  mode: 'payment',
			  success_url: `${process.env.APP_URL}success?${querystr}`,
			  cancel_url: `${process.env.APP_URL}checkout?canceled=true`,
			});

			res.json({
				status: 'success',
				message: 'stripe checkout',
				data: checkoutsession.url
			});
		}
		else if(postdata.mode == 'Paypal'){
			let querystr = `plan_id=${plan_id}`;
			if(postdata?.couponCode) {
				querystr = `plan_id=${plan_id}&couponCode=${postdata.couponCode}`
			}
			const orderJson = {
				intent: 'CAPTURE',
				purchase_units: [
					{
						invoice_id: uuidv4(),
						amount: {
							currency_code: currency,
							value: amount,
						}
					}
				],
				payment_source: {
					paypal: {
						experience_context: {
							payment_method_preference: 'IMMEDIATE_PAYMENT_REQUIRED',
							brand_name: 'PixaURL',
							locale: 'en-US',
							landing_page: 'LOGIN',
							user_action: 'PAY_NOW',
							return_url: `${process.env.APP_URL}success?${querystr}`,
							cancel_url: `${process.env.APP_URL}checkout?canceled=true`
						}
					}
				}
			}

			const jsonString = JSON.stringify(orderJson);
			const encoded = Buffer.from(`${paypalCredentials.key}:${paypalCredentials.secretKey}`, 'utf8').toString('base64'); 

			const response = await fetch(`${paypalCredentials.apiURL}checkout/orders`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					'Authorization': 'Basic '+encoded
				},
				body: jsonString
			});

			const result = await response.json();
			if(result?.id) {
				// Extract the approval URL from the payment.links array
				const approvalUrl = result.links.find(link => link.rel === 'payer-action').href;
				res.json({
					status: 'success',
					message: 'paypal checkout',
					data: approvalUrl
				});
			} else {
				res.json({
					status: 'error',
					message: 'Something went wrong.'
				});
			}
		}
		else if( postdata.mode === 'Razorpay'){

			let querystr = `plan_id=${plan_id}`;
			if(postdata?.couponCode) {
				querystr = `plan_id=${plan_id}&couponCode=${postdata.couponCode}`
			}

			  try {
				const payment_capture = 1; // 1 to capture the payment immediately, 0 to authorize the payment
				amount = amount * 100; // Amount in paise
			
				const options = {
				  amount,
				  currency: currency,
				  payment_capture,
				};
			
				const response = await razorpay.orders.create(options);
			
				const checkoutData = {
				  key: curr_data.razorpayKey,
				  amount: response.amount,
				  currency: response.currency,
				  order_id: response.id,
				  name: 'PixaURL',
				  description: plan,
				  prefill: {
					name: user.name,
					email: email,
				  },
				  theme: {
					color: '#338DFF', // Customize the color of the checkout form
				  },
				};
			
				res.json({status : 'success', message: 'Razorpay checkout', data : checkoutData, type : 'Razorpay', queryParameter : querystr});
			  } catch (error) {
				console.error(error);
				res.status(500).send('Internal Server Error');
			  }
			
		}
		else{
			res.json({
				status: 'error',
				message: 'Select payment mode.'
			});
		}

	
	  } catch (err) {
		res.json({
			status: 'error',
			message: 'Server error'
		});
	}
}


routeHandler.paymentSuccess = async (req, res) => {
	try{
		let postdata = req.body;
		let userid = postdata.user_id;
		let plan_id = postdata.plan_id;
		let user = req.vsuser;
		let plandata = await Plans.findOne({'_id' : plan_id});
		let validity = plandata.validity;
		let planName = plandata.planname;
		let amount   = plandata.price 
		let orderdetails
		let invoiceID = '123';

		if(postdata?.session_id){
			let sessionid = postdata.session_id;

			const session = await stripe.checkout.sessions.retrieve(sessionid);
			const sessioninvoice = session.invoice;
			const invoice = await stripe.invoices.sendInvoice(sessioninvoice);
		
			const pi_id = invoice.payment_intent;
			const pi_status = await stripe.paymentIntents.retrieve(pi_id);
			
			invoiceID = invoice.id;
			orderdetails = {
				planId: plandata.id,
				invoice_id: invoice.id,
				amount: invoice.amount_paid / 100,
				customer_id: userid,
				validity : validity,
				shiping_details: (invoice.shipping_details !== null) ? invoice.shipping_details.address : '',
				couponCode : (postdata?.couponCode != '') ? postdata.couponCode : '',
				title: invoice.lines.data[0].description,
				unitPrice: plandata.price,
				paymentStatus : pi_status.status,
				paymentMethod:'Stripe',
				invoice_url: invoice.hosted_invoice_url,
				currency: invoice.currency,
				payloadData: JSON.stringify(invoice)
			};
		}
		if(postdata?.token) {
			let token = postdata.token;

			const encoded = Buffer.from(`${paypalCredentials.key}:${paypalCredentials.secretKey}`, 'utf8').toString('base64'); 
			const response = await fetch(`${paypalCredentials.apiURL}checkout/orders/${token}`, {
				headers: {
					'Content-Type': 'application/json',
					'Authorization': 'Basic '+encoded
				}
			});
			const result = await response.json();

			if(result?.id) {
				if(result.status == 'APPROVED' || result.status == 'COMPLETED') {
					invoiceID = result.purchase_units[0].invoice_id;
					let paymentStatus = 'succeeded';
					orderdetails = {
						planId: plandata.id,
						invoice_id: invoiceID,
						amount: result.purchase_units[0].amount.value,
						customer_id: userid,
						validity : validity,
						shiping_details: result.purchase_units[0].shipping,
						couponCode : (postdata?.couponCode != '') ? postdata.couponCode : '',
						title: planName,
						unitPrice: plandata.price,
						paymentStatus : paymentStatus,
						paymentMethod:'PayPal',
						invoice_url: '',
						currency: result.purchase_units[0].amount.currency_code,
						payloadData: JSON.stringify(result)
					}
				}
			}
		}
		if(postdata.paymentId) {
			if(postdata.couponCode){
				let total
				let coupon = await Coupons.findOne({'couponCode' : postdata.couponCode, 'status' : 1})

				if(coupon.duration == 'Once per user'){
					let userdata = await BillingModel.findOne({customer_id : user._id, couponCode : postdata.couponCode})
					if(userdata){
						return res.json({
							message: 'Invalid coupon',
							status: "error",
						});
					}
				}
				if(coupon.discountType == 'By Percentage'){
					let discounted = amount * coupon.discount /100
					total = amount - discounted
					amount = total
				 }
				 else {
					let discountPrice = coupon.discount
					total = amount - discountPrice
					amount = total
				 }
				 if(amount < 0){
					amount = 0
				 }
			}
			let curr_data = await AdminSettings.findOne({});
			orderdetails = {
				planId: plandata.id,
				invoice_id: postdata.paymentId,
				amount: amount,
				customer_id: userid,
				validity : validity,
				couponCode : (postdata?.couponCode != '') ? postdata.couponCode : '',
				title: planName,
				unitPrice: plandata.price,
				paymentStatus : 'Pending',
				paymentMethod:'Bank Transfer',
				invoice_url: '',
				currency: curr_data.currency.code,
			};
		}
		if(postdata?.razorpay_order_id){
			let orderId = postdata.razorpay_order_id
			let paymentId = postdata.razorpay_payment_id
			let signature = postdata.razorpay_signature

			let details = await razorpay.payments.fetch(paymentId)
			invoiceID = paymentId
			orderdetails = {
				planId: plandata.id,
				invoice_id: paymentId,
				amount: details.amount / 100,
				customer_id: userid,
				validity : validity,
				couponCode : (postdata?.couponCode != '') ? postdata.couponCode : '',
				title: planName,
				unitPrice: plandata.price,
				paymentStatus : 'success',
				paymentMethod:'Razorpay',
				invoice_url: '',
				currency: details.currency,
			};
		}
		let exists = await OrderList.findOne({'invoice_id' : invoiceID});
		if(exists) {  
			return res.json({ 
				status :'success',  
				data: exists, 
			});
		} else {
			if(orderdetails) {
				var ordersave = await OrderList.create(orderdetails);
				if(ordersave){
					let userdata = await Users.findOne({'_id':userid});
					if(userdata){
						if(postdata.session_id || postdata.token || postdata.razorpay_payment_id){
							let validityDate
							if(userdata.validityDate && userdata.validityDate !== ''){
								validityDate = userdata.validityDate
								let newDate = addDays(new Date(validityDate), validity);
								await Users.findOneAndUpdate({'_id' : userid},{'validityDate' : newDate, planName});
							} else {
								validityDate = addDays(new Date(), validity);
								await Users.findOneAndUpdate({'_id' : userid},{'validityDate' : validityDate, planName});
							}
						}
					}
				}
				return res.json({ 
					status :'success',  
					data: ordersave, 
				});
			} else {
				return res.json({
					status: 'error',
					message: 'Something went wrong.'
				});
			}
		}

	} catch (err) {
		console.log(err);
		res.json({
			status: 'error',
			message: 'Server error'
		});
	}
}
function addDays(theDate, days) {
	return new Date(theDate.getTime() + days*24*60*60*1000);
}

routeHandler.getCurrentPlan = async (req, res) => {
	let user = req.vsuser;
	try {
		let planName = '';
		if(user?.planName) {
			planName = user.planName;
		} else {
			let lastPayment = await OrderList.findOne({'customer_id' : user._id}).sort({_id: -1});
			if(lastPayment) {
				planName = lastPayment.title;
			}
		}
		let planFeature = await AdminSettings.findOne({})
		
		let isPlan = planName ? true : false;
		let isExpired = user.validityDate ? false : true;

		let data = {
			planName,
			isPlan,
			isExpired,
			validityDate: user.validityDate,
			adminPlanStatus: planFeature?.isEnabled
		}

		return res.json({ 
			status :'success',  
			data: data, 
		});		
	} catch(err) {
		res.json({
			status: 'error',
			message: 'Server error'
		});
	}
}

routeHandler.getBillingHistory = async (req,res) => {
	let user = req.vsuser;
	try{
		let postdata = req.body;
		let page = parseInt(postdata.page || 1);
		let limit = parseInt(postdata.listPerPage || config.listPerPage);
		let skip = (page - 1) * limit;
		let query = { 'customer_id' : user._id};
		let orders = await OrderList.find(query)
				.limit(limit)
				.skip(skip)
				.sort({ createdAt: -1 })
				.catch((error) => {
					res.json({
						error: error,
						message: "There was an error!",
						status: "error",
					});
				});
			let totalOrders = await OrderList.find(query).countDocuments();
			let pageCounts = Math.ceil(totalOrders / limit);

			res.json({
				status: "success",
				message: "",
				data: orders,
				expireDate : user?.validityDate,
				totalOrders: totalOrders,
				perPage: limit,
				currentPage: page,
				pageCounts: pageCounts,
			});
	} catch (err) {
		res.json({
			status: 'error',
			message: 'Server error'
		});
	}
}


routeHandler.removeProfileImage = (req, res) => {
  let postdata = req.body;
	let user = req.vsuser;
	try {
		if (user.profilePicture && user.profilePicture != "") {
			CommonAPI.deleteObjects([user.profilePicture.key]);

			res.json({
				status: 'success',
				message: 'We have removed profile image successfully.'
			});
		}else {
			res.json({ 
				status: 'error',
				message: 'Something went wrong.'
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

routeHandler.createCampaign = async (req, res) => {
  let postdata = req.body;
	let user = req.vsuser;
	try {
		let validateFields = ["link_name", "template_id"];
		let response = await Common.requestFieldsValidation(
			validateFields,
			postdata
		);
		if(response.status) {
			let pURL = postdata.link_name.trim();
			let pURLSlug = pURL.toLowerCase();
			pURLSlug = pURLSlug.replace(/[^A-Z0-9]+/gi, "-");
			let campaignExists = await Campaigns.findOne({ slug: pURLSlug });
			if(campaignExists && typeof campaignExists._id != 'undefined') {
				res.json({
					status: 'error',
					message: 'Campaign is already exist with this URL. Please use another URL.'
				});
			}else {
				if(typeof postdata.template_id != 'undefined' && postdata.template_id != "") {
					let preTemplate = await Templates.findOne({ _id: postdata.template_id });
					if(preTemplate && typeof preTemplate._id != 'undefined') {
						let newCampaign = {
							userId: user._id,
							title: pURL,
							slug: pURLSlug,
							catId: preTemplate.catId,
							profile: preTemplate.profile,
							usedTemplateId: preTemplate._id,
							packId: preTemplate.packId,
							themeId: preTemplate.themeId,
							html_theme_id: preTemplate.html_theme_id,
						};

						let userImage = "";
						if (typeof user.profilePicture !== "undefined") {
							userImage = user.profilePicture.key;
						}
						
						newCampaign.profile = {...newCampaign.profile, name: user.name, image: userImage};
						if(preTemplate.templateData) {
							newCampaign.templateData = preTemplate.templateData;
						}
						if(preTemplate.templateStyle) {
							newCampaign.templateStyle = preTemplate.templateStyle;
						}
						if(preTemplate.SocialIconData) {
							newCampaign.SocialIconData = preTemplate.SocialIconData;
						}
						await Campaigns.create(newCampaign).then(async(campaign) => {
							let templatePages = await TemplatePage.find({templateId: preTemplate._id, status: 1});
							if(templatePages) {
								templatePages.map(async (item, index) => {
									let pageFields = {
										userId: user._id,
										templateId: campaign._id,
										title: item.title,
										slug: item.slug,
										isDefault: item.isDefault,
										sort: item.sort
									};
									if(item.templateData) {
										pageFields.templateData = item.templateData;
									}

									await CampaignPage.create(pageFields).then(async (resultPage) => {
										//console.log("success");
										let Sections = await TemplateSection.find({templateId: preTemplate._id, pageId: item._id, status: 1});
										if(Sections) {
											Sections.map(async (sitem, sindex)=> {
												let newSection = {
													templateId: campaign._id,
													pageId: resultPage._id,
													userId: user._id,
													title: sitem.title,
													type: sitem.type,
													isDefault: sitem.isDefault,
													sort: sitem.sort,
													sectionData: sitem.sectionData
												};
												
												await CampaignSection.create(newSection).then((campSection) => {
													console.log("Success section");
												});

											})
										}
									})
								});
							}

							res.json({
								status: 'success',
								message: 'We have created link successfully.',
								data: {id: campaign._id}
							})
						});
					}else {
						res.json({
							status: 'error',
							messgae: 'We have not found the template.'
						});
					}
				}else {
					res.json({
						status: 'error',
						message: 'Something went wrong.'
					});
				}
			}
		}else {
			res.json({
				status: 'error',
				message: 'Something went wrong.'
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

routeHandler.getCampaigns = async (req, res) => {
  let postdata = req.body;
	let user = req.vsuser;
	try {
		let page = parseInt(postdata.page || 1);
		let limit = parseInt(postdata.listPerPage || config.listPerPage);
		let skip = (page - 1) * limit;
		let query = { userId: user._id };

		if (postdata.searchTerm != "") {
			postdata.searchTerm = postdata.searchTerm.trim();
			query = {
				userId: user._id,
				$text: { $search: postdata.searchTerm }
			};
		}

		let query2 = [
			{ $match: query },
			{
				$lookup: {
					from: "pixaurl_campaignvisits",
					localField: "_id",
					foreignField: "templateId",
					as: "campaignVisits"
				}
			},
			{
				$lookup: {
					from: "pixaurl_campaignlinks",
					localField: "_id",
					foreignField: "templateId",
					as: "campaignClicks",
				},
			},
			{ $sort: { createdAt: -1 } },
			{ $skip: skip },
			{ $limit: limit },
			{
				$project: {
					status: 1,
					isCustomTheme: 1,
					userId: 1,
					title: 1,
					slug: 1,
					catId: 1,
					profile: 1,
					usedTemplateId: 1,
					packId: 1,
					themeId: 1,
					html_theme_id: 1,
					templateStyle: 1,
					SocialIconData: 1,
					createdAt: 1,
					updatedAt: 1,
					totalVisits: { $sum: "$campaignVisits.visitCount" },
					totalClicks: { $sum: "$campaignClicks.visitCount" }
				},
			},
		]

		let campaigns = await Campaigns.aggregate(query2)
		/* let campaigns = await Campaigns.find(query)
			.limit(limit)
			.skip(skip)
			.sort({ createdAt: -1 })
			.catch((error) => {
				res.json({
					error: error,
					status: 'error',
					message: "There was an error!"
				});
			}); */

			for (let i=0; i< campaigns.length; i++){
				if(campaigns[i].profile != ''){
					try {
						const url = await CommonAPI.getObjectSignedURL(campaigns[i].profile.image);
						campaigns[i].profile.image = url;
					} catch (error) {
						console.error(`Error updating image at index ${index}:`, error);
					}				 			
			    }
		    }
		
		let totalCampaigns = await Campaigns.find(query).countDocuments();
		let pageCounts = Math.ceil(totalCampaigns / limit);

		res.json({
			status: 'success',
			message: "",
			data: campaigns,
			totalCampaigns: totalCampaigns,
			perPage: limit,
			currentPage: page,
			pageCounts: pageCounts,
		});
	}catch(err) {
		console.log(err);
		res.json({
			status: 'error',
			message: 'Server error'
		});
	}
}

routeHandler.deleteCampaign = async (req, res) => {
  let postdata = req.body;
	let user = req.vsuser;
	try {
		let camId = postdata.id;
		let where = {_id: camId};

		let params = {userId: user._id, campaignId: camId};
		let delState = await Common.deleteCampaignDBData(params);

		let shoulddelete = await CommonAPI.getAllkeysOfFolder(
			camId
		);
		if (shoulddelete && shoulddelete.status) {
			API.deleteObjects(shoulddelete.keys);
		}

		await Campaigns.deleteOne(where).then(() => {
			res.json({
				status: 'success',
				message: 'we have deleted link successfully.'
			});
		})

	}catch(err) {
		res.json({
			status: 'error',
			message: 'Server error'
		});
	}
}

routeHandler.updateCampaignStatus = async (req, res) => {
  let postdata = req.body;
	try {
		let campaignId = postdata.id;
		let campaignStatus = postdata.campaignStatus;
		campaignStatus = parseInt(campaignStatus);

		let where = { _id: campaignId };
		await Campaigns.updateOne(where, {
			$set: { status: campaignStatus },
		}).then(() => {
			res.json({
				status: "success",
				message: "We have updated link status successfully.",
			});
		});
	} catch (err) {
		res.json({
			status: "error",
			message: "Server error",
		});
	}
}

routeHandler.changeUsedTemplate = async (req, res) => {
  let postdata = req.body;
	let user = req.vsuser;
	try {
		let validateFields = ["id", "template_id"];
		let response = await Common.requestFieldsValidation(
			validateFields,
			postdata
		);
		if(response.status) {
			let campaignData = await Campaigns.findOne({ _id: postdata.id });
			if(campaignData && typeof campaignData._id != 'undefined') {
				let preTemplate = await Templates.findOne({ _id: postdata.template_id });
				if(preTemplate && typeof preTemplate._id != 'undefined') {
					let set = {
						packId: preTemplate.packId,
						usedTemplateId: preTemplate._id,
						templateStyle: preTemplate.templateStyle,
						html_theme_id: preTemplate.html_theme_id
					}
					await Campaigns.updateOne({_id: campaignData._id}, {
						$set: set,
					}).then(async() => {
						res.json({
							status: "success",
							message: "We have changed the template successfully.",
						});
					});
				}else {
					res.json({
						status: 'error',
						messgae: 'We have not found the template.'
					});
				}
			}else {
				res.json({
					status: 'error',
					message: 'The requested campaign is not exist.'
				});
			}
		}else {
			res.json({
				status: 'error',
				message: 'Something went wrong.'
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

routeHandler.getTemplates = async (req, res) => {
  let postdata = req.body;
	try {
		let page = parseInt(postdata.page || 1);
		let limit = parseInt(postdata.listPerPage || config.listPerPage);
		let skip = (page - 1) * limit;
		let query = {status: 1};
		if (
			typeof postdata.searchTerm != "undefined" &&
			postdata.searchTerm != ""
		) {
			postdata.searchTerm = postdata.searchTerm.trim();
			query = {
				status: 1,
				$text: { $search: postdata.searchTerm },
			};
		}
		if(typeof postdata.category_id != 'undefined' && postdata.category_id != "") {
			query.catId = postdata.category_id;
		}

		let templates = {};
		if (postdata.listPerPage == -1) {
			templates = await Templates.find(query)
				//.sort({ updatedAt: -1 })
				.catch((error) => {
					res.json({
						error: error,
						message: "There was an error!",
						status: "error",
					});
				});
		} else {
			templates = await Templates.find(query)
				.limit(limit)
				.skip(skip)
				//.sort({ updatedAt: -1 })
				.catch((error) => {
					res.json({
						error: error,
						message: "There was an error!",
						status: "error",
					});
				});
		}

		let totalTemplates = await Templates.find(query).countDocuments();
		let pageCounts = Math.ceil(totalTemplates / limit);

		res.json({
			status: "success",
			message: "",
			data: templates,
			totalTemplates: totalTemplates,
			perPage: limit,
			currentPage: page,
			pageCounts: pageCounts,
		});
	} catch (err) {
		res.json({
			status: "error",
			message: "Server error",
		});
	}
}

routeHandler.getDashboardAnalytics = async (req, res) => {
	let user = req.vsuser;
	try {
		let totalMonthlyVisitor = 0, totalWeeklyVisitor = 0, totalWeeklyClicks = 0;
        let today = new Date();

		let where = {
			userId: user._id
		};
		let qurGroup = {
            $group: {
                _id: "$userId",
                totalVisitor: {
                    $sum: "$visitCount"
                }
            }
        };
        let qurProject = {
            $project: {
                totalVisitor: 1
            }
        };

        // Monthly Visitor 
        let where2 = {
            createdAt: {
                $gte: new Date(new Date().setDate(today.getDate() - 30)),
                $lt: today
            }
        };

        // Weekly Visitor 
        let where3 = {
            createdAt: {
                $gte: new Date(new Date().setDate(today.getDate() - 7)),
                $lt: today
            }
        };

		// Weekly Clicks
		let where4 = {
            createdAt: {
                $gte: new Date(new Date().setDate(today.getDate() - 7)),
                $lt: today
            }
        };

        let query = [
            { $match: where},
            { $match: where2},
        ];
        query.push(qurGroup);
        query.push(qurProject);
        let monthlyVisitResult = await CampaignVisit.aggregate(query).exec();
        if(monthlyVisitResult && monthlyVisitResult.length) {
            totalMonthlyVisitor = monthlyVisitResult[0].totalVisitor;
        }

        let query2 = [
            { $match: where},
            { $match: where3},
        ];
        query2.push(qurGroup);
        query2.push(qurProject);
        let weeklyVisitResult = await CampaignVisit.aggregate(query2).exec();
        if(weeklyVisitResult && weeklyVisitResult.length) {
            totalWeeklyVisitor = weeklyVisitResult[0].totalVisitor;
        }

		let query3 = [
			{ $match: where},
            { $match: where4},
		];
		query3.push(qurGroup);
        query3.push(qurProject);
		let weeklyClickResult = await CampaignLink.aggregate(query3).exec();
        if(weeklyClickResult && weeklyClickResult.length) {
            totalWeeklyClicks = weeklyClickResult[0].totalVisitor;
        }

		let analyticsData = {
			totalMonthlyVisitor: totalMonthlyVisitor,
			totalWeeklyVisitor: totalWeeklyVisitor,
			totalWeeklyClicks: totalWeeklyClicks
		};
		res.json({
			status: "success",
			message: "",
			data: analyticsData,
		});
	}catch(err) {
		console.log(err);
		res.json({
			status: "error",
			message: "Server error",
		});
	}
}

routeHandler.moveCampaign = async (req, res) => {
  let postdata = req.body;
	let user = req.vsuser;
	try {
		let validateFields = ["id", "user_id"];
		let response = await Common.requestFieldsValidation(
			validateFields,
			postdata
		);
		if(response.status) {
			let userData = await Users.findOne({_id: postdata.user_id});
			if(userData && typeof userData._id != 'undefined') {
				let campaignData = await Campaigns.findOne({ _id: postdata.id, userId: user._id });
				if(campaignData && typeof campaignData._id != 'undefined') {
					let profile = campaignData.profile;
					if(campaignData.profile?.image) {
						let fileName = path.basename(campaignData.profile?.image);
						let subPath = `${postdata.user_id}`;
						subPath = subPath.concat(`/templates`);
						let imagetarget = `usercontent/${subPath}/${postdata.id}/${fileName}`;
						let newImage = await CommonAPI.copyObject(campaignData.profile?.image, imagetarget);
						if(newImage) {
							profile = {
								...campaignData.profile,
								image: newImage.key,
							};
							await CommonAPI.deleteObjects([campaignData.profile.image]);
						}
					}
					let set = {
						userId: postdata.user_id,
						profile: profile
					}
					await Campaigns.updateOne({_id: postdata.id}, {
						$set: set
					}).then(() => {
						//console.log("success");
					});
					await CampaignPage.updateMany({templateId: postdata.id}, {
						$set: {userId: postdata.user_id}
					}).then(() => {
						//console.log("success");
					});
					await CampaignSection.updateMany({templateId: postdata.id}, {
						$set: {userId: postdata.user_id}
					}).then(() => {
						//console.log("success");
					});
					await CampaignVisit.updateOne({templateId: postdata.id}, {
						$set: {userId: postdata.user_id}
					}).then(() => {
						//console.log("Update visit");
					});
					await CampaignVisitDetail.updateMany({templateId: postdata.id}, {
						$set: {userId: postdata.user_id}
					}).then(() => {
						//console.log("Update visitDetail");
					});
					await CampaignPageVisit.updateMany({templateId: postdata.id}, {
						$set: {userId: postdata.user_id}
					}).then(() => {
						//console.log("Update visit page");
					});
					await CampaignPageVisitDetail.updateMany({templateId: postdata.id}, {
						$set: {userId: postdata.user_id}
					}).then(() => {
						//console.log("Update visitDetail");
					});
					await CampaignLink.updateOne({templateId: postdata.id}, {
						$set: {userId: postdata.user_id}
					}).then(() => {
						//console.log("Update link");
					});
					await CampaignLinkDetail.updateOne({templateId: postdata.id}, {
						$set: {userId: postdata.user_id}
					}).then(() => {
						//console.log("Update linkDetail");
					});

					res.json({
						status: 'success',
						message: 'Campaign moved successfully.',
						data: imagetarget
					});
				}else {
					res.json({
						status: 'error',
						message: 'Campaign is not exist.'
					});
				}
			}else {
				res.json({
					status: 'error',
					message: 'The requested user is not exist.'
				});
			}
		}else {
			res.json({
				status: 'error',
				message: 'Something went wrong.'
			});
		}
	}catch(err) {
		console.log(err);
		res.json({
			status: 'error',
			message: 'Something went wrong.'
		});
	}
}

routeHandler.duplicateCampaign = async (req, res) => {
  let postdata = req.body;
	let user = req.vsuser;
	try {
		console.log('duplicate');
		let validateFields = ["id"];
		let response = await Common.requestFieldsValidation(
			validateFields,
			postdata
		);
		if (response.status) {
			let campaignData = await Campaigns.findOne({ _id: postdata.id, userId: user._id });
			if(campaignData && typeof campaignData._id != 'undefined') {
				let rnString = randomstring.generate({
					length: 5,
					charset: 'alphabetic',
					capitalization: 'lowercase'
				});
				let name = `${campaignData.title} (Copy)`;
				let campSlug = `${campaignData.slug}-${rnString}`;
				campaignData._id = new mongoose.Types.ObjectId();
				campaignData.isNew = true;
				campaignData.createdAt = new Date().toISOString();
				campaignData.updateAt = new Date().toISOString();
				campaignData.title = name;
				campaignData.slug = campSlug;
				campaignData.save()
				.then(async (campaign) => {
					if(campaign.profile?.image) {
						if (
							campaign.profile.image &&
							campaign.profile.image.indexOf("profileImage") !==
								-1
						) 
						{
							let profile = campaign.profile;
							let fileName = path.basename(campaign.profile.image);
							let subPath = `${user._id}`;
							subPath = subPath.concat(`/templates`);
							let imagetarget = `usercontent/${subPath}/${campaign._id}/${fileName}`;
							let newImage = await CommonAPI.copyObject(campaign.profile?.image, imagetarget);
							if(newImage) {
								profile = {
									...campaign.profile,
									image: newImage.key,
								};
								await Campaigns.updateOne({_id: campaign._id}, {
									$set: { profile: profile },
								}).then(() => {
									//console.log("success");
								});
							}	
						}
					}
					let campaignPages = await CampaignPage.find({templateId: postdata.id});
					if(campaignPages) {
						campaignPages.map(async (item, index) => {
							let prePageId = item._id;
							let npage = item;
							npage._id = new mongoose.Types.ObjectId();
							npage.isNew = true;
							npage.templateId = campaign._id;
							
							npage.save()
							.then(async (resultPage) => {
								let Sections = await CampaignSection.find({templateId: postdata.id, pageId: prePageId});
								if(Sections) {
									Sections.map(async (sitem, sindex)=> {
										let nSection = sitem;
										nSection._id = new mongoose.Types.ObjectId();
										nSection.isNew = true;
										nSection.templateId = campaign._id;
										nSection.pageId = resultPage._id;
										
										nSection.save();
									})
								}
							})
							.catch(() => {
								//console.log('error')
							})
						});
					}
					res.json({
						status: 'success',
						message: 'Duplicate link successfully.',
					});
				})
				.catch(() => {
					res.json({
						status: "error",
						message: "Something went wrong.",
					});
				})
			}else{
				res.json({
					status: 'error',
					message: 'The requested Campaign is not exist.'
				});
			}
		}
	}catch(err) {
		console.log(err);
		res.json({
			status: "error",
			message: "Server error",
		});
	}
}

routeHandler.downloadInvoice = async (req, res) => {
	let postdata = req.body;
	let user = req.vsuser;
	try {
		let orderData = await OrderList.findOne({_id: postdata.id});
		if(orderData) {
			let userData = await Users.findOne({_id: orderData.customer_id});

			let fileName = 'invoice_'+orderData.id.substring(orderData.id.length - 5)+'.pdf';
			let filePath = `invoices/${fileName}`;
			let discountAmount = 0;
			let planAmount = orderData.amount;
			if(orderData?.unitPrice) {
				planAmount = orderData.unitPrice;
				discountAmount = planAmount - orderData.amount;
			}
			const currencyIndex = currencies.findIndex(row => row.code == orderData.currency.toUpperCase());
			let currencySymbol = currencies[currencyIndex].symbol;

			let obj = {
				"{BUYER_ADDRESS}": userData.email,
				"{PRODUCT_NAME}": orderData.title,
				"{PRODUCT_PRICE}": currencySymbol.concat(planAmount),
				"{PRODUCT_AMOUNT}": currencySymbol.concat(planAmount),
				"{PAID_AMOUNT}": currencySymbol.concat(orderData.amount),
				"{CURRENCY}": orderData.currency,
				"{DISCOUNT_AMOUNT}": currencySymbol.concat(discountAmount)
			}
			let html = Common.replaceItemByObj(invoiceHTMLStr, obj);

			const browser = await puppeteer.launch({ headless: 'new' });

			const page = await browser.newPage();
			await page.setContent(html, { waitUntil: 'networkidle0', timeout: 30000 });
			// To reflect CSS used for screens instead of print
			await page.emulateMediaType('screen');
			await page.pdf({ path: `${process.env.folderPath}/public/${filePath}`, format: 'A4' });
			await page.close();
			await browser.close();

			res.json({
				status: 'success',
				message: '',
				data: { filePath: filePath, fileName: fileName }
			});
		} else {
			res.json({
				status: "error",
				message: "Something went wrong.",
			});
		}
	} catch(err) {
		console.log(err);
		res.json({
			status: "error",
			message: "Server error",
		});
	}
}

routeHandler.deleteInvoiceFile = async (req, res) => {
	let postdata = req.body;
	let user = req.vsuser;
	try {
		let fileName = postdata.name;
		let filePath = `${process.env.folderPath}/public/invoices/${fileName}`;
		if(fs.existsSync(filePath)) {
			fs.unlink(filePath, () => {
				// console.log('success')
			});
		}

		res.json({
			status: 'success',
			message: ''
		});
	} catch(err) {
		console.log(err);
		res.json({
			status: "error",
			message: "Server error",
		});
	}
}

async function handler(req, res) {
  const { userSlug } = req.query
  let routeFlag = true

  if (req.method === 'POST') {
    switch (userSlug) {
      case 'updateProfile': 
        await routeHandler.updateProfile(req, res)
        break;
			case 'paymentSuccess': 
        await routeHandler.paymentSuccess(req, res)
        break;
			case 'getBillingHistory': 
        await routeHandler.getBillingHistory(req, res)
        break;
	  	case 'planPurchase': 
        await routeHandler.planPurchase(req, res)
        break;
			case 'getCurrentPlan':
				await routeHandler.getCurrentPlan(req, res)
        break;
      case 'removeProfileImage':
        await routeHandler.removeProfileImage(req, res)
        break;
      case 'createCampaign':
        await routeHandler.createCampaign(req, res)
        break;
      case 'getCampaigns':
        await routeHandler.getCampaigns(req, res)
        break;
      case 'deleteCampaign':
        await routeHandler.deleteCampaign(req, res)
        break;
      case 'updateCampaignStatus':
        await routeHandler.updateCampaignStatus(req, res)
        break;
      case 'changeUsedTemplate':
        await routeHandler.changeUsedTemplate(req, res)
        break;
      case 'getTemplates':
        await routeHandler.getTemplates(req, res)
        break;
      case 'getDashboardAnalytics':
        await routeHandler.getDashboardAnalytics(req, res)
        break;
      case 'moveCampaign':
        await routeHandler.moveCampaign(req, res)
        break;
      case 'duplicateCampaign':
        await routeHandler.duplicateCampaign(req, res)
        break;
	  case 'downloadInvoice':
		await routeHandler.downloadInvoice(req, res)
		break;
	  case 'deleteInvoiceFile':
		await routeHandler.deleteInvoiceFile(req, res)
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

export default authMiddleware(handler)
