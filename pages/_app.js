import Header from '../components/header'
import { QueryClient, QueryClientProvider } from 'react-query'
import { ReactQueryDevtools } from "react-query/devtools"
import '../styles/globals.css'
import 'react-static-tweets/styles.css'
import ScrollToTop from '../components/scrollTop'
import { SessionProvider } from "next-auth/react"
import Footer from '../components/footer'
import ToastContextProvider from '../contexts/ToastContext'
import Toast from '../components/toast'

function MyApp({ Component, pageProps: { session, ...pageProps } }) {

  const queryClient = new QueryClient();
  return <ToastContextProvider>
    <SessionProvider>
      <QueryClientProvider client={queryClient}>
        <div className="font-mono relative">
          <Header />
          <Component {...pageProps} />
          <Footer />
          <ScrollToTop />
          <Toast />
        </div>
      </QueryClientProvider>
    </SessionProvider>
  </ToastContextProvider>
}

export default MyApp
