import { useToggleWish } from '@/hook/use-toggle-wish'

export default function WishButton({ token, type, id }) {
    const { isFavorited, toggleFavorite } = useToggleWish(token, type, id)

    return (
        <div className="bookmark">
            <button onClick={toggleFavorite} className="text-xl text-red-500 hover:scale-110 transition">
                <i className={isFavorited ? 'bx bxs-heart' : 'bx bx-heart'} />
            </button>
        </div>
    )
}
