import { NEXT_AUTH } from '@/app/lib/auth'
import { getServerSession } from 'next-auth'
import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/db'

// PUT: Update a vendor
export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
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
    const vendor = await prisma.vendor.update({
      where: {
        id: params.id,
      },
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

    return NextResponse.json(vendor, { status: 200 })
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
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(NEXT_AUTH)
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const vendor = await prisma.vendor.delete({
      where: { id: params.id },
    })

    return NextResponse.json({ success: true, vendor }, { status: 200 })
  } catch (error) {
    console.error(error)
    return NextResponse.json(
      { error: 'Failed to delete vendor' },
      { status: 500 }
    )
  }
}
