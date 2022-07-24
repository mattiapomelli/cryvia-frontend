import { ReactNode } from 'react'
import type { NextPage } from 'next'

export enum PageAuth {
  Admin,
  Private,
  UnPrivate,
}

export type PageWithLayout<P = Record<string, never>> = NextPage<P> & {
  getLayout?: (page: ReactNode) => ReactNode
  auth?: PageAuth
}
