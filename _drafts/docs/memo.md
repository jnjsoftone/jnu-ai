## 기능

### web-scraper

#### data flow

- url -> html -> markdown -> 
              -> images, files

#### 기능 개요
- 웹 페이지 url이 입력되면, 페이지 내용을 스크래핑하여, html, markdown 파일 + 이미지, 첨부 파일 저장
- 웹 페이지 url에 따라, 스크래핑 하는 방법 지정
  - 스크래핑 방법: fetchSimple, fetchWithRedirect, fetchWithChrome, fetchWithLogin
- pattern 설정
  - 패턴 설정에 따라, 스크래핑 방법 지정

const blog_naver = {
  name: 'blog/naver',
  url: ['blog.naver.com'],
  downloads: {
    path: 'blog/naver',
    scripts: false,
    styles: false,
    images: true,
    files: true,
  },
  // * 스크래핑 방법
  fetch: {
    type: 'fetchWithRedirect',
    callback: 'fetchWithRedirect_naverBlog',
  },
  // * properties(frontmatter에 사용) 내용 추출 규칙
  properties: {
    title: {
      selector: "meta[property='og:title']",
      attribute: 'content',
    },
    author: {
      selector: "meta[property='naverblog:nickname']",
      attribute: 'content',
    },
    published: {
      selector: '.date',
      attribute: 'text',
    },
    description: {
      selector: "meta[property='og:description']",
      attribute: 'content',
      callback: 'decodeHtmlEntities',
    },
    tags: {
      value: ['clipping/blog/naver'],
    },
    clipped: {
      callback: 'today',
    },
  },
  // html 추출 Root Selector
  rootSelector: '#postListBody',
  // html 추출 제거 Selector
  removeSelectors: ['script', 'style', '.revenue_unit_wrap', '.na_ad'],
  // html 추출 결과 파일 생성 규칙(callback)
  postHtml: 'postHtml_naver',
  // frontmatter 생성 규칙(callback)
  preFrontmatter: 'preFrontmatter_naver',
  // markdown 생성 규칙(callback)
  postMarkdown: 'postMarkdown_naver',
};


## 개발 환경

- 