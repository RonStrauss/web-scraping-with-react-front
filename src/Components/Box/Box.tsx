import './Box.css';
import ScrappedContent from '../../Types/ScrappedContent';
import { Dispatch, SetStateAction, } from 'react';
import ModalContent from '../../Types/ModalContent';

interface Props extends ScrappedContent {
  setModalContent: Dispatch<SetStateAction<ModalContent>>
  setIsModalOpen: Dispatch<SetStateAction<boolean>>
  setIsLoading: Dispatch<SetStateAction<boolean>>

};

const Box = ({ link, title, img, setIsLoading, setIsModalOpen, setModalContent, }: Props) => {

  const fetchRelatedLinks = async (url: string) => {
    setIsLoading(true)
    const res = await fetch(`http://localhost:1000/scrape-single?url=${url}`)
    const data = await res.json()
    if (!data.err) {
      setIsModalOpen(true)
      setModalContent({ ...data, pageContent: { title, img, link } })
      setIsLoading(false)
    } else {
      setIsLoading(false)
      alert(data.err + "\n" + data.msg)
    }
  }




  return (

    <div

      className='Box'
      onClick={e => {
        if (e.target instanceof HTMLDivElement) { fetchRelatedLinks(link) }
      }}
      style={{ backgroundImage: `url(${img})` }}>
      <span className='Box-title'>{title}</span>
    </div>

  );
};

export default Box;
