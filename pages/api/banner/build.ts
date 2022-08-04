import fs from 'fs';
import path from 'path';

import axios from 'axios';
import type { NextApiRequest, NextApiResponse } from 'next';

import sharp from 'sharp';

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
  },
};

async function generateBannerImage(
  selectedSMBImage: Buffer,
  selectedBackground: Buffer,
  name: any
) {
  const resizesSMBImage = await sharp(selectedSMBImage)
    .resize(bannerData[name].size, bannerData[name].size)
    .toBuffer();

  const generatedImageBuffer = await sharp(selectedBackground)
    .resize(bannerData.width, bannerData.height)
    .composite([
      {
        input: resizesSMBImage,
        top: bannerData[name].y,
        left: bannerData[name].x,
      },
    ])
    .png()
    .toBuffer();

  return generatedImageBuffer;
}

async function generateLockScreenImage(
  selectedSMBImage: Buffer,
  selectedBackground: Buffer
) {
  const resizesSMBImage = await sharp(selectedSMBImage)
    .resize(phoneData.size, phoneData.size)
    .toBuffer();

  const generatedImageBuffer = await sharp(selectedBackground)
    .resize(phoneData.width, phoneData.height)
    .composite([
      {
        input: resizesSMBImage,
        left: phoneData.monkePosition.x,
        top: phoneData.monkePosition.y,
      },
    ])
    .png()
    .toBuffer();

  return generatedImageBuffer;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const { selectedSMBNumber, image } = req.body;
    const selectedSMBImageResponse = await axios({
      url: `https://monkedao-banners.s3.us-east-1.amazonaws.com/smb-gen1/no-bgs/${selectedSMBNumber}.png`,
      responseType: 'arraybuffer',
    });
    const selectedSMBImage = Buffer.from(
      selectedSMBImageResponse.data,
      'binary'
    );

    const isBanner = bannerData.files.find((name: any) => name === image);
    res.setHeader('Content-Type', 'image/png');

    if (isBanner) {
      const selectedBackground = fs.readFileSync(
        path.join(process.cwd(), `assets/banners/${image}.png`)
      );
      const banner = await generateBannerImage(
        selectedSMBImage,
        selectedBackground,
        image
      );
      res.setHeader('content-disposition', 'attachment; filename=banner.png');
      res.send(banner);
    } else {
      const selectedBackgroundResponse = await axios({
        url: `https://monkedao-banners.s3.us-east-1.amazonaws.com/mobile/${image}.png`,
        responseType: 'arraybuffer',
      });
      const selectedBackground = Buffer.from(
        selectedBackgroundResponse.data,
        'binary'
      );
      const lockscreen = await generateLockScreenImage(
        selectedSMBImage,
        selectedBackground
      );
      res.setHeader(
        'content-disposition',
        'attachment; filename=lock_screen.png'
      );
      res.send(lockscreen);
    }
  } catch (e) {
    res.status(400).json({ isError: true, error: e });
  }
}
