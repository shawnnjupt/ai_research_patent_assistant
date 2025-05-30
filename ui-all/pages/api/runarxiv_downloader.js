// pages/api/runarxiv_crawler.ts
import { exec } from 'child_process';
import util from 'util';

const execAsync = util.promisify(exec);

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { title, date } = req.body; // 解析 title 和 date 参数

  try {
    // 确保传递的参数是 UTF-8 编码
    const encodedTitle = encodeURIComponent(title);
    const encodedDate = encodeURIComponent(date);
    // 输出 encodedTitle 和 encodedDate 到控制台
    console.log('Encoded Title:', encodedTitle);
    console.log('Encoded Date:', encodedDate);
    console.log('Title:', title);
    console.log('Date:', date);
    const { stdout } = await execAsync(`C:/Users/user/miniconda3/envs/ai_assistant/python.exe C:/WORK/GitHub/ai_research_assistant/arxiv/arxiv_downloader.py --title "${title}" --date "${date}"`);
    //const { stdout } = await execAsync(`C:/Users/user/miniconda3/envs/ai_assistant/python.exe C:/WORK/GitHub/ai_research_assistant/arxiv/arxiv_downloader.py --title "Instance-Adaptive Keypoint Learning with Local-to-Global Geometric Aggregation for Category-Level Object Pose Estimation" --date "2025-04-22"`);
    res.status(200).json({ output: stdout });
  } catch (error) {
    console.error('Error executing Python script:', error);
    res.status(500).json({ error: 'Failed to run Python script' });
  }
}