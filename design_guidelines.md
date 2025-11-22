# Design Guidelines: Faith Journal with Elara

## Design Approach
**Reference-Based**: Preserve the existing purple-themed spiritual journaling aesthetic with refined, elegant styling that conveys sanctity and reflection.

## Color Palette
```
Primary Purple: #7a1fc3
Purple Dark: #61219a
Muted Text: #8f8a93
Background: #fafafa
Card Background: #ffffff
Accent Red (delete): #ff5c5c
Banner Yellow: #ffecb3 with #5c4300 text
```

## Typography

**Font Families:**
- Headers: 'Playfair Display', serif (weights: 700, 900)
- Body: Inter, system-ui (weights: 300, 400, 600, 700)

**Hierarchy:**
- Main Title (h1): 36px, Playfair Display (28px mobile)
- Section Headings (h2): 28px, Playfair Display
- Entry Titles (h3): 22px, Playfair Display
- Subtitle/Description: 18px, Inter, muted color
- Body Text: 18px, Inter (16px mobile)
- Input Text: 20px title input, 18px textarea
- Small/Date Text: 14px, muted color
- Navigation: 14px, Inter

## Layout System

**Spacing Units**: Use consistent spacing - 4px, 8px, 12px, 18px, 24px, 34px, 40px

**Container:**
- Max-width: 720px
- Margin: 24px auto
- Padding: 20px
- Center-aligned text

**Component Spacing:**
- Header gap: 12px
- Card padding: 18px
- Section margin-top: 34px
- Empty area padding: 40px 10px

## Component Library

### Logo
- Size: 56px × 56px (48px mobile)
- Border-radius: 12px
- Background: white with subtle shadow
- Custom purple dove SVG icon

### Cards
- Background: white
- Border-radius: 14px
- Padding: 18px
- Shadow: 0 6px 18px rgba(0,0,0,0.04)
- Border: 1px solid rgba(0,0,0,0.03)

### Buttons

**Primary (Save):**
- Background: linear-gradient(180deg, #7a1fc3, #61219a)
- Color: white
- Padding: 16px 36px (14px 22px mobile)
- Border-radius: 18px (14px mobile)
- Font-size: 20px (18px mobile)
- Shadow: 0 4px 8px rgba(122,31,195,0.18)
- Width: 85%, max-width: 560px

**Delete:**
- Background: #ff5c5c
- Hover: #e03b3b
- Position: absolute top-right (12px from edges)
- Padding: 6px 12px
- Border-radius: 8px
- Font-size: 14px

### Form Inputs

**Title Input:**
- Font-size: 20px
- Color: #5a5560
- Font-weight: 600
- Border: none (borderless design)
- Margin: 6px 4px 12px

**Textarea:**
- Min-height: 200px (180px mobile)
- Border-radius: 12px
- Border: 1px solid rgba(0,0,0,0.03)
- Padding: 20px
- Font-size: 18px (16px mobile)
- Background: transparent
- Vertical resize enabled

### Navigation (Fixed Bottom)
- Position: fixed bottom, full width
- Background: gradient overlay - linear-gradient(to top, #791fc38d, transparent)
- Backdrop-filter: blur(3px)
- Border-radius: 10px
- Z-index: 1000
- Link opacity: 0.8, hover: 1.0
- Hover transition: 0.25s with translateY(-3px)

### Entry Cards
- Relative positioning for delete button placement
- Title (h3): 22px Playfair, 8px bottom margin
- Content (p): white-space pre-wrap, 12px bottom margin
- Date (small): 14px, muted color

### Empty State
- Flexbox centered layout
- Min-height: 260px
- Book icon: 78px × 78px, 35% opacity
- Muted color scheme
- Vertical stack: icon → heading → message

### Banner Notifications
- Display: none by default
- Background: #ffecb3
- Color: #5c4300
- Padding: 14px 18px
- Border-radius: 12px
- Margin: 12px 0
- Font-weight: 500
- Center-aligned
- Shadow: 0 2px 8px rgba(0,0,0,0.08)
- Animation: fadeInOut 4s (fade in/out with translateY)

## Visual Effects

**Gradient Overlay (Body):**
- Fixed bottom gradient for depth
- Height: 110px
- Gradient: linear-gradient(to top, #791fc38d, transparent)
- Z-index: 1
- Pointer-events: none

**Shadows:**
- Cards: 0 6px 18px rgba(0,0,0,0.04)
- Buttons: 0 4px 8px rgba(122,31,195,0.18)
- Banners: 0 2px 8px rgba(0,0,0,0.08)
- Logo: 0 0 0 1px rgba(0,0,0,0.04)

## Animations
Minimal and purposeful only:
- Banner: fadeInOut 4s animation
- Nav hover: 0.25s transition with translateY(-3px)
- No other animations to maintain spiritual calm

## Responsive Breakpoints
Mobile (max-width: 420px):
- Header h1: 28px
- Logo: 48px × 48px
- Textarea: min-height 180px, font-size 16px
- Save button: 18px font, 14px padding, 14px radius

## Content Strategy
- Single-page journaling interface
- Chronological entry display (newest first)
- Clear empty states encouraging engagement
- Inline delete functionality with confirmation
- Success feedback via banner notifications