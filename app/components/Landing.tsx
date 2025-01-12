import React from 'react'
import Navigate from './Navigate'

const Landing = () => {
  return (
    <div className='flex flex-col items-center justify-center min-h-screen'>
      <div className='text-center'>
        <h1 className='text-5xl font-extrabold mb-6'>
          Welcome to Vendor&apos;s List
        </h1>
        <p className='text-xl mb-10'>
          Join our community and start sharing your story.
        </p>
      </div>
      <Navigate/>
    </div>
  )
}

export default Landing
