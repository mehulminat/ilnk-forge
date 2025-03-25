import Jwt from 'jsonwebtoken';
import md5 from 'md5';
import fs from 'fs';
import dbConnect from '../../../lib/dbConnect';
import Common from '../../../helpers/Common';
import CommonAPI from '../../../helpers/CommonAPI';
import { Users, Plans, AdminSettings, Coupons } from '../../../models/DB';
import { defaultCurrency } from '../../../src/helper/currencies';
import { config } from 'process';
import BillingModel from '../../../models/OrderList';
import { equal } from 'assert';

const routeHandler = {}

routeHandler.login = async (req, res) => {
  let postdata = req.body;
	let data = {
		email: postdata.email,
		password: md5(postdata.password),
	};

  let user = await Users.findOne(data).catch((error) => {
		res.json({
			status: 'error',
			message: "There was an error!",
			d: error,
		})
	});

  if (!user) {
		res.json({
			status: 'error',
			message: "Couldn't find a LinkForge account associated with this email and password. Please try again.",
		})
	} else {
    if (user.status) {
		console.log("Came")
		if(user?.profilePicture != ''){
				try {
					const url = await CommonAPI.getObjectSignedURL(user.profilePicture?.file);
					user.profilePicture.file = url;
				} catch (error) {
					console.error(`Error updating image at index :`, error);
				}
			 
		   }

      let jwtdata = {};
			jwtdata.email = user.email;
			jwtdata.user_id = user._id;
			jwtdata.name = user.name;
			jwtdata.profile_img =
				user.profilePicture == undefined
					? ""
					: user.profilePicture.file;
			jwtdata.short_nm = Common.getShortName(user.name);
			jwtdata.role = user.role;
			jwtdata.createdAt = user.createdAt;
			let url = "";

			if(jwtdata.role == 1 ) {
				url = "admin/users";
			}else if (jwtdata.role == 2) {
				url = "user";
			} else {
				res.json({
					status: 'error',
					message: `Your login details is not correct.`,
				});
				return;
			}

			if(url) {
				let token = Jwt.sign(jwtdata, process.env.SESSION_SECRET, {
					expiresIn: "1d",
				});
				jwtdata.parentId = user.parentId;
				jwtdata.access_level = user.accessLevel;
				res.json({
					status: 'success',
					message: "You are successfully logged in.",
					token: token,
					url: url,
					data: jwtdata,
				})
			}
    } else {
			res.json({
				status: 'error',
				message: `Your LinkForge account has been deactivated.`,
			})
    }
  }
}

routeHandler.getParentID = async (req, res) => {
	const parentUser = await Users.findOne({
		role: 1,
	}).catch(() => {
		res.json({
			message: "There was an error!",
			status: 'error',
		})
	});

	if ( typeof(parentUser) !== "undefined" && parentUser !== null ) {
		res.json({
			status: 'success',
			message: '',
			data: parentUser.id,
		})
	} else {
		res.json({
			message: "There was an error2!",
			status: 'error',
		})
	}
}

routeHandler.register = async (req, res) => {
	console.log(req.body);
	const postdata = req.body;
	try {
		let parentUser = await Users.findOne({
			role: 1,
		}).catch(() => {
			res.json({
				message: "There was an error!",
				status: 'error',
			})
			return;
		});
		postdata.parentId = parentUser.id;
		let uEmail = postdata.email.toLowerCase();
		uEmail = uEmail.trim();
		let where = { email: uEmail };
		let user = await Users.findOne(where).catch((error) => {
			res.json({
				status: 'error',
				message: "There was an error!",
				d: error,
			})
		});
		if (!user) {
			let newUser = {
				source: "Self",
				parentId: postdata.parentId,
				name: postdata.name,
				email: uEmail,
				password: md5(postdata.password),
				ip: postdata.user_ip,
				role: 2,
				status: 0,
			};
			Users.create(newUser).then((user) => {
				fs.readFile(
					`${process.env.folderPath}/email_template/reg.txt`,
					"utf8",
					async (err, htmlToSend) => {
						if (err) {
							console.error(err);
							res.json({
								status: "error",
								message: "User has Created but error in sending email.",
								data: err
							});
							return;
						}
						let object = {
							"{member_name}": user.name,
							"{login_url}": process.env.APP_URL,
							"{member_email}": user.email,
							"{member_password}": postdata.password,
							"{activate_link}": `${process.env.APP_URL}verify/${user.id}`,
						};
						let replaces = Common.replaceItemByObj(htmlToSend, object);
						let params = {
							to: user.email,
							subject: "Welcome to LinkForge",
							html: replaces
						}
						let emailData = await AdminSettings.findOne()
						let settings = emailData.emailSettings
						let mailResponse
						if(emailData.emailSettings.name == 'Mandrill'){
							mailResponse = await CommonAPI.sendMailUsingMandrill(params,settings);
						}
						if(emailData.emailSettings.name == 'SMTP'){
							mailResponse = await CommonAPI.sendMailUsingSMTP(params, settings)
						}
						if(emailData.emailSettings.name == 'Sendgrid'){
							mailResponse = await CommonAPI.sendMailUsingSendgrid(params, settings)
						}
						
						//console.log(mailResponse);
						/* if(mailResponse.accepted.length > 0) {
							console.log("Success");
						}else {
							res.json({
								status: 'error',
								msg: "Something went wrong.",
								data: mailResponse.rejected[0].reject_reason
							});
						} */
						res.json({
							status: 'success',
							message: "You have registered successfully.",
							data: { id: user.id },
						})
					}
				)
			});
		} else {
			res.json({
				status: 'error',
				message: `Email is already used, Please use different email.`,
			})
		}
	}catch(err) {
		console.log(err);
		res.json({
			status: "error",
			message: "Server error",
		})
	}
}

routeHandler.userAccountActive = async (req, res) => {
	const postdata = req.body;
	try {
		let where = { _id: postdata.token };
		let userData = await Users.findOne(where).catch((error) => {
			res.json({
				message: "Invalid token.",
				status: 'error',
			});
			return;
		});
		if(userData && typeof userData != 'undefined') {
			await Users.updateOne(where, { $set: { status: 1 } }).then(() => {
				res.json({
					status: 'success',
					message: "User account is activated.",
				});
			});
		}else {
			res.json({
				status: "error",
				message: "Something went wrong.",
			});
		}
	}catch(err) {
		res.json({
			status: "error",
			message: "Invalid token.",
		});
	}
}

routeHandler.forgot = async (req, res) => {
	const postdata = req.body;
	let where = { email: postdata.email };
	let user = await Users.findOne(where).catch((error) => {
		res.status(500).json({
			status: 'error',
			message: "There was an error!",
			d: error,
		});
	});
	if (user) {
		if (user.status) {
			//if (!user.resetPasswordToken) {
				let token = uuid();
				user.updateOne({
					$set: { resetPasswordToken: token },
				}).then(() => {
					fs.readFile(
						`${process.env.folderPath}/email_template/forgot.txt`,
						"utf8",
						async (err, htmlToSend) => {
							if (err) {
								console.error(err);
								res.json({
									status: "error",
									message: "Something went wrong while sending email.",
									data: err
								});
								return;
							}
							let object = {
								"{member_name}": user.name,
								"{reset_url}": `${process.env.APP_URL}reset-password/${token}`,
							};
							let replaces = Common.replaceItemByObj(htmlToSend, object);
							let params = {
								to: user.email,
								subject: `Password Reset Link - ${process.env.SITE_TITLE}`,
								html: replaces
							}
							
							let emailData = await AdminSettings.findOne()
							let settings = emailData.emailSettings
							let mailResponse
							if (emailData.emailSettings.name == 'Mandrill') {
								mailResponse = await CommonAPI.sendMailUsingMandrill(params, settings);
							}
							if(emailData.emailSettings.name == 'SMTP'){
								mailResponse = await CommonAPI.sendMailUsingSMTP(params, settings)
							}
							if(emailData.emailSettings.name == 'Sendgrid'){
								mailResponse = await CommonAPI.sendMailUsingSendgrid(params, settings)
							}
              //console.log("mailResponse",mailResponse);
							if(mailResponse.accepted.length > 0) {
								res.json({
									status: 'success',
									message: 'Password reset link has been sent to your email.',
								});
							}else {
								res.json({
									status: 'error',
									message: 'Unable to send password reset link on your email, Please try again.',
								});
							}
						}
					);
				});
			// } else {
			// 	res.json({
			// 		status: 'error',
			// 		message: `We have sent you email already, Please check your email or try after 30 min.`,
			// 	});
			// }
		} else {
			res.json({
				status: 'error',
				message: `Your account is deactivated, please contact to support.`,
			});
		}
	} else {
		res.json({
			status: 'error',
			message: `We couldn't find your account.`,
		});
	}
}

routeHandler.checkResetToken = async (req, res) => {
	req.params = req.query;
	let token = req.params.token;
	if (!token) {
		res.json({
			status: 'error',
			message: "The reset token is not provided or has invalid characters.",
		});
		return;
	}
	const potentialUser = {
		where: { resetPasswordToken: token },
	};
	let user = await Users.findOne(potentialUser.where);
	if (!user) {
		res.json({
			status: 'error',
			message: "Password reset link is invalid or has expired.",
		});
	} else {
		res.json({
			status: 'success',
			message: "",
		});
	}
}

routeHandler.resetPassword = async (req, res) => {
	if (!req.body.password || !req.body.token) {
		console.log(req.body);
		res.json({
			status: 'error',
			message: "Parameters are missing",
		});
		return;
	}

	let { password } = req.body;
	let token = req.body.token;
	if (password === "") {
		res.json({
			status: 'error',
			message: "Enter your new password",
		});
		return;
	}

	const potentialUser = {
		where: { resetPasswordToken: token },
	};
	let user = await Users.findOne(potentialUser.where);
	if (!user) {
		res.json({
			status: 'error',
			message: "This link is invalid or has expired.",
		});
		return;
	}

	user.update({
		$set: {
			password: md5(password),
		},
		$unset: {
			resetPasswordToken: 1,
		},
	})
		.then(() => {
			res.json({
				status: 'success',
				message: "Your password has been changed.",
			});
		})
		.catch((err) => {
			res.json({
				message: "An error occurred while updating password.",
				data: { raw: err, string: err.toString() },
				status: 'error',
			});
		});
}


routeHandler.getPlans = async (req, res) =>{
	let postdata = req.body;
	try {
			let adminSetting = await AdminSettings.findOne({})
			if(adminSetting?.isEnabled !== true)
			{
				return res.json({
					status: 'success',
					message: "",
					data: {isEnabled: adminSetting.isEnabled}
				})
			}

		  let query = {}
 			let page = parseInt(postdata.page || 1);
			let limit = parseInt(postdata.listPerPage || config.listPerPage);
			let skip = (page - 1) * limit;
			if (postdata.status){
				query.status = 1
			}
			if (postdata.searchTerm && postdata.searchTerm !== "") {

				postdata.searchTerm = postdata.searchTerm.trim();
				query = {
					$or: [
						{
							planname: {
								$regex: postdata.searchTerm,
								$options: "i",
							},
						},
						{ "price"  : /^\d+$/.test(postdata.searchTerm) ? parseInt(postdata.searchTerm) : null},
						{ "validity"  : /^\d+$/.test(postdata.searchTerm) ? parseInt(postdata.searchTerm) : null},
					],
				};
			}

			let plans = await Plans.find(query)
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
			let totalPlans = await Plans.find(query).countDocuments();
			let pageCounts = Math.ceil(totalPlans / limit);
			let currencyObj = Object.assign({}, defaultCurrency);
			let stripeActive, paypalActive,bankTransferIns,bankTransferActive,razorpayActive
			if(adminSetting) {
				if(adminSetting.stripeKey != ''){
					stripeActive = true
				}
				if(adminSetting.paypalKey != ''){
					paypalActive = true
				}
				if(adminSetting.razorpayKey != ''){
					razorpayActive = true
				}
				if(adminSetting.isEnableBankTransfer == true && adminSetting.bankTransferIns !== ''){
					bankTransferActive = true
					bankTransferIns = adminSetting.bankTransferIns
				}
				currencyObj = adminSetting.currency;
			}

			res.json({
				status: "success",
				message: "",
				data: plans,
				stripeActive : stripeActive,
				paypalActive : paypalActive,
				razorpayActive : razorpayActive,
				bankTransferActive :bankTransferActive,
				bankTransferIns:bankTransferIns,
				totalPlan: totalPlans,
				perPage: limit,
				currency : currencyObj,
				currentPage: page,
				pageCounts: pageCounts,
			});
		
	} catch (err) {
		console.log(err)
		res.json({
			message: err,
			status: "error",
		});
	}
}


routeHandler.checkPlanFeature = async (req, res) => {
	try{
		let planFeature = await AdminSettings.findOne({});
		let isEnabled = planFeature?._id ? planFeature.isEnabled : false; 
		res.json({
			status : 'success',
			message: "",
			data : {isEnabled}
		});
	} catch (err) {
		res.json({
			message: err,
			status: "error",
		});
	}
}


routeHandler.getCoupons = async (req, res) =>{
	try{
		let postdata = req.body

		let query = {}
 			let page = parseInt(postdata.page || 1);
			let limit = parseInt(postdata.listPerPage || config.listPerPage);
			let skip = (page - 1) * limit;
			if (postdata.status){
				query.status = 1
			}
			if (postdata.couponCode){
				let couponExists = await Coupons.findOne({couponCode : postdata.couponCode})
				if(couponExists != null){
					query.couponCode = postdata.couponCode
					if(couponExists.duration == 'Once per user'){
						let user = await BillingModel.findOne({customer_id : postdata.userId, couponCode : postdata.couponCode})
						if(user){
							return res.json({
								message: 'Invalid coupon',
								status: "error",
							});
						}
					}
				}
				else {
					return res.json({
						message: 'Invalid coupon',
						status: "error",
					});
				}
			}
			if (postdata.searchTerm && postdata.searchTerm !== "") {

				postdata.searchTerm = postdata.searchTerm.trim();
				query = {
					$or: [
						{
							planname: {
								$regex: postdata.searchTerm,
								$options: "i",
							},
						},
						{ "couponName"  : /^\d+$/.test(postdata.searchTerm) ? parseInt(postdata.searchTerm) : null},
						{ "couponCode"  : /^\d+$/.test(postdata.searchTerm) ? parseInt(postdata.searchTerm) : null},
					],
				};
			}

			let CouponsData = await Coupons.find(query)
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

				if(CouponsData == ''){
					return res.json({
						message: 'Invalid coupon',
						status: "error",
					});
				}
				let totalCoupons = await Coupons.find(query).countDocuments();
				let pageCounts = Math.ceil(totalCoupons / limit);

			res.json({
				status: "success",
				message: "",
				data: CouponsData,
				totalCoupons: totalCoupons,
				perPage: limit,
				pageCounts: pageCounts,
			});
	} catch (err) {
		res.json({
			message: err,
			status: "error",
		});
	}
}

async function handler(req, res) {
  const { authSlug } = req.query
  let routeFlag = true
  await dbConnect();

  if (req.method === 'POST') {
    switch (authSlug) {
      case 'login': 
        await routeHandler.login(req, res)
        break;
	  	case 'getPlans': 
        await routeHandler.getPlans(req, res)
        break;
		case 'getCoupons': 
        await routeHandler.getCoupons(req, res)
        break;
      case 'getParentID':
        await routeHandler.getParentID(req, res)
        break;
			case 'checkPlanFeature':
        await routeHandler.checkPlanFeature(req, res)
        break;
			case 'register':
				await routeHandler.register(req, res)
				break;
			case 'userAccountActive':
				await routeHandler.userAccountActive(req, res)
				break;
			case 'forgot':
				await routeHandler.forgot(req, res)
				break;
			case 'checkResetToken':
				await routeHandler.checkResetToken(req, res)
				break;
			case 'resetPassword':
				await routeHandler.resetPassword(req, res)
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
