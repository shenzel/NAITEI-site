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

// --- テンプレート1: スタイリッシュ ---
const generateStylishContent = (data: PortfolioData, imageFileName?: string) => {
  const imageTag = imageFileName ? `<img src="img/${imageFileName}" alt="プロフィール写真" class="profile-image">` : '';

  // ▼▼▼ hobbyとskillのリストを動的に生成 ▼▼▼
  const hobbyList = data.hobby.map(item => `<li>${item}</li>`).join('');
  const skillList = data.skill.map(item => `<li>${item}</li>`).join('');

  // ▼▼▼ CSSのパスを "style.css" に、JSのパスを "script.js" に統一 ▼▼▼
  const html = `<!DOCTYPE html>
<html lang="ja">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <link rel="stylesheet" href="style.css">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@100..900&display=swap" rel="stylesheet">
  <title>${data.yourName}のポートフォリオ</title>
</head>
<body>
  <div class="container">
    <div class="first-block section-divider">
      ${imageTag}
      <div class="profile-text">
        <div class="profile-row"><div class="profile-label">名前</div><div class="profile-colon">:</div><div class="profile-value">${data.yourName}</div></div>
        <div class="profile-row"><div class="profile-label">出身地</div><div class="profile-colon">:</div><div class="profile-value">${data.hometown}</div></div>
        <div class="profile-row"><div class="profile-label">大学</div><div class="profile-colon">:</div><div class="profile-value">${data.university}</div></div>
        <div class="profile-row"><div class="profile-label">学部/学科</div><div class="profile-colon">:</div><div class="profile-value">${data.faculty}</div></div>
        <div class="profile-row"><div class="profile-label">将来の夢</div><div class="profile-colon">:</div><div class="profile-value">${data.dream}</div></div>
      </div>
    </div>
    <div class="second-block section-divider">
      <div class="second-box-wrapper"><h2 class="header">趣味</h2><div class="second-box"><ul>${hobbyList}</ul></div></div>
      <div class="second-box-wrapper"><h2 class="header">スキル・資格</h2><div class="second-box"><ul>${skillList}</ul></div></div>
    </div>
    <div class="third-block section-divider">
      <h2 class="header">自己PR</h2>

      <div class="text-box"><p>${data.self_pr.replace(/\n/g, '<br>')}</p></div>
    </div>
  </div>
  <script src="script.js"></script>
</body>
</html>`;

  const css = `/* General */
* {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
}

html {
    font-size: 10px;
}

body {
    line-height: 1.4;
    font-weight: 400;
    font-family: "Noto Sans JP", sans-serif;
    font-weight: 400;
}
.container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 10px;
}
.section-divider {
    margin: 60px 0;
}
.header {
    font-size: 3.5rem;
    font-weight: 500;
    text-align: center;
}

/* Navigation */
nav {
    background-color: #3A506B;
}
.navigation {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 10px 0;
}
.logo {
    width: 200px;
    height: auto;
}
.language {
    display: flex;
    align-items: center;
    gap: 10px;
    background-color: #6FFFE9;
    border-radius: 50px;
    padding: 10px 20px;
    font-size: 1.6rem;
    font-weight: 500;
}
.language a {
    color: black;
    text-decoration: none;
    font-size: 2.0rem;
}
.flag {
    width: 30px;
    height: auto;
}

/* First Block */
.basic-info {
    background-color: #0B132B;
    padding-top: 40px;
    color: white;
}
.first-block {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 40px;
}
.profile-image {
    width: 30%;
    border-radius: 30px;;
}
.profile-text {
    background-color: #3A506B;
    padding: 30px;
    border-radius: 30px;
    font-size: 2.8rem;
    font-weight: 500;
    align-items: center;
    justify-content: center;
}
.profile-row {
    display: grid;
    grid-template-columns: 6em 1em auto;
    margin-bottom: 1.8rem;
    align-items: center;
    gap: 15px;
}
.profile-label {
    text-align: right;

}
.profile-colon {
    text-align: center;
}

.profile-value {
    text-align: left;
}

/* Second Block */
.second-block {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 40px;
}
.second-box-wrapper {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 20px;
    width: 100%;
}
.second-box {
    background-color: #3A506B;
    padding: 40px;
    border-radius: 30px;
    font-size: 2.2rem;
    font-weight: 500;
    width: 100%;
    height: auto;
    color: black;
    display: flex;
    justify-content: center;
    align-items: center;
}
.second-box ul {
    list-style: none;
    display: flex;
    flex-wrap: wrap;
    gap: 20px;
    justify-content: center;
}
.second-box li {
    background-color: #6FFFE9;
    border-radius: 20px;    
    padding: 5px 20px;
}
.text-box {
    background-color: #3A506B;
    padding: 50px;
    border-radius: 30px;
    font-size: 2.2rem;
    font-weight: 400;
    width: 100%;
    height: auto;
}

/* Footer */
footer {
    background-color: #3A506B;
    color: white;
    text-align: center;
    padding: 20px 0;
    font-size: 2.3rem;
    font-weight: 3;
}`;

  const js = `document.addEventListener('DOMContentLoaded', () => {
  console.log('ポートフォリオサイトへようこそ！');
});`;

  return { html, css, js };
};

// --- テンプレート2: シンプル ---
const generateSimpleContent = (data: PortfolioData, imageFileName?: string) => {
  const imageTag = imageFileName
    ? `<img src="img/${imageFileName}" alt="プロフィール写真" class="profile-image">`
    : '';

  const html = `<!DOCTYPE html>
<html lang="ja">
<head>
  <meta charset="UTF-8">
  <title>${data.yourName}のポートフォリオ</title>
  <link rel="stylesheet" href="style.css">
</head>
<body>
  <div class="container">
    ${imageTag}
    <h1>${data.yourName}</h1>
    <hr>
    <h2>プロフィール</h2>
    <ul>
      <li><strong>大学:</strong> ${data.university} ${data.faculty}</li>
      <li><strong>出身:</strong> ${data.hometown}</li>
      <li><strong>将来の夢:</strong> ${data.dream}</li>
      <li><strong>趣味:</strong> ${data.hobby.join('、 ')}</li>
    </ul>
  </div>
  <script src="script.js"></script>
</body>
</html>`;
  
  const css = `body {
  font-family: "MS PMincho", "Hiragino Mincho ProN", serif;
  line-height: 2;
  color: #222;
}
.container {
  max-width: 720px;
  margin: 30px auto;
  padding: 20px;
  border: 1px solid #ccc;
}
h1 {
  font-size: 2em;
  text-align: center;
  margin-bottom: 10px;
}
h2 {
  font-size: 1.5em;
  border-bottom: 1px solid #ccc;
  padding-bottom: 5px;
  margin-top: 20px;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  margin-bottom: 10px;
}
.profile-image {
  display: block;
  width: 120px;
  height: 120px;
  margin: 0 auto 30px;
}`;

  const js = `console.log('ページが読み込まれました。');`;

  return { html, css, js };
};


// --- エクスポート部分 ---
export const templates = {
  stylish: {
    name: 'スタイリッシュ ✨',
    generate: generateStylishContent,
  },
  simple: {
    name: 'シンプル 📄',
    generate: generateSimpleContent,
  },
};

export type TemplateKey = keyof typeof templates;