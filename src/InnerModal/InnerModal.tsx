import { Dispatch, SetStateAction } from 'react'
import ModalContent from '../Types/ModalContent'
import FullscreenModalType from '../Types/FullscreenModal'
import "./InnerModal.css"

type Props = {
  modalContent: ModalContent
  setIsModalOpen: Dispatch<SetStateAction<boolean>>
  setFullscreenModalSource: Dispatch<SetStateAction<FullscreenModalType|undefined>>
  setIsFullscreenModalOpen: Dispatch<SetStateAction<boolean>>
}

const InnerModal = ({ setIsModalOpen, modalContent,setFullscreenModalSource,setIsFullscreenModalOpen }: Props) => {

  const openModalWithImage = (element:HTMLImageElement) =>{
    const {top, left, width, height} = element.getBoundingClientRect()
    setFullscreenModalSource({img:element.src,
      width,
      height,
      left,
      top})
    setIsFullscreenModalOpen(true)
  }


  return (
    <div className="InnerModal" onContextMenu={e=>{
      e.preventDefault()
      setIsModalOpen(false)
    }}>
      <div className="InnerModal-title">
        {modalContent.pageContent?.title}
      </div>
      <div className="InnerModal-body">

        <div className="InnerModal-left">
          <div className="InnerModal-left-top" style={{maxHeight: modalContent.streamtape?.img ? "46%":"calc(100% - 1rem)"}}>
            <img src={modalContent.pageContent?.img} className={modalContent.vidoza?.poster? "InnerModal-left-top-half-width":""} onClick={(e)=>{ if (e.target instanceof HTMLImageElement)openModalWithImage(e.target)}}/>
            {modalContent.vidoza?<img src={modalContent.vidoza?.poster} onClick={(e)=>{ if (e.target instanceof HTMLImageElement)openModalWithImage(e.target)}} className="InnerModal-left-top-half-width"/>:null}
            </div>
          {modalContent.streamtape?.img ? <img className='InnerModal-left-bottom' onClick={(e)=>{ if (e.target instanceof HTMLImageElement)openModalWithImage(e.target)}} src={modalContent.streamtape?.img}/>:null}

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