import React from 'react'
import pizza from './images/pizza.jpg'
import { Routes, Route, Link } from 'react-router-dom'
import Form from './Form'

function Home() {
  return (
    <div>
      <h2>
        Welcome to Bloom Pizza!
      </h2>
      {/* clicking on the img should navigate to "/order" */}
      <Link to='order'>
        <img alt="order-pizza" style={{ cursor: 'pointer' }} src={pizza} />
      </Link>
      <Routes>
        <Route path='order' element={<Form />} />
      </Routes>
    </div>
  )
}

export default Home
