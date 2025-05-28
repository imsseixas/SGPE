import { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { Student, StudyPlan, Payment, MonthYear, PaymentSummary } from '../types';
import { 
  students as initialStudents, 
  studyPlans as initialStudyPlans, 
  payments as initialPayments, 
  getStudentPlan, 
  calculateTotalPaid, 
  calculateRemainingAmount, 
  addPayment as addPaymentToData,
  addStudent as addStudentToData,
  addStudyPlan as addStudyPlanToData,
  removeStudent as removeStudentFromData,
  removePayment as removePaymentFromData
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
  addStudent: (name: string, studyPlanId: string) => void;
  addStudyPlan: (name: string, value: number) => void;
  removeStudent: (studentId: string) => void;
  removePayment: (paymentId: string) => void;
  getStudentPlan: (studentId: string) => StudyPlan | undefined;
  getFilteredPayments: () => Payment[];
  setPaymentsData: (payments: Payment[]) => void;
}

const PaymentContext = createContext<PaymentContextType | undefined>(undefined);

const STORAGE_KEYS = {
  STUDENTS: 'payment_system_students',
  STUDY_PLANS: 'payment_system_study_plans',
  PAYMENTS: 'payment_system_payments'
};

// Função para carregar dados do localStorage
const loadFromStorage = <T,>(key: string, initialData: T[]): T[] => {
  try {
    const storedData = localStorage.getItem(key);
    return storedData ? JSON.parse(storedData) : initialData;
  } catch (error) {
    console.error(`Erro ao carregar dados de ${key}:`, error);
    return initialData;
  }
};

// Função para salvar dados no localStorage
const saveToStorage = <T,>(key: string, data: T[]): void => {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (error) {
    console.error(`Erro ao salvar dados em ${key}:`, error);
  }
};

const currentDate = new Date();
const currentMonth = currentDate.getMonth() + 1; // JavaScript months are 0-indexed
const currentYear = currentDate.getFullYear();

export const PaymentProvider = ({ children }: { children: ReactNode }) => {
  // Carregar dados do localStorage ou usar dados iniciais vazios
  const [studentsData, setStudentsData] = useState<Student[]>(() => 
    loadFromStorage(STORAGE_KEYS.STUDENTS, initialStudents)
  );
  
  const [studyPlansData, setStudyPlansData] = useState<StudyPlan[]>(() => 
    loadFromStorage(STORAGE_KEYS.STUDY_PLANS, initialStudyPlans)
  );
  
  const [paymentsData, setPaymentsData] = useState<Payment[]>(() => 
    loadFromStorage(STORAGE_KEYS.PAYMENTS, initialPayments)
  );

  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [selectedMonthYear, setSelectedMonthYear] = useState<MonthYear>({
    month: currentMonth,
    year: currentYear
  });
  const [paymentAmount, setPaymentAmount] = useState<number>(0);

  // Salvar dados no localStorage quando mudarem
  useEffect(() => {
    saveToStorage(STORAGE_KEYS.STUDENTS, studentsData);
  }, [studentsData]);

  useEffect(() => {
    saveToStorage(STORAGE_KEYS.STUDY_PLANS, studyPlansData);
  }, [studyPlansData]);

  useEffect(() => {
    saveToStorage(STORAGE_KEYS.PAYMENTS, paymentsData);
  }, [paymentsData]);

  // Calcular resumo de pagamento com base no estudante e mês/ano selecionados
  const calculatePaymentSummary = (): PaymentSummary => {
    if (!selectedStudent) {
      return { totalPaid: 0, remaining: 0 };
    }

    const { month, year } = selectedMonthYear;
    const studentPlan = getStudentPlan(selectedStudent.id);
    if (!studentPlan) {
      return { totalPaid: 0, remaining: 0 };
    }

    const totalPaid = paymentsData
      .filter(p => p.studentId === selectedStudent.id && p.month === month && p.year === year)
      .reduce((total, payment) => total + payment.amount, 0);
    
    const remaining = Math.max(0, studentPlan.value - totalPaid);

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

  // Adicionar um novo estudante
  const addStudent = (name: string, studyPlanId: string) => {
    if (!name || !studyPlanId) {
      return;
    }

    const newStudent = addStudentToData({
      name,
      studyPlanId
    });

    setStudentsData([...studentsData, newStudent]);
  };

  // Adicionar um novo plano de estudo
  const addStudyPlan = (name: string, value: number) => {
    if (!name || value <= 0) {
      return;
    }

    const newPlan = addStudyPlanToData({
      name,
      value
    });

    setStudyPlansData([...studyPlansData, newPlan]);
  };

  // Remover um estudante
  const removeStudent = (studentId: string) => {
    if (!studentId) {
      return;
    }

    // Remover estudante dos dados
    removeStudentFromData(studentId);
    
    // Atualizar estado
    setStudentsData(studentsData.filter(s => s.id !== studentId));
    
    // Remover pagamentos associados
    const updatedPayments = paymentsData.filter(p => p.studentId !== studentId);
    setPaymentsData(updatedPayments);
    
    // Resetar estudante selecionado se for o mesmo
    if (selectedStudent?.id === studentId) {
      setSelectedStudent(null);
    }
  };

  // Remover um pagamento
  const removePayment = (paymentId: string) => {
    if (!paymentId) {
      return;
    }

    // Remover pagamento dos dados
    removePaymentFromData(paymentId);
    
    // Atualizar estado
    setPaymentsData(paymentsData.filter(p => p.id !== paymentId));
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
    students: studentsData,
    studyPlans: studyPlansData,
    payments: paymentsData,
    selectedStudent,
    selectedMonthYear,
    paymentAmount,
    paymentSummary,
    setSelectedStudent,
    setSelectedMonthYear,
    setPaymentAmount,
    addPayment,
    addStudent,
    addStudyPlan,
    removeStudent,
    removePayment,
    getStudentPlan,
    getFilteredPayments,
    setPaymentsData
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
