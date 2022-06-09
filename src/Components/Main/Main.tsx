import { Dispatch, SetStateAction, useEffect, useRef } from 'react'
import ModalContent from '../../Types/ModalContent'
import ScrappedContent  from '../../Types/ScrappedContent'
import Box  from '../Box/Box'
import "./Main.css"

type Props = {
    count:number;
    setCount:Dispatch<SetStateAction<number>>
    setModalContent:Dispatch<SetStateAction<ModalContent>>
    setIsModalOpen:Dispatch<SetStateAction<boolean>>
    setIsLoading:Dispatch<SetStateAction<boolean>>
    links:ScrappedContent[];
    fetchThisUrl:(url?:string)=>Promise<void>
  }

export const Main = ({count,setCount,setModalContent,setIsModalOpen,setIsLoading,links,fetchThisUrl}:Props) => {


  const containerRef = useRef(null)
  
  useEffect(() => {
    const observer = new IntersectionObserver((arr)=>{
      if (arr[0].isIntersecting && count>1){fetchThisUrl()}
    },{threshold:1})

    if (containerRef.current) observer.observe(containerRef.current)
    
  
    return () => {
      if (containerRef.current) observer.unobserve(containerRef.current)
    }
  }, [containerRef,count])
  
  return (
    <div className='Main'>{links.map((each:ScrappedContent) => <Box {...{...each,setModalContent,setIsModalOpen,setIsLoading}}/>)}<span id="observer" ref={containerRef}></span></div>
  )
}
