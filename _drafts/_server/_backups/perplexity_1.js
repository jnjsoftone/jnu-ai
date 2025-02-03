import TurndownService from 'turndown';
import { JSDOM } from 'jsdom';

import { Chrome, sleepAsync, saveJson, Cheerio, loadFile, saveFile } from 'jnj-utils';
import { chromeOptions, selectors, defaultEmail } from './settings.js';

// * markdown
// 이스케이프 문자 제거 함수
const removeEscapes = (markdown) => {
  return markdown.replace(/\\([[\].])/g, '$1'); // \[, \], \. 등의 이스케이프 제거
};

const createPerplexityTurndownService = () => {
  const turndownService = new TurndownService({
    headingStyle: 'atx',
    codeBlockStyle: 'fenced',
  });

  // button 태그 제거 규칙
  turndownService.addRule('button', {
    filter: 'button',
    replacement: () => '',
  });

  // pre 태그 처리 규칙
  turndownService.addRule('pre', {
    filter: ['pre'],
    replacement: (content, node) => {
      const codeElement = node.querySelector('code');
      if (!codeElement) return '';

      const language = codeElement.className?.match(/language-(\w+)/)?.[1] || '';
      const code = codeElement.textContent.trim();
      return `\n\`\`\`${language}\n${code}\n\`\`\`\n\n`;
    },
  });

  // inline code 처리
  turndownService.addRule('code', {
    filter: (node) => node.nodeName === 'CODE' && !node.parentNode.matches('pre'),
    replacement: (content) => `\`${content}\``,
  });

  return turndownService;
};

const convertPerplexityHtmlToMarkdown = (html) => {
  const dom = new JSDOM(html);
  const doc = dom.window.document;
  const turndownService = createPerplexityTurndownService();

  let markdownContent = '';

  // 메인 컨테이너 찾기 (대화가 있는 컨테이너)
  const mainContainer = doc.querySelector('.col-span-8');
  if (!mainContainer) return markdownContent;

  // 대화 쌍 찾기
  const conversations = Array.from(mainContainer.children).reduce((pairs, div) => {
    if (div.querySelector('h1')) {
      // 새로운 대화 쌍 시작
      pairs.push({
        question: div,
        answer: null,
      });
    } else if (pairs.length > 0 && !pairs[pairs.length - 1].answer) {
      // 이전 질문의 답변
      pairs[pairs.length - 1].answer = div;
    }
    return pairs;
  }, []);

  for (const { question, answer } of conversations) {
    // 질문 처리
    const questionDiv = question.querySelector('h1');
    if (questionDiv) {
      const questionText = questionDiv.textContent.trim();
      if (questionText && questionText !== '답변') {
        markdownContent += '## user prompt\n\n';
        markdownContent += '~~~\n' + questionText + '\n~~~\n\n';

        // 답변 처리
        if (answer) {
          console.log('\n=== 답변 처리 시작 ===');

          // 직접 답변 div 찾기 시도
          const answerDivs = answer.querySelectorAll('div[dir="auto"] > div');
          console.log(`찾은 답변 div 수: ${answerDivs.length}`);

          if (answerDivs.length > 0) {
            markdownContent += '## assistant says\n\n';

            // 각 답변 div 처리
            for (const answerDiv of answerDivs) {
              console.log('\n--- 답변 div 처리 ---');
              console.log('답변 div HTML:', answerDiv.outerHTML);

              // 코드 블록 찾기
              const codeBlocks = answerDiv.querySelectorAll('pre');
              console.log(`코드 블록 수: ${codeBlocks.length}`);

              // 일반 텍스트 먼저 처리
              const textContent = answerDiv.querySelector('span')?.textContent?.trim();
              if (textContent) {
                markdownContent += textContent + '\n\n';
              }

              if (codeBlocks.length > 0) {
                for (const codeBlock of codeBlocks) {
                  console.log('코드 블록 내용:', codeBlock.textContent);
                  // 코드 블록의 언어 확인
                  const language = codeBlock.querySelector('.text-text-200')?.textContent?.trim() || '';
                  // 실제 코드 내용 추출
                  const codeContent = codeBlock.querySelector('code')?.textContent?.trim() || '';

                  if (codeContent) {
                    markdownContent += '```' + language + '\n' + codeContent + '\n```\n\n';
                  }
                }
              }

              // 목록 처리
              const lists = answerDiv.querySelectorAll('ol, ul');
              for (const list of lists) {
                const listMarkdown = turndownService.turndown(list.outerHTML);
                markdownContent += listMarkdown + '\n\n';
              }
            }
          } else {
            console.log('답변 div를 찾을 수 없음');
            // 이전 선택자로 시도
            const answerContent = answer.querySelector('div > div.border-borderMain\\/50');
            if (answerContent) {
              console.log('border-borderMain/50 div를 찾음');
              const secondTryDivs = answerContent.querySelectorAll('div[dir="auto"] > div');
              console.log(`두 번째 시도로 찾은 답변 div 수: ${secondTryDivs.length}`);
            }
          }

          console.log('=== 답변 처리 종료 ===\n');
        }

        markdownContent += '---\n\n';
      }
    }
  }

  return removeEscapes(markdownContent);
};

// * fetch
const fetchFromPerplexity = async (source, email = defaultEmail) => {
  chromeOptions.default.email = email;
  const chrome = new Chrome({
    ...chromeOptions.default,
    arguments: [
      '--disable-gpu',
      '--no-sandbox',
      '--disable-dev-shm-usage',
      '--disable-blink-features=AutomationControlled',
      '--disable-extensions',
      '--start-maximized',
      '--window-size=1920,1080',
      '--disable-web-security',
      '--allow-running-insecure-content',
    ],
  });

  try {
    await chrome.goto(source);
    await chrome.driver.sleep(5000);

    // 페이지 소스 가져오기
    const html = await chrome.driver.getPageSource();
    const cheerio = new Cheerio(html);

    // 제목 정리 - 파일명으로 사용할 수 없는 문자 제거
    const rawTitle = cheerio.value('head title') || 'Untitled';
    const title = rawTitle
      .replace(/[\\/:*?"<>|\n\r]/g, '') // 파일명으로 사용할 수 없는 문자 제거
      .replace(/\s+/g, ' ') // 연속된 공백을 하나로
      .trim();

    // 컨텐츠 선택자 수정
    const content = cheerio.outerHtml('main') || cheerio.outerHtml('body');

    let markdown = `---\ntitle: ${title}\nemail: ${email}\nsource: ${source}\ntags:\n  - aichat/perplexity\n---\n\n`;
    markdown += convertPerplexityHtmlToMarkdown(content);

    return {
      title: title.substring(0, 100), // 제목 길이 제한
      content,
      markdown,
    };
  } finally {
    await chrome.close();
  }
};

export { fetchFromPerplexity };

const html = loadFile(
  './downloads/perplexity_옵시디언에서 youtube 동영상 재생을 위한 css를 만들어주세요..markdown-preview-view....html'
);
// console.log(html);
const markdown = convertPerplexityHtmlToMarkdown(html);
// console.log(markdown);
saveFile('./downloads/perplexity_2.md', markdown);
