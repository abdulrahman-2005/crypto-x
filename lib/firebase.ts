import { initializeApp } from "firebase/app"
import { getFirestore, doc, getDoc } from "firebase/firestore"
import { getAuth } from "firebase/auth"
import { cryptos } from "./crypto-data"

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)
export const db = getFirestore(app)
export const auth = getAuth(app)

export function getCryptoById(id: string) {
  return cryptos.find(crypto => crypto.id === id)
}

export async function getCryptoByIdFirestore(id: string) {
  const docRef = doc(db, "cryptos", id)
  const docSnap = await getDoc(docRef)

  if (docSnap.exists()) {
    const data = docSnap.data()
    return {
      id: docSnap.id,
      name: data.name,
      symbol: data.symbol,
      price: data.price.toString(),
      change: data.change.toString() + "%",
      rating: data.rating,
      imageUrl: data.imageUrl,
      chartData: data.chartData || [],
      trend: data.trend,
      islamicRating: data.islamicRating,
      shortDescription: data.shortDescription,
      fullContent: data.fullContent,
      pros: data.pros || [],
      cons: data.cons || [],
      shariaRuling: data.shariaRuling,
      rulingReason: data.rulingReason
    }
  }
  return null
} 