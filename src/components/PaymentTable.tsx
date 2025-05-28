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

const monthNames = [
  "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
  "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
];

const PaymentTable = () => {
  const { 
    selectedStudent, 
    selectedMonthYear, 
    getFilteredPayments,
    students
  } = usePayment();

  const filteredPayments = getFilteredPayments();

  // Formatar valor para exibição em reais
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  // Encontrar nome do estudante pelo ID
  const getStudentName = (studentId: string) => {
    const student = students.find(s => s.id === studentId);
    return student ? student.name : 'Desconhecido';
  };

  return (
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
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-4">
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
  );
};

export default PaymentTable;
