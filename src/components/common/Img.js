import Image from 'next/image'

let Img = (props) => {
    
    return (
        <Image width={props.width} height={props.height} src={props.src} alt={props.alt} className={props.className}/>
    )
}

export default Img;