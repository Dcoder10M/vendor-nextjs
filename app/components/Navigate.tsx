'use client'
import Link from 'next/link'
import { signOut, useSession } from 'next-auth/react'
import Loading from '../Loading'

const Navigate = () => {
  const { data, status } = useSession()
  if (status === 'loading') {
    return <Loading />
  }
  return (
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
            <button className='px-8 py-3 bg-green-500 text-white font-medium rounded-lg shadow-md hover:bg-green-400 transition-all duration-300 transform hover:scale-105'>
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
  )
}

export default Navigate
