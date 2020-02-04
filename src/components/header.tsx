import React from 'react'
import { useStaticQuery, graphql } from 'gatsby'
import Img from 'gatsby-image'

const query = graphql`
  query {
    file(relativePath: { eq: "profile-pic.png"}) {
      childImageSharp {
        fixed(width: 150, height: 150) {
          ...GatsbyImageSharpFixed
        }
      }
    }
  }
`

export const Header: React.FC = () => {
  const data = useStaticQuery(query)

  return <div className="flex flex-col items-center justify-center py-32">
    <div>
      <Img className="rounded-full shadow-lg" fixed={data.file.childImageSharp.fixed} />
    </div>
    <div>
      <h1 className="text-black text-5xl font-serif text-center font-normal -mb-3 mt-3">Sam Wight</h1>
      <p className="text-balck text-xl font-sans text-center">I like code.</p>
    </div>
  </div>
}