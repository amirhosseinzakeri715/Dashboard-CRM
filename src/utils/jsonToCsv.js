import { Parser } from 'json2csv';

export const convertJsonToCsv = (jsonData, fields) => {
  try {
    const parser = new Parser({ fields });
    return parser.parse(jsonData);
  } catch (err) {
    console.error('Error converting to CSV:', err);
    return null;
  }
}