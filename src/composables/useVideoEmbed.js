/**
 * 作品データから埋め込み用の URL を組み立てる。
 *
 * データ側は youtubeId / vimeoId / videoUrl のいずれかを持つ。
 * YouTube はプライバシー強化モード（youtube-nocookie）を使う。
 */
export function buildEmbedUrl(video) {
  if (!video) return '';

  if (video.youtubeId) {
    return `https://www.youtube-nocookie.com/embed/${video.youtubeId}?autoplay=1&rel=0`;
  }
  if (video.vimeoId) {
    return `https://player.vimeo.com/video/${video.vimeoId}?autoplay=1&title=0&byline=0&portrait=0`;
  }
  return video.videoUrl ?? '';
}

/**
 * 一覧に出すサムネイル。
 * 独自画像があればそれを、なければ YouTube の自動サムネイルを使う。
 */
export function buildThumbnailUrl(video) {
  if (!video) return '';
  if (video.thumbnail) return video.thumbnail;
  if (video.youtubeId) return `https://img.youtube.com/vi/${video.youtubeId}/hqdefault.jpg`;
  return '';
}
