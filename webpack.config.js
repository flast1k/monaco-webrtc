import path from 'path'
import { fileURLToPath } from 'url'
import NodePolyfillPlugin from 'node-polyfill-webpack-plugin'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

export default {
  mode: 'development',
  devtool: 'source-map',
  plugins: [
    new NodePolyfillPlugin()
  ],
  entry: {
    monaco: './demo/index.js',
    'editor.worker': 'monaco-editor/esm/vs/editor/editor.worker.js',
    'json.worker': 'monaco-editor/esm/vs/language/json/json.worker',
    'css.worker': 'monaco-editor/esm/vs/language/css/css.worker',
    'html.worker': 'monaco-editor/esm/vs/language/html/html.worker',
    'ts.worker': 'monaco-editor/esm/vs/language/typescript/ts.worker'
  },
  resolve: {
  },
  devServer: {
    compress: true,
    static: {
      directory: path.join(__dirname, 'demo')
    }
  },
  output: {
    globalObject: 'self',
    filename: '[name].bundle.js',
    path: path.resolve(__dirname, 'dist'),
    publicPath: '/dist/'
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader']
      },
      {
        test: /\.ttf$/,
        use: ['file-loader']
      }
    ]
  }
}