import { GoogleSheets } from 'jnj-utils';
import { googleAuthOptions } from './settings.js';

const googlesheets = async (spreadsheetId = '13Y3q2mYpGRIIjD2oJZu5YvLIXkQB0jDaHDICNnLqLgE') => {
  const gs = new GoogleSheets(spreadsheetId, googleAuthOptions());
  const client = await gs.init();
  return gs;
};

export { googlesheets };

// * TEST

// * googleCalendar
const gs = await googlesheets();
// const names = await gs.getSheetNames();
// console.log(names);

// // * service 사용
// const values = await gs.service.spreadsheets.values.get({
//   spreadsheetId: '13Y3q2mYpGRIIjD2oJZu5YvLIXkQB0jDaHDICNnLqLgE',
//   range: '시트1',
// });

// console.log(values.data.values);

// * user definded function
const values = await gs.getValues({ range: 'B4:C5', sheetName: '시트1' });
console.log(values);
