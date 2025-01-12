import { NEXT_AUTH } from '@/app/lib/auth'
import { getServerSession } from 'next-auth'
import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/db'

// GET: Get a single vendor
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(NEXT_AUTH)
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const resolvedParams = await params
    const vendorId = resolvedParams.id

    const vendor = await prisma.vendor.findFirst({
      where: { id: vendorId },
    })

    if (!vendor) {
      return NextResponse.json(
        { error: 'Vendor not found or unauthorized' },
        { status: 404 }
      )
    }

    return NextResponse.json(vendor, { status: 200 })
  } catch (error) {
    console.error('Error fetching vendor:', error)
    return NextResponse.json({ error: 'Failed to get vendor' }, { status: 500 })
  }
}

// PUT: Update a vendor
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
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

  try {
    const resolvedParams = await params
    const vendorId = resolvedParams.id
    const vendor = await prisma.vendor.findFirst({
      where: {
        id: vendorId,
        userId: session.user.id,
      },
    })

    if (!vendor) {
      return NextResponse.json(
        { error: 'Vendor not found or unauthorized' },
        { status: 404 }
      )
    }

    const updatedVendor = await prisma.vendor.update({
      where: { id: vendorId },
      data: {
        name,
        bankAccount,
        bankName,
        address1,
        address2,
        city,
        country,
        zipCode,
      },
    })

    return NextResponse.json(updatedVendor, { status: 200 })
  } catch (error) {
    console.error(error)
    return NextResponse.json(
      { error: 'Failed to update vendor' },
      { status: 500 }
    )
  }
}

// DELETE: Delete a vendor
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(NEXT_AUTH)
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const resolvedParams = await params
    const vendorId = resolvedParams.id

    const vendor = await prisma.vendor.findFirst({
      where: {
        id: vendorId,
        userId: session.user.id,
      },
    })

    if (!vendor) {
      return NextResponse.json(
        { error: 'Vendor not found or unauthorized' },
        { status: 404 }
      )
    }

    await prisma.vendor.delete({
      where: { id: vendorId },
    })

    return NextResponse.json({ success: true }, { status: 200 })
  } catch (error) {
    console.error(error)
    return NextResponse.json(
      { error: 'Failed to delete vendor' },
      { status: 500 }
    )
  }
}
