import './bootstrap'
import '../sass/admin.scss'
import 'jquery-highlight'
import 'datatables.net'
import 'datatables.net-plugins/features/searchHighlight/dataTables.searchHighlight'
import 'mdbootstrap/js/mdb'
import 'mdbootstrap/js/addons/datatables'
import 'mdbootstrap/js/addons/datatables-select'

import React from 'react'
import { AppContainer } from 'react-hot-loader'
import { render } from 'react-dom'
import { BrowserRouter } from 'react-router-dom'

import Root from './employee/Root'

render(
  <AppContainer>
    <BrowserRouter>
      <Root />
    </BrowserRouter>
  </AppContainer>,
  document.getElementById('app')
)

if (process.env.NODE_ENV === 'development' && module.hot) {
  module.hot.accept()
}
