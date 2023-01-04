import React from 'react'
import { QueryClient } from '@tanstack/react-query'

export const trpcClientContext = React.createContext<QueryClient | undefined>(
  undefined,
)
