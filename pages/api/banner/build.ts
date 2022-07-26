import fs from 'fs';
import path from 'path';

import type { NextApiRequest, NextApiResponse } from 'next';

import { createCanvas, Image } from 'canvas';

const BANNER_BG_DATA = fs.readFileSync(
  path.join(process.cwd(), 'assets/banners/banana_bg.png')
);

async function generateImage(selectedSMBImage: Buffer) {
  const canvas = createCanvas(1500, 500);
  const ctx = canvas.getContext('2d');
  ctx.quality = 'best';

  await new Promise((resolve: any) => {
    const backgroundImage = new Image();
    backgroundImage.onerror = (err) => {
      throw err;
    };
    backgroundImage.onload = () => {
      ctx.drawImage(backgroundImage, 0, 0, 1500, 500);
      resolve();
    };
    backgroundImage.src = BANNER_BG_DATA;
  });

  await new Promise((resolve: any) => {
    const smbImage = new Image();
    smbImage.onerror = (err) => {
      throw err;
    };
    smbImage.onload = () => {
      resolve();
      ctx.drawImage(smbImage, 900, -26, 384, 384);
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
  const { selectedSMBNumber } = req.body;
  const selectedSMBImage = fs.readFileSync(
    path.join(process.cwd(), `assets/smb_nobg/${selectedSMBNumber}.png`)
  );

  const banner = await generateImage(selectedSMBImage);

  res.setHeader('Content-Type', 'image/png');
  res.setHeader('content-disposition', 'attachment; filename=banner.png');

  res.send(banner);
}
