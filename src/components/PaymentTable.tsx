import { useState } from "react";
import { usePayment } from "../context/PaymentContext";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Trash2, Pencil } from "lucide-react";
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { Input } from "./ui/input";
import { Label } from "./ui/label";

const monthNames = [
  "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
  "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
];

type Payment = {
  id: string;
  amount: number;
  date: string;
  studentId: string;
  month: number;
  year: number;
};


const PaymentTable = () => {
  const { 
    selectedStudent, 
    selectedMonthYear, 
    getFilteredPayments,
    students,
    removePayment,
    payments,
    setPaymentsData = () => {} // Adicionando uma função vazia como fallback
  } = usePayment();

  const [editingPayment, setEditingPayment] = useState<Payment | null>(null);
  const [editAmount, setEditAmount] = useState("");
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  const filteredPayments = getFilteredPayments();

  // Formatar valor para exibição em reais
  const formatCurrency = (value:string) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  // Encontrar nome do estudante pelo ID
  const getStudentName = (studentId:string) => {
    const student = students.find(s => s.id === studentId);
    return student ? student.name : 'Desconhecido';
  };

  const handleDeletePayment = (paymentId:string) => {
    removePayment(paymentId);
  };

  const openEditDialog = (payment:string) => {
    setEditingPayment(payment);
    setEditAmount(payment.amount.toString());
    setIsEditDialogOpen(true);
  };

  const handleEditPayment = () => {
    if (!editingPayment) return;
    
    const amount = parseFloat(editAmount);
    if (isNaN(amount) || amount <= 0) return;
    
    // Atualizar o pagamento no array
    const updatedPayments = payments.map(p => 
      p.id === editingPayment.id ? { ...p, amount } : p
    );
    
    // Atualizar o estado global
    setPaymentsData(updatedPayments);
    
    // Atualizar o localStorage
    localStorage.setItem('payment_system_payments', JSON.stringify(updatedPayments));
    
    // Fechar o diálogo
    setIsEditDialogOpen(false);
    setEditingPayment(null);
    setEditAmount("");
  };

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Histórico de Pagamentos</CardTitle>
        </CardHeader>
        <CardContent>
          {selectedStudent ? (
            <Table>
              <TableCaption>
                Pagamentos de {selectedStudent.name} em {monthNames[selectedMonthYear.month - 1]}/{selectedMonthYear.year}
              </TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead>Data</TableHead>
                  <TableHead>Estudante</TableHead>
                  <TableHead>Período</TableHead>
                  <TableHead className="text-right">Valor</TableHead>
                  <TableHead className="w-[100px]">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPayments.length > 0 ? (
                  filteredPayments.map((payment) => (
                    <TableRow key={payment.id}>
                      <TableCell>{payment.date}</TableCell>
                      <TableCell>{getStudentName(payment.studentId)}</TableCell>
                      <TableCell>
                        {monthNames[payment.month - 1]}/{payment.year}
                      </TableCell>
                      <TableCell className="text-right font-medium">
                        {formatCurrency(payment.amount)}
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => openEditDialog(payment)}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button variant="destructive" size="sm">
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Excluir Pagamento</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Tem certeza que deseja excluir este pagamento de {formatCurrency(payment.amount)}?
                                  Esta ação não pode ser desfeita.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                <AlertDialogAction onClick={() => handleDeletePayment(payment.id)}>
                                  Excluir
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-4">
                      Nenhum pagamento registrado para este período.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center py-6 text-muted-foreground">
              Selecione um estudante para visualizar o histórico de pagamentos.
            </div>
          )}
        </CardContent>
      </Card>

      {/* Diálogo de Edição de Pagamento */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar Pagamento</DialogTitle>
            <DialogDescription>
              Altere o valor do pagamento conforme necessário.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <div className="space-y-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-amount" className="text-right">
                  Valor (R$)
                </Label>
                <Input
                  id="edit-amount"
                  type="number"
                  min="0.01"
                  step="0.01"
                  value={editAmount}
                  onChange={(e) => setEditAmount(e.target.value)}
                  className="col-span-3"
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setIsEditDialogOpen(false)}
            >
              Cancelar
            </Button>
            <Button 
              onClick={handleEditPayment}
              disabled={!editAmount || parseFloat(editAmount) <= 0}
            >
              Salvar Alterações
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default PaymentTable;
