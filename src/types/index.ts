// Definição dos tipos para o sistema de pagamento de estudantes

export interface StudyPlan {
  id: string;
  name: string;
  value: number;
}

export interface Student {
  id: string;
  name: string;
  studyPlanId: string;
}

export interface Payment {
  id: string;
  studentId: string;
  date: string;
  month: number;
  year: number;
  amount: number;
}

export interface MonthYear {
  month: number;
  year: number;
}

export interface PaymentSummary {
  totalPaid: number;
  remaining: number;
}
