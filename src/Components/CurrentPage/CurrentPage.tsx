import React, { useEffect, useLayoutEffect, useRef, useState } from 'react'
import "./CurrentPage.css"

type Props = { count: number }

const CurrentPage = ({ count }: Props) => {

    const prevScrollPosition = useRef<number>(window.scrollY)

    const divRef = useRef<HTMLDivElement>(null)

    const handleScroll = (e: Event) => {
        const currentScrollPosition = window.scrollY,
            { current } = divRef
        if (prevScrollPosition.current > currentScrollPosition) {
            if (current) current.classList.remove('CurrentPage-down')
        } else {
            if (current) current.classList.add('CurrentPage-down')
        }
        if (current) {
            if (currentScrollPosition > 127) { 
                current.style.position = "fixed"
            } else {
                current.style.position = "static"
                current.style.top=""
            }
        }
        prevScrollPosition.current = currentScrollPosition;
    }

    useLayoutEffect(() => {
        window.addEventListener('scroll', handleScroll)

        return () => {
            window.removeEventListener('scroll', handleScroll)
        }
    }, [])




    return (
        <div className='CurrentPage' ref={divRef}>Last Page Scraped: {count - 1}</div>
    )
}

export default CurrentPage