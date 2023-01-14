import clsx from "clsx"

import styles from "./navbar.module.css"

type ItemType = { key: React.Key; text: string }

type Props = {
  list: ItemType[]
  className?: string
  onItemClick: (item: ItemType, index: number, list: ItemType[]) => void
}

export default function Navbar({ list, className, onItemClick }: Props) {
  if (!list || list.length <= 0) return null
  return (
    <div className={clsx(styles.container, className)}>
      <ul className={styles.list}>
        {list.map((item, index) => (
          <li key={item.key} className={styles.item}>
            <span onClick={() => onItemClick(item, index, list)}>
              {item.text}
            </span>
          </li>
        ))}
      </ul>
    </div>
  )
}
