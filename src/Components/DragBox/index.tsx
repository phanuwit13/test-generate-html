import type { CSSProperties, FC, ReactNode } from 'react'
import { useDrag } from 'react-dnd'

const style: CSSProperties = {
  position: 'absolute',
  padding: '0.5rem 1rem',
  cursor: 'move',
}

export interface BoxProps {
  id: string
  left: number
  top: number
  hideSourceOnDrag?: boolean
  children?: ReactNode
}

export const DragBox: FC<BoxProps> = ({
  id,
  left,
  top,
  hideSourceOnDrag,
  children,
}) => {
  const [{ isDragging }, drag] = useDrag(
    () => ({
      type: 'box',
      item: { id, left, top },
      collect: (monitor) => ({
        isDragging: monitor.isDragging(),
      }),
    }),
    [id, left, top]
  )

  if (isDragging && hideSourceOnDrag) {
    return <div ref={drag} />
  }
  return (
    <div
      ref={drag}
      style={{ ...style, left, top, width: '100%' }}
      data-testid='box'
    >
      {children}
    </div>
  )
}
