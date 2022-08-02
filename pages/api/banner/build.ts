import fs from 'fs';
import path from 'path';

import axios from 'axios';
import type { NextApiRequest, NextApiResponse } from 'next';

import { createCanvas, Image, registerFont } from 'canvas';

registerFont(path.join(process.cwd(), 'assets/fonts/Inter-ExtraBold.woff'), {
  family: 'Inter',
});

interface IDictionary {
  [index: string]: any;
}
let bannerData = {} as IDictionary;

bannerData = {
  width: 1500,
  height: 500,
  size: 384,
  banana_bg: {
    x: 900,
    y: -26,
    text: 'MonkeDAO'
  },
  black_monke: {
    x: 654,
    y: 65,
  },
  waves_bg: {
    x: 988,
    y: 116,
  },
  files: ['banana_bg', 'black_monke', 'waves_bg'],
}

const phoneData = {
  width: 1170,
  height: 2532,
  size: 1170,
  monkePosition: {
    x: 0,
    y: 1372,
  }
}

async function generateBannerImage(selectedSMBImage: Buffer, selectedBackground: Buffer, name: any) {
  const canvas = createCanvas(bannerData.width, bannerData.height);
  const ctx = canvas.getContext('2d');
  ctx.quality = 'best';

  await new Promise((resolve: any) => {
    const backgroundImage = new Image();
    backgroundImage.onerror = (err) => {
      throw err;
    };
    backgroundImage.onload = () => {
      ctx.drawImage(backgroundImage, 0, 0, bannerData.width, bannerData.height);
      resolve();
    };
    backgroundImage.src = selectedBackground;
  });

  await new Promise((resolve: any) => {
    const smbImage = new Image();
    smbImage.onerror = (err) => {
      throw err;
    };
    smbImage.onload = () => {
      resolve();
      ctx.drawImage(smbImage, bannerData[name].x, bannerData[name].y, bannerData.size, bannerData.size);
    };
    smbImage.src = selectedSMBImage;
  });

  if (bannerData[name].text) {
  ctx.font = '80px Inter';
  ctx.fillStyle = '#184623';
  ctx.textAlign = 'right';
  ctx.fillText(bannerData[name].text, 1300, 470);
  }

  const buffer = canvas.toBuffer('image/png', {
    compressionLevel: 0,
    filters: canvas.PNG_FILTER_NONE,
  });

  return buffer;
}


async function generateLockScreenImage(selectedSMBImage: Buffer, selectedBackground: Buffer) {
  const canvas = createCanvas(phoneData.width, phoneData.height);
  const ctx = canvas.getContext('2d');
  ctx.quality = 'best';

  await new Promise((resolve: any) => {
    const backgroundImage = new Image();
    backgroundImage.onerror = (err) => {
      throw err;
    };
    backgroundImage.onload = () => {
      ctx.drawImage(backgroundImage, 0, 0, phoneData.width, phoneData.height);
      resolve();
    };
    backgroundImage.src = selectedBackground;
  });

  await new Promise((resolve: any) => {
    const smbImage = new Image();
    smbImage.onerror = (err) => {
      throw err;
    };
    smbImage.onload = () => {
      resolve();
      ctx.drawImage(smbImage, phoneData.monkePosition.x, phoneData.monkePosition.y, phoneData.size, phoneData.size);
    };
    smbImage.src = selectedSMBImage;
  });

  const buffer = canvas.toBuffer('image/png', {
    compressionLevel: 0,
    filters: canvas.PNG_FILTER_NONE,
  });

  return buffer;
}


export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { selectedSMBNumber, image } = req.body;

  const selectedSMBImageResponse = await axios({
    url: `https://monkedao-banners.s3.us-east-1.amazonaws.com/smb-gen1/no-bgs/${selectedSMBNumber}.png`,
    responseType: 'arraybuffer',
  });
  const selectedSMBImage = Buffer.from(selectedSMBImageResponse.data, 'binary');

  const isBanner = bannerData.files.find((name: any) => name === image);
  res.setHeader('Content-Type', 'image/png');

  if (isBanner) {
    const selectedBackground =  fs.readFileSync(
      path.join(process.cwd(), `assets/banners/${image}.png`)
    );
    const banner = await generateBannerImage(selectedSMBImage, selectedBackground, image);
    res.setHeader('content-disposition', 'attachment; filename=banner.png');
    res.send(banner);
  } else {
    const selectedBackground =  fs.readFileSync(
      path.join(process.cwd(), `assets/mobile/${image}.png`)
    );
    const lockscreen = await generateLockScreenImage(selectedSMBImage, selectedBackground);
    res.setHeader('content-disposition', 'attachment; filename=lock_screen.png');
    res.send(lockscreen);
  }
}
