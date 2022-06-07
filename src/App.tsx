import { useEffect, useState } from 'react'
import './App.css'
import { Main } from './Components/Main/Main'
import { Top } from './Components/Top/Top'
import { ScrappedContent } from './Types/ScrappedContent'

function App() {
  const [count, setCount] = useState(1)
  const [url, setUrl] = useState("")
  const [links, setLinks] = useState<ScrappedContent[]>([])

  const fetchThisUrl = async (inputtedUrl?:string) =>{
    //typescript doesn't allow both optional and default arguments in function declaration
    if (!inputtedUrl)inputtedUrl = url
    const res = await fetch(`http://localhost:1000/scrape-page?url=${inputtedUrl}${count > 1 ? "&page="+count : ''}`)
    const data = await res.json()
    if (!data.err){
      setCount(count+1)
        setLinks([...links,...data])
    } else {
      alert(data.msg+"\n"+data.err)
    }
  }
  

  return (
    <div className="App">
     <Top {...{url,setUrl,fetchThisUrl}}/>
     <Main {...{count,links,fetchThisUrl,setCount}}/>
    </div>
  )
}

export default App
