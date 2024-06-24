import {blobToBase64} from "./utils";

/**
 * A JSON type.
 */
export type Params = object;

export class ImageSaverManager {
    handlers: Map<string, ImageSaverHandler> = new Map();

    register(name: string, handler: ImageSaverHandler) {
        this.handlers.set(name, handler);
    }

    get(name: string): ImageSaverHandler {
        return this.handlers.get(name);
    }
}

export abstract class ImageSaverHandler {
    /**
     * Takes a screenshot and returns the image
     */
    public abstract generate(): Promise<Blob>;

    public async generateImageBase64(): Promise<string> {
        return await blobToBase64(await this.generate());
    }
}

const IMAGE_SAVER_MANAGER_GLOBAL_NAME = 'imageSaveManager';

export function imageSaverManager() {
    return window[IMAGE_SAVER_MANAGER_GLOBAL_NAME] as ImageSaverManager;
}

window[IMAGE_SAVER_MANAGER_GLOBAL_NAME] = new ImageSaverManager();

export function registerSimpleImageGenerator(name: string, handler: () => Promise<Blob>) {
    imageSaverManager().register(name, new class extends ImageSaverHandler {
        async generate(): Promise<Blob> {
            return await handler()
        }
    });
}
