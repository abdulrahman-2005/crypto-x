import { Suspense } from "react"
import dynamic from "next/dynamic"
import ComparePageClient from "@/components/compare-page-client"

// Use dynamic import to fix module resolution issue
const PriceComparison = dynamic(() => import("../../components/price-comparison"), {
  loading: () => (
    <div className="animate-pulse">
      <div className="h-8 bg-gray-700 rounded w-1/4 mb-8"></div>
      <div className="space-y-4">
        <div className="h-4 bg-gray-700 rounded w-3/4"></div>
        <div className="h-4 bg-gray-700 rounded w-1/2"></div>
      </div>
    </div>
  ),
  ssr: true
})

export default function ComparePage() {
  return (
    <ComparePageClient>
        <Suspense fallback={
          <div className="animate-pulse p-8 rounded-2xl">
            <div className="h-10 bg-gray-700/50 rounded-xl w-1/4 mb-8"></div>
            <div className="space-y-6">
              <div className="h-6 bg-gray-700/50 rounded-xl w-3/4"></div>
              <div className="h-6 bg-gray-700/50 rounded-xl w-2/3"></div>
              <div className="h-6 bg-gray-700/50 rounded-xl w-1/2"></div>
              <div className="grid grid-cols-3 gap-4">
                <div className="h-24 bg-gray-700/50 rounded-xl"></div>
                <div className="h-24 bg-gray-700/50 rounded-xl"></div>
                <div className="h-24 bg-gray-700/50 rounded-xl"></div>
              </div>
            </div>
          </div>
        }>
          <PriceComparison />
        </Suspense>
    </ComparePageClient>
  )
}