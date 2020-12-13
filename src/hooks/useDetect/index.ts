import { loadObjectDetection } from '@tensorflow/tfjs-automl';
import { useCallback } from 'react';

export const useDetect = () => {
  return useCallback(async (modelUrl: string, img: HTMLImageElement) => {
    const model = await loadObjectDetection(modelUrl);
    const options = { score: 0.5, iou: 0.5, topk: 20 };
    return await model.detect(img, options).catch((e) => console.error(e));
  }, []);
};
