import React from 'react'

import Layout from '../components/layout'

import './index.css'

const IndexPage = () => (
  <Layout>
    <div className="main">
      <img
        className="headline-logo"
        src={require('../images/logo.svg')}
        alt="Logo"
      />
      <div className="headline">
        Libraries & tools for enabling Machine Learning driven user-experiences
        on the web
      </div>
    </div>
  </Layout>
)

export default IndexPage
