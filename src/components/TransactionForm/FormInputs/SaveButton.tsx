export default function SaveButton({
  isValid,
  isLoading,
  onSave,
}: {
  isValid: boolean
  isLoading: boolean
  onSave: () => void
}) {
  return (
    <div className="field">
      <div className="control">
        <button className="button is-info" onClick={onSave} disabled={!isValid || isLoading}>
          {isValid ? 'Сохранить' : 'Заполните необходимые поля'}
          {isLoading && '...'}
        </button>
      </div>
    </div>
  )
}
