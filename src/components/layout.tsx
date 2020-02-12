import React from "react"
import { StaticQuery, graphql } from "gatsby"
import Footer from "./footer"

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
          <Footer />
        </Layout>
      )
    }}
  />
)

export default WrappedLayout
