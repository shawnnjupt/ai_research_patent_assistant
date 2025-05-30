// pages/api/runarxiv_crawler.ts
import { exec } from 'child_process';
import util from 'util';

const execAsync = util.promisify(exec);

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { input } = req.body;

  try {
    // 确保传递的参数是 UTF-8 编码
    const encodedInput = encodeURIComponent(input);
    const { stdout } = await execAsync(`C:/Users/user/miniconda3/envs/ai_assistant/python.exe C:/WORK/GitHub/ai-lesson-other-branch/ai_research_assistant/networks.py`);
    res.status(200).json({ output: stdout });
  } catch (error) {
    console.error('Error executing Python script:', error);
    res.status(500).json({ error: 'Failed to run Python script' });
  }
}