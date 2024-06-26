/** @type {import('tailwindcss').Config}*/
const config = {
	content: ['./src/**/*.{html,js,svelte,ts}'],

	theme: {
		// extend: {
		// 	colors: {
		// 		'teal-100': "#00ADB5",
		// 		'teal-200': "#008D95",
		// 		'gray-100': "#222831"

		// 		// 'base': '#222831',
		// 		// 'mid': '#2E333C',
		// 		// 'main': '#393E46',
		// 		// 'light': '#535A65',
		// 		// 'accent': '#00ADB5',
		// 		// 'accent-dark': '#008D95',
		// 		// 'accent-light': '#55BDD5',
		// 		// 'warn':'#D96C28',
		// 		// 'white': '#EEEEEE'
		// 	}
		// },
		extend:{
			colors: {
				'white': '#FFFFFF',
				'teal-100': "#00ADB5",
				'teal-200': "#008D95",
				// 'gray-50': "#FF0000",
				'red-100': '#d8273b',
				'gray-20': "#949daa",
				'gray-30': "#727984",
				'gray-50': "#535A65",
				'gray-70': "#3d434c",
				'gray-80': "#313842",
				'gray-100': "#222831",
				'gray-200': "#171c23",
				// 'gray-300': "#393E46",
				'test-100': "#FF00FF",
				'test-200': "#FFCCFF",
				'black': "#000000"
			}
		}
	},

	plugins: []
};

module.exports = config;
