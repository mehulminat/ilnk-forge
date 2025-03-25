import React, { useState, useEffect, useRef } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { common } from '../../helper/Common';
import svg from "../../helper/svg";
import styles from '../../../styles/pages/Plan.module.css'
import { Alert } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { setPageHeading } from "../../redux/actions/commonAction"
import Cookies from 'js-cookie';
import Popup from './popup/Popup';
import { AlertMsg } from '../../helper/helper';

let tokenCookie = Cookies.get('accessToken') ? Cookies.get('accessToken') : false;

const Plan = () => {

   const router = useRouter()
   const headerContainer = useRef();
   const headerNav = useRef();
   const userData = useSelector(store => store.userData);

   let dispatch = useDispatch();
   useEffect(() => {
      dispatch(setPageHeading({
         pageHeading: "LinkForge - Plans",
         title: "LinkForge - The Ultimate Bio Link Manager",
      }));
   }, [dispatch]);


   const [searchTerm, setSearchTerm] = useState('');
   const [planList, setPlanList] = useState([])
   const [currency, setCurrency] = useState({})
   const [perPage, setPerPage] = useState(10);
   const [totalPageCount, setTotalPageCount] = useState(0);
   const colorClasses = ['plan1', 'plan2', 'plan3']
   const [addCouponPopup, setAddCouponPopup] = useState(false)

   const [planID, setPlanId] = useState('')
   const [planName, setPlanName] = useState('')
   const [planPrice, setPlanPrice] = useState('')
   const [planValidity, setPlanValidity] = useState('')
   const [totalPrice, setTotalPrice] = useState('')
   const [couponCode, setCouponCode] = useState('')
   const [savedAmount, setSavedAmount] = useState('')
   const [expandInput, setExpandInput] = useState(false);

   const [paypalOn, setPaypalOn] = useState(false)
   const [stripeOn, setStripeOn] = useState(false)
   const [razorpayOn, setRazorpayOn] = useState(false)
   const [stripeActive, setStripeActive] = useState(false);
   const [paypalActive, setPaypalActive] = useState(false)
   const [razorpayActive, setRazorpayActive] = useState(false)
   const [bankOn, setBankOn] = useState(false)
   const [bankTransferIns, setBankTransferIns] = useState('')
   const [bankTransferActive, setBankTransferActive] = useState(false)
   const [paymentId, setPaymentId] = useState('');
   ; useEffect(() => {
      fetchPlan();
   }, [])

   const fetchPlan = async (page, listPerPage = perPage, nchange = false) => {

      common.getAPI(
         {
            method: "POST",
            url: 'auth/getPlans',
            data: { page: page, listPerPage: listPerPage, searchTerm: searchTerm, status: 1 }
         },
         (resp) => {
            if (resp.status === 'success') {
               if (resp.data.isEnabled == false) {
                  router.push('/dashboard')
               }
               if (resp.stripeActive == true) {
                  setStripeActive(true)
               }
               if (resp.paypalActive == true) {
                  setPaypalActive(true)
               }
               if (resp.razorpayActive == true) {
                  setRazorpayActive(true)
               }
               if (resp.bankTransferActive == true) {
                  setBankTransferActive(resp.bankTransferActive)
                  setBankTransferIns(resp.bankTransferIns)
               }
               setPlanList(resp.data);
               setCurrency(resp.currency)
               setPerPage(listPerPage);
               setTotalPageCount(resp.pageCounts);
            }
         }
      );
   };

   /* menu toggle outside click start */

   /* menu toggle outside click start */
   useEffect(() => {

      function handleClickOutside(event) {
         if (headerNav.current && !headerNav.current.contains(event.target)) {
            headerContainer.current.classList.remove('ddd');
         }
      }
      document.addEventListener("mousedown", handleClickOutside);
      return () => {
         document.removeEventListener("mousedown", handleClickOutside);
      };
   }, [headerNav]);

   const applyCouponCode = () => {
      if (couponCode == '') {

         setTotalPrice(planPrice)
         setSavedAmount('')
      } else
         common.getAPI(
            {
               method: "POST",
               url: 'auth/getCoupons',
               data: { status: 1, couponCode: couponCode, userId: userData.user_id }
            },
            (resp) => {
               if (resp.status === 'success') {
                  if (resp.data[0] !== undefined) {
                     let total
                     if (planPrice > resp.data[0].minAmount) {
                        if (resp.data[0].discountType == 'By Percentage') {
                           let discounted = planPrice * resp.data[0].discount / 100
                           total = planPrice - discounted
                           setSavedAmount(`Coupon Applied Successfully! You saved ${currency.symbol} ${discounted}`)
                           if (total < 0) {
                              setTotalPrice(0)
                           }
                           else {
                              setTotalPrice(total)
                           }
                        }
                        else {
                           let discountPrice = resp.data[0].discount
                           total = planPrice - discountPrice
                           setSavedAmount(`Coupon Applied Successfully! You saved ${currency.symbol} ${discountPrice}`)
                           if (total < 0) {
                              setTotalPrice(0)
                           } else {
                              setTotalPrice(total)
                           }
                        }
                     } else {
                        let type = 'error'
                        let title = 'Opps!'
                        let message = 'Invalid coupon'
                        AlertMsg(type, title, message)
                     }
                  }
               }
            }
         );
   }

   const handlePlanPurchase = (type) => {
      if (!tokenCookie) {
         router.push('/auth/registration')
      }
      else {
         let data = { id: planID }
         if (couponCode !== '') {
            data.couponCode = couponCode
         }
         if (stripeOn === false && paypalOn === false && bankOn == false && razorpayOn == false) {
            let type = 'error'
            let title = 'Opps!'
            let message = 'Select a payment mode.'
            AlertMsg(type, title, message)
            return
         }
         if (type == 'bank transfer') {
            data.mode = 'Bank Transfer'
            if (paymentId == '') {
               let type = 'error'
               let title = 'Opps!'
               let message = 'Payment ID is required.'
               AlertMsg(type, title, message)
               return
            }
            data.paymentId = paymentId
         }

         if (stripeOn === true) {
            data.mode = 'Stripe'
         }
         if (paypalOn === true) {
            data.mode = 'Paypal'
         }
         if (razorpayOn === true) {
            data.mode = 'Razorpay'
         }
         if (type == 'bank transfer' || type == 'online payment') {
            common.getAPI(
               {
                  method: "POST",
                  url: 'user/planPurchase',
                  data: data
               },
               async(resp) => {
                  setBankOn(false);
                  if (resp.status === 'success') {

                     if(resp?.type == 'Razorpay'){
                        const checkoutData = resp.data
                        let querystr = resp.queryParameter
                        const options = {
                           key: checkoutData.key,
                           amount: checkoutData.amount,
                           currency: checkoutData.currency,
                           name: checkoutData.name,
                           description: checkoutData.description,
                           image: checkoutData.image,
                           order_id: checkoutData.order_id,
                           handler: function (response) {
                               window.location.href = `${process.env.APP_URL}success?${querystr}&razorpay_order_id=${response.razorpay_order_id}&razorpay_payment_id=${response.razorpay_payment_id}&razorpay_signature=${response.razorpay_signature}`
                           },
                           prefill: checkoutData.prefill,
                           notes: checkoutData.notes,
                           theme: checkoutData.theme
                       };
                        let response = new Razorpay(options)
                        response.open()
                     }
                     else {
                        window.location.href = resp.data
                     }
                  }
                  if (resp.status === 'error') {
                     AlertMsg(resp.message)
                  }
               }
            );
         }
      }
   }

   const SelectedPlan = (id, name, price, validity) => {
      if (!tokenCookie) {
         router.push('/auth/registration')
      }
      setPlanId(id);
      setPlanName(name);
      setPlanPrice(price);
      setTotalPrice(price)
      setPlanValidity(validity);
      setAddCouponPopup(true)
   }

   const couponPopupCloseHandler = (e) => {
      setAddCouponPopup(false);
      //Reset popup form start
      setTimeout(() => {
         setPlanId('');
         setPlanName('');
         setPlanPrice('');
         setPlanValidity('');
         setExpandInput('');
         setSavedAmount('');
         setCouponCode('');
      }, 100);
   };


   const removeCoupon = () => {
      setCouponCode('');
      setSavedAmount('');
      setTotalPrice(planPrice)
   }


   return (
      <>

         <Head>
            <title>Plans</title>
            <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
            <meta name="viewport" content="width=device-width, initial-scale=1" />
            <meta content="width=device-width, initial-scale=1.0" name="viewport" />
            <meta name="description" content="The Ultimate Bio Link Manager" />
            <meta name="keywords" content="linkforge, link urlurl.com, pixa url, biolink, bio link, miniwebsite, mini website, social link, personal link, portfolio link, bio link generator" />
            <meta name="MobileOptimized" content="320" />
            <script src="https://checkout.razorpay.com/v1/checkout.js"></script>

         </Head>

         <div className="pu_container">
            <div className={styles.heading}>
               <h3>Ready to Start With LinkForge?</h3>
               <p>Choose the Perfect Plan for You and Your Business</p>
            </div>
            <div className={styles.plan_list_wrapper}>
               <div className={styles.template_list_inner}>
                  {(planList.length) ?
                     <>
                        <div className={styles.plan_list}>
                           {planList.map((temp, index) =>
                              <div key={temp._id} className={`${styles.plan_item} ${styles[colorClasses[index % colorClasses.length]]}`}>
                                 <div className={styles.plan_name_wrap}>
                                    {temp.planname}
                                 </div>
                                 <div className={styles.plan_price_wrap}>
                                    {currency.symbol} {temp.price}
                                 </div>
                                 <div className={styles.plan_desc_wrap}>
                                    <p>Valid upto {temp.validity} days.</p>
                                    <button className="pix-btn" onClick={(e) => SelectedPlan(temp._id, temp.planname, temp.price, temp.validity)}>Buy Now</button>
                                 </div>
                              </div>
                           )}
                        </div>
                     </> : null
                  }
                  {(planList.length == 0) ?
                     <div className="pu_noData">
                        <span>{svg.noData}</span>
                        <h3>No Plans Found.</h3>
                        <p>There is no Plans available with this filter.</p>
                     </div> : null
                  }
               </div>

            </div>

         </div>

         <Popup
            heading=''
            show={addCouponPopup}
            onClose={couponPopupCloseHandler}
            maxWidth={'465px'}
         >

            <div className={styles.coupon_wrapper}>

               <h2>{planName}</h2>
               <h6>{userData.email}</h6>
               <div className={styles.apply_couple_toggle_wrap}>Have a coupon ? <span className={`${styles.apply_couple_toggle} ${expandInput ? styles.rotate_icon : ''}`} onClick={() => setExpandInput(!expandInput)}>{svg.expand_arrow}</span></div>
               {(expandInput) && <div className={"pu_input_wrapper " + styles.coupon_apply_inp}>
                  <input type="text" placeholder='Enter coupon code' className="pu_input" name="discount" value={couponCode} onChange={(e) => setCouponCode(e.target.value)} />
                  <button type='button' className={'pu_btn ' + styles.coupon_btn_apply} onClick={(e) => applyCouponCode()}>Apply</button>
               </div>}
               {savedAmount && <Alert sx={{ fontSize: '12px', fontFamily: 'Poppins', marginBottom: '10px', backgroundColor: 'rgba(58, 223, 149, 0.15)' }} onClose={() => removeCoupon()}>{savedAmount}</Alert>}
               <div className={styles.amount_wrap}>
                  {/* <span>{savedAmount}</span> */}
                  <h3>Your Total: {currency.symbol} {totalPrice} </h3>
                  <p>Valid upto {planValidity} days</p></div>

               <div>

                  <form >
                     <div className={"pu_radio_list" + " " + styles.radio_plan}>

                        {stripeActive == true ?
                           <div className="pu_radio">
                              <input type="radio" id="stripe" name="fav_language" value={stripeOn} onChange={(e) => { setStripeOn(true), setRazorpayOn(false), setPaypalOn(false), setBankOn(false) }} />
                              <label htmlFor='stripe'>Stripe</label>
                           </div>
                           : ''}
                        {paypalActive == true ?
                           <div className="pu_radio">
                              <input type="radio" id="paypal" name="fav_language" value={paypalOn} onChange={(e) => { setPaypalOn(true), setRazorpayOn(false), setStripeOn(false), setBankOn(false) }} />
                              <label htmlFor='paypal'>PayPal</label>
                           </div> : ''}
                        {razorpayActive == true ?
                           <div className="pu_radio">
                              <input type="radio" id="razorpay" name="fav_language" value={razorpayOn} onChange={(e) => { setRazorpayOn(true), setPaypalOn(false), setStripeOn(false), setBankOn(false) }} />
                              <label htmlFor='razorpay'>Razorpay</label>
                           </div> : ''}
                        {bankTransferActive == true ?
                           <>
                              <div className="pu_radio" >
                                 <input type="radio" id="bank" name="fav_language" value={bankOn} onChange={(e) => { setBankOn(true), setRazorpayOn(false), setStripeOn(false), setPaypalOn(false) }} />
                                 <label htmlFor='bank'>Bank Transfer</label>
                              </div>

                              {bankOn == true ?
                                 <div className={`${styles.popover__content} ${styles.show_popup}`}>
                                    <div className="pu_input_wrapper mb-1">
                                       <div className={styles.inst_bank_head}>Instructions</div>
                                       <div className={styles.inst_bank} dangerouslySetInnerHTML={{ __html: bankTransferIns.replace(/\n/g, '<br />') }} />
                                       <input type='text' className="pu_input" placeholder='Enter payment id' onChange={(e) => setPaymentId(e.target.value)} />

                                    </div>
                                    <div style={{ textAlign: 'center' }}>
                                       <button type="button" className="pu_btn" onClick={(e) => handlePlanPurchase('bank transfer')}>Submit</button>
                                    </div>
                                 </div>
                                 : ''}
                           </>
                           : ''
                        }
                     </div>
                  </form>
               </div><br />

               {!bankOn && <div className="text-center">
                  <button type="submit" className="pu_btn" style={{ width: '100%' }} onClick={(e) => handlePlanPurchase('online payment')}>Buy now</button>
               </div>}
            </div>
         </Popup>

      </>
   )
}


export default Plan
