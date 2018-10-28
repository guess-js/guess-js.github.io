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
    <br />
    <h2>Guess.js announcement at Google I/O 2018</h2>
    <iframe
      className="intro-video"
      title="Guess.js announcement at Google I/O"
      width="560"
      height="315"
      src="https://www.youtube.com/embed/Mv-l3-tJgGk?start=2093"
      frameborder="0"
      allow="autoplay; encrypted-media"
      allowfullscreen
    />
  </Layout>
)

export default IndexPage
