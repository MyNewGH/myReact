import React from './react'
import ReactDom from "./react-dom";
const element = (
  <div className='title'>
    hello <span>react</span>
  </div>
)

function Home(){
  return  <div className='title'>
    hello <span>react</span>
  </div>
}
ReactDom.render(<Home name={"xxx"}/>,document.getElementById("root"))