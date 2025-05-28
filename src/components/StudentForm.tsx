import { useState } from "react";
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { usePayment } from "../context/PaymentContext";
import { PlusCircle } from "lucide-react";

const StudentForm = () => {
  const { studyPlans, addStudent, addStudyPlan } = usePayment();
  const [open, setOpen] = useState(false);
  const [studentName, setStudentName] = useState("");
  const [selectedPlanId, setSelectedPlanId] = useState("");
  const [showPlanForm, setShowPlanForm] = useState(false);
  const [planName, setPlanName] = useState("");
  const [planValue, setPlanValue] = useState("");

  const handleAddStudent = () => {
    if (studentName.trim() && selectedPlanId) {
      addStudent(studentName.trim(), selectedPlanId);
      setStudentName("");
      setSelectedPlanId("");
      setOpen(false);
    }
  };

  const handleAddPlan = () => {
    const value = parseFloat(planValue);
    if (planName.trim() && !isNaN(value) && value > 0) {
      addStudyPlan(planName.trim(), value);
      setPlanName("");
      setPlanValue("");
      setShowPlanForm(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="w-full">
          <PlusCircle className="mr-2 h-4 w-4" />
          Adicionar Novo Estudante
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Adicionar Estudante</DialogTitle>
          <DialogDescription>
            Preencha os dados do novo estudante. Todos os campos são obrigatórios.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Nome
            </Label>
            <Input
              id="name"
              value={studentName}
              onChange={(e) => setStudentName(e.target.value)}
              className="col-span-3"
              placeholder="Nome do estudante"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="plan" className="text-right">
              Plano
            </Label>
            <div className="col-span-3 flex gap-2">
              <Select value={selectedPlanId} onValueChange={setSelectedPlanId}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Selecione um plano" />
                </SelectTrigger>
                <SelectContent>
                  {studyPlans.map((plan) => (
                    <SelectItem key={plan.id} value={plan.id}>
                      {plan.name} - R$ {plan.value.toFixed(2)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button 
                variant="outline" 
                size="icon" 
                onClick={() => setShowPlanForm(true)}
                type="button"
              >
                <PlusCircle className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {showPlanForm && (
            <>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="planName" className="text-right">
                  Nome do Plano
                </Label>
                <Input
                  id="planName"
                  value={planName}
                  onChange={(e) => setPlanName(e.target.value)}
                  className="col-span-3"
                  placeholder="Nome do plano"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="planValue" className="text-right">
                  Valor (R$)
                </Label>
                <Input
                  id="planValue"
                  type="number"
                  min="0"
                  step="0.01"
                  value={planValue}
                  onChange={(e) => setPlanValue(e.target.value)}
                  className="col-span-3"
                  placeholder="0,00"
                />
              </div>
              <div className="flex justify-end gap-2">
                <Button 
                  variant="outline" 
                  onClick={() => setShowPlanForm(false)}
                  type="button"
                >
                  Cancelar
                </Button>
                <Button 
                  onClick={handleAddPlan}
                  type="button"
                  disabled={!planName.trim() || !planValue || parseFloat(planValue) <= 0}
                >
                  Adicionar Plano
                </Button>
              </div>
            </>
          )}
        </div>
        <DialogFooter>
          <Button 
            onClick={handleAddStudent}
            disabled={!studentName.trim() || !selectedPlanId}
          >
            Adicionar Estudante
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default StudentForm;
