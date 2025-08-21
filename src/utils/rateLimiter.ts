interface RateLimitStore {
  [key: string]: {
    count: number;
    resetTime: number;
  };
}

class RateLimiter {
  private store: RateLimitStore = {};
  private windowMs: number;
  private maxRequests: number;

  constructor(windowMs: number = 15 * 60 * 1000, maxRequests: number = 100) {
    this.windowMs = windowMs; // 15分間
    this.maxRequests = maxRequests; // 最大100リクエスト
  }

  // IPアドレスベースのレート制限
  async isRateLimited(identifier: string): Promise<{ limited: boolean; remainingRequests?: number; resetTime?: number }> {
    const now = Date.now();
    const userRecord = this.store[identifier];

    // 初回アクセスまたは時間窓がリセット
    if (!userRecord || now > userRecord.resetTime) {
      this.store[identifier] = {
        count: 1,
        resetTime: now + this.windowMs
      };
      return { 
        limited: false, 
        remainingRequests: this.maxRequests - 1,
        resetTime: now + this.windowMs
      };
    }

    // リクエスト回数を増加
    userRecord.count++;

    // 制限チェック
    if (userRecord.count > this.maxRequests) {
      return { 
        limited: true,
        remainingRequests: 0,
        resetTime: userRecord.resetTime
      };
    }

    return { 
      limited: false,
      remainingRequests: this.maxRequests - userRecord.count,
      resetTime: userRecord.resetTime
    };
  }

  // 古いエントリを定期的にクリア（メモリリーク防止）
  cleanup() {
    const now = Date.now();
    Object.keys(this.store).forEach(key => {
      if (now > this.store[key].resetTime) {
        delete this.store[key];
      }
    });
  }
}

// シングルトンインスタンス
export const rateLimiter = new RateLimiter(
  15 * 60 * 1000, // 15分
  100 // 100リクエスト
);

// 定期クリーンアップ（1時間ごと）
if (typeof setInterval !== 'undefined') {
  setInterval(() => {
    rateLimiter.cleanup();
  }, 60 * 60 * 1000);
}