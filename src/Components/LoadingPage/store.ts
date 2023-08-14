import { create } from 'zustand'

type Store = {
  isLoading: boolean
  setIsLoading: (loading: boolean) => void
}

const useLoadingPageStore = create<Store>()((set) => ({
  isLoading: false,
  setIsLoading: (loading) => set((state) => ({ isLoading: loading })),
}))

export { useLoadingPageStore }
