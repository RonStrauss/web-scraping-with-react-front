import { useEffect, useState } from 'react'
import './App.css'
import CurrentPage from './Components/CurrentPage/CurrentPage'
import { Loading } from './Components/Loading/Loading'
import { Main } from './Components/Main/Main'
import { Modal } from './Components/Modal/Modal'
import { Top } from './Components/Top/Top'
import ModalContent from './Types/ModalContent'
import ScrappedContent from './Types/ScrappedContent'


function App() {
  const [count, setCount] = useState(1)
  const [url, setUrl] = useState("")
  const [links, setLinks] = useState<ScrappedContent[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [modalContent, setModalContent] = useState<ModalContent>({})
  const [isModalOpen, setIsModalOpen] = useState(false)


  const fetchThisUrl = async (inputtedUrl?: string) => {
    //typescript doesn't allow both optional and default arguments in function declarations
    if (!inputtedUrl) inputtedUrl = url
    try {
      setIsLoading(true)
      const res = await fetch(`http://localhost:1000/scrape-page?url=${inputtedUrl}${count > 1 ? "&page=" + count : ''}`)
      const data = await res.json()
      if (!data.err) {
        setCount(count + 1)
        setLinks([...links, ...data])
        setIsLoading(false)
      } else {
        alert(data.msg + "\n" + data.err)
        setIsLoading(false)
      }
    } catch (error) {
      alert(error)
      setIsLoading(false)
    }
  }

  useEffect(() => {
    if (isModalOpen) {
      const scrollY = String(window.scrollY)
      document.body.classList.add('modal-open')
      document.body.style.top = `-${scrollY}px`
      window.scrollTo(0, parseInt(scrollY || "0") * 1)
    } else {
      const scrollY = String(document.body.style.top)
      document.body.classList.remove('modal-open')
      document.body.style.top = '';
      window.scrollTo(0, parseInt(scrollY || "0") * -1)
    }
  }, [isModalOpen])





  return (
    <div className="App">
      <Top {...{ url, setUrl, fetchThisUrl,count, setCount }} />
      {count > 1 ? <CurrentPage {...{count}}/> : null}
      <Main {...{ count, links, fetchThisUrl, setCount, setModalContent, setIsModalOpen, setIsLoading }} />
      {isLoading ? <Loading /> : null}
      {isModalOpen ? <Modal {...{ ...{ modalContent }, setIsModalOpen }} /> : null}
    </div>
  )
}

export default App
