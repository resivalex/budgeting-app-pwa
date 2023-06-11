import { atom } from 'jotai'

export const typeAtom = atom<'income' | 'expense' | 'transfer'>('expense')
export const amountAtom = atom('')
export const currencyAtom = atom('')
export const categoryAtom = atom('')
export const accountAtom = atom('')
export const payeeTransferAccountAtom = atom('')
export const payeeAtom = atom('')
export const commentAtom = atom('')
export const datetimeAtom = atom(new Date().toISOString())
export const payeeSuggestionsAtom = atom<string[]>([])
export const commentSuggestionsAtom = atom<string[]>([])
