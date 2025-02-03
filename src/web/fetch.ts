// import { sanitizeName } from 'jnu-abc';
// import { Chrome, Cheerio } from 'jnu-web';

// const { defaultEmail, chromeOptions } = settings;

// // * fetch
// const fetchByChrome = async (source, email = defaultEmail) => {
//     chromeOptions.default.email = email;
//     const chrome = new Chrome({
//       ...chromeOptions.default,
//       arguments: [
//         '--disable-gpu',
//         '--no-sandbox',
//         '--disable-dev-shm-usage',
//         '--disable-blink-features=AutomationControlled',
//         '--disable-extensions',
//         '--start-maximized',
//         '--window-size=1920,1080',
//         '--disable-web-security',
//         '--allow-running-insecure-content',
//       ],
//     });
  
//     try {
//       await chrome.goto(source);
//       await chrome.driver.sleep(5000);
  
//       // 페이지 소스 가져오기
//       const html = await chrome.driver.getPageSource();
//       const cheerio = new Cheerio(html);
  
//       // 제목 정리 - 파일명으로 사용할 수 없는 문자 제거
//       const rawTitle = cheerio.value('head title') || 'Untitled';
//       const title = sanitizeName(rawTitle).replace(' markdownpreviewview', '');
  
//       // 컨텐츠 선택자 수정
//       const content = cheerio.outerHtml('main') || cheerio.outerHtml('body');
  
//       // convertPerplexityHtmlToMarkdown 함수 호출 시 메타데이터 전달
//       const markdown = convertPerplexityHtmlToMarkdown(content, {
//         title: title.substring(0, 100), // 제목 길이 제한
//         email,
//         source,
//       });
  
//       return {
//         title: title.substring(0, 100),
//         content,
//         markdown,
//       };
//     } finally {
//       await chrome.close();
//     }
//   };