import { createContext, useState, useContext, ReactNode } from 'react';
import { Student, StudyPlan, Payment, MonthYear, PaymentSummary } from '../types';
import { 
  students, 
  studyPlans, 
  payments, 
  getStudentPlan, 
  calculateTotalPaid, 
  calculateRemainingAmount, 
  addPayment as addPaymentToData 
} from '../data/sampleData';

interface PaymentContextType {
  students: Student[];
  studyPlans: StudyPlan[];
  payments: Payment[];
  selectedStudent: Student | null;
  selectedMonthYear: MonthYear;
  paymentAmount: number;
  paymentSummary: PaymentSummary;
  setSelectedStudent: (student: Student | null) => void;
  setSelectedMonthYear: (monthYear: MonthYear) => void;
  setPaymentAmount: (amount: number) => void;
  addPayment: () => void;
  getStudentPlan: (studentId: string) => StudyPlan | undefined;
  getFilteredPayments: () => Payment[];
}

const PaymentContext = createContext<PaymentContextType | undefined>(undefined);

const currentDate = new Date();
const currentMonth = currentDate.getMonth() + 1; // JavaScript months are 0-indexed
const currentYear = currentDate.getFullYear();

export const PaymentProvider = ({ children }: { children: ReactNode }) => {
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [selectedMonthYear, setSelectedMonthYear] = useState<MonthYear>({
    month: currentMonth,
    year: currentYear
  });
  const [paymentAmount, setPaymentAmount] = useState<number>(0);
  const [paymentsData, setPaymentsData] = useState<Payment[]>(payments);

  // Calcular resumo de pagamento com base no estudante e mês/ano selecionados
  const calculatePaymentSummary = (): PaymentSummary => {
    if (!selectedStudent) {
      return { totalPaid: 0, remaining: 0 };
    }

    const { month, year } = selectedMonthYear;
    const totalPaid = calculateTotalPaid(selectedStudent.id, month, year);
    const remaining = calculateRemainingAmount(selectedStudent.id, month, year);

    return { totalPaid, remaining };
  };

  // Adicionar um novo pagamento
  const addPayment = () => {
    if (!selectedStudent || paymentAmount <= 0) {
      return;
    }

    const { month, year } = selectedMonthYear;
    const newPayment = addPaymentToData({
      studentId: selectedStudent.id,
      date: new Date().toISOString().split('T')[0],
      month,
      year,
      amount: paymentAmount
    });

    setPaymentsData([...paymentsData, newPayment]);
    setPaymentAmount(0);
  };

  // Obter pagamentos filtrados por estudante e mês/ano
  const getFilteredPayments = () => {
    if (!selectedStudent) {
      return [];
    }

    const { month, year } = selectedMonthYear;
    return paymentsData.filter(
      p => p.studentId === selectedStudent.id && p.month === month && p.year === year
    );
  };

  const paymentSummary = calculatePaymentSummary();

  const value = {
    students,
    studyPlans,
    payments: paymentsData,
    selectedStudent,
    selectedMonthYear,
    paymentAmount,
    paymentSummary,
    setSelectedStudent,
    setSelectedMonthYear,
    setPaymentAmount,
    addPayment,
    getStudentPlan,
    getFilteredPayments
  };

  return (
    <PaymentContext.Provider value={value}>
      {children}
    </PaymentContext.Provider>
  );
};

export const usePayment = () => {
  const context = useContext(PaymentContext);
  if (context === undefined) {
    throw new Error('usePayment must be used within a PaymentProvider');
  }
  return context;
};
