import React, { useContext, useState } from 'react'
import {useNavigate} from 'react-router-dom'
import axios from 'axios'
import { UserContext } from '../UserContext'

const LoginPage = () => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const {setUserInfo} = useContext(UserContext)
  const navigate = useNavigate();

  const login = async (e) => {
    e.preventDefault()
    try {
      const response = await axios.post('http://localhost:4000/login', {
        username,
        password,
      }, {withCredentials: true})
      
      setUserInfo(response.data)
      navigate('/')

    } catch (error) {
      console.log(error)
      alert('Login Failed!')
    }
  }

  return (
    <form className="login" onSubmit={login}>
      <h1>Login</h1>
      <input
        type="text"
        placeholder="username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <input
        type="password"
        placeholder="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button>Login</button>
    </form>
  )
}

export default LoginPage
