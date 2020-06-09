import React from 'react'
import { useDrop } from 'react-dnd'
import AddCircleIcon from '@material-ui/icons/AddCircle'

function CardDropZone({
    i,
    handleDrop,
}: {
    i: number
    handleDrop: (arg1: string, arg2: number) => void
}) {
    const [{ isOver }, drop] = useDrop({
        accept: 'CARD',
        // @ts-ignore
        drop: ({ imageId }) => {
            handleDrop(imageId, i)
        },
        collect: monitor => ({
            isOver: !!monitor.isOver(),
        }),
    })
    return (
        <div
            ref={drop}
            style={{
                position: 'relative',
                width: '100%',
                height: isOver ? '30px' : '16px',
                padding: isOver ? '2em 0' : 0,
                backgroundColor: 'white',
            }}
            className="my-4"
        >
            {isOver && (
                <div
                    style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        height: '100%',
                        width: '100%',
                        zIndex: 1,
                        backgroundColor: 'black',
                    }}
                    className="flex justify-center items-center"
                >
                    <AddCircleIcon style={{ color: 'white' }} />
                </div>
            )}
        </div>
    )
}

export default CardDropZone
