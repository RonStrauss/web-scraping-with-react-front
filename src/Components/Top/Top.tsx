import { Dispatch, SetStateAction } from 'react';
import ScrappedContent from '../../Types/ScrappedContent';
import './Top.css'

type Props = {
  count:number; 
  setCount:Dispatch<SetStateAction<number>>
  url:string;
  setUrl:Dispatch<SetStateAction<string>>
  fetchThisUrl:(url:string)=>Promise<void>
}

export const Top = ({url, setUrl, fetchThisUrl}:Props) => {



  return (
    <div className='Top'>
        <h1>Scrape A Site</h1>
        <div className="Top-form-field">
            <input type="text" id="URLInput" value={url} onChange={(e)=>setUrl(e.target.value)}/><button onClick={()=>fetchThisUrl(url)}>Scrape That Shit</button>
        </div>
    </div>
  )
}
