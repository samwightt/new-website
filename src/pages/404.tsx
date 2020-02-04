import React from "react"
import { Link } from 'gatsby'
import Layout from "../components/layout"
import SEO from "../components/seo"

const NotFoundPage = () => (
  <Layout>
    <SEO title="404: Not found" />
    <div className="h-screen flex flex-col items-center justify-center dark:bg-black">
      <h1 className="text-black text-13xl font-serif text-center font-bold -mb-12">404</h1>
      <p className="max-w-lg text-gray-700 text-2xl font-serif text-center mb-12">That's an error.</p>
      <Link to="/" className="text-gray-500 text-sm hover:text-gray-400 font-sans">Go back home.</Link>
    </div>
  </Layout>
)

export default NotFoundPage
