import './Box.css';
import ScrappedContent from '../../Types/ScrappedContent';
import { Dispatch, SetStateAction } from 'react';
import ModalContent from '../../Types/ModalContent';

interface Props extends ScrappedContent {
  setModalContent: Dispatch<SetStateAction<ModalContent>>
  setIsModalOpen: Dispatch<SetStateAction<boolean>>
  setIsLoading: Dispatch<SetStateAction<boolean>>
};

const Box = (props: Props) => {

  const fetchRelatedLinks = async (url: string) => {
    props.setIsLoading(true)
    const res = await fetch(`http://localhost:1000/scrape-single?url=${url}`)
    const data = await res.json()
    if (!data.err) {
      props.setIsModalOpen(true)
      props.setModalContent({...data,pageContent:{title:props.title,img:props.img,link:props.link}})
      props.setIsLoading(false)
    } else {
      props.setIsLoading(false)
      alert(data.err + "\n" + data.msg)
    }
  }

  return (
    <div
      className='Box'
      onClick={e => {
        if (e.target instanceof HTMLDivElement) { props.setIsModalOpen(true) }
      }}
      style={{ backgroundImage: `url(${props.img})` }}>
      <span className='Box-title'>{props.title}</span>
    </div>
  );
};

export default Box;
