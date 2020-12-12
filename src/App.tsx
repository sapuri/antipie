import React, { FC, useState } from 'react';
import { loadObjectDetection } from '@tensorflow/tfjs-automl';
import '@tensorflow/tfjs-backend-cpu';
import Jimp from 'jimp';
import { Backdrop, CircularProgress, unstable_createMuiStrictModeTheme, CssBaseline, makeStyles, ThemeProvider } from '@material-ui/core';
import Button from '@material-ui/core/Button';
import { pink } from '@material-ui/core/colors';
import './App.css';

const modelUrl = '/model/model.json';

const theme = unstable_createMuiStrictModeTheme({
  palette: {
    type: 'dark',
    primary: pink,
  },
});

const useStyles = makeStyles((theme) => ({
  backdrop: {
    zIndex: theme.zIndex.drawer + 1,
    color: '#fff',
  },
}));

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

const App: FC = () => {
  const classes = useStyles();

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
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <div className="App">
        <h1>Antipie</h1>
        <p>写真の女性器を見つけ出して自動的にモザイクをかけます</p>
        <br />
        <Button variant="contained" component="label">
          画像を選択
          <input type="file" hidden onChange={handleChangeFile} />
        </Button>
        <div className="photo">
          <img src={srcImg} alt="" />
        </div>
        <Button variant="contained" color="primary" disabled={!srcImg} onClick={() => handleClick(srcImg)}>
          変換
        </Button>
        <div className="photo">
          <img src={dstImg} alt="" />
        </div>
        <Backdrop className={classes.backdrop} open={loading}>
          <CircularProgress color="inherit" />
        </Backdrop>
      </div>
    </ThemeProvider>
  );
};

export default App;
