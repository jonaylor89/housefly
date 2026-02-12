![Housefly ロゴ](/apps/tutorial/public/housefly-logo.png)

# Housefly: 実践的なWebスクレイピング学習環境

Houseflyは、構造化された課題を通じてWebスクレイピングを教えるために設計されたインタラクティブな学習プロジェクトです。各章には専用に構築されたウェブサイトが含まれており、制御された環境で練習することができます。

## 特徴

* 現実的なWebスクレイピングの課題 – 目的に合わせて構築されたウェブサイトで作業します。
* 構造化された学習 – ガイド付き演習を通じて段階的に進みます。
* 自動解答チェック – スクレイパーの出力を期待される結果と照合します。

## 始め方

1. リポジトリをクローンする

```sh
git clone https://github.com/jonaylor89/housefly.git
cd housefly
```

2. 第1章に移動する

各章には、スクレイピング用の簡単なウェブサイトと、正しい出力を定義する`expected.txt`ファイルが含まれています。

3. スクレイパーを作成する

対応する`solution{number}/`ディレクトリ内にソリューションを実装します。

4. 答えをチェックする

検証スクリプトを実行して、スクレイパーの出力をexpected.txtと比較します：

```sh
# npx install playwright (一部の演習ではオプション)
npm run ca 1
```

5. 環境変数を追加する（オプション）

一部の課題ではOpenAIなどのサードパーティAPIが必要で、これらについては`.env.template`ファイルがあります。これを記入して`.env`に名前を変更して使用します

```
mv .env.template .env
```

## プロジェクト構造

```
housefly/
├── apps/
│   ├── chapter1/  # 第1章のウェブサイト
│   │   ├── index.html
│   │   ├── package.json
│   ├── chapter2/
│   ├── chapter3/
│   ├── solution1/  # ここに第1章のソリューションを配置
│   │   ├── expected.(txt, csv, json)
│   │   ├── index.ts
│   │   ├── package.json
├── scripts/
│   ├── check_answers.sh  # ソリューションを検証するスクリプト
```

## 貢献

プルリクエストや提案を歓迎します！バグ報告や機能リクエストについては、お気軽にIssueをオープンしてください。

## ライセンス

MITライセンス

## スクレイピングを始める準備はできましたか？

👉 [今すぐHouseflyを試す](https://housefly.cc)


## 免責事項

これは教育目的であり、スクレイピングを望まないウェブサイトでのWebスクレイピングは利用規約に違反する可能性があり、産業規模で行われた場合、問題を引き起こす可能性があります