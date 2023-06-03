import styled from 'styled-components'
import DateTimePicker from 'react-datetime-picker'

interface Props {
  datetime: Date
  isExpanded: boolean
  onDatetimeChange: (datetime: Date | null) => void
  onExpand: () => void
}

const DateTimeLabel = styled.div<{ isExpanded: boolean }>`
  font-size: 1rem;
  color: ${(props) => (props.isExpanded ? 'black' : 'gray')};
`

const SelectedDateTime = styled.div`
  font-size: 0.8rem;
`

export default function DatetimeStep({ datetime, isExpanded, onDatetimeChange, onExpand }: Props) {
  if (!isExpanded) {
    return (
      <div className="field" onClick={onExpand}>
        <DateTimeLabel className="is-size-7" isExpanded={isExpanded}>
          Дата и время
        </DateTimeLabel>
        <SelectedDateTime>
          {datetime ? datetime.toISOString().slice(0, 19).replace('T', ' ') : 'Select'}
        </SelectedDateTime>
      </div>
    )
  }

  return (
    <div className="field">
      <DateTimeLabel className="is-size-7" isExpanded={isExpanded}>
        Дата и время
      </DateTimeLabel>
      <div className="control">
        <DateTimePicker
          onChange={onDatetimeChange}
          value={datetime}
          format="y-MM-dd HH:mm:ss"
          disableClock
        />
      </div>
    </div>
  )
}
