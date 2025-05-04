import { initializeApp } from "firebase/app"
import { getFirestore, collection, addDoc, doc, setDoc } from "firebase/firestore"
import { cryptos } from "@/lib/crypto-data"
import { hashPassword } from "@/lib/auth"

const firebaseConfig = {
  apiKey: "AIzaSyDfvX9sowkfrRotS5z08xDwmk29aZAwVjs",
  authDomain: "newcrypto-4e3f0.firebaseapp.com",
  projectId: "newcrypto-4e3f0",
  storageBucket: "newcrypto-4e3f0.firebasestorage.app",
  messagingSenderId: "760268557632",
  appId: "1:760268557632:web:aaf7954d47df6096c9fea5"
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)
const db = getFirestore(app)

const exchanges = [
  {
    name: "Binance",
    rating: 4.7,
    islamicRating: "Controversial",
    fees: "0.1%",
    coins: 350,
    imageUrl: "https://cryptologos.cc/logos/binance-coin-bnb-logo.png",
    shortDescription: "The world's largest cryptocurrency exchange by trading volume, offering a wide range of trading pairs and features.",
    fullContent: "Binance is a global cryptocurrency exchange that provides a platform for trading more than 350 cryptocurrencies. Founded in 2017, Binance has quickly risen to become the largest crypto exchange in the world by trading volume. The platform is known for its fast processing speed, low trading fees, and wide variety of trading options.",
    pros: [
      "Lowest trading fees in the industry",
      "High liquidity and trading volume",
      "Wide variety of cryptocurrencies",
      "Advanced trading features",
      "Strong security measures"
    ],
    cons: [
      "Complex interface for beginners",
      "Regulatory challenges in some countries",
      "Limited fiat currency support",
      "Customer support can be slow",
      "Some features not available in certain regions"
    ],
    shariaRuling: "Controversial",
    rulingReason: "While Binance offers Islamic trading accounts, some of its features like margin trading and certain derivatives may not be Sharia-compliant. The platform's mixed offerings require careful consideration from an Islamic perspective.",
    minimumDeposit: "$10",
    tradingPlatforms: [
      "Web Platform",
      "Mobile App (iOS/Android)",
      "Desktop Application",
      "API Trading"
    ],
    licensesRegulations: [
      "DFSA (Dubai)",
      "FCA (UK)",
      "FINMA (Switzerland)",
      "MAS (Singapore)"
    ],
    paymentMethods: [
      "Bank Transfer",
      "Credit/Debit Card",
      "Crypto Transfer",
      "P2P Trading"
    ],
    customerSupport: "24/7 live chat, email support, and comprehensive help center"
  },
  {
    name: "Coinbase",
    rating: 4.5,
    islamicRating: "Halal",
    fees: "0.5%",
    coins: 250,
    imageUrl: "https://cryptologos.cc/logos/coinbase-coin-logo.png",
    shortDescription: "A user-friendly, regulated cryptocurrency exchange perfect for beginners, offering secure trading and storage solutions.",
    fullContent: "Coinbase is one of the most trusted cryptocurrency exchanges, particularly popular in the United States. Founded in 2012, it's known for its easy-to-use interface, regulatory compliance, and strong security measures. The platform is ideal for newcomers to cryptocurrency trading.",
    pros: [
      "User-friendly interface",
      "Strong security features",
      "Regulated in multiple jurisdictions",
      "Insurance on crypto holdings",
      "Educational resources for beginners"
    ],
    cons: [
      "Higher fees compared to some competitors",
      "Limited cryptocurrency selection",
      "Customer service can be slow",
      "Platform outages during high volume",
      "Geographic restrictions"
    ],
    shariaRuling: "Halal",
    rulingReason: "Coinbase operates under strict regulatory oversight and primarily focuses on spot trading of cryptocurrencies. The platform avoids interest-bearing products and maintains clear segregation of user funds, making it generally acceptable from an Islamic perspective.",
    minimumDeposit: "$2",
    tradingPlatforms: [
      "Web Platform",
      "Mobile App (iOS/Android)",
      "Coinbase Pro",
      "API Access"
    ],
    licensesRegulations: [
      "SEC regulated",
      "FinCEN registered",
      "BitLicense (NY)",
      "FCA (UK)"
    ],
    paymentMethods: [
      "Bank Transfer (ACH)",
      "Wire Transfer",
      "Credit/Debit Card",
      "PayPal"
    ],
    customerSupport: "Email support, phone support for account issues, and extensive help center"
  },
  {
    name: "Kraken",
    rating: 4.3,
    islamicRating: "Halal",
    fees: "0.26%",
    coins: 200,
    imageUrl: "https://cryptologos.cc/logos/kraken-krk-logo.png",
    shortDescription: "A well-established cryptocurrency exchange known for its security, advanced trading features, and regulatory compliance.",
    fullContent: "Kraken, founded in 2011, is one of the oldest and most respected cryptocurrency exchanges. The platform is known for its robust security measures, advanced trading features, and commitment to regulatory compliance. It offers a good balance between features for both beginners and experienced traders.",
    pros: [
      "Strong security track record",
      "Competitive fees",
      "Advanced trading features",
      "Good regulatory compliance",
      "Margin trading available"
    ],
    cons: [
      "Limited payment methods",
      "Complex fee structure",
      "Slower verification process",
      "Limited tokens compared to competitors",
      "Interface can be overwhelming"
    ],
    shariaRuling: "Halal",
    rulingReason: "Kraken's focus on spot trading and transparent operations aligns well with Islamic principles. The exchange maintains clear segregation of funds and provides detailed documentation of its practices.",
    minimumDeposit: "$10",
    tradingPlatforms: [
      "Web Trading",
      "Kraken Pro",
      "Mobile App (iOS/Android)",
      "API Trading"
    ],
    licensesRegulations: [
      "FinCEN registered",
      "FCA (UK)",
      "FINTRAC (Canada)",
      "AUSTRAC (Australia)"
    ],
    paymentMethods: [
      "Wire Transfer",
      "SEPA",
      "Bank Transfer",
      "Crypto Deposits"
    ],
    customerSupport: "24/7 live chat, email support, and comprehensive knowledge base"
  }
]

async function initializeDatabase() {
  try {
    console.log("Starting database initialization...")

    // Initialize admin user
    const adminUsername = "ahmedma12w@gmail.com"
    const adminPassword = "123456"
    const hashedPassword = hashPassword(adminPassword)

    await setDoc(doc(db, "admins", adminUsername), {
      username: adminUsername,
      password: hashedPassword,
      createdAt: new Date().toISOString()
    })
    console.log("Admin user created successfully")

    // Initialize cryptos
    for (const crypto of cryptos) {
      await setDoc(doc(db, "cryptos", crypto.id), {
        ...crypto,
        createdAt: new Date().toISOString()
      })
    }
    console.log("Cryptos initialized successfully")

    // Add exchanges
    const exchangeCollection = collection(db, "exchanges")
    for (const exchange of exchanges) {
      await addDoc(exchangeCollection, exchange)
      console.log(`Added ${exchange.name} to exchanges collection`)
    }

    console.log("Database initialization completed!")
  } catch (error) {
    console.error("Error initializing database:", error)
  }
}

initializeDatabase() 