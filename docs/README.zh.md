![Housefly 标志](/apps/tutorial/public/housefly-logo.png)

# Housefly: 一个实践网络爬虫的平台

Housefly 是一个交互式学习项目，旨在通过结构化的挑战来教授网络爬虫技术。每一章都包含一个专门构建的网站，供你爬取，使你可以在受控的环境中进行实践。

## 功能

* 真实的网络爬虫挑战 – 使用专为爬取而建的网站。
* 结构化学习 – 通过指导练习逐步进步。
* 自动解决方案检查 – 验证你的爬虫是否与预期输出一致。

## 开始使用

1. 克隆仓库

```sh
git clone https://github.com/jonaylor89/housefly.git
cd housefly
```

2. 进入第一章

每一章都包含一个简单的网站供爬取，以及一个定义正确输出的 `expected.txt` 文件。

3. 编写你的爬虫

在相应的 `solution{number}/` 目录中实现你的解决方案。

4. 检查你的答案

运行验证脚本，将你的爬虫输出与 expected.txt 进行比较：

```sh
# npx install playwright (某些练习可选)
npm run ca 1
```

5. 添加环境变量（可选）

一些挑战需要第三方API，例如OpenAI，对于这些挑战，有一个 `.env.template` 文件，你可以填写并重命名为 `.env` 来使用它们

```
mv .env.template .env
```

## 项目结构

```
housefly/
├── apps/
│   ├── chapter1/  # 第一章的网站
│   │   ├── index.html
│   │   ├── package.json
│   ├── chapter2/
│   ├── chapter3/
│   ├── solution1/  # 在这里放置你的第一章解决方案
│   │   ├── expected.(txt, csv, json)
│   │   ├── index.ts
│   │   ├── package.json
├── scripts/
│   ├── check_answers.sh  # 用于验证解决方案的脚本
```

## 贡献

欢迎 pull requests 和建议！如果有错误报告或功能请求，请随时提出问题。

## 许可证

MIT 许可证

## 准备好开始爬取了吗？

👉 [立即试用 Housefly](https://housefly.cc)


## 免责声明

这仅供教育目的，对不希望被爬取的网站进行网络爬取可能会违反服务条款，如果以工业规模进行，可能会给你带来麻烦