import ChoosingInput from '@/components/ChoosingInput'

interface Props {
  category: string
  categoryOptions: { value: string; label: string }[]
  onCategoryChange: (category: string) => void
}

export default function Category({ category, categoryOptions, onCategoryChange }: Props) {
  return (
    <div className="field">
      <div className="is-size-7">Категория</div>
      <div className="control">
        <ChoosingInput value={category} options={categoryOptions} onChange={onCategoryChange} />
      </div>
    </div>
  )
}
