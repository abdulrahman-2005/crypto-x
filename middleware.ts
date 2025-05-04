// نظرًا لأننا نستخدم تحقق بالكامل على جانب العميل، فلا حاجة للـ middleware
// ولن يعمل فحص localStorage من middleware لأنه يعمل على الخادم
// سنقوم بتعطيل الفحص في middleware ونعتمد فقط على الفحص في صفحة الإدارة نفسها

import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(request: NextRequest) {
  // نسمح بالمرور دائمًا ونترك عملية التحقق للـ client side
  return NextResponse.next()
}

export const config = {
  matcher: "/admin/:path*",
} 