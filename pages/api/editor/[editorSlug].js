import { authMiddleware } from '../../../lib/authMiddleware';
import { 
  Templates,
	TemplatePage,
	TemplateSection,
	Theme,
	SocialPack,
	Campaigns,
	CampaignPage,
	CampaignSection,
} from '../../../models/DB';
import mongoose from 'mongoose';
import Common from '../../../helpers/Common';
import CommonAPI from '../../../helpers/CommonAPI';
import randomstring from 'randomstring';
import { uuid } from 'uuidv4';

const routeHandler = {}

routeHandler.addSection = async (req, res) => {
  let postdata = req.body;
	let user = req.vsuser;

	try {
		let validateFields = ["page_id", "template_id", "title", "type"];
		let response = await Common.requestFieldsValidation(
			validateFields,
			postdata
		);
		if (response.status) {
			let sectionTbl = TemplateSection;
			if(user.role != 1) {
				sectionTbl = CampaignSection;
			}
			let totalTemplateSections = await sectionTbl.find({
				templateId: postdata.template_id,
				pageId: postdata.page_id,
			}).countDocuments();
			let newSection = {
				templateId: postdata.template_id,
				pageId: postdata.page_id,
				title: postdata.title,
				type: postdata.type,
				sort: totalTemplateSections + 1,
			};

			if (typeof postdata.sectionData !== "undefined") {
				newSection.sectionData = postdata.sectionData;
			}

			await sectionTbl.create(newSection).then((section) => {
				res.json({
					status: "success",
					message: "We have created Section successfully.",
					data: section,
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


routeHandler.updateAnimation = async (req, res) => {
	let postdata = req.body;
	  let user = req.vsuser;
  
	  try {
		  let validateFields = ["section_id", "sectionData"];
		  let response = await Common.requestFieldsValidation(
			  validateFields,
			  postdata
		  );
		  if (response.status) {
			  let sectionTbl = TemplateSection;
			  if(user.role != 1) {
				  sectionTbl = CampaignSection;
			  }
			  let section_id = postdata.section_id;
			  let where = { _id: section_id };
			  let SectionData = await sectionTbl.findOne(where);
			  if (SectionData && typeof SectionData._id !== "undefined") {
				  let set = {
					  animation: postdata.animation,
				  };
				  await sectionTbl.updateOne(where, {
					  $set: set,
				  }).then(() => {
					  res.json({
						  status: "success",
						  message: "We have saved animation successfully.",
					  });
				  });
			  } else {
				  res.json({
					  status: "error",
					  message: "Something went wrong.",
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


routeHandler.saveSection = async (req, res) => {
  let postdata = req.body;
	let user = req.vsuser;

	try {
		let validateFields = ["section_id", "sectionData"];
		let response = await Common.requestFieldsValidation(
			validateFields,
			postdata
		);
		if (response.status) {
			let sectionTbl = TemplateSection;
			if(user.role != 1) {
				sectionTbl = CampaignSection;
			}
			let section_id = postdata.section_id;
			let where = { _id: section_id };
			let SectionData = await sectionTbl.findOne(where);
			if (SectionData && typeof SectionData._id !== "undefined") {
				let set = {
					sectionData: postdata.sectionData,
				};
				await sectionTbl.updateOne(where, {
					$set: set,
				}).then(() => {
					res.json({
						status: "success",
						message: "We have saved section successfully.",
					});
				});
			} else {
				res.json({
					status: "error",
					message: "Something went wrong.",
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

routeHandler.updateSectionStatus = async (req, res) => {
  let postdata = req.body;
	let user = req.vsuser;

	try {
		let validateFields = ["section_id", "sectionStatus"];
		let response = await Common.requestFieldsValidation(
			validateFields,
			postdata
		);
		if (response.status) {
			let sectionTbl = TemplateSection;
			if(user.role != 1) {
				sectionTbl = CampaignSection;
			}
			let section_id = postdata.section_id;
			let sectionStatus = postdata.sectionStatus;
			sectionStatus = parseInt(sectionStatus);

			let where = { _id: section_id };
			await sectionTbl.updateOne(where, {
				$set: { status: sectionStatus },
			}).then(() => {
				res.json({
					status: "success",
					message: "We have updated status successfully.",
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

routeHandler.getSections = async (req, res) => {
  let postdata = req.body;
	let user = req.vsuser;

	try {
		let validateFields = ["page_id"];
		let response = await Common.requestFieldsValidation(
			validateFields,
			postdata
		);
		if (response.status) {
			let sectionTbl = TemplateSection;
			if(user.role != 1) {
				sectionTbl = CampaignSection;
			}
			let where = {
				pageId: postdata.page_id,
			};
			let Sections = {};
			let totalSections = 0;

			Sections = await sectionTbl.find(where)
					.sort({ sort: 1 })
					.catch((error) => {
						res.json({
							error: error,
							message: "There was an error!",
							status: "error",
						});
					});
				totalSections = await sectionTbl.find(
					where
				).countDocuments();

				 for (let i=0; i< Sections.length; i++){
					if(Sections[i].otherBusiness.length > 0){
					 for (const [index, element] of Sections[i].otherBusiness.entries()) {
						 try {
							 const url = await CommonAPI.getObjectSignedURL(element.image);
							 Sections[i].otherBusiness[index].image = url;
						 } catch (error) {
							 console.error(`Error updating image at index ${index}:`, error);
						 }
					  }
					}
				 }
				res.json({
					status: "success",
					message: "",
					data: Sections,
					totalSections: totalSections,
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

routeHandler.deleteSection = async (req, res) => {
  let postdata = req.body;
	let user = req.vsuser;

	try {
		let validateFields = ["section_id"];
		let response = await Common.requestFieldsValidation(
			validateFields,
			postdata
		);
		if (response.status) {
			let sectionTbl = TemplateSection;
			if(user.role != 1) {
				sectionTbl = CampaignSection;
			}
			let where = { _id: postdata.section_id };
			
			let templateSectionData = await sectionTbl.findOne(where)
			if (
				templateSectionData &&
				typeof templateSectionData._id != "undefined"
			) {
				if (templateSectionData.isDefault) {
					res.json({
						status: "error",
						message: "You can not delete the default section.",
					});
				} else {
					if(templateSectionData.type == 'el_image') {
						if(templateSectionData.otherBusiness.length > 0){
							for (let i = 0; i < templateSectionData.otherBusiness.length; i++) {
								await CommonAPI.deleteObjects([templateSectionData.otherBusiness[i].image]);
							}
						}
					}
					await sectionTbl.deleteOne(where).then(() => {
						res.json({
							status: "success",
							message:
								"we have deleted section successfully.",
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

routeHandler.duplicateSection = async (req, res) => {
  let postdata = req.body;
	let user = req.vsuser;

	try {
		let validateFields = ["section_id"];
		let response = await Common.requestFieldsValidation(
			validateFields,
			postdata
		);
		if (response.status) {
			let sectionTbl = TemplateSection;
			if(user.role != 1) {
				sectionTbl = CampaignSection;
			}
			let preSection = await sectionTbl.findOne({
				_id: postdata.section_id,
			});
			if (preSection && typeof preSection._id != "undefined") {
				let totalTemplateSections = await sectionTbl.find({
					templateId: preSection.templateId,
					pageId: preSection.pageId,
				}).countDocuments();
				let name = `${preSection.title} (Copy)`;
				let newSection = preSection;

				newSection._id = new mongoose.Types.ObjectId();
				newSection.isNew = true;
				newSection.createdAt = new Date().toISOString();
				newSection.updatedAt = new Date().toDateString();
				newSection.title = name;
				newSection.sort = totalTemplateSections + 1;

				newSection.save()
				.then((result) => {
					res.json({
						status: "success",
						message: "We have created section successfully.",
						data: result,
					});
				})
				.catch(() => {
					res.json({
						status: "error",
						messgae: "Something went wrong.",
					});
				})
			} else {
				res.json({
					status: "error",
					messgae: "We have not found the section.",
				});
			}
		} else {
			res.json({
				status: "error",
				message: "Something went wrong.",
			});
		}
	} catch (err) {
		console.log(err)
		res.json({
			status: "error",
			message: "Server error",
		});
	}
}

routeHandler.getTemplate = async (req, res) => {
  let postdata = req.body;
	let user = req.vsuser;
	try {
		if (typeof postdata.id != "undefined" && postdata.id != "") {
			let where = {
				_id: postdata.id,
			};
			let templateData = {};
			if(user.role == 1) {
				templateData = await Templates.findOne(where);
			}else {
				templateData = await Campaigns.findOne(where);
			}
			if (templateData && typeof templateData._id != "undefined") {
				if(templateData.profile != ''){
					try {
						const url = await CommonAPI.getObjectSignedURL(templateData.profile.image);
						templateData.profile.image = url;
					} catch (error) {
						console.error(`Error updating image at index ${index}:`, error);
					}
				}
				res.json({
					status: "success",
					message: "",
					data: templateData,
				});
			} else {
				res.json({
					status: "error",
					message: "We have not found template.",
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

routeHandler.applyTheme = async (req, res) => {
  let postdata = req.body;
	let user = req.vsuser;
	try {
		let validateFields = ["template_id"];
		let response = await Common.requestFieldsValidation(
			validateFields,
			postdata
		);
		if(response.status) {
			let templateTbl = Templates;
			if(user.role != 1) {
				templateTbl = Campaigns;
			}
			if(typeof postdata.theme_id != 'undefined') {
				let themeData = await Theme.findOne({_id: postdata.theme_id});
				if(themeData && typeof themeData._id != 'undefined') {
					let metaData = themeData.metaData;
					let set = {
						templateStyle: metaData,
						themeId: postdata.theme_id,
						isCustomTheme: 0
					};
					await templateTbl.updateOne({_id: postdata.template_id}, {
						$set: set,
					}).then(() => {
						res.json({
							status: "success",
							message: "We have applied the theme successfully.",
						});
					});
				}else {
					res.json({
						status: "error",
						message: "The requested theme is not exists.",
					});
				}
			}else {
				if(typeof postdata.themeData != 'undefined') {
					let metaData = postdata.themeData;
					let set = {
						templateStyle: metaData,
						themeId: null,
						isCustomTheme: 1
					};
					await templateTbl.updateOne({_id: postdata.template_id}, {
						$set: set,
					}).then(() => {
						res.json({
							status: "success",
							message: "We have applied the theme successfully.",
						});
					});
				}else {
					res.json({
						status: "error",
						message: "Something went wrong.",
					});
				}
			}
		} else {
			res.json({
				status: "error",
				message: "Something went wrong.",
			});
		}
	}catch(err) {
		console.log(err);
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
		let query = {status: 1};

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

routeHandler.saveSocialIcons = async (req, res) => {
  let postdata = req.body;
	let user = req.vsuser;
	try {
		let validateFields = ["template_id", "icon_data"];
		let response = await Common.requestFieldsValidation(
			validateFields,
			postdata
		);
		if(response.status) {
			let templateTbl = Templates;
			if(user.role != 1) {
				templateTbl = Campaigns;
			}
			let templateData = await templateTbl.findOne({_id: postdata.template_id});
			if(templateData && typeof templateData._id != 'undefined') {
				let set = {
					SocialIconData: postdata.icon_data
				};
				await templateTbl.updateOne({_id: postdata.template_id}, {
					$set: set,
				}).then(() => {
					res.json({
						status: "success",
						message: "We have saved the icons successfully.",
					});
				});
			}else {
				res.json({
					status: "error",
					message: "The requested template is not exists.",
				});
			}
		} else {
			res.json({
				status: "error",
				message: "Something went wrong.",
			});
		}
	}catch(err) {
		res.json({
			status: "error",
			message: "Server error",
		});
	}
}

routeHandler.updateTemplateProfile = async (req, res) => {
  let postdata = req.body;
	let user = req.vsuser;
	try {
		let validateFields = ["template_id", "profile_data"];
		let response = await Common.requestFieldsValidation(
			validateFields,
			postdata
		);
		if(response.status) {
			let templateTbl = Templates;
			if(user.role != 1) {
				templateTbl = Campaigns;
			}
			let templateData = await templateTbl.findOne({_id: postdata.template_id});
			if(templateData && typeof templateData._id != 'undefined') {
				let set = {
					profile: postdata.profile_data
				};
				await templateTbl.updateOne({_id: postdata.template_id}, {
					$set: set,
				}).then(() => {
					res.json({
						status: "success",
						message: "We have saved the profile successfully.",
					});
				});
			}else {
				res.json({
					status: "error",
					message: "The requested template is not exists.",
				});
			}
		} else {
			res.json({
				status: "error",
				message: "Something went wrong.",
			});
		}
	}catch(err) {
		res.json({
			status: "error",
			message: "Server error",
		});
	}
}

routeHandler.updateSocialIconsPack = async (req, res) => {
  let postdata = req.body;
	let user = req.vsuser;
	try {
		let validateFields = ["template_id", "pack_id"];
		let response = await Common.requestFieldsValidation(
			validateFields,
			postdata
		);
		if(response.status) {
			let templateTbl = Templates;
			if(user.role != 1) {
				templateTbl = Campaigns;
			}
			let templateData = await templateTbl.findOne({_id: postdata.template_id});
			if(templateData && typeof templateData._id != 'undefined') {
				let set = {
					packId: postdata.pack_id
				};
				await templateTbl.updateOne({_id: postdata.template_id}, {
					$set: set,
				}).then(() => {
					res.json({
						status: "success",
						message: "We have updated the Social icon successfully.",
					});
				});
			}else {
				res.json({
					status: "error",
					message: "The requested template is not exists.",
				});
			}
		} else {
			res.json({
				status: "error",
				message: "Something went wrong.",
			});
		}
	}catch(err) {
		res.json({
			status: "error",
			message: "Server error",
		});
	}
}

routeHandler.getTemplatePages = async (req, res) => {
  let postdata = req.body;
	let user = req.vsuser;
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
			if(user.role == 1) {
				templatePages = await TemplatePage.find(query)
				.sort({ sort: 1 })
				.catch((error) => {
					res.json({
						error: error,
						message: "There was an error!",
						status: "error",
					});
				});
			}else {
				templatePages = await CampaignPage.find(query)
				.sort({ sort: 1 })
				.catch((error) => {
					res.json({
						error: error,
						message: "There was an error!",
						status: "error",
					});
				});
			}
		} else {
			if(user.role == 1) {
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
			}else {
				templatePages = await CampaignPage.find(query)
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
		}

		let totalTemplatePages = 0;
		let pageCounts = 0;
		if(user.role == 1) {
			totalTemplatePages = await TemplatePage.find(
				query
			).countDocuments();
			pageCounts = Math.ceil(totalTemplatePages / limit);
		}else {
			totalTemplatePages = await CampaignPage.find(
				query
			).countDocuments();
			pageCounts = Math.ceil(totalTemplatePages / limit);
		}

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
	let user = req.vsuser;
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
			let templatePageData = {};

			if(user.role == 1) {
				templatePageData = await TemplatePage.findOne(where);
			}else {
				templatePageData = await CampaignPage.findOne(where);
			}
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

routeHandler.createTemplatePage = async (req, res) => {
  let postdata = req.body;
	let user = req.vsuser;
	try {
		let pageName = postdata.name;
		pageName = pageName.trim();
		let pageSlug = pageName.toLowerCase();
		pageSlug = pageSlug.replace(/[^A-Z0-9]+/gi, "-");

		if (
			typeof postdata.template_id != "undefined" &&
			postdata.template_id != ""
		) {
			if(user.role == 1) {
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
							userId: user._id,
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
			}else {
				let campaignData = await Campaigns.findOne({
					_id: postdata.template_id,
				});
				if (campaignData && typeof campaignData._id != "undefined") {
					let pageExists = await CampaignPage.findOne({
						slug: pageSlug,
						templateId: campaignData._id,
					});
					if (pageExists && typeof pageExists._id != "undefined") {
						res.json({
							status: "error",
							message:
								"Page is already exist with this name. Please user another name.",
						});
					} else {
						let totalCampaignPages = await CampaignPage.find({
							templateId: campaignData._id,
						}).countDocuments();
						let fields = {
							userId: user._id,
							templateId: campaignData._id,
							title: pageName,
							slug: pageSlug,
							sort: totalCampaignPages + 1,
						};
						await CampaignPage.create(fields).then((templatePage) => {
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

routeHandler.saveSEOData = async (req, res) => {
  let postdata = req.body;
	let user = req.vsuser;
	try {
		let validateFields = ["page_id", "seoData"];
		let response = await Common.requestFieldsValidation(
			validateFields,
			postdata
		);
		if (response.status) {
			let pageTbl = TemplatePage;
			if(user.role != 1) {
				pageTbl = CampaignPage;
			}
			let where = {_id: postdata.page_id};

			pageData = await pageTbl.findOne(where);
			if(pageData && pageData._id != 'undefined') {
				await pageTbl.updateOne(where, {
					$set: { seoData: postdata.seoData },
				}).then(() => {
					res.json({
						status: "success",
						message: "We have saved seo settings successfully.",
					});
				});
			}else {
				res.json({
					status: "error",
					message: "The requested page is not exists.",
				});
			}
		}else {
			res.json({
				status: "error",
				message: "Something went wrong.",
			});
		}
	}catch(err) {
		res.json({
			status: "error",
			message: "Server error",
		});
	}
}

routeHandler.saveSectionOrder = async (req, res) => {
  let postdata = req.body;
	let user = req.vsuser;
	try {
		let sectionTbl = TemplateSection;
		if(user.role != 1) {
			sectionTbl = CampaignSection;
		}
		if (postdata.length) {
			for (let [i, row] of postdata.entries()) {
				let num = i + 1;
				let set = {
					sort: num,
				};
				let rst = await sectionTbl.updateOne(
					{ _id: row._id, templateId: row.templateId, pageId: row.pageId },
					{
						$set: set,
					}
				);
			}
		}
		res.json({
			status: "success",
			message: "We have saved order Successfully.",
		});
	} catch (err) {
		console.log(err);
		res.json({
			status: "error",
			message: "Server error",
		});
	}
}

routeHandler.savePagesOrder = async (req, res) => {
  let postdata = req.body;
	let user = req.vsuser;
	try {
		let pageTbl = TemplatePage;
		if(user.role != 1) {
			pageTbl = CampaignPage;
		}
		if (postdata.length) {
			for (let [i, row] of postdata.entries()) {
				let num = i + 1;
				let set = {
					sort: num,
				};
				let rst = await pageTbl.updateOne(
					{ _id: row._id, templateId: row.templateId },
					{
						$set: set,
					}
				);
			}
		}
		res.json({
			status: "success",
			message: "We have saved order Successfully.",
		});
	} catch (err) {
		console.log(err);
		res.json({
			status: "error",
			message: "Server error",
		});
	}
}

routeHandler.deleteTemplatePage = async (req, res) => {
  let postdata = req.body;
	let user = req.vsuser;
	try {
		let pageTbl = TemplatePage;
		let sectionTbl = TemplateSection;
		if(user.role != 1) {
			pageTbl = CampaignPage;
			sectionTbl = CampaignSection;
		}
		let pageId = postdata.id;

		let where = { _id: pageId, userId: user._id };
		let templatePageData = await pageTbl.findOne(where, {
			isDefault: 1,
		});
		if (templatePageData && typeof templatePageData._id != "undefined") {
			if (templatePageData.isDefault) {
				res.json({
					status: "error",
					message: "You can not delete the default page.",
				});
			} else {
				await sectionTbl.deleteMany({ pageId: pageId });
				await pageTbl.deleteOne(where).then(() => {
					res.json({
						status: "success",
						message: "we have deleted page successfully.",
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

routeHandler.updateTemplatePageStatus = async (req, res) => {
  let postdata = req.body;
	let user = req.vsuser;
	try {
		let validateFields = ["id", "pageStatus"];
		let response = await Common.requestFieldsValidation(
			validateFields,
			postdata
		);
		if (response.status) {
			let pageTbl = TemplatePage;
			if(user.role != 1) {
				pageTbl = CampaignPage;
			}
			let pageId = postdata.id;
			let pageStatus = postdata.pageStatus;
			pageStatus = parseInt(pageStatus);

			let where = { _id: pageId };
			await pageTbl.updateOne(where, {
				$set: { status: pageStatus },
			}).then(() => {
				res.json({
					status: "success",
					message: "We have updated page status successfully.",
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

routeHandler.updateTemplateName = async (req, res) => {
  let postdata = req.body;
	let user = req.vsuser;
	try {
		let validateFields = ["id", "title"];
		let response = await Common.requestFieldsValidation(
			validateFields,
			postdata
		);
		if (response.status) {
			let templateTbl = Templates;
			if(user.role != 1) {
				templateTbl = Campaigns;
			}
			let where = {_id: postdata.id, userId: user._id};
			let tempTitle = postdata.title;
			tempTitle = tempTitle.trim();
			let tempSlug = tempTitle.toLowerCase();
			if(Common.isSpecialCharsPresent(tempSlug)) {
				res.json({
					status: "error",
					message: "Name does not allowed with special characters.",
				});
				return;
			}
			tempSlug = tempSlug.replace(/[^A-Z0-9]+/gi, "-");

			let templateData = await templateTbl.findOne(where, {_id: 1});
			if(templateData && templateData._id != 'undefined') {
				let templateExists = await templateTbl.findOne({
					slug: tempSlug,
					_id: {$ne: postdata.id}
				});
				if (templateExists && typeof templateExists._id != "undefined") {
					res.json({
						status: "error",
						message: "Link is already exist with this name. Please user another name.",
					});
				}else {
					await templateTbl.updateOne(where, {
						$set: { title: tempTitle, slug: tempSlug },
					}).then(() => {
						res.json({
							status: "success",
							message: "We have saved title successfully.",
						});
					});
				}
			}else {
				res.json({
					status: "error",
					message: "We have not found requested template.",
				});
			}
		}else {
			res.json({
				status: "error",
				message: "Server error",
			});
		}
	}catch(err) {
		res.json({
			status: "error",
			message: "Server error",
		});
	}
}

routeHandler.getThemes = async (req, res) => {
  let postdata = req.body;
	let user = req.vsuser;
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
		if(user.role != 1) {
			query.status = 1;
		}

		let themes = {};
		if (postdata.listPerPage == -1) {
			themes = await Theme.find(query)
				.sort({ isDefault: -1 })
				.catch((error) => {
					res.json({
						error: error,
						message: "There was an error!",
						status: "error",
					});
				});
		} else {
			themes = await Theme.find(query)
				.limit(limit)
				.skip(skip)
				.sort({ isDefault: -1 })
				.catch((error) => {
					res.json({
						error: error,
						message: "There was an error!",
						status: "error",
					});
				});
		}

		let totalThemes = await Theme.find(query).countDocuments();
		let pageCounts = Math.ceil(totalThemes / limit);

		res.json({
			status: "success",
			message: "",
			data: themes,
			totalThemes: totalThemes,
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

routeHandler.updatePageName = async (req, res) => {
  let postdata = req.body;
	let user = req.vsuser;
	try {
		let validateFields = ["page_id", "title"];
		let response = await Common.requestFieldsValidation(
			validateFields,
			postdata
		);
		if (response.status) {
			let pageTbl = TemplatePage;
			if(user.role != 1) {
				pageTbl = CampaignPage;
			}
			let where = {_id: postdata.page_id};
			let pageTitle = postdata.title;
			pageTitle = pageTitle.trim();
			let pageSlug = pageTitle.toLowerCase();
			if(Common.isSpecialCharsPresent(pageSlug)) {
				res.json({
					status: "error",
					message: "Name does not allowed with special characters.",
				});
				return;
			}

			pageSlug = pageSlug.replace(/[^A-Z0-9]+/gi, "-");

			let pageData = await pageTbl.findOne(where, {_id: 1, templateId: 1});
			if(pageData && pageData._id != 'undefined') {
				let pageExists = await pageTbl.findOne({
					slug: pageSlug,
					templateId: pageData.templateId,
					_id: {$ne: postdata.page_id}
				});
				if (pageExists && typeof pageExists._id != "undefined") {
					res.json({
						status: "error",
						message: "Page is already exist with this name. Please user another name.",
					});
				}else {
					await pageTbl.findOneAndUpdate(where, {
						$set: { title: pageTitle, slug: pageSlug },
					},{new: true}).then((result) => {
						res.json({
							status: "success",
							message: "We have saved title successfully.",
							data: result
						});
					});
				}
			}else {
				res.json({
					status: "error",
					message: "We have not found requested page.",
				});
			}
		}else {
			res.json({
				status: "error",
				message: "Server error",
			});
		}
	}catch(err) {
		console.log(err);
		res.json({
			status: "error",
			message: "Server error",
		});
	}
}

routeHandler.duplicatePage = async (req, res) => {
  let postdata = req.body;
	let user = req.vsuser;

	try {
		let validateFields = ["page_id"];
		let response = await Common.requestFieldsValidation(
			validateFields,
			postdata
		);
		if (response.status) {
			let pageTbl = TemplatePage;
			let sectionTbl = TemplateSection;
			if(user.role != 1) {
				pageTbl = CampaignPage;
				sectionTbl = CampaignSection;
			}

			let pageData = await pageTbl.findOne({_id: postdata.page_id});
			if(pageData && pageData._id != 'undefined') {
				let totalpages = await pageTbl.find({
					templateId: pageData.templateId,
					userId: user._id,
				}).countDocuments();
				let rnString = randomstring.generate({
					length: 5,
					charset: 'alphabetic',
					capitalization: 'lowercase'
				});
				let name = `${pageData.title} (Copy)`;
				let pSlug = `${pageData.slug}-${rnString}`;
				let newPageData = pageData;

				newPageData._id = new mongoose.Types.ObjectId();
				newPageData.isNew = true;
				newPageData.createdAt = new Date().toISOString();
				newPageData.updatedAt = new Date().toDateString();
				newPageData.title = name;
				newPageData.slug = pSlug;
				newPageData.isDefault = 0;
				newPageData.sort = totalpages + 1;

				newPageData.save()
				.then(async (resultPage) => {
					let sections = await sectionTbl.find({templateId: pageData.templateId, pageId: postdata.page_id});
					if(sections) {
						sections.map(async (sitem, sindex)=> {
							let newSection = sitem;
							newSection._id = new mongoose.Types.ObjectId();
							newSection.isNew = true;
							newSection.pageId = resultPage._id;
							
							await newSection.save()
						})
					}
					res.json({
						status: "success",
						message: "We have created page successfully.",
						data: resultPage,
					});
				})
				.catch(() => {
					res.json({
						status: "error",
						messgae: "Something went wrong.",
					});
				})
			}else {
				res.json({
					status: "error",
					message: "We have not found requested page.",
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

async function handler(req, res) {
  const { editorSlug } = req.query
  let routeFlag = true

  if (req.method === 'POST') {
    switch (editorSlug) {
      case 'addSection': 
        await routeHandler.addSection(req, res)
        break;
      case 'saveSection': 
        await routeHandler.saveSection(req, res)
        break;
      case 'updateSectionStatus': 
        await routeHandler.updateSectionStatus(req, res)
        break;
      case 'getSections': 
        await routeHandler.getSections(req, res)
        break;
      case 'deleteSection': 
        await routeHandler.deleteSection(req, res)
        break;
      case 'duplicateSection': 
        await routeHandler.duplicateSection(req, res)
        break;
      case 'getTemplate': 
        await routeHandler.getTemplate(req, res)
        break;
      case 'applyTheme': 
        await routeHandler.applyTheme(req, res)
        break;
      case 'getSocialPacks': 
        await routeHandler.getSocialPacks(req, res)
        break;
      case 'saveSocialIcons': 
        await routeHandler.saveSocialIcons(req, res)
        break;
      case 'updateTemplateProfile': 
        await routeHandler.updateTemplateProfile(req, res)
        break;
      case 'updateSocialIconsPack': 
        await routeHandler.updateSocialIconsPack(req, res)
        break;
      case 'getTemplatePages': 
        await routeHandler.getTemplatePages(req, res)
        break;
      case 'getTemplatePage': 
        await routeHandler.getTemplatePage(req, res)
        break;
      case 'createTemplatePage': 
        await routeHandler.createTemplatePage(req, res)
        break;
      case 'saveSEOData': 
        await routeHandler.saveSEOData(req, res)
        break;
      case 'saveSectionOrder': 
        await routeHandler.saveSectionOrder(req, res)
        break;
      case 'savePagesOrder': 
        await routeHandler.savePagesOrder(req, res)
        break;
      case 'deleteTemplatePage': 
        await routeHandler.deleteTemplatePage(req, res)
        break;
      case 'updateTemplatePageStatus': 
        await routeHandler.updateTemplatePageStatus(req, res)
        break;
      case 'updateTemplateName': 
        await routeHandler.updateTemplateName(req, res)
        break;
      case 'getThemes': 
        await routeHandler.getThemes(req, res)
        break;
      case 'updatePageName': 
        await routeHandler.updatePageName(req, res)
        break;
      case 'duplicatePage': 
        await routeHandler.duplicatePage(req, res)
        break;
		case 'updateAnimation': 
        await routeHandler.updateAnimation(req, res)
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
