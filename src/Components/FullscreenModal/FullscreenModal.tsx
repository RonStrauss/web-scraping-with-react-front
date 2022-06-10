import React, { Dispatch, SetStateAction, useEffect, useLayoutEffect, useRef } from 'react'
import FullscreenModalType from '../../Types/FullscreenModal';
import './FullscreenModal.css'

type Props = {
    FullscreenModalOptions: FullscreenModalType | undefined;
    setIsOpen: Dispatch<SetStateAction<boolean>>
}

const FullscreenModal = ({ FullscreenModalOptions, setIsOpen }: Props) => {

    const ref = useRef<HTMLImageElement>(null)

    useLayoutEffect(() => {
        const timeout = setTimeout(() => {
            const {current} = ref
            if(current){
                current.style.top = FullscreenModalOptions?.top + "px"
                current.style.left = FullscreenModalOptions?.left + "px"
                current.classList.add('FullscreenModal-fullscreen')
            }
        }, )

    }, [])


    return (
        <img className='FullscreenModal' ref={ref}
            src={FullscreenModalOptions?.img}
            style={{ width: FullscreenModalOptions?.width, height: FullscreenModalOptions?.height, position: "absolute", left: FullscreenModalOptions?.left, top: FullscreenModalOptions?.top }}
            onClick={() => setIsOpen(false)} />
    )
}

export default FullscreenModal