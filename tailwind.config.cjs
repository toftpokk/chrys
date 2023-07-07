/** @type {import('tailwindcss').Config}*/
const config = {
	content: ['./src/**/*.{html,js,svelte,ts}'],

	theme: {
		extend: {
			colors: {
				'base': '#222831',
				'mid': '#2E333C',
				'main': '#393E46',
				'light': '#535A65',
				'accent': '#00ADB5',
				'warn':'#D96C28',
				'white': '#EEEEEE'
			}
		}
	},

	plugins: []
};

module.exports = config;
