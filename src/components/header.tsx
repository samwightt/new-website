import React from 'react'
import { useStaticQuery, graphql } from 'gatsby'
import Img from 'gatsby-image'

const query = graphql`
  query {
    prismicHeader {
      data {
        name {
          text
        }
        tagline {
          text
        }
        profile_pic {
          localFile {
            childImageSharp {
              fixed(width: 200, height: 200) {
                ...GatsbyImageSharpFixed_withWebp_tracedSVG
              }
            }
          }
        }
      }
    }
  }
`

export const Header: React.FC = () => {
  const data = useStaticQuery(query)
  const { data: prismic } = data.prismicHeader
  const image = prismic.profile_pic.localFile.childImageSharp.fixed

  return <div className="h-screen flex flex-col items-center justify-center dark:bg-black">
    <div>
      <Img className="rounded-full shadow-xl" fixed={image} />
    </div>
    <div>
      <h1 className="text-black text-5xl font-serif text-center font-bold mt-5">{prismic.name.text}</h1>
      <p className="max-w-lg text-balck text-xl font-serif text-center">{prismic.tagline.text}</p>
    </div>
  </div>
}