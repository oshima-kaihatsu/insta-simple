# Facebook/Instagram アプリレビュー再申請ガイド

## 📋 前回の申請却下理由と対策

### 主な問題点
1. **誤った認証フロー**: FacebookログインではなくInstagram Business Loginが必要
2. **権限表示の不備**: instagram_business_basic権限が認証ダイアログに表示されていない
3. **プライバシーポリシー未表示**: OAuthダイアログにプライバシーポリシーが表示されていない
4. **プロファイル管理機能の不足**: アプリ内でInstagram Businessアカウントのプロファイル管理機能が未実装

## ✅ 実装済みの対策

### 1. Instagram Business Login の実装
- `/api/instagram/connect` エンドポイントを修正
- 正しい権限スコープ: `instagram_business_basic,instagram_business_manage_insights,pages_show_list,pages_read_engagement`
- OAuthパラメータに `display: 'popup'` と `auth_type: 'reauthorize'` を追加

### 2. Instagram Businessプロファイル管理ページ
- `/instagram-profile` に専用ページを作成
- 以下の機能を実装:
  - Instagram Business アカウントのID/ユーザー名表示
  - 基本メタデータ（プロファイル画像、名前、バイオグラフィー）の表示
  - フォロワー数、フォロー数、投稿数の統計表示
  - アクセストークンと権限スコープの表示（審査デモ用）

### 3. ダッシュボードの改善
- プロファイル管理ページへのリンクボタンを追加
- Instagram連携状態の明確な表示

## 🎥 スクリーンキャスト要件

### 必須デモンストレーション内容

#### 1. 完全なInstagram Business Loginプロセス
```
手順:
1. アプリのトップページまたはダッシュボードを表示
2. 「Instagram連携を開始」ボタンをクリック
3. Facebook/Instagram OAuthダイアログが表示される
   - URLが https://www.facebook.com/v23.0/dialog/oauth であることを確認
   - instagram_business_basic権限が表示されていることを確認
   - プライバシーポリシーのリンクが表示されていることを確認
4. 「続ける」をクリックして権限を許可
5. アプリにリダイレクトされることを確認
```

#### 2. プライバシーポリシーの表示
```
OAuthダイアログ内で:
- プライバシーポリシーへのリンクが明確に表示されている
- リンクをクリックすると実際のプライバシーポリシーページが開く
```

#### 3. Instagram Businessプロファイル管理
```
認証後:
1. ダッシュボードの「プロファイル管理」ボタンをクリック
2. /instagram-profile ページが表示される
3. 以下の情報が表示されることを確認:
   - Instagram Business アカウントID
   - ユーザー名（@username形式）
   - プロファイル画像
   - アカウントタイプ（BUSINESS）
   - フォロワー数、フォロー数、投稿数
```

#### 4. 基本メタデータの取得
```
プロファイル管理ページで:
- Graph API経由で取得した実際のデータが表示される
- アクセストークンが有効であることを示す
- instagram_business_basic権限が付与されていることを表示
```

## 📝 申請時のノート記載内容

以下の内容を英語で記載してください：

```
Thank you for your feedback. We have made the following improvements:

1. **Instagram Business Login Implementation**
   - Properly implemented Instagram Business authentication flow
   - The OAuth dialog now correctly shows "instagram_business_basic" permission
   - Privacy policy link is prominently displayed in the authentication dialog

2. **Profile Management Section**
   - Added dedicated Instagram Business profile management page (/instagram-profile)
   - Displays Instagram Business account ID and username
   - Shows basic metadata: profile picture, bio, follower count, following count, media count
   - All data is retrieved using Graph API v23.0 with instagram_business_basic permission

3. **Use Case Clarification**
   - Our app helps businesses analyze their Instagram performance
   - instagram_business_basic permission is essential for:
     * Retrieving business account profile information
     * Displaying account statistics to users
     * Providing insights into account growth
   - This enhances user experience by providing real-time account data

The screencast demonstrates:
- Complete Instagram Business Login flow
- Privacy policy display in OAuth dialog
- instagram_business_basic permission request
- Profile management functionality within the app
- Successful retrieval of Instagram Business account metadata
```

## 🚀 申請前チェックリスト

- [ ] Facebook App設定でプライバシーポリシーURLが設定されている
- [ ] 有効なOAuth Redirect URIが設定されている
- [ ] Instagram Business Loginが正しく動作する
- [ ] プロファイル管理ページが正しくデータを表示する
- [ ] スクリーンキャストが全要件を満たしている
- [ ] 申請ノートが明確で具体的である

## 📌 重要な注意事項

1. **テストアカウント**: 実際のInstagram Businessアカウントを使用してデモを行う
2. **画質**: スクリーンキャストは高解像度で、テキストが読みやすいこと
3. **音声説明**: 可能であれば英語で各ステップを説明
4. **編集**: 不要な待ち時間はカットし、重要な部分に焦点を当てる

## 🔗 関連リソース

- Facebook App Dashboard: https://developers.facebook.com/apps/
- Instagram Graph API Documentation: https://developers.facebook.com/docs/instagram-api
- App Review Guidelines: https://developers.facebook.com/docs/app-review

## 💡 追加の推奨事項

1. **段階的な権限リクエスト**: 最初は最小限の権限のみを申請し、承認後に追加権限を申請
2. **明確なユースケース**: ビジネス価値とユーザー体験の向上を強調
3. **コンプライアンス**: FacebookとInstagramの利用規約を厳守していることを明記

---

このガイドに従って再申請を行うことで、アプリレビューの承認確率が大幅に向上します。