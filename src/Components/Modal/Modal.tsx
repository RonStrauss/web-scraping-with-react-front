import { Dispatch, SetStateAction } from 'react'
import InnerModal from '../../InnerModal/InnerModal'
import ModalContent from '../../Types/ModalContent'

type Props = {
  modalContent:ModalContent
  setIsModalOpen: Dispatch<SetStateAction<boolean>>
}

export const Modal = (props: Props) => {

  return (
    <div className='Modal' onClick={(e) => {
      if (e.target instanceof HTMLDivElement && e.target.classList.contains('Modal')) props.setIsModalOpen(false)
    }}><InnerModal {...props} /></div>
  )
}