import { FC } from 'react'

interface SaveButtonProps {}

interface FormLayoutProps {
  SaveButton: FC<SaveButtonProps>
}

function FormLayout({ SaveButton }: FormLayoutProps) {
  return (
    <>
      <SaveButton />
    </>
  )
}

export default FormLayout
