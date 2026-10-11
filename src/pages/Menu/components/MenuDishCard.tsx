import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import type { MenuItem } from "@/types/menuItem";
import { useRestaurantProfile } from "@/hooks/useRestaurantProfile";
import { formatMenuPrice, getMenuItemCopy } from "@/shared/menu/itemCopy";
import { MenuDishCardMenu } from "./MenuDishCardMenu";
import { MenuDishFlags } from "./MenuDishFlags";
import { MenuDishImage } from "./MenuDishImage";

type MenuDishCardProps = {
  item: MenuItem;
  to: string;
  editTo?: string;
  onDelete?: () => void;
};

export const MenuDishCard = ({
  item,
  to,
  editTo,
  onDelete,
}: MenuDishCardProps) => {
  const { t, i18n } = useTranslation();
  const { restaurant } = useRestaurantProfile();
  const copy = getMenuItemCopy(
    item,
    i18n.resolvedLanguage ?? i18n.language,
  );
  const name = copy.name || t("menu.untitled");
  const hidden = item.isAvailable === false;
  const showActions = Boolean(editTo && onDelete);

  return (
    <article
      className={`menu-dish${hidden ? " menu-dish--hidden" : ""}${
        showActions ? " menu-dish--manageable" : ""
      }`}
    >
      {showActions && editTo && onDelete && (
        <MenuDishCardMenu editTo={editTo} onDelete={onDelete} />
      )}
      <Link to={to} className="menu-dish__link">
        <MenuDishImage
          imageId={item.imageId}
          alt=""
          className="menu-dish__media"
        />
        <div className="menu-dish__body">
          <p className="menu-dish__price">
            {formatMenuPrice(
              item.price,
              i18n.resolvedLanguage ?? i18n.language,
              restaurant?.currency,
            )}
          </p>
          <h2 className="menu-dish__name">{name}</h2>
          <MenuDishFlags item={item} />
        </div>
      </Link>
    </article>
  );
};
