import Cookies from 'js-cookie'
import {common} from '../../helper/Common';
import Router from 'next/router' 


export function authAction(type , data) {
   return async (dispatch) => {

      if(type == 'login'){
         await common.getAPI({
               method : 'POST',
               url : 'auth/login',
               data : data
         }, (resp) => {
            let respData = resp.data;
            Cookies.set('accessToken', resp.token , { expires: 1 }) 
            Router.push(respData.role == 1?"/admin/dashboard":"/dashboard");
            if(type != 'login'){
               dispatch( {
                  type: 'LOGOUT'
               })
            }
            dispatch( {
               type: 'LOGIN_SUCCESS',
               payload : {...respData, token : resp.token}
            })
         });
      
      }else if(type == 'registration'){
   
         await common.getAPI({
               method : 'POST',
               url : 'auth/register',
               data : data
         }, (resp) => {
            
         });
      
      }else if(type == 'forgot-password'){
         await common.getAPI({
               method : 'POST',
               url : 'auth/forgot',
               data : {
                  email : data.email
               }
         }, (resp) => {
            Router.push("/auth/login");
         });
      }
      
   }
}

export function updateUserProfileACT(data) {
   return (dispatch) => {
      dispatch({
         type: 'UPDATE_USER_PROFILE',
         payload : data
      });
   }
}


export function logout(){
   return (dispatch) => {
      Cookies.remove('accessToken')
      dispatch({
         type: 'LOGOUT',
      });
      Router.push("/");
   }
}
