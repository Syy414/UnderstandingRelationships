# Educational App Structure

## Topic: Understanding Relationships and Personal Boundaries

### Overview
This educational app is designed for autistic children to learn about relationship boundaries and safety through interactive, autism-friendly games.

---

## Module 1: Relationship Circles and Safety 💜

**Color Theme:** Purple

### Game 1: Circle Sorter 👥
- **File:** `/components/CircleSorter.tsx`
- **Description:** Sort people (family, friends, acquaintances, community helpers, strangers) into colored relationship circles
- **Interaction:** Tap character, then tap the correct circle
- **Features:** 
  - 28 different characters
  - 6 relationship circles (Me, Family, Friends, Acquaintances, Community Helpers, Strangers)
  - Visual feedback with color coding

### Game 2: Safe Touch 🤝
- **File:** `/components/SafeContactGame.tsx`
- **Description:** Learn about safe vs unsafe contact situations
- **Interaction:** Tap "Safe" or "Not Safe" for each scenario
- **Features:**
  - 10 scenarios covering different relationship circles
  - Explanations for each answer
  - Star rating based on performance

---

## Module 2: Private vs Public Behaviour 💚

**Color Theme:** Green

### Game 1: What to Share 🔒
- **File:** `/components/PrivatePublicSorting.tsx`
- **Description:** Sort activities, information, and behaviors into private or public categories
- **Interaction:** Tap "Private" or "Public" for each item
- **Features:**
  - 20 items covering body privacy, personal information, and activities
  - Clear explanations of private vs public
  - Progressive learning

### Game 2: Safety Scenarios 💭
- **File:** `/components/ScenarioQuiz.tsx`
- **Description:** Make safe choices in various social scenarios
- **Interaction:** View scenario, choose from 3 response options
- **Features:**
  - 6 different scenarios
  - Multiple choice responses
  - Try again option for incorrect answers
  - Relationship circle context

---

## Module 3: Respect and Assertiveness 🧡

**Color Theme:** Orange

### Game 1: Respect Space 🛡️
- **File:** `/components/BoundariesGame.tsx`
- **Description:** Learn about respecting other people's boundaries
- **Interaction:** Tap "Yes" (respectful) or "No" (not respectful)
- **Features:**
  - 12 boundary situations
  - Covers privacy, personal space, consent, and respect
  - Teaches correct behaviors when answer is wrong

### Game 2: What Would You Do? 👫
- **File:** `/components/GroupSimulation.tsx`
- **Description:** Navigate group social situations with assertiveness and respect
- **Interaction:** Choose from 3 possible responses to each scenario
- **Features:**
  - 6 realistic group scenarios
  - Multiple valid responses per scenario
  - Teaches assertiveness, kindness, and when to seek help
  - Visual characters in each scenario

---

## Navigation Structure

```
Main Menu
├── Module 1: Relationship Circles and Safety
│   ├── Circle Sorter
│   └── Safe Touch
├── Module 2: Private vs Public Behaviour
│   ├── What to Share
│   └── Safety Scenarios
└── Module 3: Respect and Assertiveness
    ├── Respect Space
    └── What Would You Do?
```

---

## Key Components

- **`/App.tsx`** - Main app router handling all navigation
- **`/components/MainMenu.tsx`** - Shows 3 modules with numbered cards
- **`/components/ModuleMenu.tsx`** - Reusable component showing 2 games per module
- **Individual game components** - 6 complete games as listed above

---

## Design Principles Maintained

✅ **Tap-only interactions** - No drag-and-drop  
✅ **High contrast UI** - Soft colors with clear borders  
✅ **Immediate feedback** - Sound and visual responses  
✅ **Minimal cognitive load** - One action per screen  
✅ **Rounded shapes** - Calming visual design  
✅ **Clear progression** - Star ratings and scores  
✅ **Consistent patterns** - Similar interaction across all games

---

## Sound Feedback

- **Success:** Pleasant "ding" sound (523.25 Hz)
- **Error:** Gentle "whoops" sound (200 Hz)  
- **Duration:** Brief (0.2-0.3 seconds) to avoid overstimulation

---

## Total Content

- **3 Modules**
- **6 Games (2 per module)**
- **70+ Learning Scenarios** across all games
- **Color-coded organization** for easy navigation
