import SuggestingInput from '@/components/SuggestingInput'

interface Props {
  comment: string
  onCommentChange: (comment: string) => void
  comments: string[]
}

export default function Comment({ comment, onCommentChange, comments }: Props) {
  return (
    <div className="field">
      <div className="is-size-7">Комментарий</div>
      <div className="control">
        <SuggestingInput suggestions={comments} value={comment} onChange={onCommentChange} />
      </div>
    </div>
  )
}
