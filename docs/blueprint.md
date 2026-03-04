# **App Name**: EstetikMarket

## Core Features:

- Product Catalog Display: Showcase products with images, names, prices, and stock status. Products are fetched from the remote Apps Script backend.
- Dynamic Content Pages: Render carousel banners, 'About Us' information, and 'Contact Us' details, all dynamically loaded from a remote Apps Script backend.
- Shopping Cart Functionality: Allow users to add, remove, and adjust quantities of products in their shopping cart. Cart state is persisted locally.
- Secure Checkout Process: Enable users to input their details (name, email, phone) and initiate payment via Midtrans. Frontend performs client-side input validation and integrates with the Apps Script backend for payment token and confirmation.
- Responsive Navigation & UI: Provide a responsive navigation menu for seamless browsing on various device sizes, along with a sticky header and a dedicated cart sidebar for intuitive user interaction.
- Interactive Carousel Slider: Display a captivating, auto-sliding image carousel with navigation indicators, providing an engaging welcome to the store.

## Style Guidelines:

- The chosen color palette evokes a modern, clean, and elegant aesthetic, fitting for 'Estetik' design principles. Primary calls to action and important information are highlighted effectively while maintaining visual harmony.
- Primary color: A sophisticated deep blue (#2A5C7E). This color instills trust and reflects a modern, calm elegance, serving as the foundational brand hue. It contrasts beautifully with the overall light theme.
- Background color: A subtle, heavily desaturated light blue-grey (#F8FAFC). This almost-white hue maintains a clean and spacious canvas, ensuring product displays and content are foregrounded effectively in the light theme.
- Accent color: A vibrant, warm salmon (#FF8A7A). This lively accent color creates impactful contrast with the primary blue, drawing attention to crucial elements like call-to-action buttons, cart badges, and key information, adding a dynamic energy to the design.
- Headline and body font: 'Inter' (sans-serif). This font provides excellent legibility across various screen sizes and maintains a clean, modern, and objective feel, perfectly aligning with the app's aesthetic.
- Leverage the comprehensive set of Font Awesome 6 Solid icons. These icons offer consistent styling for interactive elements like shopping bags, menu toggles, and payment-related actions, enhancing clarity and user recognition.
- A refined and responsive grid-based layout structures content logically, ensuring adaptability across devices. A prominent full-width carousel engages users immediately, while a sticky header maintains navigation access, complemented by a smooth sliding sidebar for the shopping cart for efficient browsing and checkout.
- Subtle, deliberate animations using a cubic-bezier easing function (`all 0.25s cubic-bezier(0.2, 0, 0, 1)`) are applied across interactive components. These include smooth transitions for navigation links, cart icon 'pop' on item add, carousel auto-sliding with indicators, and elegant skeleton loading states, contributing to a fluid and premium user experience.