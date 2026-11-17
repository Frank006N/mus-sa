import { NextResponse } from 'next/server';

// Temporary mock data matching your seeded database structure
// Replace with actual Drizzle query once db import path is confirmed
const MOCK_LISTINGS = [
  { id: '1', title: 'Fresh Fade Barber Shop', description: 'Professional haircuts & styling. Student discount Mon-Thu.', priceKes: 300, category: 'services', campusZone: 'Main Gate Road', imageUrls: ['https://images.unsplash.com/photo-1585747860715-2ba37e788b70?w=600&h=400&fit=crop'], contactPhone: '+254712345678', verifiedSeller: true },
  { id: '2', title: 'Glow Up Beauty Salon', description: 'Nail art, braids, facials & makeup for events.', priceKes: 500, category: 'services', campusZone: 'Hostels Block B', imageUrls: ['https://images.unsplash.com/photo-1560066984-138dadb4c035?w=600&h=400&fit=crop'], contactPhone: '+254798765432', verifiedSeller: true },
  { id: '3', title: 'Tech Repair Hub', description: 'Phone screen replacement, laptop servicing. 3-month warranty.', priceKes: 1500, category: 'services', campusZone: 'Engineering Block', imageUrls: ['https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?w=600&h=400&fit=crop'], contactPhone: '+254722111222', verifiedSeller: false },
  { id: '4', title: 'Campus Coffee Cart', description: 'Freshly brewed coffee delivered to lecture halls.', priceKes: 150, category: 'food', campusZone: 'Library Plaza', imageUrls: ['https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=600&h=400&fit=crop'], contactPhone: '+254733444555', verifiedSeller: false },
  { id: '5', title: 'Graphic Design Studio', description: 'Logos, flyers, thesis formatting. Fast turnaround.', priceKes: 800, category: 'services', campusZone: 'Arts Block', imageUrls: ['https://images.unsplash.com/photo-1626785774573-4b799315345d?w=600&h=400&fit=crop'], contactPhone: '+254744555666', verifiedSeller: true },
];

export async function GET() {
  try {
    // TODO: Replace with actual Drizzle query once db path confirmed
    // const listings = await db.select().from(marketplaceListings).orderBy(desc(marketplaceListings.createdAt));
    return NextResponse.json({ data: MOCK_LISTINGS });
  } catch (error) {
    console.error('Marketplace API Error:', error);
    return NextResponse.json({ data: [] }, { status: 500 });
  }
}
