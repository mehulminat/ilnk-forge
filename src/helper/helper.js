import Cookies from "js-cookie";

export function getNameInitials(name){
    let rgx = new RegExp(/(\p{L}{1})\p{L}+/, 'gu');
    let nameinitials = [...name.matchAll(rgx)] || [];
    nameinitials = (
        (nameinitials.shift()?.[1] || '') + (nameinitials.pop()?.[1] || '')
    ).toUpperCase();
    return nameinitials;
}

export function AlertMsg(type, title, message){
    const wrapperEl = document.querySelector('.pu_alert_wrapper');
    const innerEl = document.querySelector('.pu_alert_inner');
    const titleEl = document.querySelector('.pu_alert_title');
    const messageEl = document.querySelector('.pu_alert_message');
    const closeEl = document.querySelector('.pu_alert_close');
    innerEl.classList.remove('success');
    innerEl.classList.remove('error');
    innerEl.classList.add(type);
    titleEl.innerHTML = title;
    messageEl.innerHTML = message;
    setTimeout(() => {
        wrapperEl.classList.add('open_alert');
    }, 100);

    if(!wrapperEl.classList.contains('open_alert')){
        setTimeout(() => {
            wrapperEl.classList.remove('open_alert');
        }, 5000);
    }

    closeEl.addEventListener('click', function(el){
        wrapperEl.classList.remove('open_alert');
    });
}

export function Loading(status, message){
    const loadingEl = document.querySelector('.pu_preloader');
    const loadingMsgEl = document.querySelector('.pu_preloader_text');
    if(loadingEl){
        if(message){
            loadingMsgEl.classList.remove('hide');
            loadingMsgEl.innerHTML = message;
        }else{
            loadingMsgEl.classList.add('hide');
        }
        if(status === true){
            loadingEl.classList.add('pu_loading');
        }else{
            loadingEl.classList.remove('pu_loading');
        }
    }    
}
export let getFileName = (filename) => {
	return filename.replace(/\.[^/.]+$/, "");
}

export let hexToRgbA = (hex, alpha) => {
    var c;
    if(/^#([A-Fa-f0-9]{3}){1,2}$/.test(hex)){
        c= hex.substring(1).split('');
        if(c.length== 3){
            c= [c[0], c[0], c[1], c[1], c[2], c[2]];
        }
        c= '0x'+c.join('');
        return 'rgba('+[(c>>16)&255, (c>>8)&255, c&255].join(',')+','+alpha+')';
    }
    throw new Error('Bad Hex');
}