import React, { useEffect } from 'react';
import { ExternalLink, Download } from 'lucide-react';
import { ModelViewer } from '../components/ModelViewer';

interface ModelInfo {
  id: string;
  name: string;
  file: string;
  description: string;
  tags: string[];
}

interface ModelCategory {
  id: string;
  title: string;
  description: string;
  models: ModelInfo[];
}

const modelCategories: ModelCategory[] = [
  {
    id: 'general',
    title: 'GLB コレクション',
    description:
      'リポジトリに含まれている汎用的なGLBモデルをブラウザ上でプレビューできます。ドラッグで回転、ホイールでズーム、右ドラッグで視点を調整できます。',
    models: [
      {
        id: 'earth',
        name: 'Earth',
        file: '/models/earth.glb',
        description: '青い星・地球の詳細な球体モデル。表面の陰影がわかりやすいようにライティングを調整しています。',
        tags: ['Planet', 'Sci-Fi', 'Education']
      },
      {
        id: 'allpan',
        name: 'All Pan',
        file: '/models/allpan.glb',
        description: '平面状のジオメトリ。背景として使いやすいベースモデルです。',
        tags: ['Environment', 'Asset']
      },
      {
        id: 'satoshi',
        name: 'Satoshi Nakamoto',
        file: '/models/satoshinakamoto.glb',
        description: '人物像のスキャンモデル。質感のチェックに便利です。',
        tags: ['Character', 'Scan']
      },
      {
        id: 'ts-shirt',
        name: 'Tシャツ 3D モデル',
        file: '/models/T-syatsu3.glb',
        description: 'Tシャツの衣装モデル。ファッション系の検証に使用できます。',
        tags: ['Cloth', 'Fashion']
      },
      {
        id: 'wall',
        name: 'Wall',
        file: '/models/wall.glb',
        description: 'シンプルな壁のモデル。マテリアルテストやライティング検証に便利です。',
        tags: ['Environment', 'Architecture']
      }
    ]
  },
  {
    id: 'godsmask',
    title: 'Godsmask シリーズ',
    description: 'ファンタジー風のマスクモデルコレクション。名称にスペースを含むファイルも適切に読み込めるようエンコードしています。',
    models: [
      {
        id: 'amaterasu',
        name: 'Amaterasu Omikami',
        file: encodeURI('/models/Godsmask/Amaterasu Omikami.glb'),
        description: '神話の女神をモチーフにしたマスクモデル。',
        tags: ['Mask', 'Mythology']
      },
      {
        id: 'anubis',
        name: 'Anubis',
        file: '/models/Godsmask/Anubis.glb',
        description: 'エジプト神話のアヌビスを象ったマスク。',
        tags: ['Mask', 'Egypt']
      },
      {
        id: 'ganesha',
        name: 'Ganesha',
        file: '/models/Godsmask/Ganesha.glb',
        description: 'ヒンドゥー教の神ガネーシャをモチーフにした装飾的なマスク。',
        tags: ['Mask', 'Hindu']
      }
    ]
  }
];

const formatDownloadName = (filePath: string) => {
  const parts = filePath.split('/');
  return parts[parts.length - 1] || 'model.glb';
};

export const ModelGalleryPage: React.FC = () => {
  useEffect(() => {
    document.title = 'GLB Model Preview';
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-slate-100">
      <div className="mx-auto flex max-w-6xl flex-col gap-10 px-4 py-12 sm:px-6 lg:px-8">
        <header className="space-y-6 text-center">
          <p className="text-sm font-medium uppercase tracking-[0.3em] text-indigo-300">GLB Viewer</p>
          <h1 className="text-3xl font-bold leading-tight sm:text-4xl">
            リポジトリ内の3Dモデルをブラウザでプレビュー
          </h1>
          <p className="mx-auto max-w-3xl text-base text-slate-300 sm:text-lg">
            下記リストから表示したいモデルを選択すると、Three.js を用いた高品質なビューワーで即座にプレビューできます。
            追加したいファイルは <code className="rounded bg-slate-800 px-2 py-1 text-sm">/public/models</code> に配置してください。
          </p>
          <div className="flex flex-wrap justify-center gap-3 text-xs text-slate-400">
            <span className="flex items-center gap-2 rounded-full border border-slate-700 px-3 py-1">
              <ExternalLink className="h-4 w-4" />
              左クリック &amp; ドラッグで回転
            </span>
            <span className="flex items-center gap-2 rounded-full border border-slate-700 px-3 py-1">
              <ExternalLink className="h-4 w-4" />
              右ドラッグで視点移動
            </span>
            <span className="flex items-center gap-2 rounded-full border border-slate-700 px-3 py-1">
              <ExternalLink className="h-4 w-4" />
              ホイールでズーム
            </span>
          </div>
        </header>

        <section className="space-y-16">
          {modelCategories.map((category) => (
            <div key={category.id} className="space-y-6">
              <div className="space-y-3 text-center sm:text-left">
                <h2 className="text-2xl font-semibold text-white sm:text-3xl">
                  {category.title}
                </h2>
                <p className="text-sm text-slate-300 sm:text-base">{category.description}</p>
              </div>

              <div className="grid gap-8 md:grid-cols-2">
                {category.models.map((model) => (
                  <article
                    key={model.id}
                    className="group flex flex-col gap-5 rounded-2xl border border-slate-800/80 bg-slate-900/60 p-6 shadow-xl shadow-slate-950/40 transition hover:border-indigo-500/60 hover:shadow-2xl hover:shadow-indigo-900/40"
                  >
                    <div className="relative">
                      <div className="overflow-hidden rounded-xl border border-slate-800/80 bg-slate-950/80">
                        <ModelViewer modelUrl={model.file} className="h-80" />
                      </div>
                      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-slate-950/80 via-transparent" />
                    </div>
                    <div className="flex flex-1 flex-col gap-4">
                      <div className="space-y-2">
                        <h3 className="text-xl font-semibold text-white">{model.name}</h3>
                        <p className="text-sm text-slate-300">{model.description}</p>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {model.tags.map((tag) => (
                          <span
                            key={tag}
                            className="rounded-full bg-slate-800/80 px-3 py-1 text-xs font-medium uppercase tracking-wide text-indigo-200"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                      <div className="mt-auto flex flex-wrap gap-3">
                        <a
                          href={model.file}
                          download={formatDownloadName(model.file)}
                          className="inline-flex items-center gap-2 rounded-lg bg-indigo-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-indigo-400"
                        >
                          <Download className="h-4 w-4" />
                          ダウンロード
                        </a>
                        <a
                          href={model.file}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-2 rounded-lg border border-slate-700 px-4 py-2 text-sm font-semibold text-slate-200 transition hover:border-indigo-500 hover:text-indigo-200"
                        >
                          <ExternalLink className="h-4 w-4" />
                          直接表示
                        </a>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          ))}
        </section>

        <footer className="rounded-2xl border border-slate-800/80 bg-slate-900/70 p-6 text-center text-sm text-slate-400">
          モデルファイルを追加した際は、同じディレクトリ構成を維持するだけで自動的にカードが増えるように構造化されています。
          <br className="hidden sm:block" />
          <span className="text-slate-500">（<code>/src/pages/ModelGalleryPage.tsx</code> の配列に追記してください）</span>
        </footer>
      </div>
    </div>
  );
};

export default ModelGalleryPage;
