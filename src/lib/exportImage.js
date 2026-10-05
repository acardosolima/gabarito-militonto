import { toPng } from 'html-to-image'

export async function exportNodeAsPng(node, filename) {
  const dataUrl = await toPng(node, { pixelRatio: 2 })
  const link = document.createElement('a')
  link.download = filename
  link.href = dataUrl
  link.click()
}
