import React, { FC, useState } from 'react';
import Button from '@material-ui/core/Button';
import { Photo } from './Photo';
import { ErrorText } from './ErrorText';
import { Backdrop } from './Backdrop';
import CircularProgress from '@material-ui/core/CircularProgress';
import { loadObjectDetection } from '@tensorflow/tfjs-automl';
import Jimp from 'jimp';

const modelUrl = '/model/model.json';

const detect = async (img: HTMLImageElement) => {
  const model = await loadObjectDetection(modelUrl);
  const options = { score: 0.5, iou: 0.5, topk: 20 };
  return await model.detect(img, options);
};

const convert = async (imgUrl: string, x: number, y: number, w: number, h: number) => {
  const j = await Jimp.read(imgUrl);
  const v = await Jimp.read(imgUrl);
  const cropped = await v.crop(x, y, w, h).scale(0.1).scale(10);
  return await j.blit(cropped, x, y, 0, 0, w, h).getBase64Async(Jimp.MIME_JPEG);
};

export const Content: FC = () => {
  const [srcImg, setSrcImg] = useState('');
  const [dstImg, setDstImg] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorText, setErrorText] = useState('');

  const handleChangeFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const createObjectURL = (window.URL || window.webkitURL).createObjectURL;
    const files = e.target.files;
    if (!files || files.length === 0) {
      return;
    }
    const imageURL = createObjectURL(files[0]);
    setSrcImg(imageURL);
  };

  const handleClick = async (imgSrc: string) => {
    setLoading(true);
    setErrorText('');

    const img = new Image();
    img.src = imgSrc;

    const res = await detect(img).catch(() => {
      setLoading(false);
      setErrorText('検出に失敗しました');
      return;
    });

    if (!res || res[0] === undefined) {
      setLoading(false);
      setErrorText('女性器を見つけられませんでした');
      return;
    }

    const box = res[0].box;
    const converted = await convert(imgSrc, box.left, box.top, box.width, box.height).catch(() => {
      setLoading(false);
      setErrorText('画像の変換に失敗しました');
      return;
    });

    if (!converted) {
      setLoading(false);
      return;
    }

    setDstImg(converted);
    setLoading(false);
  };

  return (
    <div className="App">
      <h1>Antipie</h1>
      <p>写真の女性器を見つけ出して自動的にモザイクをかけます</p>
      <p>※ 画像がサーバにアップロードされることはありません。</p>
      <br />

      <Button variant="contained" component="label">
        画像を選択
        <input type="file" hidden onChange={handleChangeFile} />
      </Button>

      <Photo src={srcImg} />

      <ErrorText msg={errorText} />

      <Button variant="contained" color="primary" disabled={!srcImg} onClick={() => handleClick(srcImg)}>
        変換する
      </Button>

      <Photo src={dstImg} />

      <Backdrop open={loading}>
        <CircularProgress color="inherit" />
      </Backdrop>
    </div>
  );
};
