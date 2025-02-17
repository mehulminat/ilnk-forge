import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Popup from "../../../src/components/common/popup/Popup";
import { common } from "../../../src/helper/Common";
import svg from "../../../src/helper/svg";
import styles from '../../../styles/pages/iconPackEdit.module.css'
import validator from 'validator';
import isSvg from 'is-svg';
import { AlertMsg } from "../../../src/helper/helper";


const IconPackEdit = () => {
    const router = useRouter();
    const [packData, setPackData] = useState('');

    const [packIconList, setPackIconList] = useState([]);
    
    const [svgCode, setSvgCode] = useState('');
    const [addSVGPopupName, setAddSVGPopupName] = useState('');

    const [addSvgPopup, setAddSvgPopup] = useState(false);
    const [editId, setEditId] = useState('');

    const [isIconEdit, setIsIconEdit] = useState(false);

    
    const addSvgPopupCloseHandler = (e) => {
        setAddSvgPopup(false);
        setTimeout(() => {
            setAddSVGPopupName('');
            setSvgCode('');
            setEditId('');
            setIsIconEdit(false);
        }, 100);
    };

    /* get icon pack data start */
    useEffect(() => {
        var eid = router.query.id;
        if(eid){
            common.getAPI({
                method: "POST",
                url: 'admin/getSocialTypes',
                data: {page: 1, listPerPage: -1, searchTerm: ''}
            },
            (resp) => {
                if(resp.status === 'success'){
                    common.getAPI(
                        {
                            method: "POST",
                            url: 'admin/getSocialPack',
                            data: {pack_id : eid}
                        },
                        (resp2) => {
                            if(resp2.status === 'success'){
                                setPackData(resp2.data);
                                const types = resp.data;
                                const packs = resp2.data.iconList;
                                const data = types.map(item => {
                                    const packitem = {};
                                    packitem.id = item._id;
                                    packitem.name = item.name;
                                    packitem.status = item.status;
                                    packitem.itype = item.itype;
                                    return packitem;
                                });
                                if(data.length !== 0){
                                    const datacopy = [...data];
                                    const newdata = datacopy.map(t1 => ({...t1, ...packs.find(t2 => t2.id === t1.id)}));
                                    setPackIconList(newdata);
                                }
                            }
                        }
                    );
                }
            });
        }
    }, [router.query]);
    /* get icon pack data end */
    

    /* add icon pack svg start */
    const addIconPackSvg = (id, name, svg) => {
        setAddSvgPopup(!addSvgPopup)
        setAddSVGPopupName(name);
        setEditId(id);
        if(svg){
            setSvgCode(svg);
            setIsIconEdit(true);
        }
    }
    /* add icon pack svg end */

    /* add template start */
    const addSVGFormSubmit = (e) => {
        e.preventDefault();
        const emptysvg = validator.isEmpty(svgCode, {ignore_whitespace:true});
        const customSvgValidation = validator.contains(svgCode, `xmlns="http://www.w3.org/2000/svg"`) && validator.contains(svgCode, 'viewBox');
        if(emptysvg){
            AlertMsg('error', 'Oops!', 'Field can not be empty!');
            return false;
        }else if(!isSvg(svgCode) || !customSvgValidation){
            AlertMsg('error', 'Oops!', 'SVG code is not correct!');
            return false;
        }else{
            if(editId){
                if(packData._id){
                    const data = [...packIconList];
                    const findIndex = data.findIndex(item => item.id === editId);
                    data[findIndex].svg_code = svgCode;
                    addSvgPopupCloseHandler();
                    const newdata = {
                        pack_id : packData._id,
                        icon_list : data
                    }
                    common.getAPI({
                        method: "POST",
                        url: 'admin/editSocialPackIcon',
                        data: newdata
                    },
                    (resp) => {
                        
                    });
                    
                }
            }
        }
    }
    /* add template end */

    return (
        <>
            <div className="pu_container">
                <div className="pu_pagetitle_wrapper">
                    <h3>
                        <a onClick={() => router.back()} className="pu_back_arrow">
                            <span className="pu_back_arrow_icon">{svg.back_arrow}</span> 
                        </a>
                        Icon Pack
                        <span className="pu_pagesubtitle">{packData ? packData.name : ''}</span>
                    </h3>
                </div>
                <div className={styles.icon_pack_wrapper}>
                    {packIconList.filter(st => st.status === 1).map(item => 
                        <div key={item.id} className={styles.icon_pack_item} onClick={() => addIconPackSvg(item.id, item.name, item.svg_code)}>
                            {item.svg_code ? 
                                <span className={styles.icon_pack_item_icon} dangerouslySetInnerHTML={{__html: item.svg_code ? item.svg_code : ''}}></span>
                                : 
                                <span className={styles.icon_pack_item_icon}>{svg.plus_icon}</span>
                            }
                            <p>{item.name}</p>
                        </div>                        
                    )}
                </div>
            </div>

            <Popup
                heading={(isIconEdit ? "Update " : "Add ") + addSVGPopupName+" SVG"}
                show={addSvgPopup}
                onClose={addSvgPopupCloseHandler}
            >
                <form onSubmit={addSVGFormSubmit}>
                    <div className="pu_input_wrapper">
                        <label>Svg code</label>
                        <textarea rows="10" className="pu_input" value={svgCode} onChange={(e) => setSvgCode(e.target.value)}></textarea>
                    </div>
                    <div className="text-center">
                        <button type="submit" className="pu_btn">{isIconEdit ? 'Update' :'Add'}</button>
                    </div>
                </form>
            </Popup>
        </>
    );
}

export default IconPackEdit;