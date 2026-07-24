interface AvatarProps {
  src?: string;
  name: string;

  className?: string;

  imageClassName?: string;
}

export default function Avatar({
  src,
  name,
  className,
  imageClassName,
}: AvatarProps) {
  const initial = name.trim().charAt(0).toUpperCase();

  if (src) {
    return (
      <div
        className={`
            w-12
            h-12

            rounded-full

            overflow-hidden

            flex
            items-center
            justify-center

            bg-primary-soft

            ${className}
          `}
      >
        <img
          src={src}
          alt={name}
          className={`
              w-full
              h-full
              object-cover
              ${imageClassName}
              `}
        />
      </div>
    );
  }

  return (
    <div
      className={`
          w-12
          h-12

          rounded-full

          flex
          items-center
          justify-center

          font-semibold

          ${className}
          `}
    >
      {initial}
    </div>
  );
}
