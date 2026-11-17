'use client';
import { useEffect, useState } from 'react';

interface Listing {
  id: string;
  title: string;
  description: string;
  priceKes: number;
  category: string;
  campusZone: string;
  imageUrls?: string[];
  contactPhone?: string;
}

export default function MarketplacePage() {
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/marketplace')
      .then((res) => res.json())
      .then((data) => {
        setListings(data.data || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) return <div className="p-8 text-center">Loading marketplace...</div>;

  return (
    <div className="max-w-6xl mx-auto p-4">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Campus Marketplace</h1>
          <p className="text-gray-600 mt-1">Buy, sell, and discover student businesses at MUT.</p>
        </div>
        <button className="bg-blue-600 text-white px-5 py-2.5 rounded-xl font-medium hover:bg-blue-700 transition-colors shadow-lg shadow-blue-900/20">
          + New Listing
        </button>
      </div>

      {listings.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-gray-200">
          <p className="text-4xl mb-4">🛒</p>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No listings yet</h3>
          <p className="text-gray-500">Be the first to post a product or service!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {listings.map((l) => (
            <div key={l.id} className="bg-white rounded-2xl border border-gray-200 overflow-hidden hover:shadow-xl transition-all duration-300 group">
              <div className="aspect-[4/3] bg-gray-100 relative overflow-hidden">
                {l.imageUrls?.[0] ? (
                  <img src={l.imageUrls[0]} alt={l.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400 text-4xl">📦</div>
                )}
                <span className="absolute top-3 left-3 bg-black/70 backdrop-blur-sm text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide">{l.category}</span>
              </div>
              <div className="p-5">
                <h3 className="font-bold text-lg text-gray-900 mb-1 line-clamp-1">{l.title}</h3>
                <p className="text-green-700 font-extrabold text-xl mb-3">KES {Number(l.priceKes).toLocaleString()}</p>
                <p className="text-gray-600 text-sm mb-4 line-clamp-2 leading-relaxed">{l.description}</p>
                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                  <span className="text-xs text-gray-500 flex items-center gap-1">📍 {l.campusZone}</span>
                  {l.contactPhone && (
                    <a href={`tel:${l.contactPhone}`} className="text-xs bg-blue-50 text-blue-700 px-3 py-1 rounded-full font-medium hover:bg-blue-100 transition-colors">
                      📞 Contact
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
