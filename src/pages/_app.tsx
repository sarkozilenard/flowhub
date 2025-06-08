import type { AppProps } from 'next/app'
import { AuthProvider } from '@/contexts/AuthContext'
import { LanguageProvider } from '@/contexts/LanguageContext'
import '../styles/globals.css';
import ProtectedRoute from '@/components/ProtectedRoute';
import { Toaster } from "@/components/ui/toaster"
import { ThemeProvider } from '@/components/ThemeProvider'

export default function App({ Component, pageProps }: AppProps) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <LanguageProvider>
        <div className="min-h-screen">
          <AuthProvider>
            <ProtectedRoute>
              <Component {...pageProps} />
            </ProtectedRoute>
            <Toaster />
          </AuthProvider>
        </div>
      </LanguageProvider>
    </ThemeProvider>
  )
}