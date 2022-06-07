import { Dispatch, SetStateAction } from 'react';
import { ScrappedContent } from '../../Types/ScrappedContent';
import './Top.css'

type Props = {
  url:string;
  setUrl:Dispatch<SetStateAction<string>>
  fetchThisUrl:(url:string)=>Promise<void>
}

export const Top = (props:Props) => {



  return (
    <div className='Top'>
        <h1>Scrape A Site</h1>
        <div className="Top-form-field">
            <input type="text" id="URLInput" value={props.url} onChange={(e)=>props.setUrl(e.target.value)}/><button onClick={()=>props.fetchThisUrl(props.url)}>Scrape That Shit</button>
        </div>
    </div>
  )
}
