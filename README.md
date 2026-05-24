# Personal Expense Analytics - Frontend

A comprehensive React-based personal finance management application for tracking expenses, managing budgets, and gaining financial insights.

## Features

- **Dashboard**: Complete financial overview with charts and summaries
- **Transactions**: Manage and track all financial transactions with filters
- **Analytics**: Detailed financial analysis and spending patterns
- **Budgets**: Set and monitor budgets across different categories
- **Reports**: Generate comprehensive financial reports
- **Settings**: Customize application preferences and account settings

## Project Structure

```
src/
├── components/
│   ├── Sidebar.js          # Main navigation sidebar
│   └── Sidebar.css
├── pages/
│   ├── Dashboard.js        # Financial overview dashboard
│   ├── Dashboard.css
│   ├── Transactions.js     # Transaction management
│   ├── Transactions.css
│   ├── Analytics.js        # Financial analytics
│   ├── Analytics.css
│   ├── Budgets.js          # Budget management
│   ├── Budgets.css
│   ├── Reports.js          # Financial reports
│   ├── Reports.css
│   ├── Settings.js         # Application settings
│   └── Settings.css
├── App.js                  # Main app component with routing
├── App.css                 # Global app styles
├── index.js                # React entry point
└── index.css               # Global styles
public/
├── index.html              # HTML template
package.json               # Project dependencies
```

## Installation

1. Navigate to the project directory:
   ```bash
   cd Personal-Expense-Analytics
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

## Running the Application

Start the development server:
```bash
npm start
```

The application will open in your browser at `http://localhost:3000`

## Available Scripts

- `npm start` - Runs the development server
- `npm build` - Creates a production build
- `npm test` - Runs the test suite

## Technologies Used

- **React 18** - UI framework
- **React Router 6** - Client-side routing
- **Recharts** - Data visualization
- **Axios** - HTTP client
- **Date-fns** - Date utilities

## Key Components

### Dashboard
- Summary cards showing key metrics
- Income vs Expenses chart
- Spending categories pie chart
- Category progress tracker
- Recent transactions list
- Smart insights

### Transactions
- Complete transaction list with filters
- Add new transaction modal
- Filter by date, category, method, and status
- Transaction pagination
- Edit and delete functionality

### Analytics
- Financial performance charts
- Spending trends analysis
- Category breakdown visualization
- Top expenses analysis
- Budget health metrics
- Smart savings insights

### Budgets
- Overall budget progress
- Category budget cards with visual indicators
- Budget summary statistics
- Add new budget functionality
- Budget recommendations

### Reports
- Summary statistics
- Monthly and quarterly views
- Expense breakdown table
- Generated reports list
- Quick action buttons
- Export and scheduling options

### Settings
- Profile management
- Preferences (theme selection)
- Notification settings
- Security settings (2FA, login alerts)
- Account management options

## Styling

The application uses a custom CSS design system with:
- CSS variables for consistent theming
- Gradient backgrounds and modern UI
- Responsive grid layouts
- Smooth transitions and hover effects
- Mobile-friendly design

## Color Scheme

- **Primary**: `#6c2de2` (Purple)
- **Success**: `#4caf50` (Green)
- **Warning**: `#ff9800` (Orange)
- **Danger**: `#f44336` (Red)
- **Info**: `#2196f3` (Blue)

## Future Enhancements

- Backend API integration
- Data persistence
- User authentication
- Real-time notifications
- Multi-user support
- Export to PDF/CSV
- Mobile app version
- Advanced analytics
- Investment tracking

## License

MIT License

## Support

For issues or feature requests, please contact the development team.
