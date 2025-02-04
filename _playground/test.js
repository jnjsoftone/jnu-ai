import { PLATFORM, loadFile, sanitizeName, sleep } from 'jnu-abc';
import { Chrome, Cheerio } from 'jnu-web';
import dotenv from 'dotenv';

const envPath = `../.env.${PLATFORM}`;
// console.log(loadFile(envPath));
dotenv.config({ path: envPath });

const { GOOGLE_EMAIL, CHROME_USER_DATA_DIR } = process.env;
// console.log(PLATFORM, GOOGLE_EMAIL, CHROME_USER_DATA_DIR);

// * fetch
const fetchByChrome = async (url, { email = GOOGLE_EMAIL, userDataDir = CHROME_USER_DATA_DIR }) => {
  const chrome = new Chrome({
    headless: false,
    email,
    userDataDir,
    arguments: [
      '--disable-gpu',
      // '--no-sandbox',
      '--disable-dev-shm-usage',
      '--disable-blink-features=AutomationControlled',
      '--disable-extensions',
      '--start-maximized',
      '--window-size=1920,1080',
      '--disable-web-security',
      '--allow-running-insecure-content',
      '--disable-popup-blocking',
      '--disable-notifications',
      '--disable-infobars',
      '--ignore-certificate-errors',
      '--user-agent=Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36', // 최신 Chrome 유저 에이전트
    ],
  });

  try {
    await chrome.goto(url);
    await chrome.driver.sleep(5000);

    // 페이지 소스 가져오기
    const html = await chrome.driver.getPageSource();
    const cheerio = new Cheerio(html);

    // 제목 정리 - 파일명으로 사용할 수 없는 문자 제거
    const rawTitle = cheerio.value('head title') || 'Untitled';
    const title = sanitizeName(rawTitle).replace(' markdownpreviewview', '');

    // 컨텐츠 선택자 수정
    const content = cheerio.html('main') || cheerio.html('body');

    await sleep(60);

    return {
      title: title.substring(0, 100),
      content,
    };
  } finally {
    await chrome.close();
  }
};

let url = 'https://chatgpt.com/c/6783a538-b5cc-8012-ab29-476795b18a44'; // 챗gpt
// url = "https://www.genspark.ai/agents?id=1059b776-f712-4a23-8fe9-0059bbaeda27" // 젠스파크
// url = "https://claude.ai/chat/24741e4f-52f2-4998-9e3f-6a7d33ebe06e" // 클로드
// url = "https://www.perplexity.ai/search/nodejsreul-sayonghayeo-appeul-XbV7QP0cSAmOWMH9TqXo3Q" // 퍼플릭시티

await fetchByChrome(url, { email: 'bigwhitekmc@gmail.com' }).then(console.log);
