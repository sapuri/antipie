import Jimp from 'jimp';
import { useCallback } from 'react';

export const useConvert = () => {
  return useCallback(async (imgUrl: string, x: number, y: number, w: number, h: number) => {
    const j = await Jimp.read(imgUrl);
    const v = await Jimp.read(imgUrl);
    const cropped = await v.crop(x, y, w, h).scale(0.1).scale(10);
    return await j.blit(cropped, x, y, 0, 0, w, h).getBase64Async(Jimp.MIME_JPEG);
  }, []);
};
