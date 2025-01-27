import {
  CoAuthor_Novel,
  CoAuthor_Novel_AppendedDate,
  CoAuthor_NovelChapter,
  CoAuthor_NovelChapter_AppendedDate,
} from "./CABaseTypes"

export type ApiV1BaseOut<T> =
  | {
      success: true
      data: T
    }
  | {
      success: false
      error: ApiV1ErrorOut
    }

export type ApiV1ErrorOut = {
  code: string
  message: string
  columns: ApiV1ErrorOutColumn[]
}

export type ApiV1ErrorOutColumn = {
  name: string
  message: string
}

// *************** API レスポンス ***************

export type ApiV1 = {
  User: {
    Get: {
      Out: {
        user: {
          id: string
          email: string
          name: string
        }
      }
    }

    Post: {
      Out: {
        user: {
          id: string
          email: string
          name: string
        }
        status: "EXISTS" | "CREATED"
      }
    }
  }

  UserHistory: {
    Get: {
      Out: {
        /*
         * ユーザーの最新の小説更新トップ5
         */
        latestNovelUpdates: {
          novelId: string
          title: string
          updatedAt: Date
        }[]
      }
    }
  }

  Novel: {
    Post: {
      In: {
        title: string
        summary: string
        novelType: string
      }

      Out: {
        novel: CoAuthor_Novel
      }
    }

    Delete: {
      In: {
        novelId: string
        /** novelIdの先頭4文字 */
        code: string
      }

      Out: {
        novelId: string
      }
    }
  }

  Novels: {
    Get: {
      Out: {
        novels: CoAuthor_Novel_AppendedDate[]
      }
    }
  }

  NovelChapter: {
    Post: {
      In: {
        novelId: string
        title: string
      }

      Out: {
        novelId: string
        chapterId: string
        title: string
      }
    }
  }

  NovelChapterContent: {
    Get: {
      Out: {
        novelId: string
        chapterId: string
        content: string
      }
    }

    /**
     * Contentのみを更新する
     */
    Post: {
      In: {
        novelId: string
        chapterId: string
        content: string
      }

      Out: {
        novelId: string
        chapterId: string
      }
    }
  }

  NovelChapters: {
    Get: {
      Out: {
        novel: CoAuthor_Novel_AppendedDate
        chapters: Omit<CoAuthor_NovelChapter_AppendedDate, "content">[]
      }
    }

    Post: {
      In: {
        novelId: string
        orders: {
          chapterId: string
          order: number
        }[]
      }

      Out: {
        chapters: Omit<CoAuthor_NovelChapter, "content">[]
      }
    }
  }
}
