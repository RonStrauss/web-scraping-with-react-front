import { Dispatch, SetStateAction } from 'react'
import InnerModal from '../../InnerModal/InnerModal'
import ModalContent from '../../Types/ModalContent'

interface Props extends ModalContent {
  setIsModalOpen: Dispatch<SetStateAction<boolean>>
}

export const Modal = (props: Props) => {



  return (
    <div className='Modal' onClick={(e) => {
      if (e.target instanceof HTMLDivElement) props.setIsModalOpen(false)
    }}><InnerModal /></div>
  )
}