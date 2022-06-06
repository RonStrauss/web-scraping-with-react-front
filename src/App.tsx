import { useEffect, useState } from 'react'
import './App.css'
import { Main } from './Components/Main/Main'
import { Top } from './Components/Top/Top'
import { ScrappedContent } from './Types/ScrappedContent'

function App() {
  const [count, setCount] = useState(1)
  const [url, setUrl] = useState("")
  const [links, setLinks] = useState<ScrappedContent[]>([])

  useEffect(() => {
    
  
    return () => {
      
    }
  }, [])
  

  return (
    <div className="App">
     <Top {...{url,count,setUrl,setCount,setLinks}}/>
     <Main {...{url,count,setUrl,setCount,links}}/>
    </div>
  )
}

export default App
