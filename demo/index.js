/* eslint-env browser */

import * as Y from 'yjs'
import { WebrtcProvider } from '../src/y-webrtc.js'
// @ts-ignore
import { MonacoBinding } from 'y-monaco'
import * as monaco from 'monaco-editor'
import { Centrifuge } from 'centrifuge'

self.MonacoEnvironment = {
  getWorkerUrl: function (moduleId, label) {
    if (label === 'json') {
      return '/dist/json.worker.bundle.js'
    }
    if (label === 'css' || label === 'scss' || label === 'less') {
      return '/dist/css.worker.bundle.js'
    }
    if (label === 'html' || label === 'handlebars' || label === 'razor') {
      return '/dist/html.worker.bundle.js'
    }
    if (label === 'typescript' || label === 'javascript') {
      return '/dist/ts.worker.bundle.js'
    }
    return '/dist/editor.worker.bundle.js'
  }
}

window.addEventListener('load', () => {
  const ydoc = new Y.Doc()
  const centrifuge = new Centrifuge('ws://127.0.0.1:8089/connection/websocket', {
    token: 'YOUR_TOKEN',
    websocket: window.WebSocket
  })
  centrifuge
    .on('connecting', function (ctx) {
      console.log(`connecting: ${ctx.code}, ${ctx.reason}`)
    })
    .on('connected', function (ctx) {
      console.log(`connected over ${ctx.transport}`)
    })
    .on('disconnected', function (ctx) {
      console.log(`disconnected: ${ctx.code}, ${ctx.reason}`)
    })
    .connect()

  const sub = centrifuge.newSubscription('signal')

  sub
    .on('publication', function (ctx) {
      console.log('publication', ctx.data)
    })
    .on('subscribing', function (ctx) {
      console.log(`subscribing: ${ctx.code}, ${ctx.reason}`)
    })
    .on('subscribed', function (ctx) {
      console.log('subscribed', ctx)
    })
    .on('unsubscribed', function (ctx) {
      console.log(`unsubscribed: ${ctx.code}, ${ctx.reason}`)
    })
    .subscribe()
  const provider = new WebrtcProvider('monaco', ydoc)
  const type = ydoc.getText('monaco')

  const editor = monaco.editor.create(/** @type {HTMLElement} */ (document.getElementById('monaco-editor')), {
    value: '',
    language: 'javascript',
    theme: 'vs-dark'
  })
  const monacoBinding = new MonacoBinding(type, /** @type {monaco.editor.ITextModel} */ (editor.getModel()), new Set([editor]), provider.awareness)

  const connectBtn = /** @type {HTMLElement} */ (document.getElementById('y-connect-btn'))
  connectBtn.addEventListener('click', () => {
    if (provider.shouldConnect) {
      provider.disconnect()
      connectBtn.textContent = 'Connect'
    } else {
      provider.connect()
      connectBtn.textContent = 'Disconnect'
    }
  })

  // @ts-ignore
  window.example = { provider, ydoc, type, monacoBinding }
})