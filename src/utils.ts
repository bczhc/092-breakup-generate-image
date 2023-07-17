import html2canvas from "html2canvas"

export async function takeScreenshot(element: HTMLElement, scale: number = 5): Promise<Blob> {
    let canvas = await html2canvas(
        element,
        {
            width: element.clientWidth,
            height: element.clientHeight,
            scale: scale,
        }
    )
    return new Promise((resolve, _reject) => {
        canvas.toBlob(b => {
            resolve(b)
        })
    })
}
