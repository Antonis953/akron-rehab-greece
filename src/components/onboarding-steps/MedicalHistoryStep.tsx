
import React from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { HelpCircle, FirstAidKit } from 'lucide-react';

const medicalHistorySchema = z.object({
  previousInjuries: z.string().optional(),
  chronicConditions: z.string().optional(),
  medications: z.string().optional(),
});

type MedicalHistoryData = z.infer<typeof medicalHistorySchema>;

interface MedicalHistoryStepProps {
  data: any;
  updateData: (data: Partial<any>) => void;
}

const MedicalHistoryStep: React.FC<MedicalHistoryStepProps> = ({ data, updateData }) => {
  const form = useForm<MedicalHistoryData>({
    resolver: zodResolver(medicalHistorySchema),
    defaultValues: {
      previousInjuries: data.previousInjuries || '',
      chronicConditions: data.chronicConditions || '',
      medications: data.medications || '',
    },
  });

  function onSubmit(values: MedicalHistoryData) {
    updateData(values);
  }

  // Watch for changes and update parent form data
  React.useEffect(() => {
    const subscription = form.watch((value) => {
      updateData(value);
    });
    return () => subscription.unsubscribe();
  }, [form, updateData]);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="flex items-center space-x-2 mb-4">
          <FirstAidKit className="h-5 w-5 text-primary" />
          <h3 className="text-lg font-medium">Ιατρικό Ιστορικό</h3>
        </div>

        <FormField
          control={form.control}
          name="previousInjuries"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="flex items-center gap-2">
                Προηγούμενοι Τραυματισμοί
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <HelpCircle className="h-4 w-4 text-muted-foreground" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Περιγράψτε προηγούμενους τραυματισμούς ή χειρουργικές επεμβάσεις.</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Περιγράψτε τυχόν προηγούμενους τραυματισμούς (π.χ. κάταγμα αστραγάλου πριν 2 χρόνια, χειρουργείο μηνίσκου κλπ.)" 
                  className="min-h-[100px]"
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="chronicConditions"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="flex items-center gap-2">
                Χρόνια Νοσήματα
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <HelpCircle className="h-4 w-4 text-muted-foreground" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Αναφέρετε τυχόν χρόνια προβλήματα υγείας.</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Αναφέρετε τυχόν χρόνια νοσήματα (π.χ. υπέρταση, διαβήτης, άσθμα κλπ.)" 
                  className="min-h-[100px]"
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="medications"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="flex items-center gap-2">
                Φαρμακευτική Αγωγή
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <HelpCircle className="h-4 w-4 text-muted-foreground" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Λίστα φαρμάκων που λαμβάνετε τακτικά.</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Αναφέρετε τα φάρμακα που λαμβάνετε τακτικά και τη δοσολογία τους" 
                  className="min-h-[100px]"
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </form>
    </Form>
  );
};

export default MedicalHistoryStep;
