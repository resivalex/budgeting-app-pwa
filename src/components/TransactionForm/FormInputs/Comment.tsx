import React, { useEffect, useRef } from 'react'
import styled from 'styled-components'
import SuggestingInput from '@/components/SuggestingInput'

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

export default function Comment({
  comment,
  isExpanded,
  onCommentChange,
  onExpand,
  onComplete,
  comments,
}: Props) {
  const inputRef = useRef<any>(null)

  useEffect(() => {
    if (isExpanded && inputRef.current) {
      inputRef.current.focus()
    }
  }, [isExpanded])

  if (!isExpanded) {
    return (
      <div className="field" onClick={onExpand}>
        <CommentLabel className="is-size-7" isExpanded={isExpanded}>
          Комментарий
        </CommentLabel>
        <SelectedComment>{comment || '(пусто)'}</SelectedComment>
      </div>
    )
  }

  return (
    <div className="field">
      <CommentLabel className="is-size-7" isExpanded={isExpanded}>
        Комментарий
      </CommentLabel>
      <div className="control">
        <SuggestingInput
          ref={inputRef}
          suggestions={comments}
          value={comment}
          onChange={onCommentChange}
          onConfirm={onComplete}
        />
      </div>
    </div>
  )
}
