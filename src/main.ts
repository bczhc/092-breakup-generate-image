import html2canvas from "html2canvas"

async function takeScreenshot(element: HTMLElement, scale: number = 5) {
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

async function onLoad() {
    let view = document.querySelector('#view') as HTMLElement
    let imageData = await takeScreenshot(view)
    console.log(imageData)

    window['updateData'] = async (text: string) => {
        view.innerText = text
        console.log(await takeScreenshot(view))
    }
}

window.onload = onLoad
