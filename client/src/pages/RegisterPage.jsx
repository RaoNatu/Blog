import React, { useState } from 'react'
import axios from 'axios'

const RegisterPage = () => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const register = async (e) => {
    e.preventDefault()
    try{
      const resposne = await axios.post('http://localhost:4000/register', {username, password})
      alert("Registration Successfull!")
    } catch(error) {
      alert("Registration Failed!")
    }
  }

  return (
    <form className="register" onSubmit={register}>
      <h1>Register</h1>
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
      <button>Register</button>
    </form>
  )
}

export default RegisterPage
