import React from 'react'
import { Link } from 'gatsby'

import Layout from '../layout'
import Sidebar from 'react-sidebar'

import './docs-layout.css'

const mql = window.matchMedia(`(min-width: 800px)`)

class App extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      sidebarDocked: mql.matches,
      sidebarOpen: false,
    }

    this.mediaQueryChanged = this.mediaQueryChanged.bind(this)
    this.onSetSidebarOpen = this.onSetSidebarOpen.bind(this)
  }

  componentWillMount() {
    mql.addListener(this.mediaQueryChanged)
  }

  componentWillUnmount() {
    mql.removeListener(this.mediaQueryChanged)
  }

  onSetSidebarOpen(open) {
    this.setState({ sidebarOpen: open })
  }

  mediaQueryChanged() {
    this.setState({ sidebarDocked: mql.matches, sidebarOpen: false })
  }

  render() {
    return (
      <Layout>
        <div className="docs-wrapper">
          <Sidebar
            transitions={false}
            rootClassName="docs-sidebar"
            sidebarClassName="docs-nav"
            contentClassName="docs-content"
            sidebar={this.renderSidebar()}
            open={this.state.sidebarOpen}
            docked={this.state.sidebarDocked}
            onSetOpen={this.onSetSidebarOpen}
          >
            <div className="docs-content">{this.props.children}</div>
          </Sidebar>
        </div>
      </Layout>
    )
  }

  renderSidebar() {
    return (
      <>
        <section>
          <header>Guides</header>
          <ul>
            <li>
              <Link to="/docs/static">Static sites</Link>
            </li>
            <li>
              <Link to="/docs/angular">Angular</Link>
            </li>
            <li>
              <Link to="/docs/gatsby">Gatsby</Link>
            </li>
            <li>
              <Link to="/docs/next">Next.js</Link>
            </li>
            <li>
              <Link to="/docs/nuxt">Nuxt.js</Link>
            </li>
          </ul>
        </section>
        <section>
          <header>API</header>
          <ul>
            <li>
              <Link to="/">guess-webpack</Link>
            </li>
            <li>
              <Link to="/">guess-ga</Link>
            </li>
            <li>
              <Link to="/">guess-parser</Link>
            </li>
          </ul>
        </section>
      </>
    )
  }
}

export default App
