import path from 'path';
import fs from 'fs';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const outputLlmsPath = path.join(process.cwd(), 'output_llms');
  const fileNames = fs.readdirSync(outputLlmsPath);

  const allPapersData = fileNames.map((fileName) => {
    const filePath = path.join(outputLlmsPath, fileName);
    const fileContents = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(fileContents);
  });

  res.status(200).json(allPapersData);
}

