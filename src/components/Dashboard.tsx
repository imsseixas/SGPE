import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { 
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Label } from "./ui/label";
import { usePayment } from "../context/PaymentContext";
//import { Student, MonthYear } from "../types";
import StudentForm from "./StudentForm";
import { Trash2 } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "./ui/alert-dialog";

const monthNames = [
  "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
  "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
];

// Gera anos para seleção (ano atual e 2 anos para frente e para trás)
const generateYearOptions = () => {
  const currentYear = new Date().getFullYear();
  return [currentYear - 2, currentYear - 1, currentYear, currentYear + 1, currentYear + 2];
};

const Dashboard = () => {
  const {
    students,
    selectedStudent,
    selectedMonthYear,
    paymentAmount,
    paymentSummary,
    setSelectedStudent,
    setSelectedMonthYear,
    setPaymentAmount,
    addPayment,
    removeStudent,
    getStudentPlan
  } = usePayment();

  const handleStudentChange = (value: string) => {
    const student = students.find(s => s.id === value) || null;
    setSelectedStudent(student);
  };

  const handleMonthChange = (value: string) => {
    setSelectedMonthYear({
      ...selectedMonthYear,
      month: parseInt(value)
    });
  };

  const handleYearChange = (value: string) => {
    setSelectedMonthYear({
      ...selectedMonthYear,
      year: parseInt(value)
    });
  };

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value);
    setPaymentAmount(isNaN(value) ? 0 : value);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addPayment();
  };

  const handleDeleteStudent = () => {
    if (selectedStudent) {
      removeStudent(selectedStudent.id);
    }
  };

  const studentPlan = selectedStudent ? getStudentPlan(selectedStudent.id) : undefined;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6 text-center">Sistema de Gerenciamento de Pagamentos</h1>
      
      <div className="mb-6">
        <StudentForm />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Formulário de Pagamento */}
        <Card>
          <CardHeader>
            <CardTitle>Registrar Pagamento</CardTitle>
            <CardDescription>
              Selecione um estudante, mês/ano e informe o valor do pagamento
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <Label htmlFor="student">Estudante</Label>
                  {selectedStudent && (
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="destructive" size="sm">
                          <Trash2 className="h-4 w-4 mr-1" />
                          Excluir
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Tem certeza?</AlertDialogTitle>
                          <AlertDialogDescription>
                            Esta ação não pode ser desfeita. Isso excluirá permanentemente o estudante
                            {selectedStudent?.name} e todos os seus pagamentos registrados.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancelar</AlertDialogCancel>
                          <AlertDialogAction onClick={handleDeleteStudent}>
                            Excluir
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  )}
                </div>
                <Select 
                  onValueChange={handleStudentChange} 
                  value={selectedStudent?.id || ""}
                >
                  <SelectTrigger id="student">
                    <SelectValue placeholder="Selecione um estudante" />
                  </SelectTrigger>
                  <SelectContent>
                    {students.map((student) => (
                      <SelectItem key={student.id} value={student.id}>
                        {student.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="month">Mês</Label>
                  <Select 
                    onValueChange={handleMonthChange} 
                    value={selectedMonthYear.month.toString()}
                  >
                    <SelectTrigger id="month">
                      <SelectValue placeholder="Mês" />
                    </SelectTrigger>
                    <SelectContent>
                      {monthNames.map((month, index) => (
                        <SelectItem key={index + 1} value={(index + 1).toString()}>
                          {month}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="year">Ano</Label>
                  <Select 
                    onValueChange={handleYearChange} 
                    value={selectedMonthYear.year.toString()}
                  >
                    <SelectTrigger id="year">
                      <SelectValue placeholder="Ano" />
                    </SelectTrigger>
                    <SelectContent>
                      {generateYearOptions().map((year) => (
                        <SelectItem key={year} value={year.toString()}>
                          {year}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="amount">Valor do Pagamento (R$)</Label>
                <Input
                  id="amount"
                  type="number"
                  min="0"
                  step="0.01"
                  value={paymentAmount || ""}
                  onChange={handleAmountChange}
                  placeholder="0,00"
                />
              </div>

              <Button 
                type="submit" 
                className="w-full" 
                disabled={!selectedStudent || paymentAmount <= 0}
              >
                Registrar Pagamento
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Informações do Plano e Pagamentos */}
        <Card>
          <CardHeader>
            <CardTitle>Informações do Plano</CardTitle>
            <CardDescription>
              Detalhes do plano de estudo e pagamentos
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-sm text-muted-foreground">Estudante</Label>
                <p className="font-medium">{selectedStudent?.name || "Não selecionado"}</p>
              </div>
              <div>
                <Label className="text-sm text-muted-foreground">Plano de Estudo</Label>
                <p className="font-medium">{studentPlan?.name || "N/A"}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-sm text-muted-foreground">Valor Total do Plano</Label>
                <p className="font-medium">
                  {studentPlan ? `R$ ${studentPlan.value.toFixed(2)}` : "R$ 0,00"}
                </p>
              </div>
              <div>
                <Label className="text-sm text-muted-foreground">Período</Label>
                <p className="font-medium">
                  {monthNames[selectedMonthYear.month - 1]} / {selectedMonthYear.year}
                </p>
              </div>
            </div>

            <div className="pt-4 border-t">
              <h3 className="font-semibold mb-2">Resumo de Pagamentos</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm text-muted-foreground">Total Pago</Label>
                  <p className="font-medium text-green-600">
                    R$ {paymentSummary.totalPaid.toFixed(2)}
                  </p>
                </div>
                <div>
                  <Label className="text-sm text-muted-foreground">Valor Restante</Label>
                  <p className="font-medium text-red-600">
                    R$ {paymentSummary.remaining.toFixed(2)}
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter className="bg-muted/50 flex justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Status</p>
              <p className="font-medium">
                {paymentSummary.remaining <= 0 
                  ? "Pago Completamente" 
                  : `Faltam R$ ${paymentSummary.remaining.toFixed(2)}`}
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm text-muted-foreground">Progresso</p>
              <p className="font-medium">
                {studentPlan 
                  ? `${Math.min(100, (paymentSummary.totalPaid / studentPlan.value) * 100).toFixed(0)}%` 
                  : "0%"}
              </p>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
