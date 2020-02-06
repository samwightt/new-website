const path = require("path")

exports.createPages = async ({ graphql, actions }) => {
  const { createPage } = actions
  const result = await graphql(`
    query {
      prismic {
        allPosts {
          edges {
            node {
              _meta {
                uid
              }
            }
          }
        }
      }
    }
  `)
  result.data.prismic.allPosts.edges.forEach(item => {
    const uid = item.node._meta.uid
    if (uid) {
      createPage({
        path: `post/${uid}`,
        component: path.resolve("./src/templates/post.tsx"),
        context: {
          uid: uid,
        },
      })
    }
  })
}
