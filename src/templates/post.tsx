import React from "react"
import { graphql, StaticQuery } from "gatsby"
import Layout from "../components/layout"
import Header from "../components/PostHeader"

export const query = graphql`
  query($uid: String!) {
    prismic {
      post(uid: $uid, lang: "en-us") {
        title
        date_published
        feature_image
        feature_imageSharp {
          childImageSharp {
            fluid(maxWidth: 1500, quality: 90) {
              ...GatsbyImageSharpFluid_withWebp_noBase64
            }
          }
          colors {
            lightVibrant
            darkMuted
          }
        }
      }
    }
  }
`

interface PageProps {
  data: any
}

const Page: React.FC<PageProps> = props => {
  const { post } = props.data.prismic
  return (
    <Layout>
      <Header
        title={post.title}
        date={post.date_published}
        color={post.feature_imageSharp.colors.lightVibrant}
        featureImage={post.feature_imageSharp.childImageSharp.fluid}
        darkColor={post.feature_imageSharp.colors.darkMuted}
      />
    </Layout>
  )
}

export default Page
