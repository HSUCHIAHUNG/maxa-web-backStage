// import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import store from './stores/index'
import { Provider } from 'react-redux'
import "@arco-design/web-react/dist/css/arco.css";
import './assets/index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  // <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  // </React.StrictMode>,
)
