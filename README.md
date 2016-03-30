# Novelous Extension

[![Build Status](https://travis-ci.org/io-monad/novelous-extension.svg?branch=master)](https://travis-ci.org/io-monad/novelous-extension)

![](app/images/logo.png)

「小説家になろう」「カクヨム」などの小説サイトでの執筆作業をサポートする拡張機能です。

:information_source: 「小説家になろう」は株式会社ヒナプロジェクトの登録商標です。

:construction: Work In Progress!

## 機能

まだ開発中です。

### 各小説サイトの新規投稿画面を開く

以下のような JavaScript を localhost のページ上で実行すると、送信されたメッセージを元に各小説サイトの新規投稿画面に各情報を入力した状態で開きます。

gulp などのタスクランナーからの実行を想定しています。

```js
// Chrome 上で動いている拡張機能のID (拡張機能一覧に書かれている)
var extensionId = "mikejgecmcephkolbcfmlomnnlihhfch";

// このスクリプトが動いているタブを送信後に自動的に閉じる場合は true, 閉じない場合は false
var close = true;

// 小説情報
var title = "小説のタイトル";
var body = "小説の本文\n複数行でも大丈夫";

// 予約投稿する時間（予約投稿しない場合は null）
var time = "2016-03-28T18:00:00+0900";

// 「小説家になろう」の小説ID (小説管理画面 syosetu.com/usernovelmanage/top/ncode/XXXXX/ の XXXXX 部分)
var narouNovelId = "12345";

// 「カクヨム」の小説ID (小説ページ kakuyomu.jp/works/XXXXXXXX の XXXXXXXX 部分)
var kakuyomuNovelId = "12345678901234567890";

// のべらすにメッセージ送信
chrome.runtime.sendMessage(
    extensionId,
    {
        type: "PUBLISH_NOVEL",
        close: close,
        pubs: [
            {
                title: title,
                body: body,
                time: time,
                sites: {
                    narou: { novelId: narouNovelId },
                    kakuyomu: { novelId: kakuyomuNovelId }
                }
            }
        ]
    }
);
```

## ビルド方法

    $ npm install
    $ npm run build

ビルドされた拡張機能は `dist/chrome` 内に生成されます。Chrome の拡張機能設定画面で「パッケージ化されていない拡張機能を読み込む」から、`dist/chrome` を指定する事で読み込めます。

## タスク

### ビルド

すべてビルドして `dist` ディレクトリ以下に出力します。

	$ gulp

| オプション | 説明 |
| ---------- | ---- |
| `--watch` | ファイルの変更を監視して継続的にビルドします |
| `--production` | 本番向けにビルドします（minify などを行います） |
| `--verbose` | ログ出力を詳細にします |
| `--vendor` | 他のブラウザ向けにビルドします (chrome, moz, opera)  デフォルト: chrome |
| `--sourcemaps` | ソースマップを強制的に作成します. デフォルト: !production |

### テスト

ユニットテストを実行します。

    $ gulp test

| オプション | 説明 |
| ---------- | ---- |
| `--watch` | ファイルの変更を監視して継続的にテストします |
| `--verbose` | ログ出力を詳細にします |
| `--serial` | テストの実行を並列的ではなく直列的に行います |

### パック

本番向けの zip ファイル (または xpi ファイル) を `packages` ディレクトリ内に生成します。

	$ npm run pack:chrome   // For Chrome
	$ npm run pack:moz      // For Firefox
	$ npm run pack:opera    // For Opera

### バージョンバンプ

`manifest.json` と `package.json` にあるバージョンをバンプして、その変更を git リポジトリにコミットし、git のタグを作ります。

    $ gulp patch      // => 0.0.X
    $ gulp feature    // => 0.X.0
    $ gulp release    // => X.0.0

## Contributing

1. Fork it!
2. Create your feature branch: `git checkout -b my-new-feature`
3. Commit your changes: `git commit -am 'Add some feature'`
4. Push to the branch: `git push origin my-new-feature`
5. Submit a pull request :D

## License

MIT (See [LICENSE.txt](LICENSE.txt))
