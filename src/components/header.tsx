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
        social_links {
          social_icon {
            localFile {
              publicURL
            }
          }
          social_link {
            url
          }
        }
      }
    }
  }
`

interface SocialLinkProps {
  url: string
  src: string
}

const SocialLink: React.FC<SocialLinkProps> = (props) => {
  return <a href={props.url} className="p-4 rounded-full bg-black hover:bg-gray-800 mr-2 ml-2"><img src={props.src} height={25} width={25} /></a>

}

export const Header: React.FC = () => {
  const data = useStaticQuery(query)
  const { data: prismic } = data.prismicHeader
  const image = prismic.profile_pic.localFile.childImageSharp.fixed
  const { social_links } = prismic

  console.log(social_links)

  return <div className="h-screen flex flex-col items-center justify-center dark:bg-black">
    <div>
      <Img className="rounded-full shadow-xl" fixed={image} />
    </div>
    <div>
      <h1 className="text-black text-5xl font-serif text-center font-bold mt-5">{prismic.name.text}</h1>
      <p className="max-w-lg text-balck text-xl font-serif text-center">{prismic.tagline.text}</p>
    </div>
    <div className="flex flex-row items-center justify-center mt-10">
      {social_links.map(link => (
        <SocialLink src={link.social_icon.localFile.publicURL} url={link.social_link.url} />
      ))}
    </div>
  </div>
}