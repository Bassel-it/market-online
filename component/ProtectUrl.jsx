import React from 'react'
import { useStateContext } from '../hooks/useStateContext'
import Login from './Login'

function ProtectComp({child}) {
    
const {loggedin}=useStateContext()
  
  return (<>
    {loggedin?child:<Login/>}
    </>)
}

export default ProtectComp