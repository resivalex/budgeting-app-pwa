import { reactSelectSmallStyles } from '@/utils'
import Select from 'react-select'
import styled from 'styled-components'

interface Props {
  category: string
  isExpanded: boolean
  onCategoryChange: (category: string) => void
  onExpand: () => void
  onComplete: () => void
  categoryOptions: { value: string; label: string }[]
}

const CategoryLabel = styled.div<{ isExpanded: boolean }>`
  font-size: 1rem;
  color: ${(props) => (props.isExpanded ? 'black' : 'gray')};
`

const SelectedCategory = styled.div`
  font-size: 0.8rem;
`

export default function CategoryStep({
  category,
  isExpanded,
  onCategoryChange,
  onExpand,
  onComplete,
  categoryOptions,
}: Props) {
  const selectedOption = categoryOptions.find((option) => option.value === category)

  const handleCategoryChange = (value: string) => {
    onCategoryChange(value)
    onComplete()
  }

  if (!isExpanded) {
    return (
      <div className="field" onClick={onExpand}>
        <CategoryLabel className="is-size-7" isExpanded={isExpanded}>
          Категория
        </CategoryLabel>
        <SelectedCategory>{selectedOption ? selectedOption.label : 'Select'}</SelectedCategory>
      </div>
    )
  }

  return (
    <div className="field">
      <CategoryLabel className="is-size-7" isExpanded={isExpanded}>
        Категория
      </CategoryLabel>
      <div className="control">
        <Select
          className="basic-single"
          classNamePrefix="select"
          value={selectedOption}
          onChange={(selectedOption) => {
            if (!selectedOption) return
            handleCategoryChange(selectedOption.value)
          }}
          options={categoryOptions}
          styles={reactSelectSmallStyles}
          placeholder="Выберите из списка..."
        />
      </div>
    </div>
  )
}
