import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import type { MenuItem } from "@/types/menuItem";
import { formatMenuPrice, getMenuItemCopy } from "@/shared/menu/itemCopy";
import { MenuDishFlags } from "./MenuDishFlags";
import { MenuDishImage } from "./MenuDishImage";

type MenuDishCardProps = {
  item: MenuItem;
  to: string;
};

export const MenuDishCard = ({ item, to }: MenuDishCardProps) => {
  const { t } = useTranslation();
  const copy = getMenuItemCopy(item);
  const name = copy.name || t("menu.untitled");
  const hidden = item.isAvailable === false;

  return (
    <Link
      to={to}
      className={`menu-dish${hidden ? " menu-dish--hidden" : ""}`}
    >
      <MenuDishImage
        imageId={item.imageId}
        alt=""
        className="menu-dish__media"
      />
      <div className="menu-dish__body">
        <p className="menu-dish__price">{formatMenuPrice(item.price)}</p>
        <h2 className="menu-dish__name">{name}</h2>
        <MenuDishFlags item={item} />
      </div>
    </Link>
  );
};
