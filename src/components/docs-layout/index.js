import React from 'react'
import { Link } from 'gatsby'

import Layout from '../layout'
import Sidebar from 'react-sidebar'

import './styles.css'
import 'hamburgers/dist/hamburgers.min.css'

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
    this.toggleNavigation = this.toggleNavigation.bind(this)
  }

  UNSAFE_componentWillMount() {
    mql.addListener(this.mediaQueryChanged)
  }

  componentWillUnmount() {
    mql.removeListener(this.mediaQueryChanged)
  }

  onSetSidebarOpen(open) {
    this.setState({ sidebarOpen: open })
  }

  toggleNavigation() {
    this.onSetSidebarOpen(!this.state.sidebarOpen)
  }

  mediaQueryChanged() {
    this.setState({ sidebarDocked: mql.matches, sidebarOpen: false })
  }

  render() {
    const isActive = this.state.sidebarOpen
    return (
      <Layout>
        <div className="docs-wrapper">
          {!mql.matches ? (
            <button
              onClick={this.toggleNavigation}
              className={
                'hamburger hamburger--spin' + (isActive ? ' is-active' : '')
              }
              type="button"
            >
              <span className="hamburger-box">
                <span className="hamburger-inner" />
              </span>
            </button>
          ) : null}
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
              <Link to="/docs/api/webpack/index">guess-webpack</Link>
            </li>
            <li>
              <Link to="/docs/api/ga/index">guess-ga</Link>
            </li>
            <li>
              <Link to="/docs/api/parser/index">guess-parser</Link>
            </li>
          </ul>
        </section>
      </>
    )
  }
}

export default App
