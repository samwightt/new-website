import React from "react"
import { useStaticQuery, graphql } from "gatsby"
import Img from "gatsby-image"
import BackgroundImage from "gatsby-background-image"
import { RichText } from "prismic-reactjs"
import { htmlSerializer } from "./htmlSerializer"

const HEAD_QUERY = graphql`
  query {
    prismic {
      allHeaders {
        edges {
          node {
            name
            tagline
            social_links {
              social_icon
              social_iconSharp {
                publicURL
              }
              social_name
              social_link {
                _linkType
                ... on PRISMIC__ExternalLink {
                  url
                }
              }
            }
            profile_image
            profile_imageSharp {
              childImageSharp {
                fixed(width: 200, height: 200) {
                  ...GatsbyImageSharpFixed_withWebp_tracedSVG
                }
              }
            }
            header_image
            header_imageSharp {
              childImageSharp {
                fluid(maxWidth: 1920, quality: 90) {
                  ...GatsbyImageSharpFluid_withWebp_noBase64
                }
              }
            }
          }
        }
      }
    }
  }
`

interface SocialLinkProps {
  url: string
  src: string
  name: string
}

const SocialLink: React.FC<SocialLinkProps> = props => {
  return (
    <a
      href={props.url}
      className="rounded-full bg-black hover:bg-gray-800 mr-2 ml-2 w-12 h-12 flex justify-center items-center"
    >
      <img alt={props.name} src={props.src} height="auto" width="auto" />
    </a>
  )
}

export const Header: React.FC = () => {
  const data = useStaticQuery(HEAD_QUERY)
  const headerPage = data.prismic.allHeaders.edges[0].node
  const {
    name,
    tagline,
    social_links,
    profile_imageSharp: profile,
    header_imageSharp: background,
  } = headerPage

  const backgroundImage = [
    "linear-gradient(rgba(255, 255, 255, 0.0) 0, rgba(255, 255, 255, 0.7) 30%, rgba(255, 255, 255, 0.85), 60%, rgba(255, 255, 255, 1.0) 80%)",
    background.childImageSharp.fluid,
  ]

  const options = {
    heading1Class: "font-serif text-black text-5xl font-bold mt-5 text-center",
    paragraphClass: "max-w-lg text-black text-xl font-serif text-center",
  }

  return (
    <BackgroundImage
      Tag="div"
      fluid={backgroundImage}
      className="py-24 flex flex-col items-center"
    >
      <div>
        <Img
          className="rounded-full shadow-xl"
          fixed={profile.childImageSharp.fixed}
        />
      </div>
      <div>
        <RichText render={name} htmlSerializer={htmlSerializer(options)} />
        <RichText render={tagline} htmlSerializer={htmlSerializer(options)} />
      </div>
      <div className="flex flex-row items-center justify-center mt-10">
        {social_links.map(link => (
          <SocialLink
            src={link.social_iconSharp.publicURL}
            url={link.social_link.url}
            name={JSON.stringify(link.social_name)}
          />
        ))}
      </div>
    </BackgroundImage>
  )
}
