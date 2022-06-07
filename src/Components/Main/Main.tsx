import { Dispatch, SetStateAction, useEffect, useRef } from 'react'
import { ScrappedContent } from '../../Types/ScrappedContent'
import Box  from '../Box/Box'
import "./Main.css"

type Props = {
    count:number;
    setCount:Dispatch<SetStateAction<number>>
    links:ScrappedContent[];
    fetchThisUrl:(url:string)=>Promise<void>
  }

export const Main = (props:Props) => {

  const containerRef = useRef(null)
  
  useEffect(() => {
    const observer = new IntersectionObserver((arr)=>{
      if (arr[0].isIntersecting && props.count>1){props.fetchThisUrl()}
    },{threshold:1})

    if (containerRef.current) observer.observe(containerRef.current)
    
  
    return () => {
      if (containerRef.current) observer.unobserve(containerRef.current)
    }
  }, [containerRef,props.count])
  
  return (
    <div className='Main'>{props.links.map((each:ScrappedContent) => <Box {...each}/>)}<span id="observer" ref={containerRef}></span></div>
  )
}
