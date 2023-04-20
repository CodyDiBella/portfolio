import Head from 'next/head';
import Main from '@/components/Main';
import About from '@/components/About';
import Skills from '@/components/Skills';
import Projects from '@/components/Projects';
import Contact from '@/components/Contact';
import Games from '@/components/Games';

export default function Home() {
  return (
    <>
    <div>
      <Head>
        <title>codencodes</title>
        <meta name="My personal portfolio" content="Personal Portfolio" />
      </Head>
      <Main />
      <About />
      <Skills />
      <Projects />
      <Games />
      <Contact />
    </div>
    </>
  )
}
