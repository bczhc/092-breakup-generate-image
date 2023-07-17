import html2canvas from "html2canvas"

export async function takeScreenshot(element: HTMLElement, scale: number = 5) {
    let canvas = await html2canvas(
        element,
        {
            width: element.clientWidth,
            height: element.clientHeight,
            scale: scale,
        }
    )
    return canvas.toDataURL('image/png')
}
