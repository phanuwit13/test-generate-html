import { fontFamilyList } from 'Utils/constants'
import { create } from 'zustand'

type GraciasStore = {
  text: string
  setText: (value: string) => void
  fontSize: string
  setFontSize: (value: string) => void
  fontWeight: string
  setFontWeight: (value: string) => void
  fontFamily: string
  setFontFamily: (value: string) => void
  strokeWidth: string
  setStrokeWidth: (value: string) => void
  strokeColor: string
  setStrokeColor: (value: string) => void
}

const useGraciasStore = create<GraciasStore>()((set) => ({
  text: '',
  setText: (value) => set(() => ({ text: value })),
  fontSize: '60',
  setFontSize: (value) => set(() => ({ fontSize: value })),
  fontWeight: '600',
  setFontWeight: (value) => set(() => ({ fontWeight: value })),
  fontFamily: fontFamilyList[0],
  setFontFamily: (value) => set(() => ({ fontFamily: value })),
  strokeWidth: '1',
  setStrokeWidth: (value) => set(() => ({ strokeWidth: value })),
  strokeColor: '#ffa5d8',
  setStrokeColor: (value) => set(() => ({ strokeColor: value })),
}))

export { useGraciasStore }

