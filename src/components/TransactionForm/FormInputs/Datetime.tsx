import DateTimePicker from 'react-datetime-picker'

interface Props {
  datetime: Date
  onDatetimeChange: (datetime: Date | null) => void
}

export default function Datetime({ datetime, onDatetimeChange }: Props) {
  return (
    <div className="field">
      <div className="is-size-7">Дата и время</div>
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
