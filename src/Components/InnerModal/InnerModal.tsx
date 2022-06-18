import { Dispatch, SetStateAction } from 'react'
import ModalContent from '../../Types/ModalContent'
import FullscreenModalType from '../../Types/FullscreenModal'
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

  const downloadWithServer = async (url:string, filename:string="video.mp4",site:string):Promise<void> =>{
    const res = await fetch(`http://localhost:1000/download-from-this-link?${new URLSearchParams({url,filename:filename+".mp4",site})}`)
    const data = await res.json()

    alert(data.msg)
  }


  return (
    <div className="InnerModal" onContextMenu={e=>{
      if (e.target instanceof HTMLAnchorElement){}else{

        e.preventDefault()
        setIsModalOpen(false)
      }
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
          {modalContent.streamtape ? <div className="InnerModal-right-field"><button onClick={()=>{downloadWithServer(modalContent.streamtape?.url||"typescript is silly",modalContent.pageContent?.title,"streamtape")}}>Download Streamtape Video</button></div>:null}
          {modalContent.vidoza ? <div className="InnerModal-right-field"><a href={modalContent.vidoza.video} target="_blank">Vidoza Video</a></div>:null}
        </div>
      </div>
    </div>
  )
}

export default InnerModal