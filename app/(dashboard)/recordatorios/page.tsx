import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getConversaciones, getRecordatoriosProgramados } from "@/lib/data/recordatorios";
import { ConversacionesTab } from "./conversaciones-tab";
import { ProgramadosTab } from "./programados-tab";

export default async function RecordatoriosPage() {
  const conversaciones = await getConversaciones();
  const recordatorios = await getRecordatoriosProgramados();

  return (
    <div>
      <header className="pb-6">
        <h1 className="font-display text-3xl font-bold text-vera-verde">Recordatorios</h1>
        <p className="mt-1 text-sm text-muted-foreground">El corazón de Vera: lo que se envió y lo que está por salir.</p>
      </header>

      <Tabs defaultValue="conversaciones">
        <TabsList>
          <TabsTrigger value="conversaciones">Conversaciones</TabsTrigger>
          <TabsTrigger value="programados">Programados</TabsTrigger>
        </TabsList>
        <TabsContent value="conversaciones" className="mt-5">
          <ConversacionesTab conversaciones={conversaciones} />
        </TabsContent>
        <TabsContent value="programados" className="mt-5">
          <ProgramadosTab recordatorios={recordatorios} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
