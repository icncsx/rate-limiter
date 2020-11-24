import fs from 'fs';
import path from 'path';

export const fetchSampleData = () => {
  const data = fs.readFileSync(path.resolve(__dirname, "data.json"));
  return JSON.parse(data);
};
