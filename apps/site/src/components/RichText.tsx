import type { DefaultTypedEditorState } from '@payloadcms/richtext-lexical'
import { RichText as LexicalRichText } from '@payloadcms/richtext-lexical/react'

export function RichText({ data }: { data: DefaultTypedEditorState }) {
  return <LexicalRichText className="rich-text" data={data} />
}
