import styled from 'styled-components'
import SuggestingInput2 from '@/components/SuggestingInput2'

interface Props {
  comment: string
  isExpanded: boolean
  onCommentChange: (comment: string) => void
  onExpand: () => void
  onComplete: () => void
  comments: string[]
}

const CommentLabel = styled.div<{ isExpanded: boolean }>`
  font-size: 1rem;
  color: ${(props) => (props.isExpanded ? 'black' : 'gray')};
`

const SelectedComment = styled.div`
  font-size: 0.8rem;
`

export default function CommentStep({
  comment,
  isExpanded,
  onCommentChange,
  onExpand,
  onComplete,
  comments,
}: Props) {
  const handleCommentChange = (newComment: string) => {
    onCommentChange(newComment)
    if (comments.includes(newComment)) {
      onComplete()
    }
  }

  if (!isExpanded) {
    return (
      <div className="field" onClick={onExpand}>
        <CommentLabel className="is-size-7" isExpanded={isExpanded}>
          Комментарий
        </CommentLabel>
        <SelectedComment>{comment || 'Add Comment'}</SelectedComment>
      </div>
    )
  }

  return (
    <div className="field">
      <CommentLabel className="is-size-7" isExpanded={isExpanded}>
        Комментарий
      </CommentLabel>
      <div className="control">
        <SuggestingInput2 suggestions={comments} value={comment} onChange={handleCommentChange} />
      </div>
    </div>
  )
}
