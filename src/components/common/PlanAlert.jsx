import React, { useEffect, useState } from 'react';
import svg from '../../helper/Logo';
import Link from 'next/link';

const PlanAlert = (props) => {

  const [show, setShow] = useState(false);

  const closeHandler = (e) => {
    setShow(false);
    props.onClose(false);
  };

  useEffect(() => {
    setShow(props.show);
  }, [props.show]);

  return (
    <>
      {show ?
        <div className="pu_alert pu_alert_warning">
          <p>Your plan has expired. Please purchase a plan to keep your links working</p>
          <button className="pu_btn"><Link href={'/checkout'}>Buy Now</Link></button>
          <span className="close_notification" onClick={closeHandler}>
            {svg.cross_icon}
          </span>
        </div> : null
      }
    </>
  );
};

export default PlanAlert;
