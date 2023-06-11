import { atom } from 'jotai'

export const typeAtom = atom<'income' | 'expense' | 'transfer'>('expense')
