import { PaymentProvider } from './context/PaymentContext';
import Dashboard from './components/Dashboard';
import PaymentTable from './components/PaymentTable';
import './App.css';

function App() {
  return (
    <PaymentProvider>
      <div className="min-h-screen bg-gray-50">
        <Dashboard />
        <div className="container mx-auto p-4 mt-6">
          <PaymentTable />
        </div>
      </div>
    </PaymentProvider>
  );
}

export default App;
