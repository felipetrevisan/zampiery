'use server'

import { auth } from '@nathy/web/config/firebase'
import { signInWithEmailAndPassword } from 'firebase/auth'

export async function login(email: string, password: string) {
  return await signInWithEmailAndPassword(auth, email, password)
}
