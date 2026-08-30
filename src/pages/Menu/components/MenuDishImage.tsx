import { useImageUrl } from "@/hooks/useImageUrl";

type MenuDishImageProps = {
  imageId?: number | null;
  alt: string;
  className?: string;
};

export const MenuDishImage = ({
  imageId,
  alt,
  className = "",
}: MenuDishImageProps) => {
  const url = useImageUrl(imageId);

  return (
    <div className={className}>
      {url ? (
        <img src={url} alt={alt} className="menu-dish-image" />
      ) : (
        <div className="menu-dish-image menu-dish-image--empty" aria-hidden />
      )}
    </div>
  );
};
