import React, { useEffect, useState } from 'react'
import Post from '../components/Post'
import axios from 'axios'

const IndexPage = () => {

  const [posts, setPosts] = useState([])

  useEffect(() => {
    const fetchData = async () => {
      const response = await axios.get('http://localhost:4000/post')
      setPosts(response.data)
    }

    fetchData()
  }, [])

  return (
    <div>
      {posts.length > 0 && posts.map((post, index) => (
        <Post key={index} {...post}/>
      ))}
    </div>
  )
}

export default IndexPage
