import React from 'react'
import logo from '../assets/logo.png';

function Logo() {
  return (
    <div>
      <img 
        src={logo}
        alt="Logo" 
        width="100px" 
        height="70px"
        className='rounded-full'/>
    </div>
  )
}

export default Logo