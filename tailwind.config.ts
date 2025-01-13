import type { Config } from "tailwindcss";

export default {
    darkMode: ["class"],
    content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
  	extend: {
  		colors: {
			primary: {
				DEFAULT: '#111827', // Dark gray/black like in the image
				light: '#2A2A2A',
				dark: '',
			  },
			  secondary: {
				DEFAULT: '#1f2937', // Gray like in the navigation
				light: '#4A4A4A',
				dark: '#1f2937',
			  },
  			background: 'var(--background)',
  			foreground: 'var(--foreground)'
  		},
  		borderRadius: {
  			lg: 'var(--radius)',
  			md: 'calc(var(--radius) - 2px)',
  			sm: 'calc(var(--radius) - 4px)'
  		},
		fontFamily: {
			poppins: ['var(--font-poppins)'],
		},
  	}
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
