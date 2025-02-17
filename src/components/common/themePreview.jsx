import { useEffect, useState } from "react";

const ThemePreview = (props) => {
    
    const [bgColor, setBgColor] = useState('');
    const [headingColor, setHeadingColor] = useState('');
    const [headingFont, setHeadingFont] = useState('');
    const [headingWeight, setHeadingWeight] = useState('');
    const [headingSize, setHeadingSize] = useState('');
    const [textColor, setTextColor] = useState('');

    
    const [gradientStatus, setGradientStatus] = useState('');
    const [gradientCss, setGradientCss] = useState('');

    const [url, setUrl] = useState('');
    const [size, setSize] = useState('');

    useEffect(() => {
        const data = props.data;
        if(data){
            setBgColor(data.bgcolor)
            setHeadingColor(data.headingcolor)
            setHeadingFont(data.headingfont)
            setHeadingWeight(data.headingfontweight)
            setHeadingSize(data.headingsize)
            setTextColor(data.textcolor)
            if(data.bg_gradient){
                setGradientStatus(data.bg_gradient.status);
                var gcss = '';
                if(data.bg_gradient.type === "linear"){
                    gcss = 'linear-gradient(' + data.bg_gradient.angle +'deg,'+(data.bg_gradient.colors.map(gcolor => 
                        gcolor.color +' '+ gcolor.stop + '%'
                    ))+')';
                }else{
                    gcss = 'radial-gradient(circle,'+(data.bg_gradient.colors.map(gcolor => 
                        gcolor.color +' '+ gcolor.stop + '%'
                    ))+')';
                }
                setGradientCss(gcss);
            }
            if(data.bgimage){
                setUrl(data.bgimage.url);
                setSize(data.bgimage.size);
            }
        }
    }, [props])
    

    return (
        <>
            <div
                style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundColor: bgColor,
                    backgroundImage: (gradientStatus === 1 ? gradientCss : 'none'),
                }}
            >   
                <div style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundImage : url ? 'url('+url+')' : 'none',
                    backgroundSize : size+'px',
                    padding : 25
                }}>
                    <div style={{
                        color : headingColor,
                        fontSize : headingSize+'px',
                        fontFamily : headingFont, 
                        fontWeight : headingWeight
                    }}>Aa</div>
                    <h3 style={{backgroundColor : headingColor, height : 15, borderRadius: 15, display: 'block', marginBottom : 10}}></h3>
                    <p>
                        <span style={{backgroundColor : textColor, height : 5, borderRadius: 5, display: 'block', marginBottom : 10}}></span>
                        <span style={{backgroundColor : textColor, height : 5, borderRadius: 5, display: 'block', marginBottom : 10}}></span>
                        <span style={{backgroundColor : textColor, height : 5, borderRadius: 5, display: 'block', marginBottom : 10}}></span>
                        <span style={{backgroundColor : textColor, height : 5, borderRadius: 5, display: 'block', marginBottom : 10}}></span>
                    </p>
                    
                </div>
            </div>
        </>
    );
}

export default ThemePreview;