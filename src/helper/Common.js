import Cookies from "js-cookie";
import moment from "moment";
import {AlertMsg, getFileName, Loading} from "../helper/helper";

export let common = {
    getAPI: async (params, cb, cb2 = null) => {
        var detail = {
            method: params.method,
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
                "Cache-Control": "no-cache",
                mode: "no-cors", // no-cors
            },
        };
        if(params.special){
            detail.headers.action = params.special;
        }
        
        if(params.loading !== false){
            Loading(true);
        }

        if (params.isFormData) {
            // delete detail.headers;
            detail.headers = {};
            if(params.special){
                detail["headers"] = {"action":params.special};
            }
            detail["body"] = params.data;
        } else if (
            params.method === "post" ||
            params.method === "POST" ||
            params.method === "delete"
        ) {
            detail["headers"] = {
                "Content-Type": "application/json",
                "Cache-Control": "no-cache",
            };
            detail["body"] = JSON.stringify(params.data);
        } else {
            if (Object.keys(params.data).length) {
                var str = [];
                for (var p in params.data) {
                    if (params.data.hasOwnProperty(p)) {
                        str.push(
                            encodeURIComponent(p) +
                                "=" +
                                encodeURIComponent(params.data[p])
                        );
                    }
                }

                if (params.url.indexOf("?") !== -1) {
                    params.url += "&" + str.join("&");
                } else {
                    params.url += "?" + str.join("&");
                }
            }
        }

        detail["headers"]["authorization"] = Cookies.get("accessToken");

        let urlRegex =
            /(http|ftp|https):\/\/[\w-]+(\.[\w-]+)+([\w.,@?^=%&amp;:\/~+#-]*[\w@?^=%&amp;\/~+#-])?/;
        params.url = urlRegex.test(params.url)
            ? params.url
            : process.env.API_URL + params.url;
        try {
            await fetch(params.url, detail)
                .then((res2) => res2.json())
                .then((resp) => {
                    Loading(false);
                    if (resp.status == "success") {
                        if(params.alert !== false){
                            if (resp.message && resp.message != "") {
                                AlertMsg(
                                    "success",
                                    "Congratulations!",
                                    resp.message
                                );
                            }
                        }

                        cb(resp);
                        return resp;
                    } else {
                        if (cb2 != null) {
                            cb2(resp);
                        }else{
                            var tmsg = [],etmsg=resp.message;
                            if (Array.isArray(resp.message)) {
                                resp.message.forEach(function(v){
                                    tmsg.push(v.msg)
                                })
                                etmsg = tmsg.join('<br/>');
                            } 
    
                            if (etmsg && etmsg != "") {
                                AlertMsg("error", "Opps!", etmsg);
                            }
                        }
                    }
                });
        } catch (error) {
            Loading(false);

            if (cb2 != null) {
                cb2(error);
            }
        }
    },

    manageLoadder: (params, status) => {
        if (
            !["GET", "get"].includes(params.method) &&
            !params.hasOwnProperty("avoidLoader")
        ) {
            Loading(status);
        }
    },
    
    loadTableData: (params, cb) => {
        common.getAPI(
            {
                method: "GET",
                url: params.url,
                data: params.data,
            },
            (resp) => {
                cb({
                    data: resp.data,
                    fetchCount: resp.data.length,
                    totalRecord: resp.totalRecord,
                });
            }
        );
    },
    tableNumCnt: (currentPage, dataPerPage) => {
        // dataPerPage = dataPerPage == 'all'?
        return currentPage == 1
            ? 1
            : currentPage * dataPerPage - dataPerPage + 1;
    },

    dateFormatter: (date) => {
        return moment(date).format("D MMM YYYY h:mm A");
    },

    dateFormatWithoutTime: (date) => {
        return moment(date).format("D MMM YYYY");
    },
};


export let manageMyFile = (params , cb) => {
    /***
     * params = {
     *  e : INPUT_ELEMENT,
     *  index : INDEX
     * }
     * 
     */
    let elements = params.e;
    if(!elements.target || !elements.target.files){
        //toast.notify(`Please choose a file to continue.` , { type: "error" });
        AlertMsg("error", "Opps!", "Please choose a file to continue.");
        return;
    }

    let selectedFile = elements.target.files[params.index?params.index:0];
    let selFileType = selectedFile.type;
    let selFileDetails = selFileType.split('/');
    let selFileExt = '.'+selectedFile.name.split('.').reverse()[0].toLowerCase();

    let acceptAry = elements.target.accept.replace(new RegExp(" ", "g"), '').split(',');

    let acceptFileTypeAry = [];
    let acceptFileAry = [];
    acceptAry.map((d , i) => {
        let fd = d.split('/');
        acceptFileTypeAry.push(fd[0]);
        acceptFileAry.push(fd[1]);
    });
    
    if(!acceptAry.includes(selFileExt)){
        AlertMsg("error", "Opps!", `Only ${acceptAry.join(', ')+(acceptFileTypeAry.length == 1?'file is ':' files are ') } allowed.`);
    }else if (selectedFile) {
        let data = new FormData();
        let fr = new FileReader();
        
        if(selFileType.split('audio').length > 1){
            data.append( 'file', selectedFile , selectedFile.name);
            var createElem = document.createElement(`audio`);
            createElem.preload = 'metadata';
            
            createElem.onloadedmetadata = function() { 
                window.URL.revokeObjectURL(createElem.src);
                var mediaMeta = { 
                    'duration'     : createElem.duration
                };
                data.append( 'mediaMeta', JSON.stringify(mediaMeta)); 
                cb(data);
            }
            createElem.src = URL.createObjectURL(selectedFile); 
            // cb(data);
        }else if(selFileType.split('video').length > 1 || selFileType.split('image').length > 1){
            fr.onloadend = async (e) => {
                e.currentTarget.value = "";

                let name = selectedFile.name;
                name = name.replace(/\s/g,"-");
                let thumbName = getFileName(name) + `-thumb.png`;
                data.append( 'file', selectedFile, name );

                if(selFileType.split('video').length > 1){
                    let videoUrl = URL.createObjectURL(dataURItoBlob(e.target.result));

                    if(selFileDetails[1] != 'quicktime'){
                        let { thumbBlob, thumbUrl } = await processVideo(videoUrl);
                        data.append( 'thumb', thumbBlob, thumbName);    
                        
                        
                        var createElem = document.createElement(`video`);
                        createElem.preload = 'metadata';
                        
                        createElem.onloadedmetadata = function() { 
                            window.URL.revokeObjectURL(createElem.src);
                            var mediaMeta = { 
                                'duration'     : createElem.duration,
                                'naturalWidth' : createElem.videoWidth,
                                'naturalHeight': createElem.videoHeight
                            };
                            
                            data.append( 'mediaMeta', JSON.stringify(mediaMeta)); 
            
                            cb(data);
                        }
                        createElem.src = URL.createObjectURL(selectedFile);    
                    }else{
                        cb(data);
                    }
                }else{
                    var createElem = document.createElement(`img`);
                    createElem.src = URL.createObjectURL(selectedFile);
                    createElem.onload = (e) => {
                        
                        var mediaMeta = { 
                            'duration'     : createElem.duration,
                            'naturalWidth' : createElem.width,
                            'naturalHeight': createElem.height
                        };
                        //data.append( 'mediaMeta', JSON.stringify(mediaMeta)); 
        
                        cb(data);
                    };
                }
                      
            };
            fr.readAsDataURL(selectedFile);  
        }else if(selFileType == 'application/pdf'){
            data.append( 'file', selectedFile , selectedFile.name);
            cb(data);
        }else{
            AlertMsg("error", "Opps!", "Selected file not allowed.");
        }
        
    }else{
        AlertMsg("error", "Opps!", "Please choose a file.");
    }
}
