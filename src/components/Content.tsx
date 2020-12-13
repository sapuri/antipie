import React, { FC, useState } from 'react';
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';

import { modelUrl } from '../const';
import { Photo } from './Photo';
import { Backdrop } from './Backdrop';
import { ErrorText } from './ErrorText';
import { useDetect } from '../hooks/useDetect';
import { useConvert } from '../hooks/useConvert';

export const Content: FC = () => {
  const [srcImg, setSrcImg] = useState('');
  const [dstImg, setDstImg] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorText, setErrorText] = useState('');
  const detect = useDetect();
  const convert = useConvert();

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

    const res = await detect(modelUrl, img).catch(() => {
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
