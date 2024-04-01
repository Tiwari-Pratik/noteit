
"use client"
import { Button } from '@/components/ui/button'
import React from 'react'
import DeleteIcon from './deleteIcon'

interface Props {
  delete: (id: string) => void,
  id: string
}

const DeleteNoteButton = (props: Props) => {
  const deleteHandler = async () => {
    props.delete(props.id)
  }
  return (
    <Button variant="outline" className="border-primary/50" onClick={deleteHandler} >
      <DeleteIcon className="h-4 w-4" />
    </Button>
  )
}

export default DeleteNoteButton
