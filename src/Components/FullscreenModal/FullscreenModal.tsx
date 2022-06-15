import { Dispatch, SetStateAction, useLayoutEffect, useRef } from 'react'
import FullscreenModalType from '../../Types/FullscreenModal';
import './FullscreenModal.css'

type Props = {
    isOpen: boolean;
    FullscreenModalOptions: FullscreenModalType | undefined;
    setIsOpen: Dispatch<SetStateAction<boolean>>
}

const FullscreenModal = ({ FullscreenModalOptions, setIsOpen,isOpen }: Props) => {

    const ref = useRef<HTMLImageElement>(null)

    useLayoutEffect(() => {
        const timeout = setTimeout(() => {
            const { current } = ref
            if (current) {
                current.style.top = FullscreenModalOptions?.top + "px"
                current.style.left = FullscreenModalOptions?.left + "px"
                current.classList.add('FullscreenModal-fullscreen')
            }
        })

    }, [isOpen])


    return (
        <img className='FullscreenModal' ref={ref}
            src={FullscreenModalOptions?.img}
            style={{ width: FullscreenModalOptions?.width, height: FullscreenModalOptions?.height, position: "absolute", left: FullscreenModalOptions?.left, top: FullscreenModalOptions?.top }}
            onClick={() => {
                if (ref.current) ref.current.classList.remove('FullscreenModal-fullscreen')
                setTimeout(() => {

                    setIsOpen(false)
                }, 200)
            }
            }
            onContextMenu={e => {
                e.preventDefault()
                if (ref.current) ref.current.classList.remove('FullscreenModal-fullscreen')
                setTimeout(() => {

                    setIsOpen(false)
                }, 200)
            }}
        />
    )
}

export default FullscreenModal