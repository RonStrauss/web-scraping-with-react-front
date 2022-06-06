import { Dispatch, SetStateAction, useState } from 'react'
import { ScrappedContent } from '../../Types/ScrappedContent'
import Box  from '../Box/Box'
import "./Main.css"

type Props = {
    count:number;
    url:string;
    setUrl:Dispatch<SetStateAction<string>>;
    setCount:Dispatch<SetStateAction<number>>;
    links:ScrappedContent[];
  }

export const Main = (props:Props) => {

    


  return (
    <div className='Main'>{props.links.map((each:ScrappedContent) => <Box {...each}/>)}</div>
  )
}
