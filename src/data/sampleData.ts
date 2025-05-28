import { Student, StudyPlan, Payment } from '../types';

// Dados de exemplo para planos de estudo
export const studyPlans: StudyPlan[] = [
  {
    id: 'plan1',
    name: 'Plano Básico',
    value: 250.00,
  },
  {
    id: 'plan2',
    name: 'Plano Intermediário',
    value: 320.00,
  },
  {
    id: 'plan3',
    name: 'Plano Avançado',
    value: 450.00,
  },
  {
    id: 'plan4',
    name: 'Plano Premium',
    value: 1000.00,
  },
];

// Dados de exemplo para estudantes
export const students: Student[] = [
  {
    id: 'student1',
    name: 'Mariana',
    studyPlanId: 'plan2',
  }
];

// Função para gerar data atual formatada
const formatDate = (date: Date): string => {
  return date.toISOString().split('T')[0];
};

// Dados de exemplo para pagamentos
export const payments: Payment[] = [
  {
    id: 'payment1',
    studentId: 'student1',
    date: formatDate(new Date(2025, 4, 10)), // 10 de maio de 2025
    month: 5,
    year: 2025,
    amount: 300.00,
  },
  {
    id: 'payment2',
    studentId: 'student1',
    date: formatDate(new Date(2025, 4, 20)), // 20 de maio de 2025
    month: 5,
    year: 2025,
    amount: 200.00,
  },
  {
    id: 'payment3',
    studentId: 'student2',
    date: formatDate(new Date(2025, 4, 15)), // 15 de maio de 2025
    month: 5,
    year: 2025,
    amount: 500.00,
  },
  {
    id: 'payment4',
    studentId: 'student3',
    date: formatDate(new Date(2025, 4, 5)), // 5 de maio de 2025
    month: 5,
    year: 2025,
    amount: 600.00,
  },
  {
    id: 'payment5',
    studentId: 'student4',
    date: formatDate(new Date(2025, 3, 10)), // 10 de abril de 2025
    month: 4,
    year: 2025,
    amount: 1000.00,
  },
];

// Função para gerar um novo ID único
export const generateId = (prefix: string): string => {
  return `${prefix}${Date.now().toString(36)}${Math.random().toString(36).substr(2, 5)}`;
};

// Função para obter o plano de estudo de um estudante
export const getStudentPlan = (studentId: string): StudyPlan | undefined => {
  const student = students.find(s => s.id === studentId);
  if (!student) return undefined;
  
  return studyPlans.find(p => p.id === student.studyPlanId);
};

// Função para calcular o total pago por um estudante em um determinado mês/ano
export const calculateTotalPaid = (studentId: string, month: number, year: number): number => {
  return payments
    .filter(p => p.studentId === studentId && p.month === month && p.year === year)
    .reduce((total, payment) => total + payment.amount, 0);
};

// Função para calcular o valor restante a ser pago
export const calculateRemainingAmount = (studentId: string, month: number, year: number): number => {
  const plan = getStudentPlan(studentId);
  if (!plan) return 0;
  
  const totalPaid = calculateTotalPaid(studentId, month, year);
  return Math.max(0, plan.value - totalPaid);
};

// Função para adicionar um novo pagamento
export const addPayment = (payment: Omit<Payment, 'id'>): Payment => {
  const newPayment: Payment = {
    ...payment,
    id: generateId('payment'),
  };
  
  payments.push(newPayment);
  return newPayment;
};
