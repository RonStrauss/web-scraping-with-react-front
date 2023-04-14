import { Dispatch, SetStateAction, useEffect, useRef, useState } from 'react'
import ModalContent from '../../Types/ModalContent'
import ScrappedContent from '../../Types/ScrappedContent'
import Box from '../Box/Box'
import "./Main.css"

type Props = {
  count: number;
  setCount: Dispatch<SetStateAction<number>>
  setModalContent: Dispatch<SetStateAction<ModalContent>>
  setIsModalOpen: Dispatch<SetStateAction<boolean>>
  setIsLoading: Dispatch<SetStateAction<boolean>>
  links: ScrappedContent[];
  url: string
  fetchThisUrl: (url?: string) => Promise<void>
}

export const Main = ({ count, url, setCount, setModalContent, setIsModalOpen, setIsLoading, links, fetchThisUrl }: Props) => {

  const triggerSmoothScroll = () => {
    window.scroll({ top: window.scrollY + 300, behavior: 'smooth' })
  }




  const containerRef = useRef(null)

  useEffect(() => {
    const observer = new IntersectionObserver((arr) => {
      if (arr[0].isIntersecting && count > 1 && url) { window.scroll(); fetchThisUrl() }
    }, { threshold: 1 })

    if (containerRef.current) observer.observe(containerRef.current)


    return () => {
      if (containerRef.current) observer.unobserve(containerRef.current)
    }
  }, [containerRef, count])

  return (
    <div className='Main'>
      <div className="scrollTrigger" onClick={triggerSmoothScroll} onContextMenu={e => { e.preventDefault(); triggerSmoothScroll() }}>Scroll Area</div>{links.map((each: ScrappedContent) => <Box {...{ ...each,setModalContent, setIsModalOpen, setIsLoading }} />)}<span id="observer" ref={containerRef}></span></div>
  )
}
