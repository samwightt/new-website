import React from "react"
import { Elements } from "prismic-reactjs"

interface OptionType {
  heading1Class?: string
  paragraphClass?: string
}

export const htmlSerializer = (options: OptionType) => (
  type,
  element,
  content,
  children,
  key
) => {
  let className = ""
  switch (type) {
    case Elements.paragraph:
      className = options.paragraphClass ? options.paragraphClass : "font-sans"
      return (
        <p {...key} className={className}>
          {children}
        </p>
      )
    case Elements.heading1:
      className = options.heading1Class
        ? options.heading1Class
        : "font-serif text-black text-5xl"
      return (
        <h1 {...key} className={className}>
          {children}
        </h1>
      )
  }
}
