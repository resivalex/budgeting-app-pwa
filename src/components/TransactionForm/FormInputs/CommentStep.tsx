import styled from 'styled-components'
import SuggestingInput2 from '@/components/SuggestingInput2'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCheckCircle } from '@fortawesome/free-solid-svg-icons'

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

const ControlContainer = styled.div`
  display: flex;
  justify-content: space-between;
`

export default function CommentStep({
  comment,
  isExpanded,
  onCommentChange,
  onExpand,
  onComplete,
  comments,
}: Props) {
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
      <ControlContainer className="control">
        <SuggestingInput2 suggestions={comments} value={comment} onChange={onCommentChange} />
        <button onClick={onComplete}>
          <FontAwesomeIcon icon={faCheckCircle} />
        </button>
      </ControlContainer>
    </div>
  )
}
