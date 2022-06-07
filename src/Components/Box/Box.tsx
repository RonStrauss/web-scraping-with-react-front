import "./Box.css"
import { ScrappedContent } from '../../Types/ScrappedContent'

type Props = ScrappedContent

const Box = (props: Props) => {
  return (
    <a href={props.link} className="Box-wrapper" target="_blank"><div className='Box' style={{backgroundImage:`url(${props.img})`}}><span className="Box-title" onClick={()=>{return false}}>{props.title}</span></div>
      </a>
  )
}

export default Box