# TaskyGist 📋

A modern, responsive task management application built with vanilla JavaScript, Html and CSS. TaskyGist helps you stay organized and productive with a clean, intuitive interface.

<img width="774" height="645" alt="Screenshot 2025-08-24 at 05 44 15" src="https://github.com/user-attachments/assets/7b538b2f-83e8-40be-ae1a-9f356a1f2488" />

## 🔗 Live Demo

**[View Live Application](https://taskygist.netlify.app/)**

Try TaskyGist now without any installation! The live demo includes all features and your data will be saved locally in your browser.

## 📂 Repository

**[GitHub Repository](https://github.com/EniolaAdemola/TaskyGist)**

View the source code, contribute, or fork the project on GitHub.

## ✨ Features

- **Task Management**: Create, edit, complete, and delete tasks
- **Smart Filtering**: View all tasks, active tasks, or completed tasks
- **Local Storage**: All data persists locally in your browser
- **Real-time Stats**: See task counts and completion status at a glance
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **Accessibility**: Full keyboard navigation and screen reader support
- **Toast Notifications**: Visual feedback for all actions
- **Modal Dialogs**: Clean interfaces for task creation and deletion confirmation
- **Character Counter**: Input validation with live character counting
- **Sample Data**: Loads with example tasks on first visit

## 🚀 Getting Started

### Prerequisites

- A modern web browser (Chrome, Firefox, Safari, Edge)
- No additional software or dependencies required

### Installation & Running

1. **Clone the Repository**:

   ```bash
   git clone https://github.com/EniolaAdemola/TaskyGist.git
   cd TaskyGist
   ```

2. **Alternative: Download ZIP**:

   - Go to the [GitHub repository](https://github.com/EniolaAdemola/TaskyGist)
   - Click "Code" → "Download ZIP"
   - Extract the ZIP file and navigate to the project directory

3. **Open** the `index.html` file in your preferred method:

#### Method 1: Direct File Opening

```bash
# Simply double-click the index.html file
# Or right-click and "Open with" your browser
```

#### Method 2: Local Server

```bash
# Using Python 3
python -m http.server 8000

# Using Python 2
python -m SimpleHTTPServer 8000

# Using Node.js (if you have http-server installed)
npx http-server

# Using PHP
php -S localhost:8000
```

Then open your browser and navigate to:

- `http://localhost:8000` (for server methods)
- Or directly open `file:///path/to/TaskyGist/index.html`

#### Method 3: Live Server Extension (VS Code)

If you're using VS Code:

1. Install the "Live Server" extension
2. Right-click on `index.html`
3. Select "Open with Live Server"

## 🏗️ Project Structure

```
TaskyGist/
├── index.html              # Main HTML file
├── scripts/                # JavaScript modules
│   └── app.js             # Main application logic
├── styles/                # Modular CSS architecture
│   ├── index.css          # Main stylesheet (imports all modules)
│   ├── _variables.css     # CSS custom properties and design tokens
│   ├── _base.css          # Reset styles and base typography
│   ├── components/        # UI component styles
│   │   ├── _buttons.css   # Button styles and variants
│   │   ├── _modals.css    # Modal dialog styles
│   │   ├── _task-list.css # Task list and item styles
│   │   └── _toasts.css    # Toast notification styles
│   ├── layout/            # Layout and structure styles
│   │   └── _layout.css    # Grid, header, main layout
│   └── utilities/         # Utility and helper styles
│       ├── _animations.css # Keyframes and transitions
│       └── _responsive.css # Media queries and responsive design
└── README.md              # This file
```

## 🎯 Usage

### Basic Operations

1. **Add a Task**: Click the "Add New Task" button and enter your task description
2. **Complete a Task**: Click the checkbox next to any task to mark it as complete
3. **Edit a Task**: Click the edit icon (✏️) to modify a task's description
4. **Delete a Task**: Click the delete icon (🗑️) and confirm deletion
5. **Filter Tasks**: Use the filter buttons to view All, Active, or Completed tasks

### Keyboard Navigation

- **Tab**: Navigate between interactive elements
- **Enter/Space**: Activate buttons and checkboxes
- **Escape**: Close modal dialogs

### Data Persistence

- All tasks are automatically saved to your browser's local storage
- Data persists between browser sessions
- No account or internet connection required

## 🛠️ Technical Details

### Architecture

- **Vanilla JavaScript**: No frameworks or libraries required
- **Modular CSS**: Organized using CSS @import for maintainability
- **ES6+ Features**: Modern JavaScript with destructuring, arrow functions, and template literals
- **IIFE Pattern**: Encapsulated code to avoid global namespace pollution
- **Semantic HTML**: Proper document structure with accessibility attributes

### Browser Compatibility

- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+

### Performance Features

- **Lightweight**: ~15KB total size (HTML + CSS + JS)
- **Fast Loading**: No external dependencies
- **Efficient Rendering**: Minimal DOM manipulation
- **Smooth Animations**: CSS transitions and transforms

## 🎨 Customization

### Styling

The modular CSS architecture makes customization easy:

1. **Colors & Themes**: Modify `styles/_variables.css` for design tokens
2. **Layout**: Adjust `styles/layout/_layout.css` for spacing and structure
3. **Components**: Edit individual component files for specific UI elements
4. **Animations**: Customize transitions in `styles/utilities/_animations.css`

### Functionality

The main application logic is in `scripts/app.js`:

- **Add Features**: Extend the task object model and UI
- **Modify Filters**: Update filter logic in the render function
- **Change Storage**: Replace localStorage with different persistence methods
- **Enhance Validation**: Modify the validate function for different rules

## 🔧 Development

### Code Structure

The application follows a clean, modular pattern:

```javascript
// Main application wrapped in IIFE
(function () {
  // Constants and configuration
  const STORAGE_KEY = "taskManager_tasks";

  // DOM element references
  const elements = {
    /* ... */
  };

  // Application state
  let tasks = [];
  let filter = "all";

  // Utility functions
  function loadTasks() {
    /* ... */
  }
  function saveTasks() {
    /* ... */
  }

  // UI rendering
  function render() {
    /* ... */
  }

  // Event handlers
  function handleTaskCreate() {
    /* ... */
  }

  // Initialization
  tasks = loadTasks();
  render();
})();
```

### Adding New Features

1. **New Task Properties**: Extend the task object in the typedef comment
2. **Additional Filters**: Add filter buttons and logic in the render function
3. **Enhanced UI**: Create new CSS modules in the appropriate directories
4. **New Actions**: Add event handlers and update the render function

## 📱 Mobile Support

TaskyGist is fully responsive and optimized for mobile devices:

- **Touch-friendly**: Large tap targets for buttons and checkboxes
- **Responsive Layout**: Adapts to different screen sizes
- **Mobile Gestures**: Supports standard touch interactions
- **Viewport Optimized**: Proper scaling on mobile browsers

## 🔒 Privacy

- **No Data Collection**: All data stays on your device
- **No Internet Required**: Works completely offline
- **No Tracking**: No analytics or third-party scripts
- **Local Storage Only**: Uses browser's localStorage API

## 🤝 Contributing

This is a standalone project, but feel free to:

1. Fork the repository
2. Make your changes
3. Test thoroughly across different browsers
4. Submit a pull request with a clear description

## Tips

- **Backup**: Export your tasks by copying the localStorage data if needed
- **Performance**: The app handles hundreds of tasks efficiently
- **Accessibility**: Use keyboard navigation for better accessibility
- **Mobile**: Add to home screen for app-like experience on mobile devices

---

**Built with ❤️ by [EniolaAdemola](https://github.com/EniolaAdemola)**
