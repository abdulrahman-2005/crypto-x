import { ExchangeNews } from "@/app/types";

// وظيفة لجلب أخبار العملات المشفرة من API خارجي
export async function fetchCryptoNews(count: number = 20): Promise<ExchangeNews[]> {
  try {
    // استخدام API من CryptoCompare
    const response = await fetch(
      `https://min-api.cryptocompare.com/data/v2/news/?lang=EN&limit=${count}`,
      { next: { revalidate: 3600 } } // تحديث البيانات كل ساعة
    );

    if (!response.ok) {
      throw new Error(`API returned ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();
    
    // تحويل البيانات إلى تنسيق ExchangeNews
    return data.Data.map((item: any) => ({
      id: item.id.toString(),
      exchangeId: "general", // عام لجميع البورصات
      title: item.title,
      content: item.body,
      source: item.source,
      url: item.url,
      publishedAt: new Date(item.published_on * 1000), // تحويل Unix timestamp إلى Date
      imageUrl: item.imageurl,
      category: item.categories
    })) as ExchangeNews[];
  } catch (error) {
    console.error("Error fetching crypto news:", error);
    return [];
  }
}

// وظيفة لتصنيف الأخبار حسب الفئة أو العملة
export function categorizeNews(news: ExchangeNews[]): Record<string, ExchangeNews[]> {
  const categories: Record<string, ExchangeNews[]> = {
    bitcoin: [],
    ethereum: [],
    altcoins: [],
    defi: [],
    nft: [],
    regulations: [],
    exchanges: [],
    general: []
  };

  news.forEach(item => {
    // استخراج الكلمات المفتاحية من العنوان والمحتوى
    const fullText = `${item.title} ${item.content}`.toLowerCase();
    
    if (fullText.includes("bitcoin") || fullText.includes("btc")) {
      categories.bitcoin.push(item);
    } else if (fullText.includes("ethereum") || fullText.includes("eth")) {
      categories.ethereum.push(item);
    } else if (
      fullText.includes("defi") || 
      fullText.includes("decentralized finance") || 
      fullText.includes("yield") || 
      fullText.includes("lending")
    ) {
      categories.defi.push(item);
    } else if (
      fullText.includes("nft") || 
      fullText.includes("non-fungible") || 
      fullText.includes("collectible")
    ) {
      categories.nft.push(item);
    } else if (
      fullText.includes("regulation") || 
      fullText.includes("law") || 
      fullText.includes("government") || 
      fullText.includes("compliance")
    ) {
      categories.regulations.push(item);
    } else if (
      fullText.includes("exchange") || 
      fullText.includes("binance") || 
      fullText.includes("coinbase") || 
      fullText.includes("kraken")
    ) {
      categories.exchanges.push(item);
    } else if (
      fullText.includes("altcoin") || 
      fullText.includes("token") || 
      fullText.includes("coin") || 
      !categories.bitcoin.includes(item) && 
      !categories.ethereum.includes(item)
    ) {
      categories.altcoins.push(item);
    } else {
      categories.general.push(item);
    }
  });

  return categories;
}

// وظيفة لترجمة عناوين الأخبار إلى العربية
export async function translateNewsTitle(title: string): Promise<string> {
  try {
    // استخدام Google Translate API أو خدمة ترجمة أخرى
    // هذه مجرد وظيفة صورية، ستحتاج إلى استبدالها بخدمة ترجمة حقيقية
    return title;
  } catch (error) {
    console.error("Error translating title:", error);
    return title;
  }
} 