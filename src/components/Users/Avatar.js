import { Suspense } from 'react'
import { useQuery } from 'react-query'

/** A component that renders an image with a fallback image if the image fails to load */
export default function Avatar({ src, alt, fallbackSrc, ...props }) {
  return (
    <div className="user-avatar">
      <Suspense fallback={<img src={fallbackSrc} alt="Fallback Avatar" />}>
        <Img src={src} alt={alt} {...props} />
      </Suspense>
    </div>
  )
}

/** A component that throws pending promises until its image has loaded */
function Img({ src, alt, ...props }) {
  // use react-query for caching, utilizing React Query’s Suspense integration
  const { data: imgObject } = useQuery(
    // image source as query key
    src,
    () =>
      // image loading Promise
      new Promise((resolve) => {
        const img = new Image()
        img.onload = () => resolve(img)
        img.src = src
      }),
    { suspense: true }
  )

  return <img src={imgObject.src} alt={alt} {...props} />
}
