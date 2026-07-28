/**
 * Long Works（手がけた映像）一覧
 *
 * youtubeId / vimeoId / videoUrl のいずれかを指定する。
 * thumbnail は public/ からの絶対パス（例: '/assets/doshin_thumbnail.jpeg'）。
 * credits は「役割: 名前」で、モーダル下部にそのまま並ぶ。
 */
export const works = [
  {
    id: 'vimeo-1165686334',
    vimeoId: '1165686334',
    title: '浅草',
    category: 'Cinematic',
    // TODO: サムネイル画像を用意して public/assets/ に置き、ここのパスを差し替える
    thumbnail: '/Works用のサムネイル画像.jpg',
    credits: {
      'Direction': 'Blanc films',
      'Sound design': 'Kest Studio'
    }
  }
];

export default works;
