import nodemailer from 'nodemailer';
import mandrillTransport from 'nodemailer-mandrill-transport/lib/mandrill-transport';
import fs from 'fs';
import {CopyObjectCommand, DeleteObjectCommand, GetObjectCommand, ListObjectsV2Command, PutObjectCommand, S3, S3Client} from '@aws-sdk/client-s3';
import nodemailerSendgrid from 'nodemailer-sendgrid'
import { Upload } from '@aws-sdk/lib-storage';
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";


let client = new S3Client(process.env.aws.configuration);
const spacesEndpoint = new S3Client("s3.amazonaws.com");
const s3Object = new S3Client({
	endpoint: spacesEndpoint,
});

// returnFullPath: false,
// ACL: "public-read",
// filename: null
let defaultOptions = {
	Bucket: process.env.aws.bucket,
};

const s3Params = {
	Bucket: process.env.aws.bucket,
};

const CommonAPI = {};

CommonAPI.sendMailUsingMandrill = async( params = null, settings) => {
	return new Promise( (resolve, reject) => {
		var transport = nodemailer.createTransport(mandrillTransport({
			auth: {
				apiKey: settings.mandrillKey
			}
		}));
		
		transport.sendMail({
			from: 'Support <support@pixaurl.com>',
			to: params.to,
			subject: params.subject,
			html: params.html
		}, function(err, info) {
			if (err) {
				console.error("err", err);
				reject(err);
			} else {
				console.log("info",info);
				resolve(info)
			}
		});
	})
}

CommonAPI.sendMailUsingSMTP = async (params = null, settings) => {
	return new Promise((resolve, reject) => {
		var transport = nodemailer.createTransport({
			host: settings.smtpHost,
			port: settings.smtpPort,
			auth: {
				user: settings.smtpUsername,
				pass: settings.smtpPassword
			}
		});
		transport.sendMail({
			from: 'Support <support@pixaurl.com>',
			to: params.to,
			subject: params.subject,
			html: params.html
		}, function(err, info) {
			if (err) {
				console.error("err", err);
				reject(err);
			} else {
				console.log("info",info);
				resolve(info)
			}
		});
	})
}


CommonAPI.getPutObjectSignedURL = async (remotePath) => {
	let params = Object.assign({}, defaultOptions);

	try {
		params.Key = remotePath
		const command = new PutObjectCommand({
			Bucket : process.env.aws.bucket,
			Key : remotePath
		})	  
		const url = await getSignedUrl(client, command, { expiresIn: 3600 });
	  return url;
	} catch (error) {
	  return { status: "error", message: error.toString() };
	}
  };

  
CommonAPI.getObjectSignedURL = async (remotePath) => {
	let params = Object.assign({}, defaultOptions);

	try {
		params.Key = remotePath
		const command = new GetObjectCommand({
			Bucket : process.env.aws.bucket,
			Key : remotePath
		})	  
		const url = await getSignedUrl(client, command, { expiresIn: 3600 });
	  return url;
	} catch (error) {
	  return { status: "error", message: error.toString() };
	}
  };

CommonAPI.sendMailUsingSendgrid = async (params = null, settings) => {
	return new Promise((resolve, reject) => {
		let transport = nodemailer.createTransport(
			nodemailerSendgrid({
				 apiKey: settings.sendgridKey
			  })
			);
		transport.sendMail({
			from: 'Support <support@pixaurl.com>',
			to: params.to,
			subject: params.subject,
			html: params.html
		}, function(err, info) {
			if (err) {
				console.error("err", err);
				reject(err);
			} else {
				console.log("info",info);
				resolve(info)
			}
		});
	})
}


CommonAPI.upload = (localFile, remotePath, options = {}) => {
	options = {
		...defaultOptions,
		...options,
	};
	return new Promise((resolve, reject) => {
		// let p = Object.assign({}, s3Params);
		let p = {}
		p.Key = remotePath;
		p.bucket = process.env.aws.bucket
		let bucketName = process.env.aws.bucket
		// p.ACL = options.ACL;
		// if (options.ContentType) {
			// 	p.ContentType = options.ContentType;
			// }
		// if (options.filename) {
			// 	p.ContentDisposition = `attachment;filename=${options.filename}`;
		// }
		// let uploader = new Upload({
		// 	params: {
		// 		Body: fs.readFileSync(localFile),
		// 		...p,
		// 	},
		// }).promise();

		let params = {
			Bucket : bucketName,
			Key : remotePath,
			Body: fs.readFileSync(localFile)
		}
		const uploadFile = async () => {
			try {
			const parallelUploads3 = new Upload({
				client: client,
				params: params,
			  });
		  
			  parallelUploads3.on("httpUploadProgress", (progress) => {
			  });
		  
              parallelUploads3.done().then(
					function (data) {
						fs.unlinkSync(localFile);
						let url = data.Key;
						data.cdnURL = process.env.s3URL.concat(url);
						if (options.returnFullPath) {
							url = bucketBase.concat(url);
						}
						resolve({ url, data });
					},
					function (err) {
						reject(err.toString());
					}
				);
			} catch (error) {
			  console.error("Error uploading file:", error);
			}
		  };

		  uploadFile()

		
	});
};

CommonAPI.deleteObjects = (remotePaths = []) => {
	return new Promise((resolve, reject) => {
		let deleteParams = Object.assign({}, s3Params);
		let bucketName = process.env.aws.bucket
		remotePaths.forEach(function (item){
			const params = {
				Bucket: bucketName,
				Key: item,
			  };
			  const command = new DeleteObjectCommand(params);
			   client.send(command).then(data =>{
				resolve(1)
			   }).catch(err =>{
				reject("error while deleting objects from s3" + err);
				console.error("error while deleting objects from s3" + err);
				return;
			   })
		})

	});
};

CommonAPI.copyObject = async (source, target) => {
	return new Promise(async (resolve, reject) => {
		// let params = Object.assign({}, s3Params);
		let CopySource = s3Params.Bucket + "/" + source;
		// params.Key = target;
		// params.ACL = defaultOptions.ACL;
		// console.log('params',params);

		const sourceBucketName = process.env.aws.bucket;
		const destinationObjectKey = target;
		const params = {
			Bucket: sourceBucketName,
			CopySource: CopySource,
			Key: destinationObjectKey,
		};


		const copyObject = async () => {
			try {
			  const command = new CopyObjectCommand(params);
			  const response = await client.send(command);
			  resolve({ key: target, url: process.env.s3URL + target });
			} catch (error) {
				reject("error while coping objects from s3" + err);
				console.error("error while coping objects from s3" + err);
				return;			}
		  };
		  
		  // Execute the copyObject function
		  copyObject();
	});
};

CommonAPI.getAllkeysOfFolder = (folder) => {
	return new Promise((resolve, reject) => {
		const listObjects = async () => {
			try {
				const command = new ListObjectsV2Command(s3Params);
				client.send(command).then(data => {
					if (data.Contents.length == 0) resolve({ status: 0 });
					let keys = [];
					data.Contents.forEach(function (content) {
						if (content.Key.indexOf(folder) !== -1) {
							keys.push(content.Key);
						}
					});
					if (keys.length) resolve({ status: 1, keys: keys });
					else resolve({ status: 0 });
				}).catch(err => {
					reject({ status: 0 });
				})
		  
			} catch (error) {
			  console.error("Error listing objects:", error);
			}
		  };
		  
		  // Execute the listObjects function
		  listObjects();
	});
};

export default CommonAPI;
