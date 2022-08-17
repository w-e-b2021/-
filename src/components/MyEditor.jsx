import React, { useEffect, useState } from 'react'
import { Editor } from 'react-draft-wysiwyg'
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css'
import draftToHtml from 'draftjs-to-html'
import { convertToRaw, ContentState, EditorState } from 'draft-js'
import htmlToDraft from 'html-to-draftjs'

export default function MyEditor({ handleContext, content }) {
  let [editorState, setEditorState] = useState('')
  useEffect(() => {
    if (content) {
      const contentBlock = htmlToDraft(content)
      if (contentBlock) {
        const contentState = ContentState.createFromBlockArray(contentBlock.contentBlocks)
        const editorState = EditorState.createWithContent(contentState)
        setEditorState(editorState)
      }
    }
  }, [content])
  return (
    <Editor
      editorState={editorState}
      onEditorStateChange={state => {
        setEditorState(state)
      }}
      onBlur={() => {
        handleContext(draftToHtml(convertToRaw(editorState.getCurrentContent())))
      }}
    />
  )
}
