import React from "react"
import { graphql, useStaticQuery } from "gatsby"
import { RichText } from "prismic-reactjs"
import { htmlSerializer } from "./htmlSerializer"
import Img from "gatsby-image"

const HOME_QUERY = graphql`
  query {
    prismic {
      page(uid: "home", lang: "en-us") {
        title
        body {
          __typename
          ... on PRISMIC_PageBodyText {
            primary {
              content_text
            }
          }
          ... on PRISMIC_PageBodyImage {
            primary {
              content_image
              content_imageSharp {
                childImageSharp {
                  fluid(maxWidth: 900) {
                    ...GatsbyImageSharpFluid_withWebp
                  }
                }
              }
            }
          }
        }
      }
    }
  }
`

interface HolderProps {
  slice: any
}

const ContentHolder: React.FC<HolderProps> = props => {
  return (
    <div className="my-3">
      <RichText
        render={props.slice.primary.content_text}
        htmlSerializer={htmlSerializer()}
      />
    </div>
  )
}

const ImageHolder: React.FC<HolderProps> = props => {
  return (
    <div className="my-6 flex flex-col justify-center items-center px-3">
      <div className="w-full max-w-xl rounded p-3 bg-gray-200">
        <Img
          className="rounded"
          fluid={props.slice.primary.content_imageSharp.childImageSharp.fluid}
        />
      </div>
    </div>
  )
}

const handleFragment = (slice: any) => {
  switch (slice.__typename) {
    case "PRISMIC_PageBodyText":
      return <ContentHolder slice={slice} />
    case "PRISMIC_PageBodyImage":
      return <ImageHolder slice={slice} />
    default:
      return <h1>ERROR</h1>
  }
}

export const HomeContent = () => {
  const data = useStaticQuery(HOME_QUERY)

  return (
    <div className="flex flex-column justify-center">
      <div className="w-full max-w-4xl px-3">
        <RichText
          render={data.prismic.page.title}
          htmlSerializer={htmlSerializer()}
        />
        {data.prismic.page.body.map(slice => handleFragment(slice))}
      </div>
    </div>
  )
}
