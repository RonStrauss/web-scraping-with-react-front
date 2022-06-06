import { Dispatch, SetStateAction } from 'react';
import { ScrappedContent } from '../../Types/ScrappedContent';
import './Top.css'

type Props = {
  count:number;
  url:string;
  setUrl:Dispatch<SetStateAction<string>>
  setCount:Dispatch<SetStateAction<number>>
  setLinks:Dispatch<SetStateAction<ScrappedContent[]>>
}

export const Top = (props:Props) => {

  const fetchThisUrl = async (url:string) =>{
    const res = await fetch(`http://localhost:1000/scrape?url=${url}`)
    const data = await res.json()
    if (!data.err){
        props.setLinks(data)
    } else {
      alert(data.msg+"\n"+data.err)
    }
  }

  return (
    <div className='Top'>
        <h1>Scrape A Site</h1>
        <div className="Top-form-field">
            <input type="text" id="URLInput" value={props.url} onChange={(e)=>props.setUrl(e.target.value)}/><button onClick={()=>fetchThisUrl(props.url)}>Scrape That Shit</button>
        </div>
    </div>
  )
}
