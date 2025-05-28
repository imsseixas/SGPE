import { Student, StudyPlan, Payment } from '../types';

// Dados de exemplo para planos de estudo
export const studyPlans: StudyPlan[] = [];

// Dados de exemplo para estudantes
export const students: Student[] = [];

// Dados de exemplo para pagamentos
export const payments: Payment[] = [];

// Função para gerar data atual formatada
export const formatDate = (date: Date): string => {
  return date.toISOString().split('T')[0];
};

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

// Função para adicionar um novo plano de estudo
export const addStudyPlan = (plan: Omit<StudyPlan, 'id'>): StudyPlan => {
  const newPlan: StudyPlan = {
    ...plan,
    id: generateId('plan'),
  };
  
  studyPlans.push(newPlan);
  return newPlan;
};

// Função para adicionar um novo estudante
export const addStudent = (student: Omit<Student, 'id'>): Student => {
  const newStudent: Student = {
    ...student,
    id: generateId('student'),
  };
  
  students.push(newStudent);
  return newStudent;
};

// Função para remover um estudante
export const removeStudent = (studentId: string): void => {
  const index = students.findIndex(s => s.id === studentId);
  if (index !== -1) {
    students.splice(index, 1);
    
    // Remover todos os pagamentos associados ao estudante
    const paymentIndices = payments
      .map((p, i) => p.studentId === studentId ? i : -1)
      .filter(i => i !== -1)
      .sort((a, b) => b - a); // Ordenar em ordem decrescente para remover de trás para frente
    
    paymentIndices.forEach(i => payments.splice(i, 1));
  }
};

// Função para remover um pagamento
export const removePayment = (paymentId: string): void => {
  const index = payments.findIndex(p => p.id === paymentId);
  if (index !== -1) {
    payments.splice(index, 1);
  }
};
