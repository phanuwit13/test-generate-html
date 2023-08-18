import { fontFamilyList } from 'Utils/constants'
import { create } from 'zustand'

type LuminanceStore = {
  text: string
  setText: (value: string) => void
  fontSize: string
  setFontSize: (value: string) => void
  fontWeight: string
  setFontWeight: (value: string) => void
  fontFamily: string
  setFontFamily: (value: string) => void
  fontColor: string
  setFontColor: (value: string) => void
}

const useLuminanceStore = create<LuminanceStore>()((set) => ({
  text: '',
  setText: (value) => set(() => ({ text: value })),
  fontSize: '80',
  setFontSize: (value) => set(() => ({ fontSize: value })),
  fontWeight: '600',
  setFontWeight: (value) => set(() => ({ fontWeight: value })),
  fontFamily: fontFamilyList[0],
  setFontFamily: (value) => set(() => ({ fontFamily: value })),
  fontColor: '#000000',
  setFontColor: (value) => set(() => ({ fontColor: value })),
}))

export { useLuminanceStore }

