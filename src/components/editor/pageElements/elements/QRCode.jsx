import { useState } from 'react'
import validator from 'validator';
import { AlertMsg } from '../../../../helper/helper';
import { useDispatch } from "react-redux";
import { saveSectionACT } from "../../../../redux/actions/editorAction";
import { useEffect } from 'react';


function QRCode(props) {

  let dispatch = useDispatch();
  const [QrUrl, setQrURl] = useState('');


  useEffect(() => {
    const isURL = validator.isURL(props.data.sectionData, { protocols: ['http', 'https', 'ftp'], require_protocol: false });
    (isURL) && setQrURl(props.data.sectionData)
  }, [])

  const generateQR = (e) => {
    e.preventDefault()
    const URlEmpty = validator.isEmpty(QrUrl, { ignore_whitespace: true });
    const isURL = validator.isURL(QrUrl, { protocols: ['http', 'https', 'ftp'], require_protocol: false });
    if (URlEmpty) {
      AlertMsg('error', 'Oops!', 'URL Field can not be empty!');
      return false;
    }
    if (!isURL) {
      AlertMsg('error', 'Oops!', 'Invalid URL!');
      return false;
    }
    if (props.data.sectionData !== QrUrl) {
      const data = { ...props.data };
      data.sectionData = QrUrl;
      dispatch(saveSectionACT(data));
    }
  }
  return (
    <div>
      <form onSubmit={generateQR}>
        <div className="pu_input_wrapper" style={{ flex: 2 }}>
          <input type="text" className="pu_input" placeholder='Enter URL to generate QR Code.' value={QrUrl} onChange={(e) => setQrURl(e.target.value)} />
        </div>

        <button type="submit" className="pu_btn" >Generate</button>
      </form>

    </div>
  )
}

export default QRCode