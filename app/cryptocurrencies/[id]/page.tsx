import { Suspense } from "react"
import { notFound } from "next/navigation"
import CryptoReview from "@/components/crypto-review"
import { CryptoData } from "@/app/types"
import { cryptos } from "@/lib/crypto-data"
import { getCryptoByIdFirestore } from "@/lib/firebase"
import { collection, getDocs } from "firebase/firestore"
import { db } from "@/lib/firebase"

interface PageProps {
  params: {
    id: string
  }
}

// This function is required for static exports with dynamic routes
export async function generateStaticParams() {
  try {
    // First, get all IDs from the static data
    const staticIds = cryptos.map((crypto) => ({
      id: crypto.id,
    }));

    // Then, fetch all IDs from Firestore
    const cryptosSnapshot = await getDocs(collection(db, "cryptos"));
    const firestoreIds = cryptosSnapshot.docs.map((doc) => ({
      id: doc.id,
    }));

    // Combine both sets of IDs, ensuring no duplicates
    const allIds = [...staticIds];
    
    firestoreIds.forEach(item => {
      if (!allIds.some(existingItem => existingItem.id === item.id)) {
        allIds.push(item);
      }
    });

    console.log(`Generated static params for ${allIds.length} cryptocurrencies`);
    
    return allIds;
  } catch (error) {
    console.error("Error generating static params:", error);
    // Return at least the static data to prevent build errors
    return cryptos.map((crypto) => ({
      id: crypto.id,
    }));
  }
}

export default async function Page({ params }: PageProps) {
  const cryptoId = params.id;
  
  try {
    // Fetch cryptocurrency data server-side
    const cryptoData = await getCryptoByIdFirestore(cryptoId);
    
    if (!cryptoData) {
      return notFound();
    }
    
    return (
      <Suspense fallback={
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-700 rounded w-1/4 mb-8"></div>
            <div className="space-y-4">
              <div className="h-4 bg-gray-700 rounded w-3/4"></div>
              <div className="h-4 bg-gray-700 rounded w-1/2"></div>
            </div>
          </div>
        </div>
      }>
        <CryptoReview crypto={cryptoData as CryptoData} />
      </Suspense>
    );
  } catch (error) {
    console.error("Error fetching cryptocurrency:", error);
    
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-500/20 border border-red-500/50 text-red-400 p-4 rounded-xl">
          <h2 className="text-xl font-bold mb-2">Error</h2>
          <p>Failed to load cryptocurrency data</p>
        </div>
      </div>
    );
  }
} 