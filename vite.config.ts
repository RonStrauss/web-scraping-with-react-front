import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve:{alias: {
    "xmlhttprequest-ssl": "./node_modules/engine.io-client/lib/xmlhttprequest.js"
  }
}

})

// alias is for socket io not working in dev mode
