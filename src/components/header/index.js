import React from 'react'
import { Link } from 'gatsby'

import './header.css'

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
        <a
          href="/"
          style={{
            textDecoration: 'none',
          }}
        >
          Home
        </a>
        <Link
          to="/docs"
          style={{
            textDecoration: 'none',
          }}
        >
          Docs
        </Link>
      </nav>
    </div>
  </div>
)

export default Header
