import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  try {
    // Get URL parameters
    const url = new URL(request.url);
    const userId = url.searchParams.get('userId');
    
    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }
    
    // For demo purposes, we'll generate mock data
    // In a real app, this would fetch from MongoDB
    
    // Mock data for spending by category
    const spendingByCategory = [
      { category: 'Groceries', amount: 450, color: 'rgb(255, 99, 132)' },
      { category: 'Entertainment', amount: 300, color: 'rgb(54, 162, 235)' },
      { category: 'Bills', amount: 650, color: 'rgb(255, 206, 86)' },
      { category: 'Shopping', amount: 200, color: 'rgb(75, 192, 192)' },
      { category: 'Other', amount: 150, color: 'rgb(153, 102, 255)' }
    ];

    // Mock data for monthly spending
    const monthlySpending = [
      { month: 'Jan', amount: 1200 },
      { month: 'Feb', amount: 1500 },
      { month: 'Mar', amount: 1100 },
      { month: 'Apr', amount: 1800 },
      { month: 'May', amount: 1300 },
      { month: 'Jun', amount: 1600 }
    ];
    
    return NextResponse.json({
      spendingByCategory,
      monthlySpending
    });
    
  } catch (error) {
    console.error('Error generating spending data:', error);
    return NextResponse.json({ error: 'Failed to generate spending data' }, { status: 500 });
  }
}