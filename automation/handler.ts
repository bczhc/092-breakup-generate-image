import {blobToBase64} from "../src/utils";

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
     * @param params parameters
     */
    public abstract generate(params: Params): Promise<Blob>;

    public async generateImageBase64(params: Params): Promise<string> {
        return await blobToBase64(await this.generate(params));
    }
}

const IMAGE_SAVER_MANAGER_GLOBAL_NAME = 'imageSaveManager';

export function imageSaverManager() {
    return window[IMAGE_SAVER_MANAGER_GLOBAL_NAME] as ImageSaverManager;
}

window[IMAGE_SAVER_MANAGER_GLOBAL_NAME] = new ImageSaverManager();
