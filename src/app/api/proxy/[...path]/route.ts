import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  try {
    const { path } = await params;
    const apiPath = path.join('/');

    const { searchParams } = new URL(request.url);
    const queryString = searchParams.toString();

    const url = `${process.env.NEXT_PUBLIC_API_BASE_URL}/${apiPath}${queryString ? `?${queryString}` : ''}`;

    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${process.env.API_KEY}`,
      },
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: 'Failed to fetch data' },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
