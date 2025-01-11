import { NEXT_AUTH } from '@/app/lib/auth'
import { getServerSession } from 'next-auth'
import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/db'

// GET: Fetch all vendors with pagination
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const skip = parseInt(searchParams.get('skip') || '0')
  const take = parseInt(searchParams.get('take') || '10')

  try {
    const vendors = await prisma.vendor.findMany({
      skip,
      take,
      include: {
        user: {
          select: { id: true, name: true },
        },
      },
    })
    const totalVendors = await prisma.vendor.count()

    return NextResponse.json({ vendors, totalVendors })
  } catch (error) {
    console.error(error)
    return NextResponse.json(
      { error: 'Failed to fetch vendors' },
      { status: 500 }
    )
  }
}

// POST: Create a vendor
export async function POST(req: NextRequest) {
  const session = await getServerSession(NEXT_AUTH)
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  const body = await req.json()
  const {
    name,
    bankAccount,
    bankName,
    address1,
    address2,
    city,
    country,
    zipCode,
  } = body

  if (!name || !bankAccount || !bankName || !address2) {
    return NextResponse.json(
      { error: 'Mandatory fields missing' },
      { status: 400 }
    )
  }

  try {
    const vendor = await prisma.vendor.create({
      data: {
        name,
        bankAccount,
        bankName,
        address1,
        address2,
        city,
        country,
        zipCode,
        userId: session.user.id,
      },
    })

    return NextResponse.json(vendor, { status: 201 })
  } catch (error) {
    console.error(error)
    return NextResponse.json(
      { error: 'Failed to create vendor' },
      { status: 500 }
    )
  }
}
