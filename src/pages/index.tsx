import React from "react"
import Layout from "../components/layout"
import SEO from "../components/seo"
import { Header } from "../components/header"
import { HomeContent } from "../components/HomeContent"

const IndexPage = () => (
  <Layout>
    <SEO title="Home" />
    <Header />
    <HomeContent />
  </Layout>
)

export default IndexPage
