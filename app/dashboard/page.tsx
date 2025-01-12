'use client';

import { useEffect, useState } from 'react';
import { useSession, signOut } from 'next-auth/react';
import Loading from '../Loading';
import Link from 'next/link';

interface Vendor {
  id: string;
  name: string;
  bankAccount: string;
  bankName: string;
  address1: string;
  address2?: string | null;
  city: string | null;
  country: string | null;
  zipCode: string | null;
  userId: string;
}

interface SessionUser {
  id?: string;
  name?: string | null;
  email?: string | null;
  image?: string | null;
}

const PAGE_SIZE = 10;

const Dashboard = () => {
  const { data: session, status } = useSession();
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState<number>(0);
  const [totalVendors, setTotalVendors] = useState<number>(0);

  useEffect(() => {
    const fetchVendors = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(`/api/vendors?skip=${page * PAGE_SIZE}&take=${PAGE_SIZE}`);
        if (!response.ok) {
          throw new Error('Failed to fetch vendors');
        }
        const data = await response.json();
        setVendors(data.vendors);
        setTotalVendors(data.totalVendors);
      } catch (err: any) {
        setError(err.message || 'Something went wrong');
      } finally {
        setLoading(false);
      }
    };

    fetchVendors();
  }, [page]);

  const handleDelete = async (id: string) => {
    if (!(session?.user as SessionUser)?.id) {
      alert('You are not authorized to delete this vendor.');
      return;
    }

    if (confirm('Are you sure you want to delete this vendor?')) {
      try {
        const response = await fetch(`/api/vendors/${id}`, { method: 'DELETE' });
        if (!response.ok) {
          throw new Error('Failed to delete vendor');
        }
        setVendors(vendors.filter((vendor) => vendor.id !== id));
      } catch (err: any) {
        alert(err.message || 'Failed to delete vendor');
      }
    }
  };

  const handlePagination = (direction: 'prev' | 'next') => {
    if (direction === 'prev' && page > 0) {
      setPage((prev) => prev - 1);
    }
    if (direction === 'next' && (page + 1) * PAGE_SIZE < totalVendors) {
      setPage((prev) => prev + 1);
    }
  };

  if (status === 'loading') {
    return <Loading />;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-6 px-8">
      <header className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-extrabold text-gray-800">Vendor Dashboard</h1>
        <div className="flex items-center space-x-4">
          {!session?.user ? (
            <>
              <Link href="/api/auth/signin">
                <button className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition duration-300">
                  Sign In
                </button>
              </Link>
              <Link href="/">
                <button className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition duration-300">
                  Go Home
                </button>
              </Link>
            </>
          ) : (
            <>
              <button
                onClick={() => signOut()}
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition duration-300"
              >
                Logout
              </button>
              <Link href="/create-vendor">
                <button className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition duration-300">
                  Add Vendor
                </button>
              </Link>
            </>
          )}
        </div>
      </header>

      {loading ? (
        <Loading />
      ) : error ? (
        <p className="text-center text-red-500">{error}</p>
      ) : (
        <div>
          <table className="min-w-full table-auto bg-white shadow-lg rounded-lg">
            <thead className="bg-gray-200">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Vendor Name</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Bank Account</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Bank Name</th>
                <th className="px-4 py-3 text-center text-sm font-semibold text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody>
              {vendors.map((vendor) => (
                <tr key={vendor.id} className="border-t hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm text-gray-700">{vendor.name}</td>
                  <td className="px-4 py-3 text-sm text-gray-700">{vendor.bankAccount}</td>
                  <td className="px-4 py-3 text-sm text-gray-700">{vendor.bankName}</td>
                  <td className="px-4 py-3 text-center">
                    {vendor.userId === (session?.user as SessionUser)?.id && (
                      <>
                        <Link href={`/edit-vendor/${vendor.id}`}>
                          <button className="mr-2 text-blue-500 hover:text-blue-700">Edit</button>
                        </Link>
                        <button
                          onClick={() => handleDelete(vendor.id)}
                          className="text-red-500 hover:text-red-700"
                        >
                          Delete
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="mt-6 flex justify-between items-center">
            <button
              onClick={() => handlePagination('prev')}
              disabled={page === 0}
              className="px-4 py-2 bg-gray-600 text-white rounded-lg disabled:opacity-50"
            >
              Previous
            </button>
            <button
              onClick={() => handlePagination('next')}
              disabled={(page + 1) * PAGE_SIZE >= totalVendors}
              className="px-4 py-2 bg-gray-600 text-white rounded-lg disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
