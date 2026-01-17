# Skyrim Character Builder (SCB)

## Project Overview

**Skyrim Character Builder** is a free **Single Page Application (SPA)** designed to create and plan character builds for _The Elder Scrolls V: Skyrim_.

The application allows users to create a character, select race, equipment, skills, perks, and passive bonuses, while dynamically recalculating character statistics in real time.  
The project focuses on complex UI logic, rich interactivity, and clean architecture — built entirely with **Vanilla JavaScript**.
>This project was built without frameworks to demonstrate core JavaScript skills.

## Features

 - Character creation (name + race required before access to the main menu)
 - Fully interactive SPA (no page reloads)
 - Equipment system:
	 - Items grouped into **5 main categories** with subcategories (e.g. Armor → Light / Heavy)
	 - Sorting by:
		 - Name
		 - Weight
		 - Damage or Armor rating
	- Advanced filters with multiple options
	- Real-time search by item name
	- Equip / unequip / change items
 - Skills & Perks:
	- All **18 Skyrim skill trees**
	- SVG-based fully interactive skill trees
	- Interactive perk selection (left or right click)
	- Descriptions on hover or long tap (mobile)
 - Boons:
	- All **12 Standing Stones**
	- Additional passive bonuses
	- Flexible combinations based on game rules
 - Real-time character statistics:
	- Armor, Damage output
	- Different resistances
	- Visualized caps for them using **Canvas-based dynamic charts**
 - Rich UI interactions:
	- Item descriptions and thumbnails
	- Image zoom on hover or click
	- Optimized image loading and caching

## Tech Stack

 - HTML
 - CSS3
	 - Pure CSS
	 - BEM methodology
- JavaScript (Vanilla JS)
- **Vite** (build tool)
- IntersectionObserver
	- Lazy loading of images
- Canvas
	- Real-time statistics visualization
- SVG
	- Fully interactive skill trees and perks
- Custom image caching logic for performance optimization

## Architecture & Approach

 - Single Page Application (SPA)
 - Modular project structure
 - Clear separation of UI and logic
 - Responsive design (desktop & mobile)
 - Focus on:
	 - Readable code
	 - Predictable behavior
	 - Maintainability

The project was developed solo, without external frameworks, to focus on fundamental frontend principles and hands-on problem solving.

## What This Project Demonstrates

 - Strong understanding of **core JavaScript**
 - Complex state-dependent UI logic
 - Working with **Canvas and SVG**
 - Performance-oriented techniques (lazy loading, image caching)
 - SPA architecture without frameworks
 - Attention to UX details and edge cases

## Installation & Run Locally

 - git clone https://github.com/VZhHub/SCB.git
 - cd SCB
 - npm install
 - npm run dev

WebP images are hosted separately to keep the repository lightweight and fast to clone via GitHub Pages: https://vzhhub.github.io/SCB-webp/