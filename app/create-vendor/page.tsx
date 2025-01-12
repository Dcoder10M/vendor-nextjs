'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

interface SessionUser {
  id: string;
  name?: string | null;
  email?: string | null;
  image?: string | null;
}

const CreateVendor = () => {
  const { data: session } = useSession();
  const router = useRouter();

  const [name, setName] = useState<string>('');
  const [bankAccount, setBankAccount] = useState<string>('');
  const [bankName, setBankName] = useState<string>('');
  const [address1, setAddress1] = useState<string>('');
  const [address2, setAddress2] = useState<string | null>('');
  const [city, setCity] = useState<string | null>('');
  const [country, setCountry] = useState<string>('');
  const [zipCode, setZipCode] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!session || !(session.user as SessionUser).id) {
      setError('You must be logged in to create a vendor.');
      return;
    }

    if (!name || !bankAccount || !bankName || !address1) {
      setError('Please fill in all required fields.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/vendors', {
        method: 'POST',
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
          userId: (session.user as SessionUser).id,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create vendor');
      }

      router.push('/dashboard');
    } catch (error: any) {
      setError(error.message || 'An error occurred while creating the vendor');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-4 md:px-10">
      <header className="text-center mb-8">
        <h1 className="text-4xl font-extrabold text-gray-800">Create Vendor</h1>
      </header>

      <form onSubmit={handleSubmit} className="max-w-3xl mx-auto bg-white p-8 rounded-lg shadow-xl">
        <div className="space-y-6">
          {error && <p className="text-red-500">{error}</p>}

          <div>
            <label htmlFor="name" className="block text-sm font-semibold text-gray-700">Vendor Name*</label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-2 block w-full p-4 bg-gray-100 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700"
              required
            />
          </div>

          <div>
            <label htmlFor="bankAccount" className="block text-sm font-semibold text-gray-700">Bank Account No.*</label>
            <input
              type="text"
              id="bankAccount"
              value={bankAccount}
              onChange={(e) => setBankAccount(e.target.value)}
              className="mt-2 block w-full p-4 bg-gray-100 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700"
              required
            />
          </div>

          <div>
            <label htmlFor="bankName" className="block text-sm font-semibold text-gray-700">Bank Name*</label>
            <input
              type="text"
              id="bankName"
              value={bankName}
              onChange={(e) => setBankName(e.target.value)}
              className="mt-2 block w-full p-4 bg-gray-100 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500  text-gray-700"
              required
            />
          </div>

          <div>
            <label htmlFor="address1" className="block text-sm font-semibold text-gray-700">Address Line 1*</label>
            <input
              type="text"
              id="address1"
              value={address1}
              onChange={(e) => setAddress1(e.target.value)}
              className="mt-2 block w-full p-4 bg-gray-100 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700"
              required
            />
          </div>

          <div>
            <label htmlFor="address2" className="block text-sm font-semibold text-gray-700">Address Line 2</label>
            <input
              type="text"
              id="address2"
              value={address2 || ''}
              onChange={(e) => setAddress2(e.target.value)}
              className="mt-2 block w-full p-4 bg-gray-100 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700"
            />
          </div>

          <div>
            <label htmlFor="city" className="block text-sm font-semibold text-gray-700">City</label>
            <input
              type="text"
              id="city"
              value={city || ''}
              onChange={(e) => setCity(e.target.value)}
              className="mt-2 block w-full p-4 bg-gray-100 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700"
            />
          </div>

          <div>
            <label htmlFor="country" className="block text-sm font-semibold text-gray-700">Country</label>
            <input
              type="text"
              id="country"
              value={country || ''}
              onChange={(e) => setCountry(e.target.value)}
              className="mt-2 block w-full p-4 bg-gray-100 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700"
            />
          </div>

          <div>
            <label htmlFor="zipCode" className="block text-sm font-semibold text-gray-700">Zip Code</label>
            <input
              type="text"
              id="zipCode"
              value={zipCode || ''}
              onChange={(e) => setZipCode(e.target.value)}
              className="mt-2 block w-full p-4 bg-gray-100 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700"
            />
          </div>

          <div className="mt-8">
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
            >
              {loading ? 'Creating...' : 'Create Vendor'}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default CreateVendor;
