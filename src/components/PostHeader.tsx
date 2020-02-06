import React from "react"
import { graphql, StaticQuery } from "gatsby"
import Img from "gatsby-image"
import BackgroundImage from "gatsby-background-image"
import { RichText } from "prismic-reactjs"
import { htmlSerializer } from "./htmlSerializer"

interface HeaderProps {
  title: string
  date: string
  featureImage: any
  color: string
}

const convert = (hex: string, alpha: number) => {
  const r = parseInt(hex.slice(1, 3), 16)
  const g = parseInt(hex.slice(3, 5), 16)
  const b = parseInt(hex.slice(5, 7), 16)

  return `rgba(${r}, ${g}, ${b}, ${alpha})`
}

const Header: React.FC<HeaderProps> = props => {
  const { color } = props
  const backgroundImage = [
    `linear-gradient(${convert(color, 0)} 0, ${convert(
      color,
      0.75
    )} 40%, ${convert(color, 0.95)} 80%, ${convert(color, 1.0)} 100%)`,
    props.featureImage,
  ]

  const options = {
    heading1Class: "font-serif text-black text-5xl font-bold mt-5 text-center",
    paragraphClass: "max-w-lg text-black text-xl font-serif text-center",
  }

  return (
    <BackgroundImage
      Tag="div"
      fluid={backgroundImage}
      className="py-48 flex flex-col items-center"
      backgroundColor={color}
    >
      <div>
        <RichText
          render={props.title}
          htmlSerializer={htmlSerializer(options)}
        />
        <h2>{props.date}</h2>
      </div>
    </BackgroundImage>
  )
}

export default Header
