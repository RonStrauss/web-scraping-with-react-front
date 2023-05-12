import { useEffect, useState } from 'react'
import './App.css'
import CurrentPage from './Components/CurrentPage/CurrentPage'
import { Loading } from './Components/Loading/Loading'
import { Main } from './Components/Main/Main'
import { Modal } from './Components/Modal/Modal'
import { Snackbar } from './Components/Snackbar/Snackbar'
import { Top } from './Components/Top/Top'
import ModalContent from './Types/ModalContent'
import ScrappedContent from './Types/ScrappedContent'
import io from 'socket.io-client';

export const PORT = import.meta.env.VITE_SERVER_PORT || 1000
export const protocol = JSON.parse(import.meta.env.VITE_isSSL) ? 'https' : 'http'
export const domain = import.meta.env.VITE_DOMAIN || 'localhost'
export const API = `${protocol}://${domain}:${PORT}`

function App() {
  const [count, setCount] = useState(1)
  const [url, setUrl] = useState("")
  const [links, setLinks] = useState<ScrappedContent[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [modalContent, setModalContent] = useState<ModalContent>({})
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isSnackbarOpen, setIsSnackbarOpen] = useState(false)
  const [snackbarMessage, setSnackbarMessage] = useState('Download Started!')
  const [toKeep, setToKeep] = useState(30)



  const fetchThisUrl = async (inputtedUrl: string = url) => {
    try {
      if (!inputtedUrl) {
        alert('Please enter a valid url!')
        return;
      }
      setIsLoading(true)
      const res = await fetch(`${API}/scrape-page?url=${inputtedUrl}${count > 1 ? "&page=" + count : ''}`)
      const data = await res.json()
      if (!data.err) {
        setCount(count + 1)
        setLinks([...links.slice(Math.max(links.length - toKeep, 0), links.length), ...data])
        window.scrollTo(0, window.scrollY)

        // setLinks([...links, ...data])
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

  const openSnackbarWithMessage = (val: string) => {
    setSnackbarMessage(val)
    setIsSnackbarOpen(true)
    setTimeout(() => { setIsSnackbarOpen(false) }, 4000)
  }

  useEffect(() => {
    const socket = io(API)
    socket.on('connect', () => {
      console.log('connected');
    });
    socket.on('started', (val: string) => {
      setSnackbarMessage(val)
      setIsSnackbarOpen(true)
      setTimeout(() => { setIsSnackbarOpen(false) }, 4000)
      console.log('started');
    });

    socket.on('finished', (val: string) => {
      openSnackbarWithMessage(val)
    });

    socket.on('error', (val: string) => {
      openSnackbarWithMessage(val)
    })

    return () => {
      socket.off('started');
      socket.off('finished');
      socket.off('error');
      socket.off('connect');
    };
  }, []);





  return (
    <div className="App">
      <Top {...{ url, setUrl, fetchThisUrl, count, setCount, toKeep,setToKeep }} />
      {count > 1 ? <CurrentPage {...{ count }} /> : null}
      <Main {...{ count, links, fetchThisUrl, url, setCount, setModalContent, setIsModalOpen, setIsLoading }} />
      {isLoading ? <Loading /> : null}
      {isModalOpen ? <Modal {...{ ...{ modalContent }, setIsModalOpen }} /> : null}
      <Snackbar {...{ isSnackbarOpen, setIsSnackbarOpen, snackbarMessage, setSnackbarMessage }} />
    </div>
  )
}

export default App
