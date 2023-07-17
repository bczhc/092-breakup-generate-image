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

export async function blobToBase64(blob: Blob): Promise<string> {
    return new Promise((resolve, _) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result as string);
        reader.readAsDataURL(blob);
    });
}
