import SuggestingInput from '@/components/SuggestingInput'

interface Props {
  payee: string
  onPayeeChange: (payee: string) => void
  payees: string[]
  type: 'expense' | 'income' | 'transfer' | ''
}

export default function Payee({ payee, onPayeeChange, payees, type }: Props) {
  return (
    <div className="field">
      <div className="is-size-7">{type === 'income' ? 'Плательщик' : 'Получатель'}</div>
      <div className="control">
        <SuggestingInput
          value={payee}
          suggestions={payees}
          onChange={onPayeeChange}
          onConfirm={() => {}}
        />
      </div>
    </div>
  )
}
