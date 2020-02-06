import React from "react"
import PropTypes from "prop-types"
import { StaticQuery, graphql } from "gatsby"

import "./layout.css"
import "typeface-lora"
import "typeface-open-sans"

const query = graphql`
  query SiteTitleQuery {
    site {
      siteMetadata {
        title
      }
    }
  }
`

const Layout = ({ children, data }) => {
  return <>{children}</>
}

const WrappedLayout = props => (
  <StaticQuery
    query={query}
    render={data => {
      return (
        <Layout data={data} {...props}>
          {props.children}
        </Layout>
      )
    }}
  />
)

export default WrappedLayout
