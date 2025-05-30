import path from 'path';
import fs from 'fs';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const outputLlmsPath = path.join(process.cwd(), 'paper_graph_temp');
  const fileName = 'graph_data.json'; // 指定文件名
  const filePath = path.join(outputLlmsPath, fileName);

  try {
    const fileContents = fs.readFileSync(filePath, 'utf8'); // 读取指定文件内容
    const jsonData = JSON.parse(fileContents); // 解析 JSON 数据
    res.status(200).json(jsonData); // 返回解析后的数据
  } catch (error) {
    res.status(500).json({ error: 'Failed to read or parse graph_data.json' }); // 处理错误
  }
}