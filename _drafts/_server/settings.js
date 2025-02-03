import dotenv from 'dotenv';

dotenv.config({ path: '../.env' });

const { GOOGLE_ACCOUNT, GOOGLE_EMAIL, GOOGLE_SCOPE_DIR, GOOGLE_AUTH_DIR, GOOGLE_AUTH_TYPE, CHROME_USER_DATA_DIR } =
  process.env;
const defaultEmail = GOOGLE_EMAIL;

const chromeOptions = {
  default: {
    headless: false,
    email: GOOGLE_EMAIL,
    userDataDir: CHROME_USER_DATA_DIR,
  },
  daum: {
    headless: false,
    email: GOOGLE_EMAIL,
    userDataDir: CHROME_USER_DATA_DIR,
  },
};

const googleAuthOptions = (user = GOOGLE_ACCOUNT) => {
  return {
    user, //
    type: GOOGLE_AUTH_TYPE,
    scopeDir: GOOGLE_SCOPE_DIR,
    authDir: GOOGLE_AUTH_DIR,
  };
};

// ----------------

const selectors = {
  poordoctor: {
    title: '#primaryContent > div.bbs_read_tit > strong > span',
    author: '#primaryContent > div.bbs_read_tit > div.info_desc > div.cover_info > a',
    views: '#primaryContent > div.bbs_read_tit > div.info_desc > div.cover_info > span:nth-child(2)',
    content: '#bbs_contents',
  },
};

export { selectors, chromeOptions, defaultEmail, googleAuthOptions };
