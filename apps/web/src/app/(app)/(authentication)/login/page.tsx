import type { Metadata } from 'next'
import { Login } from './_components'

export const metadata: Metadata = {
  title: 'Login',
}

export default async function Page() {
  return <Login />
}
