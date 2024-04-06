import { ReactNode } from "react"

interface Props {
  url: string
}
const IframeWrapper = ({ url }: Props) => {
  return (
    <iframe src={url} allowFullScreen height="300" width="300" seamless className="px-2 py-2 border border-primary mx-auto" referrerPolicy="strict-origin-when-cross-origin" />
  )
}

export default IframeWrapper
