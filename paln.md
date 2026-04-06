# 🌸 FlowerS 

## 📌 Overview

FlowerS is a bilingual (PL/UA) web application for ordering flowers and bouquets with delivery in Opole or pickup.

### Core goals:
- Elegant, non-standard UI (premium but not expensive)
- Strong visual aesthetics (floral harmony)
- Fully responsive (mobile-first)
- SEO optimized
- Smooth UX with animations and microinteractions

---

## 🧱 Tech Stack

- Frontend: React + Next.js (App Router, SSR + API)
- Styling: CSS Modules + MUI
- NO tailwindcss!
- Backend: Next.js API routes
- Database: MongoDB
- Media: Cloudinary
- Auth: Telegram verification
- Environment variables: `.env` (Mongo, Cloudinary, Telegram tokens)

---

## 🌍 Internationalization

Languages:
- Primary: Polish (PL)
- Secondary: Ukrainian (UA)

### Requirements:
- All text must be translatable
- Use JSON structure:
- /locales/pl.json
-/locales/ua.json
- Language switcher in header
- Default language: Polish

---

## 🎨 Design System

### Colors:
Background (sections): #FEFFDF (with blur)
Text: #645643
Accent: #F55946
Hover Accent: #F6525C
Border: #FF8562
Shadow: #322B22


### Global Background:
- Video: `intro/body_background.mp4`
- All sections:
  - semi-transparent
  - blurred background

---

## 🏠 Main Page Structure

### 1. Header
- Logo: `intro/logo.PNG`
- Brand name
- Navigation links (scroll to sections)
- Language switcher (PL / UA)
- Burger menu (mobile)

#### Burger Menu:
- Contains navigation links
- Social links (FB, TikTok, Instagram) at bottom
- On click:
  - closes menu
  - scrolls to section

---

### 2. Hero Section
- Background video: `intro/hero_background.mp4`
- Gradient overlay:
- #F55946 (60%) → transparent
- Centered:
- Heading
- CTA button (scroll to products)

---

### 3. Products Section

#### Layout:
- Max width: 980px
- Toggle:
- Grid (3 per row)
- List view

---

#### Filters:
- Positioned absolutely (NOT affecting layout)
- Desktop: left sidebar
- Mobile/Tablet:
- hidden
- toggle button ">>"
- full-screen overlay panel

#### Filter types:
- Categories (dynamic, expandable)
- Price (range slider)

#### Extra:
- Space below filters used for promotional banner

---

#### Product Loading:
- Infinite scroll
- Pagination: 9 items per load

---

#### Product Card:
- Non-standard design (inverted border radius)
- Layout:
- Image: 70%
- Info: 30%

#### Interaction:
- Desktop: hover effect
- Mobile: trigger when 75% visible in viewport

#### On click:
- Opens product page

---

### 4. About Section
- 3 blocks
- Zigzag layout:
- left text
- right text
- Animation:
- appear/disappear on viewport (Intersection Observer)

---

### 5. Gallery Section
- Grid: 3 per row
- Initial load: 12 images
- Button: "Load more" (+12)

#### Effects:
- Retro filter applied to grid
- On click:
- opens image in original (no filter)
- lightbox view
- navigation:
  - arrows
  - swipe (touch devices)

---

### 6. Footer
- Logo + brand
- Navigation links
- Social links
- Privacy policy
- Terms of use

#### Fixed Contact Button:
- Icon: `intro/фіксована кнопка звязку.png`
- Expands menu:
- `intro/меню фіксованої кнопки звязку.png`
- Quick contact options

---

## 🛍️ Product Page

### Layout:
- Left: product image
- Right:
- name
- composition
- price
- add to cart button

---

### Cart Visibility:
- Hidden if empty
- Appears in header when items added

---

### Additional Buttons:
- 3 buttons below main block
- Open modal with backdrop
- Assets:
- `intro/кнопки під ціною товару.png`
- `intro/повідомлення з кнопки під ціною товару1.png`
- `intro/повідомлення з кнопки під ціною товару2.png`

---

### Upsell Section:
- "You may also like"
- Horizontal scroll
- Navigation:
- arrows
- swipe

---

### Advantages Section:
- 4 cards
- Icons: `intro/section svg.svg`

#### Behavior:
- default: black & white
- hover: colored

#### Background:
- blob style
- color: #F55946 / 45%

---

## 📞 Contacts Page
- Phone
- Email
- Map with pin (Google Maps)

---

## 🛒 Cart System

### Features:
- List of products
- Quantity controls (+ / -)
- If quantity = 1 and "-" clicked:
- show confirmation modal

---

### Calculations:
- Total items count
- Total price

---

### Delivery Options:
- Required selection:
- Delivery (+35 zł)
- Pickup (no change)

---

### Checkout Form:
- First name
- Last name
- Phone
- Comment

---

### Security:
- Input sanitization
- Backend validation
- Protection against:
- injections
- script input
- Rate limiting

---

## 🔐 Admin Panel

### Authentication:
- Telegram verification
- Message sent to Telegram:
- "Login attempt"
- Buttons:
  - Approve
  - Deny

---

### After Login:
- Session token created (backend)

---

### Dashboard:
- Total products
- Orders (year/month)
- Revenue (year/month)

---

### Categories:
- List
- Edit
- Delete
- Add new

---

### Products:
- Grid view
- Each product:
- order count
- price
- edit button
- delete button
- Add product button

---

### Gallery:
- Image grid
- Delete image
- Add image (Cloudinary)

---

### Forms Behavior:
- Preserve state on error
- Toast notifications:
- success
- error
- On success:
- clear form
- redirect to dashboard

---

## 🎬 Animations & UX

- Smooth scroll
- Intersection Observer animations
- Microinteractions
- Mobile-first responsiveness

---

## 🚀 AI Design Guidelines

Follow:
- Floral aesthetics
- Soft gradients
- Organic shapes (blobs)
- Elegant typography
- Minimalism with personality

Avoid:
- Generic templates
- Bootstrap-like layouts
- Overloaded UI

Focus:
- Visual harmony
- Premium feel
- Clean UX

---

## 🧠 Additional Skill Reference

Use:
https://github.com/anthropics/claude-code/blob/main/plugins/frontend-design/skills/frontend-design/SKILL.md

---

## 📌 Notes

- All assets paths must remain EXACTLY as provided (intro/...).
- Categories must be scalable (future additions).
- SEO must be considered (SSR, semantic HTML, meta tags).
- Performance optimization required (lazy loading, image optimization).

---

## ✅ Priority Order

1. Layout + Header + i18n
2. Hero + Products UI
3. Cart logic
4. Filters + API
5. Product page
6. Gallery + About
7. Admin panel
8. Optimization + SEO

---

## 🎯 Final Goal

A visually unique, elegant flower shop web application with strong UX, smooth animations, and scalable architecture.
