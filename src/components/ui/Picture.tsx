import type { ImageAsset } from "../../content/media";

type Props = {
  image: ImageAsset;
  alt?: string;
  sizes?: string;
  priority?: boolean;
  className?: string;
  imgClassName?: string;
  /** Portrait art for tall viewports, matched by the same media query as the hero stage CSS. */
  portrait?: ImageAsset;
};

export const PORTRAIT_QUERY = "(max-aspect-ratio: 4/5)";

export function Picture({
  image,
  alt = "",
  sizes = "100vw",
  priority = false,
  className,
  imgClassName,
  portrait,
}: Props) {
  return (
    <picture className={className}>
      {portrait ? (
        <source media={PORTRAIT_QUERY} type="image/webp" srcSet={portrait.webp} sizes={sizes} />
      ) : null}
      {portrait ? <source media={PORTRAIT_QUERY} srcSet={portrait.png} /> : null}
      <source type="image/webp" srcSet={image.webp} sizes={sizes} />
      <img
        src={image.png}
        width={image.width}
        height={image.height}
        alt={alt}
        loading={priority ? "eager" : "lazy"}
        fetchPriority={priority ? "high" : "auto"}
        decoding="async"
        className={imgClassName}
      />
    </picture>
  );
}
