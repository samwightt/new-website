import React from "react"
import { Elements } from "prismic-reactjs"

interface OptionType {
  heading1Class?: string
  paragraphClass?: string
  heading1Style?: any
}

export const htmlSerializer = (options: OptionType = {}) => (
  type,
  element,
  content,
  children,
  key
) => {
  let className = ""
  switch (type) {
    case Elements.paragraph:
      className = options.paragraphClass
        ? options.paragraphClass
        : "font-sans my-4 text-lg"
      return (
        <p {...key} className={className}>
          {children}
        </p>
      )
    case Elements.heading1:
      className = options.heading1Class
        ? options.heading1Class
        : "font-serif text-black text-4xl font-bold my-4 mt-8"

      return (
        <h1 {...key} className={className}>
          {children}
        </h1>
      )
    case Elements.heading2: // Heading 2
      return <h2 {...key}>{children}</h2>

    case Elements.heading3: // Heading 3
      return <h3 {...key}>{children}</h3>

    case Elements.heading4: // Heading 4
      return <h4 {...key}>{children}</h4>

    case Elements.heading5: // Heading 5
      return <h5 {...key}>{children}</h5>

    case Elements.heading6: // Heading 6
      return <h6 {...key}>{children}</h6>

    case Elements.preformatted: // Preformatted
      return <pre {...key}>{children}</pre>

    case Elements.strong: // Strong
      return <strong {...key}>{children}</strong>

    case Elements.em: // Emphasis
      return <em {...key}>{children}</em>

    case Elements.listItem: // Unordered List Item
      return (
        <li {...key} className="font-sans text-lg my-2">
          {children}
        </li>
      )

    case Elements.oListItem: // Ordered List Item
      return (
        <li {...key} className="font-sans text-lg my-2">
          {children}
        </li>
      )

    case Elements.list: // Unordered List
      return (
        <ul {...key} className="list-inside list-disc my-5 ml-6">
          {children}
        </ul>
      )

    case Elements.oList: // Ordered List
      return (
        <ol {...key} className="list-inside list-decimal">
          {children}
        </ol>
      )

    // case Elements.embed: // Embed
    //   props = Object.assign(
    //     {
    //       "data-oembed": element.oembed.embed_url,
    //       "data-oembed-type": element.oembed.type,
    //       "data-oembed-provider": element.oembed.provider_name,
    //     },
    //     element.label ? { className: element.label } : {}
    //   )
    //   const embedHtml = React.createElement("div", {
    //     dangerouslySetInnerHTML: { __html: element.oembed.html },
    //   })
    //   return React.createElement(
    //     "div",
    //     propsWithUniqueKey(props, key),
    //     embedHtml
    //   )

    case Elements.hyperlink: // Image
      const targetAttr = element.data.target
        ? { target: element.data.target }
        : {}
      const relAttr = element.data.target ? { rel: "noopener" } : {}
      let props = Object.assign(
        {
          href: element.data.url || linkResolver(element.data),
        },
        tareetAttr,
        relAttr
      )
      return (
        <a {...key} {...props}>
          {children}
        </a>
      )

    case Elements.label: // Label
      let spanProps = element.data
        ? Object.assign({}, { className: element.data.label })
        : {}
      return (
        <span {...key} {...spanProps}>
          {children}
        </span>
      )

    case Elements.span: // Span
      if (content) {
        return content.split("\n").reduce((acc, p) => {
          if (acc.length === 0) {
            return [p]
          } else {
            const brIndex = (acc.length + 1) / 2 - 1
            const br = <br brIndex={brIndex} />
            return acc.concat([br, p])
          }
        }, [])
      } else {
        return null
      }
    default:
      return null
  }
}
