import React from 'react'
import { Link } from 'gatsby'

import './styles.css'

const Header = ({ siteTitle }) => (
  <div className="header">
    <div
      style={{
        margin: '0 auto',
        maxWidth: 960,
        padding: '1.45rem 1.0875rem',
      }}
    >
      <nav>
        <Link to="/">Home</Link>
        <Link to="/docs">Docs</Link>
      </nav>
    </div>
  </div>
)

export default Header
