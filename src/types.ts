import type { NextPage } from 'next'
import { ReactNode } from 'react'

export enum PageAuth {
  Admin,
  Private,
  UnPrivate,
}

export type PageWithLayout<P = Record<string, never>> = NextPage<P> & {
  getLayout?: (page: ReactNode) => ReactNode
  auth?: PageAuth
}
