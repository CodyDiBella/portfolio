import Navbar from '@/components/Navbar'
import '@/styles/globals.css'
import { createTheme, NextUIProvider } from "@nextui-org/react"
import Head from 'next/head'

const darkTheme = createTheme({
  type: "dark",
  theme: {
    colors: {
      primaryLight: '$purple200',
      primaryLightHover: '$purple300',
      primaryLightActive: '$purple400',
      primaryLightContrast: '$purple600',
      primary: '#4ADE7B',
      primaryBorder: '$purple500',
      primaryBorderHover: '$purple600',
      primarySolidHover: '$purple700',
      primarySolidContrast: '$white',
      primaryShadow: '$purple500',

      gradient: 'linear-gradient(112deg, $blue100 -25%, $pink500 -10%, $purple500 80%)',
      link: '#5E1DAD',

      // you can also create your own color
      myColor: '#ff4ecd'

      // ...  more colors
    },
    space: {},
    fonts: {}
  }
})

const lightTheme = createTheme({
  type: "light",
  theme: {
    colors: {
      primaryLight: '$purple200',
      primaryLightHover: '$purple300',
      primaryLightActive: '$purple400',
      primaryLightContrast: '$purple600',
      primary: '#4ADE7B',
      primaryBorder: '$purple500',
      primaryBorderHover: '$purple600',
      primarySolidHover: '$purple700',
      primarySolidContrast: '$white',
      primaryShadow: '$purple500',

      gradient: 'linear-gradient(112deg, $blue100 -25%, $pink500 -10%, $purple500 80%)',
      link: '#5E1DAD',

      myColor: '#ff4ecd'

    },
    space: {},
    fonts: {}
  }
})

export default function App({ Component, pageProps }) {
  return (
  <>
        <Head>
        <link rel="shortcut icon" href="/favicon.ico" />
      </Head>
  <NextUIProvider
  defaultTheme="system"
    attribute="class"
    value={{
      light: lightTheme.className,
      dark: darkTheme.className
    }}
  >
  <Navbar />
  <Component {...pageProps} />
  </NextUIProvider>
  </>
  );
}
