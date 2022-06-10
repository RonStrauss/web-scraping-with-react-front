import { Dispatch, SetStateAction, useState } from 'react'
import InnerModal from '../../InnerModal/InnerModal'
import FullscreenModalType from '../../Types/FullscreenModal'
import ModalContent from '../../Types/ModalContent'
import FullscreenModal from '../FullscreenModal/FullscreenModal'
import '../Loading/Loading.css'

type Props = {
  modalContent:ModalContent
  setIsModalOpen: Dispatch<SetStateAction<boolean>>
}

export const Modal = (props: Props) => {

  const [isFullscreenModalOpen, setIsFullscreenModalOpen] = useState(false)
  const [fullscreenModalSource, setFullscreenModalSource] = useState<FullscreenModalType>()
  useState

  const transferProps = {...props,setFullscreenModalSource,setIsFullscreenModalOpen}

  return (
    <div className='Modal' onClick={(e) => {
      if (e.target instanceof HTMLDivElement && e.target.classList.contains('Modal')) props.setIsModalOpen(false)
    }}><InnerModal {...transferProps} />{isFullscreenModalOpen ? <FullscreenModal  FullscreenModalOptions={fullscreenModalSource} setIsOpen={setIsFullscreenModalOpen}/>:null}</div>
  )
}