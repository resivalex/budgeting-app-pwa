import SuggestingInput2 from '@/components/SuggestingInput2'

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
        <SuggestingInput2
          suggestions={comments}
          value={comment}
          onChange={onCommentChange}
          onConfirm={() => {}}
        />
      </div>
    </div>
  )
}
