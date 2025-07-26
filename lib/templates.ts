interface PortfolioData {
  yourName: string;
  hometown: string;
  university: string;
  faculty: string;
  dream: string;
  hobby: string[];
  skill: string[];
  self_pr: string;
}


const getHtml = (data: PortfolioData, imageFileName?: string) => {
  const imageTag = imageFileName ? `<img src="img/${imageFileName}" alt="プロフィール写真" class="profile-image">` : '';

  // ▼▼▼ hobbyとskillのリストを動的に生成 ▼▼▼
  const hobbyList = data.hobby.map(item => `<li>${item}</li>`).join('');
  const skillList = data.skill.map(item => `<li>${item}</li>`).join('');

  // ▼▼▼ CSSのパスを "style.css" に、JSのパスを "script.js" に統一 ▼▼▼
  const html = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="style.css">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@100..900&family=Noto+Serif+JP:wght@200..900&display=swap" rel="stylesheet">
    <script src="https://kit.fontawesome.com/8036d0d404.js" crossorigin="anonymous"></script>
    <script src="static/js/main.js"></script>
    <title>NAITEI.site</title>
</head>
<body>
    <!-- Navigation -->
    <nav>
        <div class="container navigation">
            <img class="logo" src="img/logo.png" alt="logo"> 
            <div class="language">
                <img src="img/english-icon.png" alt="English" class="flag">
                <a href="/">English</a>
                <i class="fa-solid fa-chevron-up"></i>
            </div>
        </div>
    </nav>

    <section class="basic-info">
        <div class="container">

            <!-- First Block -->
            <div class="first-block section-divider">
                ${imageTag}
                <div class="profile-text">
                    <div class="profile-row">
                        <div class="profile-label">名前</div>
                        <div class="profile-colon">:</div>
                        <!-- 変数 -->
                        <div class="profile-value">${data.yourName}</div>
                    </div>
                    <div class="profile-row">
                        <div class="profile-label">出身地</div>
                        <div class="profile-colon">:</div>
                        <!-- 変数 -->
                        <div class="profile-value">${data.hometown}</div>
                    </div>
                    <div class="profile-row">
                        <div class="profile-label">大学</div>
                        <div class="profile-colon">:</div>
                        <!-- 変数 -->
                        <div class="profile-value">${data.university}</div>
                    </div>
                    <div class="profile-row">
                        <div class="profile-label">学部/学科</div>
                        <div class="profile-colon">:</div>
                        <!-- 変数 -->
                        <div class="profile-value">${data.faculty}</div>
                    </div>
                    <div class="profile-row">
                        <div class="profile-label">将来の夢</div>
                        <div class="profile-colon">:</div>
                        <!-- 変数 -->
                        <div class="profile-value">${data.dream}</div>
                    </div>
                </div>
            </div>

            <!-- Second Block -->
            <div class="second-block section-divider">
                <div class="second-box-wrapper">
                    <h2 class="header">趣味</h2>
                    <div class="second-box">
                        <ul>
                          ${hobbyList}
                        </ul>
                    </div>
                </div>

                <div class="second-box-wrapper">
                    <h2 class="header">スキル・資格</h2>
                    <div class="second-box">
                        <ul>
                          ${skillList}
                        </ul>
                    </div>
                </div>
            </div>

            <!-- Third Block -->
            <div class="third-block section-divider">
                <h2 class="header">自己PR</h2>
                <div class="text-box">
                    <!-- 変数　改行どうすればいいかな？ -->
                    <p>
                    ${data.self_pr}
                    </p>
                </div>
            </div>
        </div>

        <!-- Footer -->
            <footer>
                <p>&copy;NAITEI.site 2025 All rights reserved.</p>
            </footer>
    </section>

</body>
</html>`;

return html
}
// --- テンプレート1: スタイリッシュ ---
const generatePatern = (data: PortfolioData, imageFileName?: string) => {

  const html = getHtml(data, imageFileName)

  const js = `document.addEventListener('DOMContentLoaded', () => {
  console.log('ポートフォリオサイトへようこそ！');
});`;
  return { html, js };
};


// --- エクスポート部分 ---
export const templates = {
  first: {
    name: '色1 ✨',
    generate: generatePatern,
    cssPath: '/css/pattern1.css'
  },
  second: {
    name: '色2 📄',
    generate: generatePatern,
    cssPath: '/css/pattern2.css'
  },
  third: {
  name: '色3 📄',
  generate: generatePatern,
  cssPath: '/css/pattern3.css'
  },
  forth: {
    name: '色1 ✨',
    generate: generatePatern,
    cssPath: '/css/pattern1.css'
  },
  fifth: {
    name: '色2 📄',
    generate: generatePatern,
    cssPath: '/css/pattern2.css'
  },
  sixth: {
  name: '色3 📄',
  generate: generatePatern,
  cssPath: '/css/pattern3.css'
  },
};

export type TemplateKey = keyof typeof templates;