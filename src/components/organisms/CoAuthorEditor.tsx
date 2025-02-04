"use client"

import "draft-js/dist/Draft.css"
import "./CoAuthorEditor.css"
import { CompositeDecorator, ContentState, Editor, EditorState } from "draft-js"
import { useEffect, useState } from "react"
import { X } from "lucide-react"
import { toast } from "sonner"
import { Button } from "../ui/button"
import { joinClassName } from "@/utils/functions/joinClassName"
import { useGetNovelChapterContent } from "@/utils/hooks/useNovelChapterContent"
import { useApiV1 } from "@/utils/hooks/useApiV1"
import { useAuthStore } from "@/utils/stores/useAuthStore"

type Props = { novelId: string; order: number; backRoute: () => void }

export function CoAuthorEditor({ novelId, order, backRoute }: Props) {
  const {
    novelTitle,
    editorState,
    setEditorState,
    loading,
    editorEnable,
    handleSave,
  } = useCoAuthorStoryEditor(novelId, order)

  return (
    <>
      <div id='co-author-editor-header' className='mp-16 border-b flex py-2'>
        <div className='mx-4'>
          <Button onClick={backRoute} variant={"secondary"}>
            <X />
          </Button>
        </div>

        <div className='truncate mx-2 flex items-center'>
          <p className='text-ellipsis truncate'>{novelTitle}</p>
        </div>

        <div className='ml-auto mx-4'>
          <Button onClick={handleSave} disabled={loading}>
            保存
          </Button>
        </div>
      </div>

      <div id='co-author-editor-main' className='w-full flex flex-col'>
        <div
          id='co-author-editor-content'
          className={joinClassName(
            "p-2",
            "grid grid-cols-2",
            "mt-[32px] mb-[128px] lg:mx-44",
            "min-h-96 h-full",
            "border",
          )}
        >
          {editorEnable && (
            <Editor
              editorKey='CoAuthorEditor'
              editorState={editorState}
              onChange={setEditorState}
              placeholder='執筆を開始する'
              readOnly={loading}
            />
          )}
        </div>
      </div>
    </>
  )
}

// type WordCell = {
//   id: string
//   word: string
//   ruby: string | null
//   description: string
// }

function useCoAuthorStoryEditor(novelId: string, order: number) {
  // const words: WordCell[] = []

  const { accessToken } = useAuthStore()

  const { dataGetNovelChapterContent } = useGetNovelChapterContent(
    novelId,
    order,
  )
  const { postChapterContent } = useApiV1()

  const [novelTitle, setNovelTitle] = useState<string>("")
  // const [content, setContent] = useState<string>("")

  const [editorEnable, setEditorEnable] = useState(false)
  const [loading, setLoading] = useState(true)

  const coAuthorDecorator = new CompositeDecorator([
    // {
    //   strategy: (contentBlock, callback, contentState) => {
    //     console.log(">> text", contentState)
    //     const regex = new RegExp(words.map((word) => word.word).join("|"), "g")
    //     const text = contentBlock.getText()
    //     while (true) {
    //       const matched = regex.exec(text)
    //       if (matched === null) break
    //       const start = matched.index
    //       callback(start, start + matched[0].length)
    //     }
    //   },
    //   component: (props) => {
    //     if (!props.decoratedText || typeof props.decoratedText !== "string")
    //       return <span>{props.children}</span>
    //     console.log(">> props", props)
    //     return (
    //       <span
    //         className='font-bold text-blue-600 underline hover:cursor-pointer'
    //         onClick={(event) => {
    //           const { target } = event
    //           if (target instanceof HTMLElement && target.tagName === "SPAN") {
    //             const info = words.find(
    //               (word) => word.word === props.decoratedText,
    //             )
    //             if (info) _showWordDescription(info)
    //           }
    //         }}
    //         onMouseEnter={() => {}}
    //         onMouseLeave={() => {}}
    //       >
    //         {props.children}
    //       </span>
    //     )
    //   },
    // },
  ])

  // const _showWordDescription = (word: WordCell) => {
  //   console.log(">> word", word)
  // }

  const [editorState, setEditorState] = useState(
    EditorState.createWithContent(
      ContentState.createFromText(""),
      coAuthorDecorator,
    ),
  )

  const _saveContent = async () => {
    if (loading) return
    if (!dataGetNovelChapterContent || !dataGetNovelChapterContent.success) {
      return
    }

    setLoading(true)

    try {
      const currentContent = editorState.getCurrentContent()
      const plainText = currentContent.getPlainText()
      console.log(">> plainText", plainText)

      const result = await postChapterContent(accessToken ?? "", {
        novelId: novelId,
        chapterId: dataGetNovelChapterContent.data.chapterId,
        content: plainText,
      })
      // await refreshGetNovelChapterContent()
      if (result.success) toast.success("小説を保存しました")
      else toast.error("保存に失敗しました", { description: result.error.code })
    } catch (error) {
      toast.error("保存に失敗しました", { description: JSON.stringify(error) })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (!dataGetNovelChapterContent || !dataGetNovelChapterContent.success)
      return

    const contentState = ContentState.createFromText(
      dataGetNovelChapterContent.data.content,
    )
    setEditorState(
      EditorState.createWithContent(contentState, coAuthorDecorator),
    )
    setNovelTitle(dataGetNovelChapterContent.data.title)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dataGetNovelChapterContent])

  useEffect(() => {
    setEditorEnable(true)
    setLoading(false)
  }, [])

  return {
    novelTitle,
    editorState,
    setEditorState,
    loading,
    editorEnable,
    handleSave: _saveContent,
  }
}
