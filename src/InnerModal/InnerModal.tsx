import { Dispatch, SetStateAction } from 'react'
import ModalContent from '../Types/ModalContent'
import "./InnerModal.css"

type Props = {
  modalContent: ModalContent
  setIsModalOpen: Dispatch<SetStateAction<boolean>>
}

const InnerModal = ({ setIsModalOpen, modalContent }: Props) => {
  return (
    <div className="InnerModal">
      <div className="InnerModal-title">
        {modalContent.pageContent?.title}
      </div>
      <div className="InnerModal-body">

        <div className="InnerModal-left">
          <a href={modalContent.pageContent?.img} className="InnerModal-left-top" target="_blank" style={{maxHeight: modalContent.streamtape?.img ? "46%":"100%"}}>
            <img  src={modalContent.pageContent?.img} className={modalContent.vidoza?.poster? "InnerModal-left-top-half-width":""}/>
            {modalContent.vidoza?<img src={modalContent.vidoza?.poster} className="InnerModal-left-top-half-width"/>:null}
            </a>
          {modalContent.streamtape?.img ? <a href={modalContent.streamtape?.img} className="InnerModal-left-bottom" target="_blank"><img  src={modalContent.streamtape?.img}/></a>:null}

        </div>
        <div className="InnerModal-right">
          <div className="InnerModal-right-field"><a href={modalContent.pageContent?.link} target="_blank">Original Page</a></div>
          {modalContent.streamtape ? <div className="InnerModal-right-field"><a href={modalContent.streamtape.url} target="_blank">Streamtape Page</a></div>:null}
          {modalContent.vidoza ? <div className="InnerModal-right-field"><a href={modalContent.vidoza.video} target="_blank">Vidoza Video</a></div>:null}
        </div>
      </div>
    </div>
  )
}

export default InnerModal