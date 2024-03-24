import styled from 'styled-components'
import { DesktopDateTimePicker } from '@mui/x-date-pickers/DesktopDateTimePicker'
import { LocalizationProvider } from '@mui/x-date-pickers'
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns'
import { convertToLocaleTime } from '@/utils'
import ru from 'date-fns/locale/ru'

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

export default function Datetime({ datetime, isExpanded, onDatetimeChange, onExpand }: Props) {
  if (!isExpanded) {
    return (
      <div className="field" onClick={onExpand}>
        <DateTimeLabel className="is-size-7" isExpanded={isExpanded}>
          Дата и время
        </DateTimeLabel>
        <SelectedDateTime>{datetime ? convertToLocaleTime(datetime) : 'Select'}</SelectedDateTime>
      </div>
    )
  }

  return (
    <div className="field">
      <DateTimeLabel className="is-size-7" isExpanded={isExpanded}>
        Дата и время
      </DateTimeLabel>
      <div className="control">
        <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={ru}>
          <DesktopDateTimePicker
            value={datetime}
            onChange={onDatetimeChange as any}
            views={['year', 'month', 'day', 'hours', 'minutes', 'seconds']}
            viewRenderers={{
              hours: null,
              minutes: null,
              seconds: null,
            }}
          />
        </LocalizationProvider>
      </div>
    </div>
  )
}
