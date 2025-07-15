# Module 5: React Fundamentals

**Duration:** 2 days | **Week:** 3

## Learning Objectives
By the end of this module, you will:
- Understand component-based architecture deeply
- Master JSX syntax and React concepts
- Learn state management with useState effectively
- Handle events and form inputs confidently
- Understand component lifecycle with useEffect
- Think in components and data flow

## Why This Matters

React revolutionized frontend development by making UIs predictable and manageable. Instead of manually updating DOM elements, you describe what the UI should look like based on data, and React handles the updates efficiently.

## Theoretical Foundation

### Component-Based Architecture

React is like building with LEGO blocks:
- **Each component** is a reusable block
- **Blocks can contain** other blocks (composition)
- **You build complex structures** from simple pieces
- **Change one block** and it updates everywhere it's used

**Benefits:**
- **Reusability:** Write once, use many times
- **Maintainability:** Fix bugs in one place
- **Testability:** Test components in isolation
- **Reasoning:** Easier to understand small pieces

### JSX: JavaScript + HTML

JSX looks like HTML but has JavaScript superpowers:

```jsx
// HTML
<div class="container" onclick="handleClick()">Hello</div>

// JSX
<div className="container" onClick={handleClick}>Hello {name}</div>
```

**Key Differences:**
- `className` instead of `class` (JavaScript keyword conflict)
- `onClick` instead of `onclick` (camelCase convention)
- `{expression}` for dynamic content
- Self-closing tags required: `<img />` not `<img>`

### State vs Props

Think of components like functions:
- **Props** = Parameters passed in (read-only)
- **State** = Internal variables (can change)

```jsx
// Props flow down from parent
<TaskCard task={task} onEdit={handleEdit} />

// State lives inside component
const [completed, setCompleted] = useState(false);
```

### The Mental Model Shift

**Traditional Approach (Imperative):**
1. Find DOM element
2. Update its content
3. Handle side effects
4. Remember to update everywhere it's used

**React Approach (Declarative):**
1. Describe what UI should look like
2. React figures out how to make it happen
3. Changes automatically propagate

## Hands-On Exercises

### Exercise 1: Your First Component

Create a simple `TaskCard` component:

**Requirements:**
- Accept task data as props
- Display title, description, category
- Show completion status
- Handle click events

**Think About:**
- What props does this component need?
- How do you handle optional data (like description)?
- What events might a task card need to handle?

**Start Simple:** Just display static data first, then add interactivity.

### Exercise 2: State Management

Add state to track completion:

**Requirements:**
- Use useState for completion status
- Toggle completion on checkbox click
- Update UI to reflect state changes
- Consider visual feedback for completed tasks

**Think About:**
- Where should the state live?
- What happens when state changes?
- How do you update state correctly?

**Common Mistake:** Don't mutate state directly. Always use the setter function.

### Exercise 3: Event Handling

Implement various event handlers:

**Requirements:**
- Checkbox toggle for completion
- Button clicks for edit/delete
- Form submission for new tasks
- Prevent default behavior where needed

**Think About:**
- What's the difference between onClick and onClick()?
- How do you pass data to event handlers?
- When do you need to prevent default behavior?

### Exercise 4: Form Input Handling

Create a form for task creation:

**Requirements:**
- Controlled inputs for all fields
- Form validation feedback
- Submit handler
- Clear form after submission

**Think About:**
- What makes an input "controlled"?
- How do you handle different input types?
- Where should form state live?

**Challenge:** Handle multiple inputs efficiently without creating a state variable for each.

### Exercise 5: List Rendering

Display multiple tasks efficiently:

**Requirements:**
- Map over tasks array
- Provide unique keys
- Handle empty state
- Consider performance with many items

**Think About:**
- Why do React lists need keys?
- What makes a good key value?
- How do you handle dynamic lists?

**Research:** What happens if you use array index as key? When is it okay?

### Exercise 6: useEffect Hook

Manage side effects and lifecycle:

**Requirements:**
- Fetch data when component mounts
- Clean up resources when component unmounts
- Respond to prop/state changes
- Understand dependency arrays

**Think About:**
- What are "side effects" in React?
- When does useEffect run?
- How do you prevent infinite loops?

**Common Issues:** Missing dependencies, running effects too often.

### Exercise 7: Component Composition

Build a complete task management interface:

**Requirements:**
- TaskList component containing TaskCard components
- TaskForm component for creating/editing
- Header component with statistics
- Proper data flow between components

**Think About:**
- How do components communicate?
- Where should state live (state lifting)?
- How do you avoid prop drilling?

## Problem-Solving Challenges

### Challenge 1: State Location
Decide where state should live when multiple components need access to the same data.

### Challenge 2: Performance Optimization
Research when and how to optimize React components. What causes unnecessary re-renders?

### Challenge 3: Event Handler Patterns
Implement different patterns for handling events with parameters. Compare inline functions vs. predefined handlers.

### Challenge 4: Form Validation
Add real-time validation to forms. Consider user experience and when to show errors.

## Completion Checklist

### Component Understanding
- [ ] Can explain what a React component is and why they're useful
- [ ] Understand the difference between functional and class components
- [ ] Can break down a UI into component hierarchy
- [ ] Understand component composition and reusability
- [ ] Can explain props vs state clearly

### JSX Mastery
- [ ] Comfortable with JSX syntax and differences from HTML
- [ ] Can embed JavaScript expressions in JSX
- [ ] Understand conditional rendering patterns
- [ ] Can handle lists and keys properly
- [ ] Know how to handle events in JSX

### State Management
- [ ] Can use useState hook effectively
- [ ] Understand when and how to update state
- [ ] Know the rules of state updates (immutability)
- [ ] Can lift state up when needed
- [ ] Understand controlled vs uncontrolled components

### Event Handling
- [ ] Can handle various types of events
- [ ] Understand event object and preventDefault
- [ ] Can pass data to event handlers
- [ ] Know different patterns for event handling
- [ ] Can handle form submission properly

### useEffect Understanding
- [ ] Can explain what side effects are
- [ ] Know when useEffect runs
- [ ] Understand dependency arrays
- [ ] Can clean up effects properly
- [ ] Avoid common pitfalls (infinite loops)

### Practical Application
- [ ] Built working TaskCard component
- [ ] Created TaskForm with state management
- [ ] Implemented task list with proper keys
- [ ] Added event handlers for user interactions
- [ ] Integrated components into complete interface

## Common Issues & Solutions

**Issue:** "Cannot read property 'map' of undefined"
**Investigate:** What happens when data is still loading? How do you handle undefined props?

**Issue:** Input values not updating
**Investigate:** What makes an input controlled? Are you using value and onChange correctly?

**Issue:** useEffect running infinitely
**Investigate:** What causes useEffect to re-run? How do dependency arrays work?

**Issue:** State not updating immediately
**Investigate:** How does React batch state updates? What is the difference between synchronous and asynchronous updates?

## Assessment Questions

Before moving to Module 6, ensure you can explain:

1. **What's the difference between state and props?**
   - Think about: Ownership, mutability, data flow

2. **Why do React lists need keys?**
   - Consider: Virtual DOM, performance, component identity

3. **When would you use useEffect?**
   - Think about: Side effects, lifecycle events, data fetching

4. **What makes an input "controlled"?**
   - Consider: Data flow, single source of truth, React principles

5. **How do you decide where to put state?**
   - Think about: Component hierarchy, data sharing, lifting state up

## Next Steps

Once you've completed all checklist items and can answer the assessment questions, you're ready for [Module 6: TypeScript Integration](../module-6/).

**Key Insight:** React is about describing what the UI should look like based on data. When data changes, React automatically updates the UI to match.

---

**Need help?** Ask your Claude tutor to explain any React concepts you find confusing. Practice building small components and understanding the data flow.