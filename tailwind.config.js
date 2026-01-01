/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            fontFamily: {
                'pixel': ['"Press Start 2P"', 'cursive'],
            },
            colors: {
                game: {
                    bg: '#FDF6E3',
                    border: '#657B83',
                    pot: '#D8A48F',
                    water: '#93C5FD',
                }
            }
        },
    },
    plugins: [],
}
