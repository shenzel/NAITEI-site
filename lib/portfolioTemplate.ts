// テンプレートに渡すデータの型を定義します
// これにより、どんなデータが必要か明確になり、コードの安全性が高まります。
interface PortfolioData {
  yourName: string;
  catchphrase: string;
  strengthAndWeakness: string;
  mostDevotedThing: string;
  companyAttraction: string;
}

// HTML文字列を生成して返す関数
export const generatePortfolioHTML = (data: PortfolioData): string => {
  // dataオブジェクトから各値を取り出す
  const { yourName, catchphrase, strengthAndWeakness, mostDevotedThing, companyAttraction} = data;

  // ここにHTMLテンプレートを記述します
  // ${data.yourName} のようにして動的な値を埋め込みます
  return `
<!DOCTYPE html>
<html lang="ja">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${yourName}のポートフォリオサイト</title>
  <style>
    body { font-family: 'Helvetica Neue', 'Arial', 'Hiragino Kaku Gothic ProN', 'Hiragino Sans', Meiryo, sans-serif; line-height: 1.8; color: #333; background-color: #f9f9f9; }
    .container { max-width: 800px; margin: 40px auto; padding: 40px; background-color: #fff; border-radius: 8px; box-shadow: 0 4px 15px rgba(0,0,0,0.05); }
    h1, h2 { border-bottom: 2px solid #0070f3; padding-bottom: 10px; }
    h1 { font-size: 2.5em; text-align: center; margin-bottom: 10px; }
    .catchphrase { text-align: center; font-size: 1.2em; color: #555; margin-bottom: 40px; }
    .faq-section { margin-top: 50px; }
    .faq-item { margin-bottom: 30px; }
    .faq-item h3 { font-size: 1.2em; color: #0070f3; margin-bottom: 10px; padding-left: 1em; border-left: 4px solid #0070f3; }
    .faq-item p { padding: 10px; background-color: #f3f3f3; border-radius: 5px; white-space: pre-wrap; } /* white-spaceで改行を反映 */
  </style>
</head>
<body>
  <div class="container">
    <h1>${yourName}</h1>
    <p class="catchphrase">${catchphrase}</p>

    <div class="faq-section">
      <h2>よくあるご質問 (FAQ)</h2>

      <div class="faq-item">
        <h3>あなたの長所と短所を教えてください。</h3>
        <p>${strengthAndWeakness.replace(/\n/g, '<br>')}</p>
      </div>

      <div class="faq-item">
        <h3>学生時代に最も打ち込んだことは何ですか？</h3>
        <p>${mostDevotedThing.replace(/\n/g, '<br>')}</p>
      </div>

      <div class="faq-item">
        <h3>当社のどのような点に魅力を感じましたか？</h3>
        <p>${companyAttraction.replace(/\n/g, '<br>')}</p>
      </div>
    </div>
  </div>
</body>
</html>
  `;
};