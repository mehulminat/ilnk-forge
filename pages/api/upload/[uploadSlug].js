import { authMiddleware } from '../../../lib/authMiddleware';
import { 
  Users,
	Templates,
	Campaigns,
	AutoIncreament,
	CampaignSection,
	TemplateSection
} from '../../../models/DB';
import Common from '../../../helpers/Common';
import { uuid } from 'uuidv4';
import md5 from 'md5';
import path from 'path';
import CommonAPI from '../../../helpers/CommonAPI';
import { parseForm } from '../../../lib/parseForm';
import axios from 'axios';

const routeHandler = {}

routeHandler.updateProfile = async (req, res) => {
	let user = req.vsuser;
	try {
		const { fields, files } = await parseForm(req)

    const profileName = fields?.name.toString()
    const profilePassword = fields?.password.toString()
	let signedurl
		if(profileName && user) {
			let where = {
				_id: user._id
			};

			let set = {
				name: profileName
			};

			let file = '';
			if(files && files?.profileImage) {
				file = files.profileImage[0];
			}
			if(file) {
				let extension = path.extname(file.originalFilename);
				if(!extension) {
					extension = '.png';
				}
				let fileName = uuid().concat(extension);
                const tempFilePath = file.filepath;
				let subPath = `${user._id}`;
				subPath = subPath.concat(`/profileImage`);
				let remoteFile = `usercontent/${subPath}/${fileName}`;

				// let r;
				// r = await CommonAPI.upload(tempFilePath, remoteFile, {
				// 	ContentType: file.mimetype,
				// }).catch((err) => {
				// 	console.log(err);
				// 	res.json({
				// 		status: 'erroe',
				// 		file: null,
				// 		messgae: err,
				// 	});
				// 	return;
				// });
				signedurl = await CommonAPI.getPutObjectSignedURL(remoteFile)				  
				if(signedurl != undefined) {
					if (user.profilePicture && user.profilePicture != "") {
						CommonAPI.deleteObjects([user.profilePicture.key]);
					}
					set.profilePicture = { key: remoteFile, file: remoteFile };
				}
			}

			if(profilePassword != "") {
				set.password = md5(profilePassword);
			}

			await Users.updateOne(where, {
				$set: set
			}).then(async (result) => {
				if(set.profilePicture != ''){
					try {
						const url = await CommonAPI.getObjectSignedURL(set.profilePicture.file);
						set.profilePicture.file = url;
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
					data: set,
					signedurl :signedurl
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

routeHandler.uploadTemplateProfileImage = async (req, res) => {
	let user = req.vsuser;
	try {
		const { fields, files } = await parseForm(req)

		const templateId = fields?.template_id.toString()

		if (
			templateId != "" && user
		) {
			let templateTbl = Templates;
			if(user.role != 1) {
				templateTbl = Campaigns;
			}

			let file = '';
			if(files && files?.file) {
				file = files.file[0];
			}
			if (file && file.size) {
				let extension = path.extname(file.originalFilename);
				if(!extension) {
					extension = '.png';
				}
				let fileName = uuid().concat(extension);
				const tempFilePath = file.filepath;
				let subPath = `${user._id}`;
				subPath = subPath.concat(`/templates`);
				let remoteFile = `usercontent/${subPath}/${templateId}/${fileName}`;
				let r;
				// r = await CommonAPI.upload(tempFilePath, remoteFile, {
				// 	ContentType: file.mimetype,
				// }).catch((err) => {
				// 	res.json({
				// 		status: "error",
				// 		file: null,
				// 		messgae: err,
				// 	});
				// 	return;
				// });
				let signedurl = await CommonAPI.getPutObjectSignedURL(remoteFile)				  

				if (signedurl != undefined) {
					let where = { _id: templateId };
					let template = await templateTbl.findOne(where);
					if (template && typeof template._id !== "undefined") {
						let profile = {};
						if (
							template.profile.image &&
							template.profile.image.indexOf("profileImage") ===
								-1
						) {
							await CommonAPI.deleteObjects([template.profile.image]);
						}
						profile = {
							...template.profile,
							image: remoteFile,
						};
						//console.log(profile);
						let set = {
							profile: profile,
						};
						await templateTbl.updateOne(where, {
							$set: set,
						}).then(() => {
							res.json({
								status: "success",
								message:
									"The template Profile Image has been uploaded successfully.",
								profile,
								signedurl: signedurl
							});
						});
					}
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
async function getNextSequenceValue(sequenceName){

    var sequenceDocument = await AutoIncreament.findOneAndUpdate(
        {_id: sequenceName },
        {$inc:{sequence_value:1}},
        {upsert: true, new: true}
    );
	let sequence
	if(sequenceDocument != null){
		sequence = sequenceDocument.sequence_value
	}
	else {
		let create = await AutoIncreament.create({'_id': 'imageId','sequence_value' : 1})
		console.log('created sequence', create);
		sequence= create.sequence_value
	}
    // console.log(sequenceDocument);
    return sequence;
 }

routeHandler.addUpdateImageSection = async (req, res) => {
	let user = req.vsuser;
	try {
		const { fields, files } = await parseForm(req)
		let section_id = fields?.section_id.toString()
		let SectionData = fields?.SectionData.toString()
		let imageurl = fields?.url.toString()
		let imageID = ''
		if(fields.imgId){
			imageID = fields?.imgId.toString()
		}
		if (
			section_id != "" && user
		) {
			let sectionTbl = TemplateSection;
			if(user.role != 1) {
				sectionTbl = CampaignSection;
			}

			let file = '';
			if(files && files?.file) {
				file = files.file[0];
			}
			if (file && file.size) {
				let extension = path.extname(file.originalFilename);
				if(!extension) {
					extension = '.png';
				}
				let blob = files.blob

				let fileName = uuid().concat(extension);
				const tempFilePath = file.filepath;
				let subPath = `${user._id}`;
				subPath = subPath.concat(`/templates`);
				let remoteFile = `usercontent/${subPath}/${section_id}/${fileName}`;
				let r;
				let signedurl = await CommonAPI.getPutObjectSignedURL(remoteFile)				  
				// r = await CommonAPI.upload(remoteFile, {
				// 	ContentType: file.mimetype,
				// }).catch((err) => {
				// 	res.json({
				// 		status: "error",
				// 		file: null,
				// 		messgae: err,
				// 	});
				// 	return;
				// });
				// res.json({
				// 	status: "success",
				// 	message:
				// 		"The template Profile Image has been uploaded successfully.",
					
				// 	signedurl : signedurl
				// });
				
				if (signedurl != undefined) {
					let where = { _id: section_id };
					let section = await sectionTbl.findOne(where);
					if (section && typeof section._id !== "undefined") {
						let otherBusiness = {};
						
						if(imageID && imageID !== ''){
							if(section.otherBusiness.length > 0){
								for (let i = 0; i < section.otherBusiness.length; i++) {
									if (imageID == section.otherBusiness[i].imageID) {
										await CommonAPI.deleteObjects([section.otherBusiness[i].image]);
									}
								}
							}
							imageID = JSON.parse(imageID)
							await sectionTbl.updateMany(where,  {$pull: {otherBusiness: { imageID: imageID } }})
						}

						let id = await getNextSequenceValue('imageId');
						otherBusiness = {
							image : remoteFile,
							url : imageurl,
							imageID : id
						};
						let set = {
							SectionData : SectionData,
							otherBusiness: otherBusiness,
						};
						await sectionTbl.updateOne(where, {
							$push: set,
						}).then((result) => {
							res.json({
								status: "success",
								message:
									"The template Profile Image has been uploaded successfully.",
								otherBusiness,
								signedurl : signedurl
							});
						});
					}
				}
			}
			else if(imageID !== '' && imageurl !== ''){
				imageID = JSON.parse(imageID)
				await sectionTbl.updateMany({'_id': section_id,"otherBusiness.imageID": imageID},{"otherBusiness.$.url": imageurl})
				.then((result) => {
					res.json({
						status: "success",
						message: "The url has been updated successfully.",
						result
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



routeHandler.updateTemplateThumb = async (req, res) => {
	let user = req.vsuser;
	try {
		const { fields, files } = await parseForm(req)

		const templateId = fields?.template_id.toString()

		if (
			templateId != "" && user
		) {
			let templateTbl = Templates;

			let where = { _id: templateId };
			let templateData = await templateTbl.findOne(where);
			if(templateData && typeof templateData._id != 'undefined') {
				let file = '';
				if(files && files?.thumb) {
					file = files.thumb[0];
				}
				if (file && file.size) {
					let extension = path.extname(file.originalFilename);
					if(!extension) {
						extension = '.png';
					}
					let fileName = uuid().concat(extension);
					const tempFilePath = file.filepath;
					let subPath = `${user._id}`;
					subPath = subPath.concat(`/templates`);
					let remoteFile = `usercontent/${subPath}/${templateId}/${fileName}`;
					let r;
					// r = await CommonAPI.upload(tempFilePath, remoteFile, {
					// 	ContentType: file.mimetype,
					// }).catch((err) => {
					// 	res.json({
					// 		status: "error",
					// 		file: null,
					// 		messgae: err,
					// 	});
					// 	return;
					// });
					let signedurl = await CommonAPI.getPutObjectSignedURL(remoteFile)	
					if (signedurl != undefined) {
						let thumb = '';
						if (templateData.thumb?.key) {
							await CommonAPI.deleteObjects([templateData.thumb.key]);
						}
						thumb = {
							key: remoteFile,
							url: remoteFile
						};
						let set = {
							thumb: thumb,
						};
						await templateTbl.updateOne(where, {
							$set: set,
						}).then(() => {
							res.json({
								status: "success",
								message: "The template Thumb Image has been uploaded successfully.",
								data: {thumb: thumb},
								signedurl : signedurl
							});
						});
					}else {
						res.json({
							status: "error",
							message: "Something went wrong while uploading thumb.",
						});
					}
				}else {
					res.json({
						status: "error",
						message: "Something went wrong.",
					});
				}
			}else {
				res.json({
					status: "error",
					message: "Template that you requested is not exist.",
				});
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

async function handler(req, res) {
  const { uploadSlug } = req.query
  let routeFlag = true

  if (req.method === 'POST') {
    switch (uploadSlug) {
      case 'updateProfile': 
        await routeHandler.updateProfile(req, res)
        break;
			case 'uploadTemplateProfileImage': 
				await routeHandler.uploadTemplateProfileImage(req, res)
				break;
			case 'updateTemplateThumb': 
				await routeHandler.updateTemplateThumb(req, res)
				break;
				case 'addUpdateImageSection': 
				await routeHandler.addUpdateImageSection(req, res)
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

export const config = {
  api: {
    bodyParser: false,
  },
}
