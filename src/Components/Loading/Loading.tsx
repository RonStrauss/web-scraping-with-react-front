import React from 'react'
import loading from "../../Assets/loading.svg"
import './Loading.css'

type Props = {
}

export const Loading = (props: Props) => {
  return (
    <div className="loading">
    <span>Loading...</span>
  <img src={loading}/>
  </div>
  )
}