import React from 'react'
import { useStaticQuery, graphql } from 'gatsby'
import Img from 'gatsby-image'

const query = graphql`
  query {
    file(relativePath: { eq: "profile-pic.png"}) {
      childImageSharp {
        fixed(width: 180, height: 180) {
          ...GatsbyImageSharpFixed
        }
      }
    }
  }
`

export const Header: React.FC = () => {
  const data = useStaticQuery(query)

  return <div className="h-screen flex flex-col items-center justify-center py-32">
    <div>
      <Img className="rounded-full shadow-lg" fixed={data.file.childImageSharp.fixed} />
    </div>
    <div>
      <h1 className="text-black text-5xl font-serif text-center font-bold mt-3">Sam Wight</h1>
      <p className="max-w-lg text-balck text-xl font-serif text-center">Developer. CS student at The University of Alabama. President of Blueprint at UA.</p>
    </div>
  </div>
}