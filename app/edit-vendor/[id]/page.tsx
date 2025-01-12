'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'

interface SessionUser {
  id: string
  name?: string | null
  email?: string | null
  image?: string | null
}

const EditVendor = () => {
  const router = useRouter()
  const { data: session, status } = useSession();
  const params = useParams()
  const vendorId = params.id
  const userId = (session?.user as SessionUser)?.id;

  const [name, setName] = useState<string>('')
  const [bankAccount, setBankAccount] = useState<string>('')
  const [bankName, setBankName] = useState<string>('')
  const [address1, setAddress1] = useState<string>('')
  const [address2, setAddress2] = useState<string | null>('')
  const [city, setCity] = useState<string | null>('')
  const [country, setCountry] = useState<string | null>('')
  const [zipCode, setZipCode] = useState<string | null>('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState<boolean>(false)

  useEffect(() => {
    const fetchVendor = async () => {
      if(status==='loading'){
        return
      }
      if(status==='unauthenticated'){
        router.push('/')
      }
      if (status !== 'authenticated' || !userId) {
        setError('You must be logged in to edit this vendor.')
        return
      }
      if (!vendorId) {
        setError('You must be logged in to edit this vendor.')
        return
      }

      try {
        const response = await fetch(`/api/vendors/${vendorId}`)

        if (!response.ok) {
          throw new Error('Failed to fetch vendor details')
        }

        const vendor = await response.json()

        console.log("vendorsssss", vendor)
        console.log(vendor.name)

        setName(vendor.name)
        setBankAccount(vendor.bankAccount)
        setBankName(vendor.bankName)
        setAddress1(vendor.address1)
        setAddress2(vendor.address2 || '')
        setCity(vendor.city)
        setCountry(vendor.country)
        setZipCode(vendor.zipCode)
      } catch (error: any) {
        setError(
          error.message || 'An error occurred while fetching vendor details'
        )
      }
    }

    fetchVendor()
  }, [status, session, vendorId])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (status !== 'authenticated' || !userId) {
      setError('You must be logged in to edit this vendor.')
      return
    }

    if (
      !name ||
      !bankAccount ||
      !bankName ||
      !address1
    ) {
      setError('Please fill in all required fields.')
      return
    }

    setLoading(true)
    setError(null)

    try {
      const response = await fetch(`/api/vendors/${vendorId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
          bankAccount,
          bankName,
          address1,
          address2,
          city,
          country,
          zipCode,
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to update vendor')
      }

      router.push('/dashboard')
    } catch (error: any) {
      setError(error.message || 'An error occurred while updating the vendor')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className='min-h-screen bg-gray-50 py-6 px-8'>
      <header className='flex justify-between items-center mb-6 text-gray-800'>
        <h1 className='text-3xl font-extrabold '>Edit Vendor</h1>
        <div>
          <p>
            <strong>Session Status:</strong> {status}
          </p>
          <p>
            <strong>User ID:</strong> {userId || 'Not available'}
          </p>
        </div>
      </header>
      <form
        onSubmit={handleSubmit}
        className='max-w-xl mx-auto bg-white p-6 rounded-lg shadow-lg'
      >
        <div className='space-y-4'>
          {error && <p className='text-red-500'>{error}</p>}

          <div>
            <label
              htmlFor='name'
              className='block text-sm font-semibold text-gray-700'
            >
              Vendor Name*
            </label>
            <input
              type='text'
              id='name'
              value={name}
              onChange={(e) => setName(e.target.value)}
              className='mt-1 block w-full p-3 bg-gray-100 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700'
              required
            />
          </div>

          <div>
            <label
              htmlFor='bankAccount'
              className='block text-sm font-semibold text-gray-700'
            >
              Bank Account No.*
            </label>
            <input
              type='text'
              id='bankAccount'
              value={bankAccount}
              onChange={(e) => setBankAccount(e.target.value)}
              className='mt-1 block w-full p-3 bg-gray-100 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700'
              required
            />
          </div>

          <div>
            <label
              htmlFor='bankName'
              className='block text-sm font-semibold text-gray-700'
            >
              Bank Name*
            </label>
            <input
              type='text'
              id='bankName'
              value={bankName}
              onChange={(e) => setBankName(e.target.value)}
              className='mt-1 block w-full p-3 bg-gray-100 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700'
              required
            />
          </div>

          <div>
            <label
              htmlFor='address1'
              className='block text-sm font-semibold text-gray-700'
            >
              Address Line 1*
            </label>
            <input
              type='text'
              id='address1'
              value={address1}
              onChange={(e) => setAddress1(e.target.value)}
              className='mt-1 block w-full p-3 bg-gray-100 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700'
              required
            />
          </div>

          <div>
            <label
              htmlFor='address2'
              className='block text-sm font-semibold text-gray-700'
            >
              Address Line 2
            </label>
            <input
              type='text'
              id='address2'
              value={address2 || ''}
              onChange={(e) => setAddress2(e.target.value)}
              className='mt-1 block w-full p-3 bg-gray-100 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700'
            />
          </div>

          <div>
            <label
              htmlFor='city'
              className='block text-sm font-semibold text-gray-700'
            >
              City
            </label>
            <input
              type='text'
              id='city'
              value={city || ''}
              onChange={(e) => setCity(e.target.value)}
              className='mt-1 block w-full p-3 bg-gray-100 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700'
            />
          </div>

          <div>
            <label
              htmlFor='country'
              className='block text-sm font-semibold text-gray-700'
            >
              Country
            </label>
            <input
              type='text'
              id='country'
              value={country || ''}
              onChange={(e) => setCountry(e.target.value)}
              className='mt-1 block w-full p-3 bg-gray-100 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700'
            />
          </div>

          <div>
            <label
              htmlFor='zipCode'
              className='block text-sm font-semibold text-gray-700'
            >
              Zip Code
            </label>
            <input
              type='text'
              id='zipCode'
              value={zipCode || ''}
              onChange={(e) => setZipCode(e.target.value)}
              className='mt-1 block w-full p-3 bg-gray-100 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700'
            />
          </div>

          <div className='mt-6'>
            <button
              type='submit'
              disabled={loading}
              className='w-full py-3 px-4 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50'
            >
              {loading ? 'Updating...' : 'Update Vendor'}
            </button>
          </div>
        </div>
      </form>
    </div>
  )
}

export default EditVendor
