'use client'
import React from 'react'
import Link from 'next/link'
import { signOut, useSession } from 'next-auth/react'

const Landing = () => {
  const { data } = useSession()
  return (
    <div className='flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-gray-200 to-gray-400'>
      <div className='text-black'>{JSON.stringify(data)}</div>
      <div className='text-center'>
        <h1 className='text-5xl font-extrabold text-gray-900 mb-6'>
          Welcome to Vendor's List
        </h1>
        <p className='text-xl text-gray-700 mb-10'>
          Join our community and start sharing your story.
        </p>
      </div>

      <div className='flex space-x-6'>
        {data == null ? (
          <>
            <Link href='/api/auth/signin'>
              <button className='px-8 py-3 bg-blue-800 text-white font-medium rounded-lg shadow-md hover:bg-blue-700 transition-all duration-300 transform hover:scale-105'>
                Sign In
              </button>
            </Link>
          </>
        ) : (
          <>
            <Link href='/dashboard'>
              <button className='px-8 py-3 bg-emerald-600 text-white font-medium rounded-lg shadow-md hover:bg-emerald-500 transition-all duration-300 transform hover:scale-105'>
                Go to Dashboard
              </button>
            </Link>
            <button
              onClick={() => signOut()}
              className='px-8 py-3 bg-red-600 text-white font-medium rounded-lg shadow-md hover:bg-red-500 transition-all duration-300 transform hover:scale-105'
            >
              Log Out
            </button>
          </>
        )}
      </div>
    </div>
  )
}

export default Landing
