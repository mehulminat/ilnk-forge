import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Loading } from "../../src/helper/helper";
import { common } from "../../src/helper/Common";
import Link from 'next/link';

const SuccessPage = () => {
    const router = useRouter();
    const [orderstatus, setORderstatus] = useState('');

    const store = useSelector(store => store);
    const {session_id, token, plan_id, couponCode, PayerID, paymentId, razorpay_order_id, razorpay_payment_id, razorpay_signature} = router.query;

    useEffect(() => {
        if((session_id || token || paymentId || razorpay_order_id) && plan_id){
            let id = session_id ? session_id : token
            handleSuccess(id, plan_id, couponCode,PayerID, paymentId)
        }
    }, [session_id || token || paymentId || razorpay_order_id])

    
    const handleSuccess = (id, plan_id, couponCode, PayerID, paymentId) =>{
        const data = {
            user_id : store.userData.user_id,
            plan_id : plan_id
        }
        if(session_id !== undefined){
            data.session_id = session_id
        }
        if(token !== undefined){
            data.token = token
            data.payerId = PayerID
        }
        if(couponCode !== ''){
            data.couponCode = couponCode
        }
        if(paymentId !== undefined){
            data.paymentId = paymentId
        }
        if(razorpay_order_id != undefined){
            data.razorpay_order_id = razorpay_order_id,
            data.razorpay_payment_id = razorpay_payment_id,
            data.razorpay_signature = razorpay_signature 
        }
        Loading(true);
        common.getAPI({
            method: 'POST',
            url: 'user/paymentSuccess',
            data: data
        }, (resp) => {
            setORderstatus(resp.status);
        }, () => {
            router.push('/checkout?canceled=true');
        })
    }

    return (
        <>
          <div className="pu_noData">
            {orderstatus == 'success' ? (
                <>
                    <h1>Your Payment is Successfull. </h1>
                    <button className="pu_btn"><Link href={'/dashboard'}>Back to home</Link></button>
                </>
            ): null }
                
          </div>
        </>
    )
}

export default SuccessPage;
