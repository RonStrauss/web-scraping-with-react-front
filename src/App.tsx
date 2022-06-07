import { useEffect, useState } from 'react'
import './App.css'
import { Main } from './Components/Main/Main'
import { Top } from './Components/Top/Top'
import { ScrappedContent } from './Types/ScrappedContent'
import loading from "./Assets/loading.svg"

function App() {
  const [count, setCount] = useState(1)
  const [url, setUrl] = useState("")
  const [links, setLinks] = useState<ScrappedContent[]>([])
  const [isHidden, setIsHidden] = useState(true)

  const fetchThisUrl = async (inputtedUrl?:string) =>{
    //typescript doesn't allow both optional and default arguments in function declaration
    if (!inputtedUrl)inputtedUrl = url
    try {
      setIsHidden(false)
      const res = await fetch(`http://localhost:1000/scrape-page?url=${inputtedUrl}${count > 1 ? "&page="+count : ''}`)
      const data = await res.json()
      if (!data.err){
        setCount(count+1)
        setLinks([...links,...data])
        setIsHidden(true)
      } else {
        alert(data.msg+"\n"+data.err)
        setIsHidden(true)
      }
    } catch (error) {
      alert(error)
      setIsHidden(true)
    }
  }
  

  return (
    <div className="App">
     <Top {...{url,setUrl,fetchThisUrl}}/>
     <Main {...{count,links,fetchThisUrl,setCount}}/>
     <div className="loading" 
     style={{display: isHidden ? "none" : ""}}
     >
       <span>Loading...</span>
     <img src={loading}/>

     </div>
    </div>
  )
}

export default App
