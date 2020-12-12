import React, { FC, useState } from 'react';
import { loadObjectDetection } from '@tensorflow/tfjs-automl';
import '@tensorflow/tfjs-backend-cpu';
import Jimp from 'jimp';
import './App.css';

const modelUrl = '/model/model.json';

async function detect(img: HTMLImageElement) {
  const model = await loadObjectDetection(modelUrl);
  const options = { score: 0.5, iou: 0.5, topk: 20 };
  return await model.detect(img, options);
}

const convert = async (imgUrl: string, x: number, y: number, w: number, h: number) => {
  const j = await Jimp.read(imgUrl);
  const v = await Jimp.read(imgUrl);
  const cropped = await v.crop(x, y, w, h).scale(0.1).scale(10);
  return await j.blit(cropped, x, y, 0, 0, w, h).getBase64Async(Jimp.MIME_JPEG);
};

const spinner = (loading: boolean) => {
  if (!loading) {
    return null;
  }
  return <p>loading...</p>;
};

const App: FC = () => {
  const [srcImg, setSrcImg] = useState('');
  const [dstImg, setDstImg] = useState('');
  const [loading, setLoading] = useState(false);

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

    const img = new Image();
    img.src = imgSrc;

    const res = await detect(img).catch((e) => {
      console.error('failed to detect:', e);
      setLoading(false);
      return;
    });

    if (!res || res[0] === undefined) {
      console.log('cannot find pie');
      setLoading(false);
      return;
    }

    const box = res[0].box;
    console.log('box:', box);

    const converted = await convert(imgSrc, box.left, box.top, box.width, box.height).catch((e) => {
      console.error('failed to convert image:', e);
      setLoading(false);
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
      <br />
      <br />
      <input type="file" onChange={handleChangeFile} />
      <br />
      <br />
      <img src={srcImg} alt="" />
      <br />
      <br />
      <button onClick={() => handleClick(srcImg)}>変換</button>
      {spinner(loading)}
      <br />
      <br />
      <img src={dstImg} alt="" />
    </div>
  );
};

export default App;
