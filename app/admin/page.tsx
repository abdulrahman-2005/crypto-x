"use client"

import { useState, useEffect } from "react"
import { collection, getDocs, addDoc, deleteDoc, doc, updateDoc } from "firebase/firestore"
import { db } from "@/lib/firebase"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
// إنشاء بديل بسيط لوظيفة toast
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { useRouter } from "next/navigation"

interface Crypto {
  id?: string
  name: string
  symbol: string
  price: number
  change: number
  rating: number
  imageUrl: string
  chartData: number[]
  trend: "up" | "down"
  islamicRating: "Halal" | "Controversial" | "Haram"
  shortDescription: string
  fullContent: string
  pros: string[]
  cons: string[]
  shariaRuling: "Halal" | "Controversial" | "Haram"
  rulingReason: string
}

interface Exchange {
  id?: string
  name: string
  rating: number
  islamicRating: "Halal" | "Controversial" | "Haram"
  fees: string
  coins: number
  imageUrl: string
  shortDescription: string
  fullContent: string
  pros: string[]
  cons: string[]
  shariaRuling: "Halal" | "Controversial" | "Haram"
  rulingReason: string
  minimumDeposit: string
  tradingPlatforms: string[]
  licensesRegulations: string[]
  paymentMethods: string[]
  customerSupport: string
}

// إنشاء بديل بسيط لوظيفة toast
const toast = {
  success: (message: string, options?: any) => {
    console.log('Success:', message, options);
    // يمكنك استخدام alert للإشعارات البسيطة إذا كنت تريد
    alert(message);
  },
  error: (message: string) => {
    console.error('Error:', message);
    // يمكنك استخدام alert للإشعارات البسيطة إذا كنت تريد
    alert(message);
  }
};

export default function AdminPage() {
  const router = useRouter()
  const [cryptos, setCryptos] = useState<Crypto[]>([])
  const [exchanges, setExchanges] = useState<Exchange[]>([])
  const [loading, setLoading] = useState(true)
  const [editingCrypto, setEditingCrypto] = useState<Crypto | null>(null)
  const [editingExchange, setEditingExchange] = useState<Exchange | null>(null)
  const [previewItem, setPreviewItem] = useState<Crypto | Exchange | null>(null)
  const [isPreviewOpen, setIsPreviewOpen] = useState(false)
  // التحقق من حالة تسجيل الدخول
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  
  // Search and filter states
  const [cryptoSearch, setCryptoSearch] = useState("")
  const [exchangeSearch, setExchangeSearch] = useState("")
  const [cryptoFilter, setCryptoFilter] = useState("")
  const [exchangeFilter, setExchangeFilter] = useState("")

  // التحقق من حالة تسجيل الدخول عند تحميل الصفحة
  useEffect(() => {
    // تحقق بسيط مباشر من localStorage
    try {
      const isAdmin = localStorage.getItem('isAdminAuthenticated') === 'true';
      setIsAuthenticated(isAdmin);
      
      if (!isAdmin) {
        console.log("Admin not authenticated, redirecting to login");
        // استخدام replace بدلاً من push لتجنب مشاكل السجل
        router.replace('/admin/auth');
        return;
      }
      
      // تحميل البيانات إذا كان المستخدم مصادق عليه
      fetchData();
    } catch (err) {
      console.error("Error checking auth:", err);
      setIsAuthenticated(false);
      router.replace('/admin/auth');
    }
  }, [router]);

  // Filtered data
  const filteredCryptos = cryptos.filter(crypto => {
    const matchesSearch = crypto.name.toLowerCase().includes(cryptoSearch.toLowerCase()) ||
                         crypto.symbol.toLowerCase().includes(cryptoSearch.toLowerCase())
    const matchesFilter = !cryptoFilter || crypto.islamicRating === cryptoFilter
    return matchesSearch && matchesFilter
  })

  const filteredExchanges = exchanges.filter(exchange => {
    const matchesSearch = exchange.name.toLowerCase().includes(exchangeSearch.toLowerCase())
    const matchesFilter = !exchangeFilter || exchange.islamicRating === exchangeFilter
    return matchesSearch && matchesFilter
  })

  // Form states
  const [newCrypto, setNewCrypto] = useState<Crypto>({
    name: "",
    symbol: "",
    price: 0,
    change: 0,
    rating: 0,
    imageUrl: "",
    chartData: [],
    trend: "up",
    islamicRating: "Halal",
    shortDescription: "",
    fullContent: "",
    pros: [],
    cons: [],
    shariaRuling: "Halal",
    rulingReason: ""
  })

  const [newExchange, setNewExchange] = useState<Exchange>({
    name: "",
    rating: 0,
    islamicRating: "Halal",
    fees: "",
    coins: 0,
    imageUrl: "",
    shortDescription: "",
    fullContent: "",
    pros: [],
    cons: [],
    shariaRuling: "Halal",
    rulingReason: "",
    minimumDeposit: "",
    tradingPlatforms: [],
    licensesRegulations: [],
    paymentMethods: [],
    customerSupport: ""
  })

  const [newPro, setNewPro] = useState("")
  const [newCon, setNewCon] = useState("")
  const [newExchangePro, setNewExchangePro] = useState("")
  const [newExchangeCon, setNewExchangeCon] = useState("")
  const [newTradingPlatform, setNewTradingPlatform] = useState("")
  const [newLicense, setNewLicense] = useState("")
  const [newPaymentMethod, setNewPaymentMethod] = useState("")

  const fetchData = async () => {
    try {
      const cryptoSnapshot = await getDocs(collection(db, "cryptos"))
      const exchangeSnapshot = await getDocs(collection(db, "exchanges"))

      setCryptos(cryptoSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Crypto)))
      setExchanges(exchangeSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Exchange)))
    } catch (error) {
      toast.error("Failed to fetch data")
    } finally {
      setLoading(false)
    }
  }

  const handleAddCrypto = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await addDoc(collection(db, "cryptos"), newCrypto)
      toast.success("✅ Cryptocurrency added successfully!", { description: "The new crypto has been added to the database." })
      setNewCrypto({
        name: "",
        symbol: "",
        price: 0,
        change: 0,
        rating: 0,
        imageUrl: "",
        chartData: [],
        trend: "up",
        islamicRating: "Halal",
        shortDescription: "",
        fullContent: "",
        pros: [],
        cons: [],
        shariaRuling: "Halal",
        rulingReason: ""
      })
      fetchData()
    } catch (error) {
      toast.error("Failed to add cryptocurrency")
    }
  }

  const handleAddExchange = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await addDoc(collection(db, "exchanges"), newExchange)
      toast.success("✅ Exchange added successfully!", { description: "The new exchange has been added to the database." })
      setNewExchange({
        name: "",
        rating: 0,
        islamicRating: "Halal",
        fees: "",
        coins: 0,
        imageUrl: "",
        shortDescription: "",
        fullContent: "",
        pros: [],
        cons: [],
        shariaRuling: "Halal",
        rulingReason: "",
        minimumDeposit: "",
        tradingPlatforms: [],
        licensesRegulations: [],
        paymentMethods: [],
        customerSupport: ""
      })
      fetchData()
    } catch (error) {
      toast.error("Failed to add exchange")
    }
  }

  const handleDeleteCrypto = async (id: string) => {
    try {
      await deleteDoc(doc(db, "cryptos", id))
      toast.success("🗑️ Cryptocurrency deleted!", { description: "The crypto has been removed from the database." })
      // Reset newCrypto state
      setNewCrypto({
        name: "",
        symbol: "",
        price: 0,
        change: 0,
        rating: 0,
        imageUrl: "",
        chartData: [],
        trend: "up",
        islamicRating: "Halal",
        shortDescription: "",
        fullContent: "",
        pros: [],
        cons: [],
        shariaRuling: "Halal",
        rulingReason: ""
      })
      fetchData()
    } catch (error) {
      toast.error("Failed to delete cryptocurrency")
    }
  }

  const handleDeleteExchange = async (id: string) => {
    try {
      await deleteDoc(doc(db, "exchanges", id))
      toast.success("🗑️ Exchange deleted!", { description: "The exchange has been removed from the database." })
      fetchData()
    } catch (error) {
      toast.error("Failed to delete exchange")
    }
  }

  const handleAddPro = () => {
    if (newPro.trim()) {
      setNewCrypto({
        ...newCrypto,
        pros: [...newCrypto.pros, newPro.trim()]
      })
      setNewPro("")
    }
  }

  const handleAddCon = () => {
    if (newCon.trim()) {
      setNewCrypto({
        ...newCrypto,
        cons: [...newCrypto.cons, newCon.trim()]
      })
      setNewCon("")
    }
  }

  const handleRemovePro = (index: number) => {
    setNewCrypto({
      ...newCrypto,
      pros: newCrypto.pros.filter((_, i) => i !== index)
    })
  }

  const handleRemoveCon = (index: number) => {
    setNewCrypto({
      ...newCrypto,
      cons: newCrypto.cons.filter((_, i) => i !== index)
    })
  }

  const handleAddExchangePro = () => {
    if (newExchangePro.trim()) {
      setNewExchange({
        ...newExchange,
        pros: [...newExchange.pros, newExchangePro.trim()]
      })
      setNewExchangePro("")
    }
  }

  const handleRemoveExchangePro = (index: number) => {
    setNewExchange({
      ...newExchange,
      pros: newExchange.pros.filter((_, i) => i !== index)
    })
  }

  const handleAddExchangeCon = () => {
    if (newExchangeCon.trim()) {
      setNewExchange({
        ...newExchange,
        cons: [...newExchange.cons, newExchangeCon.trim()]
      })
      setNewExchangeCon("")
    }
  }

  const handleRemoveExchangeCon = (index: number) => {
    setNewExchange({
      ...newExchange,
      cons: newExchange.cons.filter((_, i) => i !== index)
    })
  }

  const handleAddTradingPlatform = () => {
    if (newTradingPlatform.trim()) {
      setNewExchange({
        ...newExchange,
        tradingPlatforms: [...newExchange.tradingPlatforms, newTradingPlatform.trim()]
      })
      setNewTradingPlatform("")
    }
  }

  const handleRemoveTradingPlatform = (index: number) => {
    setNewExchange({
      ...newExchange,
      tradingPlatforms: newExchange.tradingPlatforms.filter((_, i) => i !== index)
    })
  }

  const handleAddLicense = () => {
    if (newLicense.trim()) {
      setNewExchange({
        ...newExchange,
        licensesRegulations: [...newExchange.licensesRegulations, newLicense.trim()]
      })
      setNewLicense("")
    }
  }

  const handleRemoveLicense = (index: number) => {
    setNewExchange({
      ...newExchange,
      licensesRegulations: newExchange.licensesRegulations.filter((_, i) => i !== index)
    })
  }

  const handleAddPaymentMethod = () => {
    if (newPaymentMethod.trim()) {
      setNewExchange({
        ...newExchange,
        paymentMethods: [...newExchange.paymentMethods, newPaymentMethod.trim()]
      })
      setNewPaymentMethod("")
    }
  }

  const handleRemovePaymentMethod = (index: number) => {
    setNewExchange({
      ...newExchange,
      paymentMethods: newExchange.paymentMethods.filter((_, i) => i !== index)
    })
  }

  const handleEditCrypto = async (crypto: Crypto) => {
    if (!crypto.id) return
    try {
      // Create a copy of the crypto object and remove the id field
      const { id, ...updateData } = crypto
      await updateDoc(doc(db, "cryptos", id), updateData)
      toast.success("✏️ Cryptocurrency updated!", { description: "The crypto details have been saved." })
      setEditingCrypto(null)
      fetchData()
    } catch (error) {
      toast.error("Failed to update cryptocurrency")
    }
  }

  const handleEditExchange = async (exchange: Exchange) => {
    if (!exchange.id) return
    try {
      // Create a copy of the exchange object and remove the id field
      const { id, ...updateData } = exchange
      await updateDoc(doc(db, "exchanges", id), updateData)
      toast.success("✏️ Exchange updated!", { description: "The exchange details have been saved." })
      setEditingExchange(null)
      fetchData()
    } catch (error) {
      toast.error("Failed to update exchange")
    }
  }

  const startEditingCrypto = (crypto: Crypto) => {
    setEditingCrypto(crypto)
    setNewCrypto(crypto)
  }

  const startEditingExchange = (exchange: Exchange) => {
    setEditingExchange(exchange)
    setNewExchange(exchange)
  }

  const handlePreview = (item: Crypto | Exchange) => {
    setPreviewItem(item)
    setIsPreviewOpen(true)
  }

  const handleLogout = () => {
    console.log("Logging out");
    
    // إزالة بيانات تسجيل الدخول من localStorage
    localStorage.removeItem('isAdminAuthenticated');
    localStorage.removeItem('adminEmail');
    
    // استخدام replace بدلاً من push لتجنب مشاكل السجل
    router.replace('/admin/auth');
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#050510] flex items-center justify-center">
        <div className="relative">
          <div className="w-16 h-16 border-t-4 border-b-4 border-purple-500 rounded-full animate-spin"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-12 h-12 border-t-4 border-b-4 border-cyan-500 rounded-full animate-spin"></div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#050510] text-white">
      <div className="container mx-auto p-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">Admin Dashboard</h1>
          <Button
            onClick={handleLogout}
            className="bg-red-500/10 border border-red-500/50 text-red-400 hover:bg-red-500/20"
          >
            Logout
          </Button>
        </div>

        <Tabs defaultValue="cryptos" className="w-full">
          <TabsList className="inline-flex h-12 items-center justify-center rounded-lg bg-gray-900/50 p-1 mb-8">
            <TabsTrigger 
              value="cryptos" 
              className="inline-flex items-center justify-center whitespace-nowrap rounded-md px-6 py-2.5 text-sm font-medium ring-offset-white transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-400 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-gradient-to-r from-purple-500/20 to-cyan-500/20 data-[state=active]:text-white data-[state=active]:shadow-sm"
            >
              Cryptocurrencies
            </TabsTrigger>
            <TabsTrigger 
              value="exchanges"
              className="inline-flex items-center justify-center whitespace-nowrap rounded-md px-6 py-2.5 text-sm font-medium ring-offset-white transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-400 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-gradient-to-r from-purple-500/20 to-cyan-500/20 data-[state=active]:text-white data-[state=active]:shadow-sm"
            >
              Exchanges
            </TabsTrigger>
          </TabsList>

          <TabsContent value="cryptos">
            <Card className="bg-gradient-to-b from-gray-900/80 to-black/80 backdrop-blur-xl border border-gray-800">
              <CardHeader>
                <CardTitle className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">Add New Cryptocurrency</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleAddCrypto} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label className="text-gray-200">Name</Label>
                      <Input
                        value={newCrypto.name}
                        onChange={(e) => setNewCrypto({ ...newCrypto, name: e.target.value })}
                        required
                        className="bg-black/50 border-gray-800 focus:border-purple-500 text-white"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-gray-200">Symbol</Label>
                      <Input
                        value={newCrypto.symbol}
                        onChange={(e) => setNewCrypto({ ...newCrypto, symbol: e.target.value })}
                        required
                        className="bg-black/50 border-gray-800 focus:border-purple-500 text-white"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-gray-200">Price</Label>
                      <Input
                        type="number"
                        value={newCrypto.price}
                        onChange={(e) => setNewCrypto({ ...newCrypto, price: parseFloat(e.target.value) })}
                        required
                        className="bg-black/50 border-gray-800 focus:border-purple-500 text-white"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-gray-200">Change (%)</Label>
                      <Input
                        type="number"
                        value={newCrypto.change}
                        onChange={(e) => setNewCrypto({ ...newCrypto, change: parseFloat(e.target.value) })}
                        required
                        className="bg-black/50 border-gray-800 focus:border-purple-500 text-white"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-gray-200">Rating</Label>
                      <Input
                        type="number"
                        value={newCrypto.rating}
                        onChange={(e) => setNewCrypto({ ...newCrypto, rating: parseFloat(e.target.value) })}
                        required
                        className="bg-black/50 border-gray-800 focus:border-purple-500 text-white"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-gray-200">Image URL</Label>
                      <Input
                        value={newCrypto.imageUrl}
                        onChange={(e) => setNewCrypto({ ...newCrypto, imageUrl: e.target.value })}
                        required
                        className="bg-black/50 border-gray-800 focus:border-purple-500 text-white"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-gray-200">Trend</Label>
                      <select
                        value={newCrypto.trend}
                        onChange={(e) => setNewCrypto({ ...newCrypto, trend: e.target.value as "up" | "down" })}
                        className="w-full p-2 rounded-md bg-black/50 border border-gray-800 focus:border-purple-500 text-white"
                        required
                      >
                        <option value="up">Up</option>
                        <option value="down">Down</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-gray-200">Islamic Rating</Label>
                      <select
                        value={newCrypto.islamicRating}
                        onChange={(e) => setNewCrypto({ ...newCrypto, islamicRating: e.target.value as "Halal" | "Controversial" | "Haram" })}
                        className="w-full p-2 rounded-md bg-black/50 border border-gray-800 focus:border-purple-500 text-white"
                        required
                      >
                        <option value="Halal">Halal</option>
                        <option value="Controversial">Controversial</option>
                        <option value="Haram">Haram</option>
                      </select>
                    </div>
                    <div className="col-span-2 space-y-2">
                      <Label className="text-gray-200">Short Description</Label>
                      <Input
                        value={newCrypto.shortDescription}
                        onChange={(e) => setNewCrypto({ ...newCrypto, shortDescription: e.target.value })}
                        required
                        className="bg-black/50 border-gray-800 focus:border-purple-500 text-white"
                      />
                    </div>
                    <div className="col-span-2 space-y-2">
                      <Label className="text-gray-200">Full Content</Label>
                      <textarea
                        value={newCrypto.fullContent}
                        onChange={(e) => setNewCrypto({ ...newCrypto, fullContent: e.target.value })}
                        className="w-full p-2 rounded-md bg-black/50 border border-gray-800 focus:border-purple-500 text-white min-h-[100px]"
                        required
                      />
                    </div>
                    <div className="col-span-2 space-y-4">
                      <Label className="text-gray-200">Pros</Label>
                      <div className="space-y-4">
                        <div className="flex gap-2">
                          <Input
                            value={newPro}
                            onChange={(e) => setNewPro(e.target.value)}
                            placeholder="Add a pro"
                            className="bg-black/50 border-gray-800 focus:border-purple-500 text-white"
                          />
                          <Button 
                            type="button" 
                            onClick={handleAddPro}
                            className="bg-gradient-to-r from-purple-500/80 to-cyan-500/80 hover:from-purple-500 hover:to-cyan-500 text-white border-none"
                          >
                            Add
                          </Button>
                        </div>
                        <div className="space-y-2">
                          {newCrypto.pros.map((pro, index) => (
                            <div key={index} className="flex items-center gap-2 bg-black/30 p-2 rounded-md border border-gray-800">
                              <svg className="w-5 h-5 text-green-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                              </svg>
                              <span className="text-gray-300 flex-1">{pro}</span>
                              <Button
                                type="button"
                                onClick={() => handleRemovePro(index)}
                                className="bg-red-500/20 hover:bg-red-500/40 text-red-400 border-none h-7 px-2"
                              >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                              </Button>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                    <div className="col-span-2 space-y-4">
                      <Label className="text-gray-200">Cons</Label>
                      <div className="space-y-4">
                        <div className="flex gap-2">
                          <Input
                            value={newCon}
                            onChange={(e) => setNewCon(e.target.value)}
                            placeholder="Add a con"
                            className="bg-black/50 border-gray-800 focus:border-purple-500 text-white"
                          />
                          <Button 
                            type="button" 
                            onClick={handleAddCon}
                            className="bg-gradient-to-r from-purple-500/80 to-cyan-500/80 hover:from-purple-500 hover:to-cyan-500 text-white border-none"
                          >
                            Add
                          </Button>
                        </div>
                        <div className="space-y-2">
                          {newCrypto.cons.map((con, index) => (
                            <div key={index} className="flex items-center gap-2 bg-black/30 p-2 rounded-md border border-gray-800">
                              <svg className="w-5 h-5 text-red-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                              </svg>
                              <span className="text-gray-300 flex-1">{con}</span>
                              <Button
                                type="button"
                                onClick={() => handleRemoveCon(index)}
                                className="bg-red-500/20 hover:bg-red-500/40 text-red-400 border-none h-7 px-2"
                              >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                              </Button>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                    <div className="col-span-2 space-y-4">
                      <Label className="text-gray-200">Sharia Ruling</Label>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <select
                            value={newCrypto.shariaRuling}
                            onChange={(e) => setNewCrypto({ ...newCrypto, shariaRuling: e.target.value as "Halal" | "Controversial" | "Haram" })}
                            className="w-full p-2 rounded-md bg-black/50 border border-gray-800 focus:border-purple-500 text-white"
                            required
                          >
                            <option value="Halal">Halal</option>
                            <option value="Controversial">Controversial</option>
                            <option value="Haram">Haram</option>
                          </select>
                        </div>
                        <div className="space-y-2">
                          <textarea
                            value={newCrypto.rulingReason}
                            onChange={(e) => setNewCrypto({ ...newCrypto, rulingReason: e.target.value })}
                            placeholder="Reason for the ruling..."
                            className="w-full p-2 rounded-md bg-black/50 border border-gray-800 focus:border-purple-500 text-white min-h-[100px]"
                            required
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex justify-end pt-6">
                    <Button 
                      type="submit"
                      className="bg-gradient-to-r from-purple-500 to-cyan-500 hover:from-purple-600 hover:to-cyan-600 text-white font-semibold px-8 py-4 rounded-lg shadow-lg shadow-purple-500/20 border-none"
                    >
                      Add Cryptocurrency
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>

            <div className="mt-8 space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">Existing Cryptocurrencies</h2>
                <div className="flex items-center gap-4">
                  <Input
                    placeholder="Search cryptocurrencies..."
                    value={cryptoSearch}
                    onChange={(e) => setCryptoSearch(e.target.value)}
                    className="bg-black/50 border-gray-800 focus:border-purple-500 text-white w-64"
                  />
                  <select 
                    value={cryptoFilter}
                    onChange={(e) => setCryptoFilter(e.target.value)}
                    className="p-2 rounded-md bg-black/50 border border-gray-800 focus:border-purple-500 text-white"
                  >
                    <option value="">All Ratings</option>
                    <option value="Halal">Halal</option>
                    <option value="Controversial">Controversial</option>
                    <option value="Haram">Haram</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredCryptos.map((crypto) => (
                  <Card key={crypto.id} className="bg-gradient-to-b from-gray-900/80 to-black/80 backdrop-blur-xl border border-gray-800 hover:border-purple-500/50 transition-colors">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-lg bg-black/50 border border-gray-800 flex items-center justify-center">
                            <img src={crypto.imageUrl} alt={crypto.name} className="w-8 h-8" />
                          </div>
                          <div>
                            <h3 className="font-bold text-lg text-white">{crypto.name}</h3>
                            <p className="text-sm text-gray-400">{crypto.symbol}</p>
                          </div>
                        </div>
                        <Button
                          type="button"
                          onClick={() => handleDeleteCrypto(crypto.id!)}
                          className="bg-red-500/20 hover:bg-red-500/40 text-red-400 border-none h-8 w-8 p-0"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </Button>
                      </div>
                      <div className="mt-4 space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-gray-400">Price:</span>
                          <span className="text-white font-medium">${crypto.price.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-gray-400">Change:</span>
                          <span className={crypto.change >= 0 ? "text-green-400" : "text-red-400"}>
                            {crypto.change >= 0 ? "+" : ""}{crypto.change}%
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-gray-400">Rating:</span>
                          <div className="flex items-center">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <svg
                                key={star}
                                className={`w-4 h-4 ${star <= Math.floor(crypto.rating) ? "text-yellow-400" : "text-gray-600"}`}
                                fill={star <= Math.floor(crypto.rating) ? "currentColor" : "none"}
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                              </svg>
                            ))}
                          </div>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-gray-400">Islamic Rating:</span>
                          <span className={`font-medium ${
                            crypto.islamicRating === "Halal" ? "text-green-400" :
                            crypto.islamicRating === "Haram" ? "text-red-400" :
                            "text-yellow-400"
                          }`}>
                            {crypto.islamicRating}
                          </span>
                        </div>
                      </div>
                      <div className="mt-6 flex gap-2">
                        <Button 
                          className="flex-1 bg-gradient-to-r from-purple-500/80 to-cyan-500/80 hover:from-purple-500 hover:to-cyan-500 text-white border-none"
                          onClick={() => startEditingCrypto(crypto)}
                        >
                          Edit
                        </Button>
                        <Button 
                          className="flex-1 bg-black/50 text-white border border-gray-800 hover:border-purple-500"
                          onClick={() => handlePreview(crypto)}
                        >
                          Preview
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="exchanges">
            <Card className="bg-gradient-to-b from-gray-900/80 to-black/80 backdrop-blur-xl border border-gray-800">
              <CardHeader>
                <CardTitle className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">Add New Exchange</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleAddExchange} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label className="text-gray-200">Name</Label>
                      <Input
                        value={newExchange.name}
                        onChange={(e) => setNewExchange({ ...newExchange, name: e.target.value })}
                        required
                        className="bg-black/50 border-gray-800 focus:border-purple-500 text-white"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-gray-200">Rating</Label>
                      <Input
                        type="number"
                        value={newExchange.rating}
                        onChange={(e) => setNewExchange({ ...newExchange, rating: parseFloat(e.target.value) })}
                        required
                        className="bg-black/50 border-gray-800 focus:border-purple-500 text-white"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-gray-200">Fees</Label>
                      <Input
                        value={newExchange.fees}
                        onChange={(e) => setNewExchange({ ...newExchange, fees: e.target.value })}
                        required
                        className="bg-black/50 border-gray-800 focus:border-purple-500 text-white"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-gray-200">Number of Coins</Label>
                      <Input
                        type="number"
                        value={newExchange.coins}
                        onChange={(e) => setNewExchange({ ...newExchange, coins: parseInt(e.target.value) })}
                        required
                        className="bg-black/50 border-gray-800 focus:border-purple-500 text-white"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-gray-200">Image URL</Label>
                      <Input
                        value={newExchange.imageUrl}
                        onChange={(e) => setNewExchange({ ...newExchange, imageUrl: e.target.value })}
                        required
                        className="bg-black/50 border-gray-800 focus:border-purple-500 text-white"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-gray-200">Islamic Rating</Label>
                      <select
                        value={newExchange.islamicRating}
                        onChange={(e) => setNewExchange({ ...newExchange, islamicRating: e.target.value as "Halal" | "Controversial" | "Haram" })}
                        className="w-full p-2 rounded-md bg-black/50 border border-gray-800 focus:border-purple-500 text-white"
                        required
                      >
                        <option value="Halal">Halal</option>
                        <option value="Controversial">Controversial</option>
                        <option value="Haram">Haram</option>
                      </select>
                    </div>
                    <div className="col-span-2 space-y-2">
                      <Label className="text-gray-200">Short Description</Label>
                      <Input
                        value={newExchange.shortDescription}
                        onChange={(e) => setNewExchange({ ...newExchange, shortDescription: e.target.value })}
                        required
                        className="bg-black/50 border-gray-800 focus:border-purple-500 text-white"
                      />
                    </div>
                    <div className="col-span-2 space-y-2">
                      <Label className="text-gray-200">Full Content</Label>
                      <textarea
                        value={newExchange.fullContent}
                        onChange={(e) => setNewExchange({ ...newExchange, fullContent: e.target.value })}
                        className="w-full p-2 rounded-md bg-black/50 border border-gray-800 focus:border-purple-500 text-white min-h-[100px]"
                        required
                      />
                    </div>
                    <div className="col-span-2 space-y-4">
                      <Label className="text-gray-200">Pros</Label>
                      <div className="space-y-4">
                        <div className="flex gap-2">
                          <Input
                            value={newExchangePro}
                            onChange={(e) => setNewExchangePro(e.target.value)}
                            placeholder="Add a pro"
                            className="bg-black/50 border-gray-800 focus:border-purple-500 text-white"
                          />
                          <Button 
                            type="button" 
                            onClick={handleAddExchangePro}
                            className="bg-gradient-to-r from-purple-500/80 to-cyan-500/80 hover:from-purple-500 hover:to-cyan-500 text-white border-none"
                          >
                            Add
                          </Button>
                        </div>
                        <div className="space-y-2">
                          {newExchange.pros.map((pro, index) => (
                            <div key={index} className="flex items-center gap-2 bg-black/30 p-2 rounded-md border border-gray-800">
                              <svg className="w-5 h-5 text-green-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                              </svg>
                              <span className="text-gray-300 flex-1">{pro}</span>
                              <Button
                                type="button"
                                onClick={() => handleRemoveExchangePro(index)}
                                className="bg-red-500/20 hover:bg-red-500/40 text-red-400 border-none h-7 px-2"
                              >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                              </Button>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                    <div className="col-span-2 space-y-4">
                      <Label className="text-gray-200">Cons</Label>
                      <div className="space-y-4">
                        <div className="flex gap-2">
                          <Input
                            value={newExchangeCon}
                            onChange={(e) => setNewExchangeCon(e.target.value)}
                            placeholder="Add a con"
                            className="bg-black/50 border-gray-800 focus:border-purple-500 text-white"
                          />
                          <Button 
                            type="button" 
                            onClick={handleAddExchangeCon}
                            className="bg-gradient-to-r from-purple-500/80 to-cyan-500/80 hover:from-purple-500 hover:to-cyan-500 text-white border-none"
                          >
                            Add
                          </Button>
                        </div>
                        <div className="space-y-2">
                          {newExchange.cons.map((con, index) => (
                            <div key={index} className="flex items-center gap-2 bg-black/30 p-2 rounded-md border border-gray-800">
                              <svg className="w-5 h-5 text-red-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                              </svg>
                              <span className="text-gray-300 flex-1">{con}</span>
                              <Button
                                type="button"
                                onClick={() => handleRemoveExchangeCon(index)}
                                className="bg-red-500/20 hover:bg-red-500/40 text-red-400 border-none h-7 px-2"
                              >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                              </Button>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                    <div className="col-span-2 space-y-4">
                      <Label className="text-gray-200">Trading Platforms</Label>
                      <div className="space-y-4">
                        <div className="flex gap-2">
                          <Input
                            value={newTradingPlatform}
                            onChange={(e) => setNewTradingPlatform(e.target.value)}
                            placeholder="Add a trading platform"
                            className="bg-black/50 border-gray-800 focus:border-purple-500 text-white"
                          />
                          <Button 
                            type="button" 
                            onClick={handleAddTradingPlatform}
                            className="bg-gradient-to-r from-purple-500/80 to-cyan-500/80 hover:from-purple-500 hover:to-cyan-500 text-white border-none"
                          >
                            Add
                          </Button>
                        </div>
                        <div className="space-y-2">
                          {newExchange.tradingPlatforms.map((platform, index) => (
                            <div key={index} className="flex items-center gap-2 bg-black/30 p-2 rounded-md border border-gray-800">
                              <svg className="w-5 h-5 text-purple-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                              </svg>
                              <span className="text-gray-300 flex-1">{platform}</span>
                              <Button
                                type="button"
                                onClick={() => handleRemoveTradingPlatform(index)}
                                className="bg-red-500/20 hover:bg-red-500/40 text-red-400 border-none h-7 px-2"
                              >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                              </Button>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                    <div className="col-span-2 space-y-4">
                      <Label className="text-gray-200">Licenses & Regulations</Label>
                      <div className="space-y-4">
                        <div className="flex gap-2">
                          <Input
                            value={newLicense}
                            onChange={(e) => setNewLicense(e.target.value)}
                            placeholder="Add a license or regulation"
                            className="bg-black/50 border-gray-800 focus:border-purple-500 text-white"
                          />
                          <Button 
                            type="button" 
                            onClick={handleAddLicense}
                            className="bg-gradient-to-r from-purple-500/80 to-cyan-500/80 hover:from-purple-500 hover:to-cyan-500 text-white border-none"
                          >
                            Add
                          </Button>
                        </div>
                        <div className="space-y-2">
                          {newExchange.licensesRegulations.map((license, index) => (
                            <div key={index} className="flex items-center gap-2 bg-black/30 p-2 rounded-md border border-gray-800">
                              <svg className="w-5 h-5 text-cyan-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                              </svg>
                              <span className="text-gray-300 flex-1">{license}</span>
                              <Button
                                type="button"
                                onClick={() => handleRemoveLicense(index)}
                                className="bg-red-500/20 hover:bg-red-500/40 text-red-400 border-none h-7 px-2"
                              >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                              </Button>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                    <div className="col-span-2 space-y-4">
                      <Label className="text-gray-200">Payment Methods</Label>
                      <div className="space-y-4">
                        <div className="flex gap-2">
                          <Input
                            value={newPaymentMethod}
                            onChange={(e) => setNewPaymentMethod(e.target.value)}
                            placeholder="Add a payment method"
                            className="bg-black/50 border-gray-800 focus:border-purple-500 text-white"
                          />
                          <Button 
                            type="button" 
                            onClick={handleAddPaymentMethod}
                            className="bg-gradient-to-r from-purple-500/80 to-cyan-500/80 hover:from-purple-500 hover:to-cyan-500 text-white border-none"
                          >
                            Add
                          </Button>
                        </div>
                        <div className="space-y-2">
                          {newExchange.paymentMethods.map((method, index) => (
                            <div key={index} className="flex items-center gap-2 bg-black/30 p-2 rounded-md border border-gray-800">
                              <svg className="w-5 h-5 text-purple-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                              </svg>
                              <span className="text-gray-300 flex-1">{method}</span>
                              <Button
                                type="button"
                                onClick={() => handleRemovePaymentMethod(index)}
                                className="bg-red-500/20 hover:bg-red-500/40 text-red-400 border-none h-7 px-2"
                              >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                              </Button>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                    <div className="col-span-2 space-y-2">
                      <Label className="text-gray-200">Customer Support</Label>
                      <textarea
                        value={newExchange.customerSupport}
                        onChange={(e) => setNewExchange({ ...newExchange, customerSupport: e.target.value })}
                        className="w-full p-2 rounded-md bg-black/50 border border-gray-800 focus:border-purple-500 text-white min-h-[100px]"
                        required
                      />
                    </div>
                  </div>
                  <div className="flex justify-end pt-6">
                    <Button 
                      type="submit"
                      className="bg-gradient-to-r from-purple-500 to-cyan-500 hover:from-purple-600 hover:to-cyan-600 text-white font-semibold px-8 py-4 rounded-lg shadow-lg shadow-purple-500/20 border-none"
                    >
                      Add Exchange
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>

            <div className="mt-8 space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">Existing Exchanges</h2>
                <div className="flex items-center gap-4">
                  <Input
                    placeholder="Search exchanges..."
                    value={exchangeSearch}
                    onChange={(e) => setExchangeSearch(e.target.value)}
                    className="bg-black/50 border-gray-800 focus:border-purple-500 text-white w-64"
                  />
                  <select 
                    value={exchangeFilter}
                    onChange={(e) => setExchangeFilter(e.target.value)}
                    className="p-2 rounded-md bg-black/50 border border-gray-800 focus:border-purple-500 text-white"
                  >
                    <option value="">All Ratings</option>
                    <option value="Halal">Halal</option>
                    <option value="Controversial">Controversial</option>
                    <option value="Haram">Haram</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredExchanges.map((exchange) => (
                  <Card key={exchange.id} className="bg-gradient-to-b from-gray-900/80 to-black/80 backdrop-blur-xl border border-gray-800 hover:border-purple-500/50 transition-colors group">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-lg bg-black/50 border border-gray-800 flex items-center justify-center group-hover:border-purple-500/50 transition-colors">
                            <img src={exchange.imageUrl} alt={exchange.name} className="w-8 h-8" />
                          </div>
                          <div>
                            <h3 className="font-bold text-lg text-white group-hover:text-purple-400 transition-colors">{exchange.name}</h3>
                            <p className="text-sm text-gray-400 group-hover:text-purple-300 transition-colors">{exchange.coins} coins</p>
                          </div>
                        </div>
                        <Button
                          type="button"
                          onClick={() => handleDeleteExchange(exchange.id!)}
                          className="bg-red-500/20 hover:bg-red-500/40 text-red-400 border-none h-8 w-8 p-0"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </Button>
                      </div>
                      <div className="mt-4 space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-gray-400 group-hover:text-purple-300 transition-colors">Fees:</span>
                          <span className="text-white font-medium group-hover:text-purple-400 transition-colors">{exchange.fees}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-gray-400 group-hover:text-purple-300 transition-colors">Rating:</span>
                          <div className="flex items-center">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <svg
                                key={star}
                                className={`w-4 h-4 ${star <= Math.floor(exchange.rating) ? "text-yellow-400 group-hover:text-yellow-300" : "text-gray-600 group-hover:text-gray-500"} transition-colors`}
                                fill={star <= Math.floor(exchange.rating) ? "currentColor" : "none"}
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                              </svg>
                            ))}
                          </div>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-gray-400 group-hover:text-purple-300 transition-colors">Islamic Rating:</span>
                          <span className={`font-medium ${
                            exchange.islamicRating === "Halal" ? "text-green-400 group-hover:text-green-300" :
                            exchange.islamicRating === "Haram" ? "text-red-400 group-hover:text-red-300" :
                            "text-yellow-400 group-hover:text-yellow-300"
                          } transition-colors`}>
                            {exchange.islamicRating}
                          </span>
                        </div>
                      </div>
                      <div className="mt-6 flex gap-2">
                        <Button 
                          className="flex-1 bg-gradient-to-r from-purple-500/80 to-cyan-500/80 hover:from-purple-500 hover:to-cyan-500 text-white border-none"
                          onClick={() => startEditingExchange(exchange)}
                        >
                          Edit
                        </Button>
                        <Button 
                          className="flex-1 bg-black/50 text-white border border-gray-800 hover:border-purple-500"
                          onClick={() => handlePreview(exchange)}
                        >
                          Preview
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Edit Dialog for Crypto */}
      <Dialog open={editingCrypto !== null} onOpenChange={(open: boolean) => !open && setEditingCrypto(null)}>
        <DialogContent className="bg-gradient-to-b from-gray-900/95 to-black/95 backdrop-blur-xl border border-gray-800 text-white max-w-3xl max-h-[90vh] overflow-y-auto p-6">
          <DialogHeader className="sticky top-0 z-50 bg-gradient-to-b from-gray-900 to-gray-900/95 pb-4 -mx-6 px-6 -mt-6 pt-6">
            <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
              Edit Cryptocurrency
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={(e) => {
            e.preventDefault()
            if (editingCrypto) {
              handleEditCrypto({ ...newCrypto, id: editingCrypto.id })
            }
          }} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label className="text-gray-200">Name</Label>
                <Input
                  value={newCrypto.name}
                  onChange={(e) => setNewCrypto({ ...newCrypto, name: e.target.value })}
                  required
                  className="bg-black/50 border-gray-800 focus:border-purple-500 text-white"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-gray-200">Symbol</Label>
                <Input
                  value={newCrypto.symbol}
                  onChange={(e) => setNewCrypto({ ...newCrypto, symbol: e.target.value })}
                  required
                  className="bg-black/50 border-gray-800 focus:border-purple-500 text-white"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-gray-200">Price</Label>
                <Input
                  type="number"
                  value={newCrypto.price}
                  onChange={(e) => setNewCrypto({ ...newCrypto, price: parseFloat(e.target.value) })}
                  required
                  className="bg-black/50 border-gray-800 focus:border-purple-500 text-white"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-gray-200">Change (%)</Label>
                <Input
                  type="number"
                  value={newCrypto.change}
                  onChange={(e) => setNewCrypto({ ...newCrypto, change: parseFloat(e.target.value) })}
                  required
                  className="bg-black/50 border-gray-800 focus:border-purple-500 text-white"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-gray-200">Rating</Label>
                <Input
                  type="number"
                  value={newCrypto.rating}
                  onChange={(e) => setNewCrypto({ ...newCrypto, rating: parseFloat(e.target.value) })}
                  required
                  className="bg-black/50 border-gray-800 focus:border-purple-500 text-white"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-gray-200">Image URL</Label>
                <Input
                  value={newCrypto.imageUrl}
                  onChange={(e) => setNewCrypto({ ...newCrypto, imageUrl: e.target.value })}
                  required
                  className="bg-black/50 border-gray-800 focus:border-purple-500 text-white"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-gray-200">Trend</Label>
                <select
                  value={newCrypto.trend}
                  onChange={(e) => setNewCrypto({ ...newCrypto, trend: e.target.value as "up" | "down" })}
                  className="w-full p-2 rounded-md bg-black/50 border border-gray-800 focus:border-purple-500 text-white"
                  required
                >
                  <option value="up">Up</option>
                  <option value="down">Down</option>
                </select>
              </div>
              <div className="space-y-2">
                <Label className="text-gray-200">Islamic Rating</Label>
                <select
                  value={newCrypto.islamicRating}
                  onChange={(e) => setNewCrypto({ ...newCrypto, islamicRating: e.target.value as "Halal" | "Controversial" | "Haram" })}
                  className="w-full p-2 rounded-md bg-black/50 border border-gray-800 focus:border-purple-500 text-white"
                  required
                >
                  <option value="Halal">Halal</option>
                  <option value="Controversial">Controversial</option>
                  <option value="Haram">Haram</option>
                </select>
              </div>
              <div className="col-span-2 space-y-2">
                <Label className="text-gray-200">Short Description</Label>
                <Input
                  value={newCrypto.shortDescription}
                  onChange={(e) => setNewCrypto({ ...newCrypto, shortDescription: e.target.value })}
                  required
                  className="bg-black/50 border-gray-800 focus:border-purple-500 text-white"
                />
              </div>
              <div className="col-span-2 space-y-2">
                <Label className="text-gray-200">Full Content</Label>
                <textarea
                  value={newCrypto.fullContent}
                  onChange={(e) => setNewCrypto({ ...newCrypto, fullContent: e.target.value })}
                  className="w-full p-2 rounded-md bg-black/50 border border-gray-800 focus:border-purple-500 text-white min-h-[100px]"
                  required
                />
              </div>
              <div className="col-span-2 space-y-4">
                <Label className="text-gray-200">Pros</Label>
                <div className="space-y-4">
                  <div className="flex gap-2">
                    <Input
                      value={newPro}
                      onChange={(e) => setNewPro(e.target.value)}
                      placeholder="Add a pro"
                      className="bg-black/50 border-gray-800 focus:border-purple-500 text-white"
                    />
                    <Button 
                      type="button" 
                      onClick={handleAddPro}
                      className="bg-gradient-to-r from-purple-500/80 to-cyan-500/80 hover:from-purple-500 hover:to-cyan-500 text-white border-none"
                    >
                      Add
                    </Button>
                  </div>
                  <div className="space-y-2">
                    {newCrypto.pros.map((pro, index) => (
                      <div key={index} className="flex items-center gap-2 bg-black/30 p-2 rounded-md border border-gray-800">
                        <svg className="w-5 h-5 text-green-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <span className="text-gray-300 flex-1">{pro}</span>
                        <Button
                          type="button"
                          onClick={() => handleRemovePro(index)}
                          className="bg-red-500/20 hover:bg-red-500/40 text-red-400 border-none h-7 px-2"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <div className="col-span-2 space-y-4">
                <Label className="text-gray-200">Cons</Label>
                <div className="space-y-4">
                  <div className="flex gap-2">
                    <Input
                      value={newCon}
                      onChange={(e) => setNewCon(e.target.value)}
                      placeholder="Add a con"
                      className="bg-black/50 border-gray-800 focus:border-purple-500 text-white"
                    />
                    <Button 
                      type="button" 
                      onClick={handleAddCon}
                      className="bg-gradient-to-r from-purple-500/80 to-cyan-500/80 hover:from-purple-500 hover:to-cyan-500 text-white border-none"
                    >
                      Add
                    </Button>
                  </div>
                  <div className="space-y-2">
                    {newCrypto.cons.map((con, index) => (
                      <div key={index} className="flex items-center gap-2 bg-black/30 p-2 rounded-md border border-gray-800">
                        <svg className="w-5 h-5 text-red-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                        <span className="text-gray-300 flex-1">{con}</span>
                        <Button
                          type="button"
                          onClick={() => handleRemoveCon(index)}
                          className="bg-red-500/20 hover:bg-red-500/40 text-red-400 border-none h-7 px-2"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <div className="col-span-2 space-y-4">
                <Label className="text-gray-200">Sharia Ruling</Label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <select
                      value={newCrypto.shariaRuling}
                      onChange={(e) => setNewCrypto({ ...newCrypto, shariaRuling: e.target.value as "Halal" | "Controversial" | "Haram" })}
                      className="w-full p-2 rounded-md bg-black/50 border border-gray-800 focus:border-purple-500 text-white"
                      required
                    >
                      <option value="Halal">Halal</option>
                      <option value="Controversial">Controversial</option>
                      <option value="Haram">Haram</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <textarea
                      value={newCrypto.rulingReason}
                      onChange={(e) => setNewCrypto({ ...newCrypto, rulingReason: e.target.value })}
                      placeholder="Reason for the ruling..."
                      className="w-full p-2 rounded-md bg-black/50 border border-gray-800 focus:border-purple-500 text-white min-h-[100px]"
                      required
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="flex justify-end pt-6">
              <Button 
                type="submit"
                className="bg-gradient-to-r from-purple-500 to-cyan-500 hover:from-purple-600 hover:to-cyan-600 text-white font-semibold px-8 py-4 rounded-lg shadow-lg shadow-purple-500/20 border-none"
              >
                Update Cryptocurrency
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Edit Dialog for Exchange */}
      <Dialog open={editingExchange !== null} onOpenChange={(open: boolean) => !open && setEditingExchange(null)}>
        <DialogContent className="bg-gradient-to-b from-gray-900/95 to-black/95 backdrop-blur-xl border border-gray-800 text-white max-w-3xl max-h-[90vh] overflow-y-auto p-6">
          <DialogHeader className="sticky top-0 z-50 bg-gradient-to-b from-gray-900 to-gray-900/95 pb-4 -mx-6 px-6 -mt-6 pt-6">
            <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
              Edit Exchange
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={(e) => {
            e.preventDefault()
            if (editingExchange) {
              handleEditExchange({ ...newExchange, id: editingExchange.id })
            }
          }} className="space-y-6 mt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label className="text-gray-200">Name</Label>
                <Input
                  value={newExchange.name}
                  onChange={(e) => setNewExchange({ ...newExchange, name: e.target.value })}
                  required
                  className="bg-black/50 border-gray-800 focus:border-purple-500 text-white"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-gray-200">Rating</Label>
                <Input
                  type="number"
                  value={newExchange.rating}
                  onChange={(e) => setNewExchange({ ...newExchange, rating: parseFloat(e.target.value) })}
                  required
                  className="bg-black/50 border-gray-800 focus:border-purple-500 text-white"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-gray-200">Fees</Label>
                <Input
                  value={newExchange.fees}
                  onChange={(e) => setNewExchange({ ...newExchange, fees: e.target.value })}
                  required
                  className="bg-black/50 border-gray-800 focus:border-purple-500 text-white"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-gray-200">Number of Coins</Label>
                <Input
                  type="number"
                  value={newExchange.coins}
                  onChange={(e) => setNewExchange({ ...newExchange, coins: parseInt(e.target.value) })}
                  required
                  className="bg-black/50 border-gray-800 focus:border-purple-500 text-white"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-gray-200">Image URL</Label>
                <Input
                  value={newExchange.imageUrl}
                  onChange={(e) => setNewExchange({ ...newExchange, imageUrl: e.target.value })}
                  required
                  className="bg-black/50 border-gray-800 focus:border-purple-500 text-white"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-gray-200">Islamic Rating</Label>
                <select
                  value={newExchange.islamicRating}
                  onChange={(e) => setNewExchange({ ...newExchange, islamicRating: e.target.value as "Halal" | "Controversial" | "Haram" })}
                  className="w-full p-2 rounded-md bg-black/50 border border-gray-800 focus:border-purple-500 text-white"
                  required
                >
                  <option value="Halal">Halal</option>
                  <option value="Controversial">Controversial</option>
                  <option value="Haram">Haram</option>
                </select>
              </div>
              <div className="col-span-2 space-y-2">
                <Label className="text-gray-200">Short Description</Label>
                <Input
                  value={newExchange.shortDescription}
                  onChange={(e) => setNewExchange({ ...newExchange, shortDescription: e.target.value })}
                  required
                  className="bg-black/50 border-gray-800 focus:border-purple-500 text-white"
                />
              </div>
              <div className="col-span-2 space-y-2">
                <Label className="text-gray-200">Full Content</Label>
                <textarea
                  value={newExchange.fullContent}
                  onChange={(e) => setNewExchange({ ...newExchange, fullContent: e.target.value })}
                  className="w-full p-2 rounded-md bg-black/50 border border-gray-800 focus:border-purple-500 text-white min-h-[100px]"
                  required
                />
              </div>
              <div className="col-span-2 space-y-4">
                <Label className="text-gray-200">Pros</Label>
                <div className="space-y-4">
                  <div className="flex gap-2">
                    <Input
                      value={newExchangePro}
                      onChange={(e) => setNewExchangePro(e.target.value)}
                      placeholder="Add a pro"
                      className="bg-black/50 border-gray-800 focus:border-purple-500 text-white"
                    />
                    <Button 
                      type="button" 
                      onClick={handleAddExchangePro}
                      className="bg-gradient-to-r from-purple-500/80 to-cyan-500/80 hover:from-purple-500 hover:to-cyan-500 text-white border-none"
                    >
                      Add
                    </Button>
                  </div>
                  <div className="space-y-2">
                    {newExchange.pros.map((pro, index) => (
                      <div key={index} className="flex items-center gap-2 bg-black/30 p-2 rounded-md border border-gray-800">
                        <svg className="w-5 h-5 text-green-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <span className="text-gray-300 flex-1">{pro}</span>
                        <Button
                          type="button"
                          onClick={() => handleRemoveExchangePro(index)}
                          className="bg-red-500/20 hover:bg-red-500/40 text-red-400 border-none h-7 px-2"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <div className="col-span-2 space-y-4">
                <Label className="text-gray-200">Cons</Label>
                <div className="space-y-4">
                  <div className="flex gap-2">
                    <Input
                      value={newExchangeCon}
                      onChange={(e) => setNewExchangeCon(e.target.value)}
                      placeholder="Add a con"
                      className="bg-black/50 border-gray-800 focus:border-purple-500 text-white"
                    />
                    <Button 
                      type="button" 
                      onClick={handleAddExchangeCon}
                      className="bg-gradient-to-r from-purple-500/80 to-cyan-500/80 hover:from-purple-500 hover:to-cyan-500 text-white border-none"
                    >
                      Add
                    </Button>
                  </div>
                  <div className="space-y-2">
                    {newExchange.cons.map((con, index) => (
                      <div key={index} className="flex items-center gap-2 bg-black/30 p-2 rounded-md border border-gray-800">
                        <svg className="w-5 h-5 text-red-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                        <span className="text-gray-300 flex-1">{con}</span>
                        <Button
                          type="button"
                          onClick={() => handleRemoveExchangeCon(index)}
                          className="bg-red-500/20 hover:bg-red-500/40 text-red-400 border-none h-7 px-2"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <div className="col-span-2 space-y-4">
                <Label className="text-gray-200">Trading Platforms</Label>
                <div className="space-y-4">
                  <div className="flex gap-2">
                    <Input
                      value={newTradingPlatform}
                      onChange={(e) => setNewTradingPlatform(e.target.value)}
                      placeholder="Add a trading platform"
                      className="bg-black/50 border-gray-800 focus:border-purple-500 text-white"
                    />
                    <Button 
                      type="button" 
                      onClick={handleAddTradingPlatform}
                      className="bg-gradient-to-r from-purple-500/80 to-cyan-500/80 hover:from-purple-500 hover:to-cyan-500 text-white border-none"
                    >
                      Add
                    </Button>
                  </div>
                  <div className="space-y-2">
                    {newExchange.tradingPlatforms.map((platform, index) => (
                      <div key={index} className="flex items-center gap-2 bg-black/30 p-2 rounded-md border border-gray-800">
                        <svg className="w-5 h-5 text-purple-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                        <span className="text-gray-300 flex-1">{platform}</span>
                        <Button
                          type="button"
                          onClick={() => handleRemoveTradingPlatform(index)}
                          className="bg-red-500/20 hover:bg-red-500/40 text-red-400 border-none h-7 px-2"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <div className="col-span-2 space-y-4">
                <Label className="text-gray-200">Licenses & Regulations</Label>
                <div className="space-y-4">
                  <div className="flex gap-2">
                    <Input
                      value={newLicense}
                      onChange={(e) => setNewLicense(e.target.value)}
                      placeholder="Add a license or regulation"
                      className="bg-black/50 border-gray-800 focus:border-purple-500 text-white"
                    />
                    <Button 
                      type="button" 
                      onClick={handleAddLicense}
                      className="bg-gradient-to-r from-purple-500/80 to-cyan-500/80 hover:from-purple-500 hover:to-cyan-500 text-white border-none"
                    >
                      Add
                    </Button>
                  </div>
                  <div className="space-y-2">
                    {newExchange.licensesRegulations.map((license, index) => (
                      <div key={index} className="flex items-center gap-2 bg-black/30 p-2 rounded-md border border-gray-800">
                        <svg className="w-5 h-5 text-cyan-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                        </svg>
                        <span className="text-gray-300 flex-1">{license}</span>
                        <Button
                          type="button"
                          onClick={() => handleRemoveLicense(index)}
                          className="bg-red-500/20 hover:bg-red-500/40 text-red-400 border-none h-7 px-2"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <div className="col-span-2 space-y-4">
                <Label className="text-gray-200">Payment Methods</Label>
                <div className="space-y-4">
                  <div className="flex gap-2">
                    <Input
                      value={newPaymentMethod}
                      onChange={(e) => setNewPaymentMethod(e.target.value)}
                      placeholder="Add a payment method"
                      className="bg-black/50 border-gray-800 focus:border-purple-500 text-white"
                    />
                    <Button 
                      type="button" 
                      onClick={handleAddPaymentMethod}
                      className="bg-gradient-to-r from-purple-500/80 to-cyan-500/80 hover:from-purple-500 hover:to-cyan-500 text-white border-none"
                    >
                      Add
                    </Button>
                  </div>
                  <div className="space-y-2">
                    {newExchange.paymentMethods.map((method, index) => (
                      <div key={index} className="flex items-center gap-2 bg-black/30 p-2 rounded-md border border-gray-800">
                        <svg className="w-5 h-5 text-purple-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                        </svg>
                        <span className="text-gray-300 flex-1">{method}</span>
                        <Button
                          type="button"
                          onClick={() => handleRemovePaymentMethod(index)}
                          className="bg-red-500/20 hover:bg-red-500/40 text-red-400 border-none h-7 px-2"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <div className="col-span-2 space-y-2">
                <Label className="text-gray-200">Customer Support</Label>
                <textarea
                  value={newExchange.customerSupport}
                  onChange={(e) => setNewExchange({ ...newExchange, customerSupport: e.target.value })}
                  className="w-full p-2 rounded-md bg-black/50 border border-gray-800 focus:border-purple-500 text-white min-h-[100px]"
                  required
                />
              </div>
            </div>
            <div className="flex justify-end pt-6">
              <Button 
                type="submit"
                className="bg-gradient-to-r from-purple-500 to-cyan-500 hover:from-purple-600 hover:to-cyan-600 text-white font-semibold px-8 py-4 rounded-lg shadow-lg shadow-purple-500/20 border-none"
              >
                Update Exchange
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Preview Dialog */}
      <Dialog open={isPreviewOpen} onOpenChange={setIsPreviewOpen}>
        <DialogContent className="bg-gradient-to-b from-gray-900/95 to-black/95 backdrop-blur-xl border border-gray-800 text-white max-w-3xl max-h-[90vh] overflow-y-auto p-6">
          <DialogHeader className="sticky top-0 z-50 bg-gradient-to-b from-gray-900 to-gray-900/95 pb-4 -mx-6 px-6 -mt-6 pt-6">
            <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
              {previewItem?.name}
            </DialogTitle>
          </DialogHeader>
          <div className="mt-4 space-y-4">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-lg bg-black/50 border border-gray-800 flex items-center justify-center">
                <img src={previewItem?.imageUrl} alt={previewItem?.name} className="w-12 h-12" />
              </div>
              <div>
                <h3 className="font-bold text-xl text-white">{previewItem?.name}</h3>
                {'symbol' in (previewItem || {}) ? (
                  <p className="text-gray-400">{(previewItem as Crypto)?.symbol}</p>
                ) : (
                  <p className="text-gray-400">{(previewItem as Exchange)?.coins} coins</p>
                )}
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              {'price' in (previewItem || {}) && (
                <div className="space-y-1">
                  <span className="text-gray-400">Price</span>
                  <p className="text-white font-medium">${(previewItem as Crypto)?.price?.toLocaleString()}</p>
                </div>
              )}
              {'fees' in (previewItem || {}) && (
                <div className="space-y-1">
                  <span className="text-gray-400">Fees</span>
                  <p className="text-white font-medium">{(previewItem as Exchange)?.fees}</p>
                </div>
              )}
              <div className="space-y-1">
                <span className="text-gray-400">Rating</span>
                <div className="flex items-center">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <svg
                      key={star}
                      className={`w-5 h-5 ${star <= Math.floor(previewItem?.rating || 0) ? "text-yellow-400" : "text-gray-600"}`}
                      fill={star <= Math.floor(previewItem?.rating || 0) ? "currentColor" : "none"}
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                    </svg>
                  ))}
                </div>
              </div>
              <div className="space-y-1">
                <span className="text-gray-400">Islamic Rating</span>
                <p className={`font-medium ${
                  previewItem?.islamicRating === "Halal" ? "text-green-400" :
                  previewItem?.islamicRating === "Haram" ? "text-red-400" :
                  "text-yellow-400"
                }`}>
                  {previewItem?.islamicRating}
                </p>
              </div>
            </div>

            <div className="space-y-2">
              <span className="text-gray-400">Description</span>
              <p className="text-white">{previewItem?.shortDescription}</p>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-2">
                <span className="text-gray-400">Pros</span>
                <ul className="space-y-2">
                  {previewItem?.pros.map((pro, index) => (
                    <li key={index} className="flex items-center gap-2 text-green-400">
                      <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="text-gray-200">{pro}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="space-y-2">
                <span className="text-gray-400">Cons</span>
                <ul className="space-y-2">
                  {previewItem?.cons.map((con, index) => (
                    <li key={index} className="flex items-center gap-2 text-red-400">
                      <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                      <span className="text-gray-200">{con}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {'tradingPlatforms' in (previewItem || {}) && (
              <div className="space-y-2">
                <span className="text-gray-400">Trading Platforms</span>
                <div className="grid grid-cols-2 gap-2">
                  {(previewItem as Exchange)?.tradingPlatforms.map((platform, index) => (
                    <div key={index} className="flex items-center gap-2 bg-black/30 p-2 rounded-md">
                      <svg className="w-5 h-5 text-purple-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                      <span className="text-gray-300">{platform}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="space-y-2">
              <span className="text-gray-400">Sharia Ruling</span>
              <p className="text-white">{previewItem?.rulingReason}</p>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
} 