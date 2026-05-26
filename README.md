# Personal Expense Analytics - Frontend

A comprehensive React-based personal finance management application for tracking expenses, managing budgets, and gaining financial insights.

## Features

- **Dashboard**: Complete financial overview with charts and summaries
- **Transactions**: Manage and track all financial transactions with filters
- **Analytics**: Detailed financial analysis and spending patterns
- **Budgets**: Set and monitor budgets across different categories
- **Settings**: Customize application preferences and account settings

## Project Snapshots
<img width="1919" height="861" alt="image" src="https://github.com/user-attachments/assets/c5913229-08bf-4634-a2b6-91025e4d75b7" /><br>
<img width="1904" height="864" alt="image" src="https://github.com/user-attachments/assets/48189205-1d75-4f8e-990b-b079dd1f2d0f" /><br>
<img width="1901" height="862" alt="image" src="https://github.com/user-attachments/assets/6cc81bbe-895f-4bc7-b8cf-0bd400cb5c09" /><br>
<img width="1895" height="866" alt="image" src="https://github.com/user-attachments/assets/8449e286-b8f7-4c61-a657-64207e00e053" /><br>
<img width="1905" height="860" alt="image" src="https://github.com/user-attachments/assets/df538a5f-0094-451f-b14a-3ee887815b37" />

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
npm run dev
```

The application will open in your browser at `http://localhost:3000`


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

