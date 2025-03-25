import { authMiddleware } from '../../../lib/authMiddleware';
import {
	Users,
	TemplateCategory,
	Templates,
	TemplatePage,
	Theme,
	SocialType,
	SocialPack,
	CampaignVisit,
	CampaignLink,
	Campaigns,
	Plans,
	AdminSettings,
	OrderList,
	Coupons,
	BillingModel
} from '../../../models/DB';
import Common from '../../../helpers/Common';
import CommonAPI from '../../../helpers/CommonAPI';
import md5 from 'md5';
import { defaultThemeData } from '../../../helpers/Constant';
import { defaultCurrency } from '../../../src/helper/currencies';
import { duration } from 'moment';

const routeHandler = {}

routeHandler.getUsers = async (req, res) => {
	let postdata = req.body;
	try {
		if (req._IS_ADMIN_ACCOUNT) {
			let page = parseInt(postdata.page || 1);
			let limit = parseInt(postdata.listPerPage || config.listPerPage);
			let skip = (page - 1) * limit;
			let query = { role: 2 };
			if (postdata.searchTerm != "") {
				postdata.searchTerm = postdata.searchTerm.trim();
				query = {
					role: 2,
					$or: [
						{
							name: {
								$regex: postdata.searchTerm,
								$options: "i",
							},
						},
						{
							email: {
								$regex: postdata.searchTerm,
								$options: "i",
							},
						},
					],
				};
			}

			let users = await Users.find(query)
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
			let totalUser = await Users.find(query).countDocuments();
			let pageCounts = Math.ceil(totalUser / limit);

			res.json({
				status: "success",
				message: "",
				data: users,
				totalUser: totalUser,
				perPage: limit,
				currentPage: page,
				pageCounts: pageCounts,
			});
		} else {
			res.json({
				message: "There was an error!",
				status: "error",
			});
		}
	} catch (err) {
		res.json({
			message: err,
			status: "error",
		});
	}
}



routeHandler.updateUserStatus = async (req, res) => {
	let postdata = req.body;
	try {
		if (req._IS_ADMIN_ACCOUNT) {
			let user_id = postdata.user_id;
			let userStatus = postdata.userStatus;
			userStatus = parseInt(userStatus);

			let where = { _id: user_id, role: 2 };
			await Users.updateOne(where, {
				$set: { status: userStatus },
			}).then(() => {
				res.json({
					status: "success",
					message: "We have updated user status successfully.",
				});
			});
		} else {
			res.json({
				message: "There was an error.",
				status: "error",
			});
		}
	} catch (err) {
		res.json({
			message: err,
			status: "error",
		});
	}
}

routeHandler.getSettings = async (req, res) => {
	try{
		let postdata = req.body;
		if(req._IS_ADMIN_ACCOUNT){
			let where = { 'parentId' : postdata.user_id};
			let settingData = await AdminSettings.findOne(where)
			if(settingData){
				res.json({
					status: "success",
					message: "",
					data : settingData
				});
			}
 		} else {
			res.json({
				message: "There was an error.",
				status: "error",
			});
		}
	} catch (err) {
		res.json({
			message: err,
			status: "error",
		});
	}
}


routeHandler.updatePlanStatus = async (req, res) => {
	let postdata = req.body;
	try {
		if (req._IS_ADMIN_ACCOUNT) {
			let plan_id = postdata.plan_id;
			let planStatus = postdata.planStatus;
			planStatus = parseInt(planStatus);

			let where = { _id: plan_id };
			await Plans.updateOne(where, {
				$set: { status: planStatus },
			}).then(() => {
				res.json({
					status: "success",
					message: "We have updated plan status successfully.",
				});
			});
		} else {
			res.json({
				message: "There was an error.",
				status: "error",
			});
		}
	} catch (err) {
		res.json({
			message: err,
			status: "error",
		});
	}
}

routeHandler.assignPlan = async (req,res) =>{
	let postdata = req.body
	try{
		let plandata = await Plans.findOne({'_id':postdata.planId})
		let userdata = await Users.findOne({'_id':postdata.user_id})
		if(!userdata){
			res.json({
				message: "User not found.",
				status: "error",
			});
		}
		// await OrderList.deleteMany({'customer_id' : userdata._id})
		// await Users.findOneAndUpdate({'_id': userdata._id},{'validityDate' : ''})

		// return
		let curr_data = await AdminSettings.findOne({});
		let currency = defaultCurrency.code;
		if(curr_data?.currency?.code) {
			currency = curr_data.currency.code;
		}

		let orderdetails = {
			invoice_id: '',
			amount: plandata.price,
			customer_id: userdata._id,
			validity : plandata.validity,
			shiping_details: '',
			title: plandata.planname,
			paymentStatus : 'succeeded',
			invoice_url: 'AdminAssigned',
			paymentMethod:'Manual',
			currency: currency
		  };
		  var ordersave = await OrderList.create(orderdetails);
				if(ordersave){
					if(userdata){
						let validityDate
						if(userdata.validityDate && userdata.validityDate !== ''){
							validityDate = userdata.validityDate
							let newDate = addDays(new Date(validityDate), plandata.validity);
							await Users.findOneAndUpdate({'_id' : userdata._id},{'validityDate' : newDate, planName: plandata.planname});
						} else {
							validityDate = addDays(new Date(), plandata.validity);
							await Users.findOneAndUpdate({'_id' : userdata._id},{'validityDate' : validityDate, planName: plandata.planname});
						}
					}
				}
				return res.json({ 
					status :'success',  
					message: 'Plan has successfully assigned to user', 
					data:''
				});
	} catch(err) {
		res.json({
			message: err,
			status: "error",
		});
	}
}
function addDays(theDate, days) {
	return new Date(theDate.getTime() + days*24*60*60*1000);
}
routeHandler.updateSettings = async (req, res) => {
	let postdata = req.body;
	try {
		if (req._IS_ADMIN_ACCOUNT) {

			let where = { 'parentId': postdata.user_id };
			let Exists = await AdminSettings.find(where)
			let settingdata = {
				stripeKey: postdata.stripeKey,
				stripeSecret: postdata.stripeSecret,
				paypalKey : postdata.paypalKey,
				paypalSecret : postdata.paypalSecret,
				currency: postdata.currency,
				isEnabled: postdata.isEnable,
				isAdEnabled:postdata.isAdEnable,
				paypalTestMode : postdata.paypalTestMode,
				isEnableBankTransfer : postdata.isEnableBankTransfer,
				bankTransferIns : postdata.instructions,
				razorpayKey : postdata.razorpayKey,
				razorpaySecret   : postdata.razorpaySecret
			}
			if(postdata.adScript) {
				settingdata.adScript = postdata.adScript
			}
			if(postdata.adScriptCode) [
				settingdata.adScriptCode = postdata.adScriptCode
			]
			if (Exists[0]) {
				await AdminSettings.updateOne(where, settingdata).then(() => {
					res.json({
						status: "success",
						message: "We have updated admin settings successfully.",
					});
				});
			} else {
				settingdata.parentId = postdata.user_id
				await AdminSettings.create(settingdata).then(() => {
					res.json({
						status: "success",
						message: "We have created admin settings successfully.",
					});
				});
			}
		} else {
			res.json({
				message: "There was an error.",
				status: "error",
			});
		}
	} catch (err) {
		res.json({
			message: err,
			status: "error",
		});
	}
}

routeHandler.deleteUser = async (req, res) => {
	let postdata = req.body;
	try {
		if (req._IS_ADMIN_ACCOUNT) {
			let user_id = postdata.user_id;

			let params = { userId: user_id };
			let delState = Common.deleteUserDBData(params);

			let where = { _id: user_id, role: 2 };
			await Users.deleteOne(where).then(() => {
				res.json({
					status: "success",
					message: "we have deleted user successfully.",
				});
			});
		} else {
			res.json({
				status: "error",
				message: "Something went wrong.",
			});
		}
	} catch (err) {
		res.json({
			status: "error",
			message: "Server error",
		});
	}
}

routeHandler.deletePlan = async (req, res) => {
	let postdata = req.body;
	try {
		if (req._IS_ADMIN_ACCOUNT) {
			let plan_id = postdata.plan_id;

			let where = { _id: plan_id };
			await Plans.deleteOne(where).then(() => {
				res.json({
					status: "success",
					message: "we have deleted plan successfully.",
				});
			});
		} else {
			res.json({
				status: "error",
				message: "Something went wrong.",
			});
		}
	} catch (err) {
		res.json({
			status: "error",
			message: "Server error",
		});
	}
}

routeHandler.updateUser = async (req, res) => {
  let postdata = req.body;
	let adminUser = req.vsuser;
	try {
		if (req._IS_ADMIN_ACCOUNT) {
			if (typeof postdata.id != "undefined" && postdata.id != "") {
				let where = {
					_id: postdata.id,
					role: 2,
				};
				let set = {
					name: postdata.name,
				};

				if (
					typeof postdata.password != "undefined" &&
					postdata.password != ""
				) {
					set.password = md5(postdata.password);
				}

				await Users.updateOne(where, {
					$set: set,
				}).then(() => {
					res.json({
						status: "success",
						message: "We have updated user successfully.",
					});
				});
			} else {
				let where = {
					email: postdata.email,
				};

				let userExists = await Users.findOne(where);
				if (userExists && typeof userExists._id != "undefined") {
					res.json({
						status: "error",
						message:
							"The email already exist. Please use another email.",
					});
				} else {
					let access_level = [];
					let newUser = {
						source: "Admin",
						parentId: adminUser._id,
						name: postdata.name,
						email: postdata.email,
						password: md5(postdata.password),
						ip: "",
						role: 2,
						status: 1,
						accessLevel: access_level,
					};

					await Users.create(newUser).then((user) => {
						if (user) {
							res.json({
								status: "success",
								message: "We have created user successfully.",
								data: { id: user._id },
							});
						} else {
							res.json({
								status: "error",
								message: "Something went wrong.",
							});
						}
					});
				}
			}
		} else {
			res.json({
				status: "error",
				message: "Something went wrong.",
			});
		}
	} catch (err) {
		res.json({
			status: "error",
			message: "Server error",
		});
	}
}

routeHandler.addPlan = async (req, res) => {
	let postdata = req.body;
	let adminUser = req.vsuser;

	try {
		if (req._IS_ADMIN_ACCOUNT) {
			if (typeof postdata.id != "undefined" && postdata.id != "") {
				let where = {
					_id: postdata.id,
				};
				let set = {
					planname: postdata.planname,
				};

				if (
					typeof postdata.price != "undefined" &&
					postdata.price != ""
				) {
					set.price = postdata.price;
				}
				if (
					typeof postdata.validity != "undefined" &&
					postdata.validity != ""
				) {
					set.validity = postdata.validity;
				}

				await Plans.updateOne(where, {
					$set: set,
				}).then(() => {
					res.json({
						status: "success",
						message: "We have updated plan successfully.",
					});
				});
			} else {

				let where = {
					planname: postdata.planname,
				};

				let planExists = await Plans.findOne(where);
				if (planExists && typeof planExists._id != "undefined") {
					res.json({
						status: "error",
						message:
							"The plan already exist. Please use another plan name.",
					});
				} else {
					let newPlan = {
						source: "Admin",
						parentId: adminUser._id,
						planname: postdata.planname,
						price: postdata.price,
						validity: postdata.validity,
					};
					await Plans.create(newPlan).then((plan) => {
						if (plan) {
							res.json({
								status: "success",
								message: "We have created plan successfully.",
								data: { id: plan._id },
							});
						} else {
							res.json({
								status: "error",
								message: "Something went wrong.",
							});
						}
					});
				}
			}
		} else {
			res.json({
				status: "error",
				message: "Something went wrong.",
			});
		}
	} catch (err) {
		res.json({
			status: "error",
			message: "Server error",
		});
	}
}

routeHandler.getCategories = async (req, res) => {
	let postdata = req.body;
	try {
		let page = parseInt(postdata.page || 1);
		let limit = parseInt(postdata.listPerPage || config.listPerPage);
		let skip = (page - 1) * limit;
		let query = {};

		if (
			typeof postdata.searchTerm != "undefined" &&
			postdata.searchTerm != ""
		) {
			postdata.searchTerm = postdata.searchTerm.trim();
			query = {
				title: { $regex: postdata.searchTerm, $options: "i" },
			};
		}

		let categories = {};
		if (postdata.listPerPage == -1) {
			categories = await TemplateCategory.find(query)
				.sort({ createdAt: -1 })
				.catch((error) => {
					res.json({
						error: error,
						message: "There was an error!",
						status: "error",
					});
				});
		} else {
			categories = await TemplateCategory.find(query)
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
		}

		let totalCategory = await TemplateCategory.find(query).countDocuments();
		let pageCounts = Math.ceil(totalCategory / limit);

		res.json({
			status: "success",
			message: "",
			data: categories,
			totalCategory: totalCategory,
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

routeHandler.updateTemplateCategory = async (req, res) => {
	let postdata = req.body;
	try {
		if (typeof postdata.id != "undefined" && postdata.id != "") {
			let where = {
				_id: postdata.id,
			};
			let set = {
				title: postdata.name,
			};

			await TemplateCategory.updateOne(where, {
				$set: set,
			}).then(() => {
				res.json({
					status: "success",
					message: "We have updated the Category.",
				});
			});
		} else {
			let where = {
				title: postdata.name,
			};

			let categoryExists = await TemplateCategory.findOne(where);
			if (categoryExists && typeof categoryExists._id != "undefined") {
				res.json({
					status: "error",
					message:
						"Category name already exist. Please use another name.",
				});
			} else {
				let newCat = {
					title: postdata.name,
					status: 0
				};

				await TemplateCategory.create(newCat).then((category) => {
					res.json({
						status: "success",
						message: "We have created category successfully.",
						data: { id: category._id },
					});
				});
			}
		}
	} catch (err) {
		res.json({
			status: "error",
			message: "Server error",
		});
	}
}

routeHandler.deleteTemplateCategory = async (req, res) => {
	let postdata = req.body;
	try {
		let cat_id = postdata.category_id;

		let where = { _id: cat_id };
		await TemplateCategory.deleteOne(where).then(() => {
			res.json({
				status: "success",
				message: "we have deleted category successfully.",
			});
		});
	} catch (err) {
		res.json({
			status: "error",
			message: "Server error",
		});
	}
}

routeHandler.updateTemplateCategoryStatus = async (req, res) => {
	let postdata = req.body;
	try {
		let catId = postdata.category_id;
		let catStatus = postdata.catStatus;
		catStatus = parseInt(catStatus);

		let where = { _id: catId };
		await TemplateCategory.updateOne(where, {
			$set: { status: catStatus },
		}).then(() => {
			res.json({
				status: "success",
				message: "We have updated category status successfully.",
			});
		});
	} catch (err) {
		res.json({
			status: "error",
			message: "Server error",
		});
	}
}

routeHandler.createTemplate = async (req, res) => {
	let postdata = req.body;
	let adminUser = req.vsuser;
	try {
		let templateName = postdata.name;
		templateName = templateName.trim();
		let templateSlug = templateName.toLowerCase();
		templateSlug = templateSlug.replace(/[^A-Z0-9]+/gi, "-");
		let htmlThemeId = '';

		if (typeof postdata.html_theme_id != "undefined" && postdata.html_theme_id != "") {
			htmlThemeId = postdata.html_theme_id;
		}
		if (
			typeof postdata.category_id != "undefined" &&
			postdata.category_id != ""
		) {
			let catData = await TemplateCategory.findOne({
				_id: postdata.category_id,
			});
			if (catData && typeof catData._id != "undefined") {
				let templateExists = await Templates.findOne({
					slug: templateSlug,
				});
				if (
					templateExists &&
					typeof templateExists._id != "undefined"
				) {
					res.json({
						status: "error",
						message:
							"Template is already exist with this template name. Please user another name.",
					});
				} else {
					let userImage = "";
					if (typeof adminUser.profilePicture !== "undefined") {
						userImage = adminUser.profilePicture.key;
					}
					let fields = {
						userId: adminUser._id,
						title: templateName,
						slug: templateSlug,
						catId: catData._id,
						profile: {
							name: adminUser.name,
							image: userImage,
							tagline: "",
						},
						status: 0,
						html_theme_id: htmlThemeId,
					};
					await Templates.create(fields).then(async (template) => {
						let pageFields = {
							userId: adminUser._id,
							templateId: template._id,
							title: "Home",
							slug: "home",
							sort: 1,
							isDefault: 1,
						};
						await TemplatePage.create(pageFields).then(
							async (templatePage) => {
								//console.log(templatePage);
								/*let sectionFields = {
									templateId: template._id,
									pageId: templatePage._id,
									title: "Profile",
									type: "el_profile",
									isDefault: 1,
									sort: 1,
									sectionData: {
										name: adminUser.name,
										image: userImage,
										tagline: "",
									},
								};
								await TemplateSection.create(
									sectionFields
								).then((section) => {
									//console.log(section);
								});*/
							}
						);

						let templateFields = {};
						let themeData = await Theme.findOne({ isDefault: 1 });
						if (themeData && typeof themeData._id != "undefined") {
							templateFields.templateStyle = themeData.metaData;
							templateFields.themeId = themeData._id;
						} else {
							templateFields.templateStyle = defaultThemeData;
						}

						let socialPackData = await SocialPack.findOne({ isDefault: 1 });
						if (socialPackData && typeof socialPackData._id != "undefined") {
							templateFields.SocialIconData = socialPackData.iconList;
							templateFields.packId = socialPackData._id;
						}
						if (Object.keys(templateFields).length) {
							await Templates.updateOne({ _id: template._id }, {
								$set: templateFields,
							}).then(() => {
								//console.log("success");
							});
						}

						res.json({
							status: "success",
							message: "We have created template successfully.",
							data: { id: template._id },
						});
					});
				}
			} else {
				res.json({
					status: "error",
					message: "Something went wrong.",
				});
			}
		} else {
			res.json({
				status: "error",
				message: "Template category is missing.",
			});
		}
	} catch (err) {
		res.json({
			status: "error",
			message: "Server error",
		});
	}
}

routeHandler.getTemplates = async (req, res) => {
	let postdata = req.body;
	try {
		let page = parseInt(postdata.page || 1);
		let limit = parseInt(postdata.listPerPage || config.listPerPage);
		let skip = (page - 1) * limit;
		let query = {};
		if (
			typeof postdata.searchTerm != "undefined" &&
			postdata.searchTerm != ""
		) {
			postdata.searchTerm = postdata.searchTerm.trim();
			query = {
				$text: { $search: postdata.searchTerm },
			};
		}
		if (typeof postdata.category_id != 'undefined' && postdata.category_id != "") {
			query.catId = postdata.category_id;
		}

		let templates = {};
		if (postdata.listPerPage == -1) {
			templates = await Templates.find(query)
				.sort({ createdAt: -1 })
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
				.sort({ createdAt: -1 })
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

routeHandler.saveTemplate = async (req, res) => {
	let postdata = req.body;
	try {
		if (typeof postdata.id != "undefined" && postdata.id != "") {
			let templateData = postdata.templateData;

			let where = { _id: postdata.id };
			let set = {
				templateData: templateData,
			};

			await Templates.updateOne(where, {
				$set: set,
			}).then(() => {
				res.json({
					status: "success",
					message: "We have saved template successfully.",
				});
			});
		} else {
			res.json({
				status: "error",
				message: "Something went wrong.",
			});
		}
	} catch (err) {
		console.log(err);
		res.json({
			status: "error",
			message: "Server error",
		});
	}
}

routeHandler.updateTemplateStatus = async (req, res) => {
	let postdata = req.body;
	try {
		let templateId = postdata.id;
		let templateStatus = postdata.templateStatus;
		templateStatus = parseInt(templateStatus);

		let where = { _id: templateId };
		await Templates.updateOne(where, {
			$set: { status: templateStatus },
		}).then(() => {
			res.json({
				status: "success",
				message: "We have updated template status successfully.",
			});
		});
	} catch (err) {
		res.json({
			status: "error",
			message: "Server error",
		});
	}
}

routeHandler.createTemplatePage = async (req, res) => {
	let postdata = req.body;
	let adminUser = req.vsuser;
	try {
		let pageName = postdata.name;
		pageName = pageName.trim();
		let pageSlug = pageName.toLowerCase();
		pageSlug = pageSlug.replace(/[^A-Z0-9]+/gi, "-");

		if (
			typeof postdata.template_id != "undefined" &&
			postdata.template_id != ""
		) {
			let templateData = await Templates.findOne({
				_id: postdata.template_id,
			});
			if (templateData && typeof templateData._id != "undefined") {
				let pageExists = await TemplatePage.findOne({
					slug: pageSlug,
					templateId: templateData._id,
				});
				if (pageExists && typeof pageExists._id != "undefined") {
					res.json({
						status: "error",
						message:
							"Page is already exist with this name. Please user another name.",
					});
				} else {
					let totalTemplatePages = await TemplatePage.find({
						templateId: templateData._id,
					}).countDocuments();
					let fields = {
						userId: adminUser._id,
						templateId: templateData._id,
						title: pageName,
						slug: pageSlug,
						sort: totalTemplatePages + 1,
					};
					await TemplatePage.create(fields).then((templatePage) => {
						res.json({
							status: "success",
							message: "We have created page successfully.",
							data: templatePage,
						});
					});
				}
			} else {
				res.json({
					status: "error",
					message: "Something went wrong.",
				});
			}
		} else {
			res.json({
				status: "error",
				message: "Template id is missing.",
			});
		}
	} catch (err) {
		res.json({
			status: "error",
			message: "Server error",
		});
	}
}

routeHandler.getTemplatePages = async (req, res) => {
	let postdata = req.body;
	try {
		if (
			typeof postdata.template_id == "undefined" &&
			postdata.template_id == ""
		) {
			res.json({
				status: "error",
				message: "Something went wrong.",
			});
			return;
		}

		let page = parseInt(postdata.page || 1);
		let limit = parseInt(postdata.listPerPage || config.listPerPage);
		let skip = (page - 1) * limit;
		let query = {
			templateId: postdata.template_id,
		};
		if (
			typeof postdata.searchTerm != "undefined" &&
			postdata.searchTerm != ""
		) {
			postdata.searchTerm = postdata.searchTerm.trim();
			query = {
				templateId: postdata.template_id,
				$text: { $search: postdata.searchTerm },
			};
		}

		let templatePages = {};
		if (postdata.listPerPage == -1) {
			templatePages = await TemplatePage.find(query)
				.sort({ sort: 1 })
				.catch((error) => {
					res.json({
						error: error,
						message: "There was an error!",
						status: "error",
					});
				});
		} else {
			templatePages = await TemplatePage.find(query)
				.limit(limit)
				.skip(skip)
				.sort({ sort: 1 })
				.catch((error) => {
					res.json({
						error: error,
						message: "There was an error!",
						status: "error",
					});
				});
		}

		let totalTemplatePages = await TemplatePage.find(
			query
		).countDocuments();
		let pageCounts = Math.ceil(totalTemplatePages / limit);

		res.json({
			status: "success",
			message: "",
			data: templatePages,
			totalTemplatePages: totalTemplatePages,
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

routeHandler.getTemplatePage = async (req, res) => {
	let postdata = req.body;
	try {
		let validateFields = ["id"];
		let response = await Common.requestFieldsValidation(
			validateFields,
			postdata
		);
		if (response.status) {
			let where = {
				_id: postdata.id,
			};

			let templatePageData = await TemplatePage.findOne(where);
			if (
				templatePageData &&
				typeof templatePageData._id != "undefined"
			) {
				res.json({
					status: "success",
					message: "",
					data: templatePageData,
				});
			} else {
				res.json({
					status: "error",
					message: "We have not found template page.",
				});
			}
		} else {
			res.json({
				status: "error",
				message: "Something went wrong.",
			});
		}
	} catch (err) {
		console.log(err);
		res.json({
			status: "error",
			message: "Server error",
		});
	}
}

routeHandler.saveTemplatePage = async (req, res) => {
	let postdata = req.body;
	try {
		if (typeof postdata.id != "undefined" && postdata.id != "") {
			let templateData = postdata.templateData;

			let where = { _id: postdata.id };
			let set = {
				templateData: templateData,
			};

			await TemplatePage.updateOne(where, {
				$set: set,
			}).then(() => {
				res.json({
					status: "success",
					message: "We have saved page successfully.",
				});
			});
		} else {
			res.json({
				status: "error",
				message: "Something went wrong.",
			});
		}
	} catch (err) {
		console.log(err);
		res.json({
			status: "error",
			message: "Server error",
		});
	}
}

routeHandler.deleteTemplate = async (req, res) => {
	let postdata = req.body;
	let user = req.vsuser;
	try {
		let templateId = postdata.id;
		let where = { _id: templateId };

		let params = { userId: user._id, templateId: templateId };
		let delState = await Common.deleteTemplateDBData(params);

		let shoulddelete = await CommonAPI.getAllkeysOfFolder(
			templateId
		);
		if (shoulddelete && shoulddelete.status) {
			CommonAPI.deleteObjects(shoulddelete.keys);
		}

		await Templates.deleteOne(where).then(() => {
			res.json({
				status: "success",
				message: "we have deleted template successfully.",
			});
		});
	} catch (err) {
		res.json({
			status: "error",
			message: "Server error",
		});
	}
}

routeHandler.addTheme = async (req, res) => {
	let postdata = req.body;
	let user = req.vsuser;
	try {
		let validateFields = ["title"];
		let response = await Common.requestFieldsValidation(
			validateFields,
			postdata
		);
		if (response.status) {
			let themeName = postdata.title.trim();
			let where = { title: themeName };
			let themeData = await Theme.findOne(where);
			if (
				themeData &&
				typeof themeData._id != "undefined"
			) {
				res.json({
					status: "error",
					message: "Theme is already exist with this name. Please use another name.",
				});
			} else {
				let fields = {
					userId: user._id,
					title: themeName,
					status: 0
				};
				await Theme.create(fields).then((result) => {
					if (result) {
						res.json({
							status: "success",
							message: "We have created theme successfully.",
							data: { id: result._id },
						});
					} else {
						res.json({
							status: "error",
							message: "Something went wrong.",
						});
					}
				});
			}
		} else {
			res.json({
				status: "error",
				message: "Something went wrong.",
			});
		}
	} catch (err) {
		res.json({
			status: "error",
			message: "Server error",
		});
	}
}

routeHandler.editTheme = async (req, res) => {
	let postdata = req.body;
	try {
		let validateFields = ["id", "metaData"];
		let response = await Common.requestFieldsValidation(
			validateFields,
			postdata
		);
		if (response.status) {
			let where = { _id: postdata.id };
			let themeData = await Theme.findOne(where);
			if (
				themeData &&
				typeof themeData._id != "undefined"
			) {
				let set = {
					metaData: postdata.metaData
				};
				if (postdata.title) {
					let themeName = postdata.title.trim();
					let themeNameData = await Theme.findOne({ title: themeName, _id: { $ne: postdata.id } });
					if (themeNameData && themeNameData._id != 'undefined') {
						res.json({
							status: "error",
							message: "Theme is already exist with this name. Please use another name.",
						});
						return;
					} else {
						set.title = postdata.title;
					}
				}

				await Theme.updateOne(where, {
					$set: set,
				}).then(() => {
					res.json({
						status: "success",
						message: "We have saved successfully.",
					});
				});
			} else {
				res.json({
					status: "error",
					message: "Theme is not exist with this id.",
				});
			}
		} else {
			res.json({
				status: "error",
				message: "Something went wrong.",
			});
		}
	} catch (err) {
		res.json({
			status: "error",
			message: "Server error",
		});
	}
}

routeHandler.updateThemeStatus = async (req, res) => {
	let postdata = req.body;
	try {
		let validateFields = ["id", "themeStatus"];
		let response = await Common.requestFieldsValidation(
			validateFields,
			postdata
		);
		if (response.status) {
			let themeId = postdata.id;
			let themeStatus = postdata.themeStatus;
			themeStatus = parseInt(themeStatus);

			let where = { _id: themeId };
			await Theme.updateOne(where, {
				$set: { status: themeStatus },
			}).then(() => {
				res.json({
					status: "success",
					message: "We have updated theme status successfully.",
				});
			});
		} else {
			res.json({
				status: "error",
				message: "Something went wrong.",
			});
		}
	} catch (err) {
		res.json({
			status: "error",
			message: "Server error",
		});
	}
}

routeHandler.deleteTheme = async (req, res) => {
	let postdata = req.body;
	try {
		let validateFields = ["id"];
		let response = await Common.requestFieldsValidation(
			validateFields,
			postdata
		);
		if (response.status) {
			let themeId = postdata.id;

			let where = { _id: themeId };
			await Theme.deleteOne(where).then(() => {
				res.json({
					status: "success",
					message: "we have deleted theme successfully.",
				});
			});
		} else {
			res.json({
				status: "error",
				message: "Something went wrong.",
			});
		}
	} catch (err) {
		res.json({
			status: "error",
			message: "Server error",
		});
	}
}

routeHandler.getTheme = async (req, res) => {
	let postdata = req.body;
	try {
		let where = { _id: postdata.id };
		let themeData = await Theme.findOne(where);

		res.json({
			status: "success",
			message: "",
			data: themeData,
		});
	} catch (err) {
		res.json({
			status: "error",
			message: "Server error",
		});
	}
}

routeHandler.addSocialType = async (req, res) => {
	let postdata = req.body;
	let user = req.vsuser;
	try {
		let validateFields = ["name", "itype"];
		let response = await Common.requestFieldsValidation(
			validateFields,
			postdata
		);
		if (response.status) {
			let socialName = postdata.name.trim();
			let itype = postdata.itype.trim();
			let where = { name: socialName };
			let socialData = await SocialType.findOne(where);
			if (
				socialData &&
				typeof socialData._id != "undefined"
			) {
				res.json({
					status: "error",
					message: "Social type is already exist with this name. Please use another name.",
				});
			} else {
				let fields = {
					userId: user._id,
					name: socialName,
					itype: itype,
					status: 0
				};
				await SocialType.create(fields).then((result) => {
					if (result) {
						res.json({
							status: "success",
							message: "We have created social type successfully.",
							data: { id: result._id },
						});
					} else {
						res.json({
							status: "error",
							message: "Something went wrong.",
						});
					}
				});
			}
		} else {
			res.json({
				status: "error",
				message: "Something went wrong.",
			});
		}
	} catch (err) {
		res.json({
			status: "error",
			message: "Server error",
		});
	}
}

routeHandler.updateSocialType = async (req, res) => {
	let postdata = req.body;
	try {
		let validateFields = ["name", "type_id"];
		let response = await Common.requestFieldsValidation(
			validateFields,
			postdata
		);
		if (response.status) {
			let typeId = postdata.type_id;
			let socialName = postdata.name.trim();
			let where = { _id: typeId };
			let socialData = await SocialType.findOne(where);
			if (
				socialData &&
				typeof socialData._id != "undefined"
			) {
				await SocialType.updateOne(where, {
					$set: { name: socialName },
				}).then(() => {
					res.json({
						status: "success",
						message: "We have updated social type successfully.",
					});
				});
			} else {
				res.json({
					status: "error",
					message: "Social type is not exist.",
				});
			}
		} else {
			res.json({
				status: "error",
				message: "Something went wrong.",
			});
		}
	} catch (err) {
		res.json({
			status: "error",
			message: "Server error",
		});
	}
}

routeHandler.updateSocialTypeStatus = async (req, res) => {
	let postdata = req.body;
	try {
		let validateFields = ["type_id", "typeStatus"];
		let response = await Common.requestFieldsValidation(
			validateFields,
			postdata
		);
		if (response.status) {
			let typeId = postdata.type_id;
			let typeStatus = postdata.typeStatus;
			typeStatus = parseInt(typeStatus);
			let where = { _id: typeId };
			let socialData = await SocialType.findOne(where);
			if (
				socialData &&
				typeof socialData._id != "undefined"
			) {
				await SocialType.updateOne(where, {
					$set: { status: typeStatus },
				}).then(() => {
					res.json({
						status: "success",
						message: "We have updated social type successfully.",
					});
				});
			} else {
				res.json({
					status: "error",
					message: "Social type is not exist.",
				});
			}
		} else {
			res.json({
				status: "error",
				message: "Something went wrong.",
			});
		}
	} catch (err) {
		res.json({
			status: "error",
			message: "Server error",
		});
	}
}

routeHandler.deleteSocialType = async (req, res) => {
	let postdata = req.body;
	try {
		let typeId = postdata.type_id;

		let where = { _id: typeId };
		await SocialType.deleteOne(where).then(() => {
			res.json({
				status: "success",
				message: "we have deleted social type successfully.",
			});
		});
	} catch (err) {
		res.json({
			status: "error",
			message: "Server error",
		});
	}
}

routeHandler.addSocialPack = async (req, res) => {
	let postdata = req.body;
	let user = req.vsuser;
	try {
		let validateFields = ["name"];
		let response = await Common.requestFieldsValidation(
			validateFields,
			postdata
		);
		if (response.status) {
			let socialPackName = postdata.name.trim();
			let where = { name: socialPackName };
			let socialPackData = await SocialPack.findOne(where);
			if (
				socialPackData &&
				typeof socialPackData._id != "undefined"
			) {
				res.json({
					status: "error",
					message: "Social pack is already exist with this name. Please use another name.",
				});
			} else {
				let fields = {
					userId: user._id,
					name: socialPackName,
					status: 0
				};
				await SocialPack.create(fields).then(async (result) => {
					if (result) {
						let socialTypes = await SocialType.find({});
						if (socialTypes) {
							let icon_list = [];
							socialTypes.map((item, index) => {
								icon_list.push({
									id: item.id,
									name: item.name,
									itype: item.itype,
									status: 1,
									svg_code: '',
									value: ''
								});
							});
							await SocialPack.updateOne({ _id: result._id }, {
								$set: { iconList: icon_list },
							}).then(() => {
								//console.log("Success");
							});
						}

						res.json({
							status: "success",
							message: "We have created social pack successfully.",
							data: { id: result._id },
						});
					} else {
						res.json({
							status: "error",
							message: "Something went wrong.",
						});
					}
				});
			}
		} else {
			res.json({
				status: "error",
				message: "Something went wrong.",
			});
		}
	} catch (err) {
		res.json({
			status: "error",
			message: "Server error",
		});
	}
}

routeHandler.deleteSocialPack = async (req, res) => {
	let postdata = req.body;
	try {
		let packId = postdata.pack_id;

		let where = { _id: packId };
		let socialPackData = await SocialPack.findOne(where, {
			isDefault: 1,
		});
		if (socialPackData && typeof socialPackData != 'undefined') {
			if (socialPackData.isDefault) {
				res.json({
					status: "error",
					message: "you can not delete the default social pack.",
				});
			} else {
				await SocialPack.deleteOne(where).then(() => {
					res.json({
						status: "success",
						message: "we have deleted social pack successfully.",
					});
				});
			}
		} else {
			res.json({
				status: "error",
				message: "Something went wrong.",
			});
		}
	} catch (err) {
		res.json({
			status: "error",
			message: "Server error",
		});
	}
}

routeHandler.updateSocialPackStatus = async (req, res) => {
	let postdata = req.body;
	try {
		let validateFields = ["pack_id", "packStatus"];
		let response = await Common.requestFieldsValidation(
			validateFields,
			postdata
		);
		if (response.status) {
			let packId = postdata.pack_id;
			let packStatus = postdata.packStatus;
			packStatus = parseInt(packStatus);
			let where = { _id: packId };
			let socialPackData = await SocialPack.findOne(where);
			if (
				socialPackData &&
				typeof socialPackData._id != "undefined"
			) {
				await SocialPack.updateOne(where, {
					$set: { status: packStatus },
				}).then(() => {
					res.json({
						status: "success",
						message: "We have updated social pack successfully.",
					});
				});
			} else {
				res.json({
					status: "error",
					message: "Social type is not exist.",
				});
			}
		} else {
			res.json({
				status: "error",
				message: "Something went wrong.",
			});
		}
	} catch (err) {
		res.json({
			status: "error",
			message: "Server error",
		});
	}
}

routeHandler.updateSocialPack = async (req, res) => {
	let postdata = req.body;
	try {
		let validateFields = ["name", "pack_id"];
		let response = await Common.requestFieldsValidation(
			validateFields,
			postdata
		);
		if (response.status) {
			let packId = postdata.pack_id;
			let socialPackName = postdata.name.trim();
			let where = { _id: packId };
			let socialPackData = await SocialPack.findOne(where);
			if (
				socialPackData &&
				typeof socialPackData._id != "undefined"
			) {
				await SocialPack.updateOne(where, {
					$set: { name: socialPackName },
				}).then(() => {
					res.json({
						status: "success",
						message: "We have updated social pack successfully.",
					});
				});
			} else {
				res.json({
					status: "error",
					message: "Social type is not exist.",
				});
			}
		} else {
			res.json({
				status: "error",
				message: "Something went wrong.",
			});
		}
	} catch (err) {
		res.json({
			status: "error",
			message: "Server error",
		});
	}
}

routeHandler.editSocialPackIcon = async (req, res) => {
	let postdata = req.body;
	try {
		let validateFields = ["pack_id", "icon_list"];
		let response = await Common.requestFieldsValidation(
			validateFields,
			postdata
		);
		if (response.status) {
			let packId = postdata.pack_id;
			let icon_list = postdata.icon_list;
			let where = { _id: packId };
			let socialPackData = await SocialPack.findOne(where);
			if (
				socialPackData &&
				typeof socialPackData._id != "undefined"
			) {
				await SocialPack.updateOne(where, {
					$set: { iconList: icon_list },
				}).then(() => {
					res.json({
						status: "success",
						message: "We have updated social pack successfully.",
					});
				});
			} else {
				res.json({
					status: "error",
					message: "Social type is not exist.",
				});
			}
		} else {
			res.json({
				status: "error",
				message: "Something went wrong.",
			});
		}
	} catch (err) {
		res.json({
			status: "error",
			message: "Server error",
		});
	}
}

routeHandler.getSocialTypes = async (req, res) => {
	let postdata = req.body;
	try {
		let page = parseInt(postdata.page || 1);
		let limit = parseInt(postdata.listPerPage || config.listPerPage);
		let skip = (page - 1) * limit;
		let query = {};

		let socialTypes = {};
		if (postdata.listPerPage == -1) {
			socialTypes = await SocialType.find(query)
				.sort({ createdAt: -1 })
				.catch((error) => {
					res.json({
						error: error,
						message: "There was an error!",
						status: "error",
					});
				});
		} else {
			socialTypes = await SocialType.find(query)
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
		}

		let totalTypes = await SocialType.find(query).countDocuments();
		let pageCounts = Math.ceil(totalTypes / limit);

		res.json({
			status: "success",
			message: "",
			data: socialTypes,
			totalTypes: totalTypes,
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

routeHandler.getSocialPacks = async (req, res) => {
	let postdata = req.body;
	try {
		let page = parseInt(postdata.page || 1);
		let limit = parseInt(postdata.listPerPage || config.listPerPage);
		let skip = (page - 1) * limit;
		let query = {};

		let socialPacks = {};
		if (postdata.listPerPage == -1) {
			socialPacks = await SocialPack.find(query)
				.sort({ createdAt: -1 })
				.catch((error) => {
					res.json({
						error: error,
						message: "There was an error!",
						status: "error",
					});
				});
		} else {
			socialPacks = await SocialPack.find(query)
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
		}

		let totalPacks = await SocialPack.find(query).countDocuments();
		let pageCounts = Math.ceil(totalPacks / limit);

		res.json({
			status: "success",
			message: "",
			data: socialPacks,
			totalPacks: totalPacks,
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

routeHandler.getSocialPack = async (req, res) => {
	let postdata = req.body;
	try {
		let validateFields = ["pack_id"];
		let response = await Common.requestFieldsValidation(
			validateFields,
			postdata
		);
		if (response.status) {
			let where = {
				_id: postdata.pack_id,
			};

			let socialPackData = await SocialPack.findOne(where);
			if (
				socialPackData &&
				typeof socialPackData._id != "undefined"
			) {
				res.json({
					status: "success",
					message: "",
					data: socialPackData,
				});
			} else {
				res.json({
					status: "error",
					message: "We have not found social pack.",
				});
			}
		} else {
			res.json({
				status: "error",
				message: "Something went wrong.",
			});
		}
	} catch (err) {
		console.log(err);
		res.json({
			status: "error",
			message: "Server error",
		});
	}
}

routeHandler.getDashboardAnalytics = async (req, res) => {
	try {
		let totalMonthlyVisitor = 0, totalWeeklyVisitor = 0, totalWeeklyClicks = 0;
		let today = new Date();

		let qurGroup = {
			$group: {
				_id: null,
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
			{ $match: where2 },
		];
		query.push(qurGroup);
		query.push(qurProject);
		let monthlyVisitResult = await CampaignVisit.aggregate(query).exec();
		if (monthlyVisitResult && monthlyVisitResult.length) {
			totalMonthlyVisitor = monthlyVisitResult[0].totalVisitor;
		}

		let query2 = [
			{ $match: where3 },
		];
		query2.push(qurGroup);
		query2.push(qurProject);
		let weeklyVisitResult = await CampaignVisit.aggregate(query2).exec();
		if (weeklyVisitResult && weeklyVisitResult.length) {
			totalWeeklyVisitor = weeklyVisitResult[0].totalVisitor;
		}

		let query3 = [
			{ $match: where4 },
		];
		query3.push(qurGroup);
		query3.push(qurProject);
		let weeklyClickResult = await CampaignLink.aggregate(query3).exec();
		if (weeklyClickResult && weeklyClickResult.length) {
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
	} catch (err) {
		console.log(err);
		res.json({
			status: "error",
			message: "Server error",
		});
	}
}

routeHandler.getAllCampaigns = async (req, res) => {
	let postdata = req.body;
	try {
		let validateFields = ["page", "listPerPage"];
		let response = await Common.requestFieldsValidation(
			validateFields,
			postdata
		);
		if (response.status) {
			let page = parseInt(postdata.page || 1);
			let limit = parseInt(postdata.listPerPage || config.listPerPage);
			let skip = (page - 1) * limit;

			let query = [
				{
					$lookup: {
						from: "users",
						localField: "userId",
						foreignField: "_id",
						as: "userDetails"
					}
				},
				{
					// bug to be fixed @aarshi
					$lookup: {
						from: "removetest_test_campaignvisits",
						localField: "_id",
						foreignField: "templateId",
						as: "campaignVisits"
					}
				},
				{
					$lookup: {
						from: "removetest_test_campaignlinks",
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
						createdAt: 1,
						updatedAt: 1,
						userDetails: {
							name: 1,
							email: 1
						},
						totalVisits: { $sum: "$campaignVisits.visitCount" },
						totalClicks: { $sum: "$campaignClicks.visitCount" }
					},
				},
			];

			let results = await Campaigns.aggregate(query).exec();

			let totalCampaigns = await Campaigns.find().countDocuments();
			let pageCounts = Math.ceil(totalCampaigns / limit);

			res.json({
				status: "success",
				message: "",
				data: results,
				totalCampaigns: totalCampaigns,
				perPage: limit,
				currentPage: page,
				pageCounts: pageCounts,
			});
		} else {
			res.json({
				status: 'error',
				message: 'Something went wrong.'
			});
		}
	} catch (err) {
		console.log(err);
		res.json({
			status: "error",
			message: "Server error",
		});
	}
}


routeHandler.updateEmailSettings = async(req,res) =>{
	let postdata = req.body
	try{
		if (req._IS_ADMIN_ACCOUNT) {

			let where = { 'parentId': postdata.user_id };
			let settingdata = {}
			settingdata.name = postdata.name

			let Exists = await AdminSettings.find(where)

			if(postdata.name == 'Mandrill'){
				settingdata.mandrillKey= postdata.mandrillKey
			} 
			else if(postdata.name == 'Sendgrid'){
				settingdata.sendgridKey = postdata.sendgridKey
				// settingdata.sendgridSecret = postdata.sendgridSecret
			} 
			else if(postdata.name == 'SMTP'){
					settingdata.smtpHost = postdata.smtpHost,
					settingdata.smtpPort = postdata.smtpPort,
					settingdata.smtpUsername = postdata.smtpUsername,
					settingdata.smtpPassword = postdata.smtpPassword
			}
			if (Exists[0]) {
				await AdminSettings.updateOne(where, {$set : {emailSettings : settingdata}}).then(() => {
					res.json({
						status: "success",
						message: "We have updated admin settings successfully.",
					});
				});
			} else {
				let createData = {
					parentId : postdata.user_id,
					emailSettings : settingdata
				}
				await AdminSettings.create(createData).then(() => {
					res.json({
						status: "success",
						message: "We have created admin settings successfully.",
					});
				});
			}
		} else {
			res.json({
				message: "There was an error.",
				status: "error",
			});
		}
	} catch (err) {
		res.json({
			status: "error",
			message: "Server error",
		});
	}
}


routeHandler.updateCouponStatus = async (req, res) => {
	let postdata = req.body;
	try {
		if (req._IS_ADMIN_ACCOUNT) {
			let coupon_id = postdata.coupon_id;
			let couponStatus = postdata.couponStatus;
			couponStatus = parseInt(couponStatus);

			let where = { _id: coupon_id };
			await Coupons.updateOne(where, {
				$set: { status: couponStatus },
			}).then(() => {
				res.json({
					status: "success",
					message: "We have updated coupon status successfully.",
				});
			});
		} else {
			res.json({
				message: "There was an error.",
				status: "error",
			});
		}
	} catch (err) {
		res.json({
			message: err,
			status: "error",
		});
	}
}


routeHandler.deleteCoupon = async (req, res) => {
	let postdata = req.body;
	try {
		if (req._IS_ADMIN_ACCOUNT) {
			let coupon_id = postdata.coupon_id;

			let where = { _id: coupon_id };
			await Coupons.deleteOne(where).then(() => {
				res.json({
					status: "success",
					message: "We have deleted coupon successfully.",
				});
			});
		} else {
			res.json({
				status: "error",
				message: "Something went wrong.",
			});
		}
	} catch (err) {
		res.json({
			status: "error",
			message: "Server error",
		});
	}
}

routeHandler.addCoupon = async (req, res) =>{
	let postdata = req.body;
	let adminUser = req.vsuser;
	try {
		if (req._IS_ADMIN_ACCOUNT) {
			if (typeof postdata.id != "undefined" && postdata.id != "") {
				let where = {
					_id: postdata.id,
				};
				let set = {
					couponName: postdata.couponName,
				};
				if (typeof postdata.discountType != "undefined" && postdata.discountType != "") {
					set.discountType = postdata.discountType;
				}
				if (typeof postdata.discountType != "undefined" && postdata.discountType != "") {
					set.couponCode = postdata.couponCode;
				}
				if (typeof postdata.discount != "undefined" && postdata.discount != "") {
					set.discount = postdata.discount;
				}
				if (typeof postdata.duration != "undefined" && postdata.duration != "") {
					set.duration = postdata.duration;
				}
				if (typeof postdata.minAmount != "undefined" && postdata.minAmount != "") {
					set.minAmount = postdata.minAmount;
				}

				await Coupons.updateOne(where, {
					$set: set,
				}).then(() => {
					res.json({
						status: "success",
						message: "We have updated coupon successfully.",
					});
				});
			} else {

				let where = {
					couponCode: postdata.couponCode,
				};

				let couponExists = await Coupons.findOne(where);
				if (couponExists && typeof couponExists._id != "undefined") {
					res.json({
						status: "error",
						message:
							"The coupon code already exist. Please use different coupon code.",
					});
				} else {
					let newcoupon = {
						source: "Admin",
						parentId: adminUser._id,
						couponName: postdata.couponName,
						couponCode: postdata.couponCode,
						discountType: postdata.discountType,
						discount : postdata.discount,
						duration: postdata.duration,
						minAmount : postdata.minAmount
					};
					await Coupons.create(newcoupon).then((coupon) => {
						if (coupon) {
							res.json({
								status: "success",
								message: "We have created coupon successfully.",
								data: { id: coupon._id },
							});
						} else {
							res.json({
								status: "error",
								message: "Something went wrong.",
							});
						}
					});
				}
			}
		} else {
			res.json({
				status: "error",
				message: "Something went wrong.",
			});
		}
	} catch (err) {
		res.json({
			status: "error",
			message: "Server error",
		});
	}
}

routeHandler.getPendingPayments = async( req, res) =>{
 try {
	let where = {'paymentMethod' : 'Bank Transfer', paymentStatus : 'Pending'}
	let sortData  = {createdAt : -1};

	let payments = await BillingModel.find(where).populate('customer_id', 'name email').sort(sortData)
	let totalcount = await BillingModel.find(where).countDocuments();
	if(payments) {
		res.json({
			status: "success",
			message: "",
			data: payments,
			totalcount : totalcount,
		});
	} else
	res.json({
		status: "error",
		message: "No pending payments.",
	});

 } catch (err) {
	res.json({
		status: "error",
		message: "Server error",
	});
 }
}

routeHandler.updatePaymentStatus = async(req, res) =>{
	try{
		let id = req.body.payment_id
		let payment = await BillingModel.findOne({'_id' : id})
		if(payment){
			let userid = payment.customer_id
			await BillingModel.findOneAndUpdate({'_id': id},{paymentStatus : 'Approved'})

			let plan = await Plans.findOne({'_id' : payment.planId})
			let userdata = await Users.findOne({'_id' : userid})
			if(userdata) {
				let validityDate
				if(userdata.validityDate && userdata.validityDate !== ''){
					validityDate = userdata.validityDate
					let newDate = addDays(new Date(validityDate), plan.validity);
					await Users.findOneAndUpdate({'_id' : userid},{'validityDate' : newDate});
				} else {
					validityDate = addDays(new Date(), plan.validity);
					await Users.findOneAndUpdate({'_id' : userid},{'validityDate' : validityDate});
				}	
				res.json({
					status: "success",
					message: "Payment approved.",
					data: '',
				});	
			} 
		}
	} catch (err) {
		res.json({
			status: "error",
			message: "Server error",
		});
	 }
}

async function handler(req, res) {
	const { adminSlug } = req.query
	let routeFlag = true

	if (req.method === 'POST') {
		switch (adminSlug) {
			case 'getUsers':
				await routeHandler.getUsers(req, res)
				break;
			case 'addCoupon':
				await routeHandler.addCoupon(req, res)
				break;
			case 'deleteCoupon':
				await routeHandler.deleteCoupon(req, res)
				break;
			case 'updateCouponStatus':
				await routeHandler.updateCouponStatus(req, res)
				break;
			case 'updateUserStatus':
				await routeHandler.updateUserStatus(req, res)
				break;
			case 'updatePlanStatus':
				await routeHandler.updatePlanStatus(req, res)
				break;
			case 'getSettings':
				await routeHandler.getSettings(req, res)
				break;
			case 'updateSettings':
				await routeHandler.updateSettings(req, res)
				break;
			case 'deleteUser':
				await routeHandler.deleteUser(req, res)
				break;
			case 'deletePlan':
				await routeHandler.deletePlan(req, res)
				break;
			case 'updateUser':
				await routeHandler.updateUser(req, res)
				break;
			case 'addPlan':
				await routeHandler.addPlan(req, res)
				break;
			case 'getCategories':
				await routeHandler.getCategories(req, res)
				break;
			case 'updateTemplateCategory':
				await routeHandler.updateTemplateCategory(req, res)
				break;
			case 'deleteTemplateCategory':
				await routeHandler.deleteTemplateCategory(req, res)
				break;
			case 'updateTemplateCategoryStatus':
				await routeHandler.updateTemplateCategoryStatus(req, res)
				break;
			case 'createTemplate':
				await routeHandler.createTemplate(req, res)
				break;
			case 'getTemplates':
				await routeHandler.getTemplates(req, res)
				break;
			case 'saveTemplate':
				await routeHandler.saveTemplate(req, res)
				break;
			case 'updateTemplateStatus':
				await routeHandler.updateTemplateStatus(req, res)
				break;
			case 'createTemplatePage':
				await routeHandler.createTemplatePage(req, res)
				break;
			case 'getTemplatePages':
				await routeHandler.getTemplatePages(req, res)
				break;
			case 'getTemplatePage':
				await routeHandler.getTemplatePage(req, res)
				break;
			case 'saveTemplatePage':
				await routeHandler.saveTemplatePage(req, res)
				break;
			case 'deleteTemplate':
				await routeHandler.deleteTemplate(req, res)
				break;
			case 'addTheme':
				await routeHandler.addTheme(req, res)
				break;
			case 'editTheme':
				await routeHandler.editTheme(req, res)
				break;
			case 'updateThemeStatus':
				await routeHandler.updateThemeStatus(req, res)
				break;
			case 'deleteTheme':
				await routeHandler.deleteTheme(req, res)
				break;
			case 'getTheme':
				await routeHandler.getTheme(req, res)
				break;
			case 'addSocialType':
				await routeHandler.addSocialType(req, res)
				break;
			case 'updateSocialType':
				await routeHandler.updateSocialType(req, res)
				break;
			case 'updateSocialTypeStatus':
				await routeHandler.updateSocialTypeStatus(req, res)
				break;
			case 'deleteSocialType':
				await routeHandler.deleteSocialType(req, res)
				break;
			case 'addSocialPack':
				await routeHandler.addSocialPack(req, res)
				break;
			case 'deleteSocialPack':
				await routeHandler.deleteSocialPack(req, res)
				break;
			case 'updateSocialPackStatus':
				await routeHandler.updateSocialPackStatus(req, res)
				break;
			case 'updateSocialPack':
				await routeHandler.updateSocialPack(req, res)
				break;
			case 'editSocialPackIcon':
				await routeHandler.editSocialPackIcon(req, res)
				break;
			case 'getSocialTypes':
				await routeHandler.getSocialTypes(req, res)
				break;
			case 'getSocialPacks':
				await routeHandler.getSocialPacks(req, res)
				break;
			case 'getSocialPack':
				await routeHandler.getSocialPack(req, res)
				break;
			case 'getDashboardAnalytics':
				await routeHandler.getDashboardAnalytics(req, res)
				break;
			case 'getAllCampaigns':
				await routeHandler.getAllCampaigns(req, res)
				break;
			case 'assignPlan':
				await routeHandler.assignPlan(req, res)
				break;
			case 'updateEmailSettings':
				await routeHandler.updateEmailSettings(req, res)
				break;
			case 'getPendingPayments':
				await routeHandler.getPendingPayments(req, res)
				break;
			case 'updatePaymentStatus':
				await routeHandler.updatePaymentStatus(req, res)
				break;
			default:
				routeFlag = false
		}
	} else {
		routeFlag = false
	}

	if (!routeFlag) {
		res.status(404).send('No route found.')
	}
}

export default authMiddleware(handler)
