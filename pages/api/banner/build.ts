import fs from 'fs';
import path from 'path';

import type { NextApiRequest, NextApiResponse } from 'next';

import { createCanvas, Image } from 'canvas';


const BANNER_BG_DATA = fs.readFileSync(
  path.join(process.cwd(), 'assets/banners/banana_bg.png')
);

function generateImage() {
  const canvas = createCanvas(1500, 500);
  const ctx = canvas.getContext('2d');
  ctx.quality = 'best';

  const backgroundImage = new Image();
  backgroundImage.onerror = (err) => {
    throw err;
  };
  backgroundImage.onload = () => {
    ctx.drawImage(backgroundImage, 0, 0, 1500, 500);
  };
  backgroundImage.src = BANNER_BG_DATA;

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
  const banner = generateImage();

  res.setHeader('Content-Type', 'image/png');
  res.setHeader('content-disposition', 'attachment; filename=banner.png');

  res.send(banner);
}
