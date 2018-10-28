import React from 'react'

import DocsLayout from '../components/docs-layout/index'

import './docs.css'
import 'prismjs/plugins/line-numbers/prism-line-numbers.css'

const DocsPage = () => (
  <DocsLayout>
    <h2>Documentation</h2>
    <p>
      On this page, you can find API documentation and guides on how to use
      Guess.js with various of technologies.
    </p>

    <p>Select an option from the sidebar on the left.</p>
  </DocsLayout>
)

export default DocsPage
