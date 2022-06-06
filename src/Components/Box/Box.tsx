import "./Box.css"
import { ScrappedContent } from '../../Types/ScrappedContent'

type Props = ScrappedContent

const Box = (props: Props) => {
  return (
    <div className='Box' style={{backgroundImage:`url(${props.img})`}}></div>
  )
}

export default Box