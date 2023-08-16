import { create } from 'zustand'

type GeneralStore = {
  backgroundType: string
  setBackgroundType: (value: string) => void
  displayBackgroundFile: File | null
  setDisplayBackgroundFile: (value: File) => void
}

const useGeneralStore = create<GeneralStore>()((set) => ({
  backgroundType: '',
  setBackgroundType: (value) => set(() => ({ backgroundType: value })),
  displayBackgroundFile: null,
  setDisplayBackgroundFile: (value) =>
    set(() => ({ displayBackgroundFile: value })),
}))

export { useGeneralStore }

