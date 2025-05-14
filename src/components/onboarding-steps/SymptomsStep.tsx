
import React from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { HelpCircle, HeartCrack } from 'lucide-react';
import { Slider } from '@/components/ui/slider';
import { Checkbox } from '@/components/ui/checkbox';

const symptomsSchema = z.object({
  painLevel: z.number().min(0).max(10),
  morningPain: z.boolean().default(false),
  nightPain: z.boolean().default(false),
  worseningFactors: z.string().min(1, {
    message: 'Παρακαλώ συμπληρώστε τους παράγοντες επιδείνωσης.',
  }),
  relievingFactors: z.string().min(1, {
    message: 'Παρακαλώ συμπληρώστε τους παράγοντες ανακούφισης.',
  }),
});

type SymptomsData = z.infer<typeof symptomsSchema>;

interface SymptomsStepProps {
  data: any;
  updateData: (data: Partial<any>) => void;
}

const SymptomsStep: React.FC<SymptomsStepProps> = ({ data, updateData }) => {
  const form = useForm<SymptomsData>({
    resolver: zodResolver(symptomsSchema),
    defaultValues: {
      painLevel: data.painLevel || 5,
      morningPain: data.morningPain || false,
      nightPain: data.nightPain || false,
      worseningFactors: data.worseningFactors || '',
      relievingFactors: data.relievingFactors || '',
    },
  });

  function onSubmit(values: SymptomsData) {
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
          <HeartCrack className="h-5 w-5 text-primary" />
          <h3 className="text-lg font-medium">Συμπτώματα & Πόνος</h3>
        </div>

        <FormField
          control={form.control}
          name="painLevel"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="flex items-center gap-2">
                Επίπεδο Πόνου (0-10)
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <HelpCircle className="h-4 w-4 text-muted-foreground" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>0 = Καθόλου πόνος, 10 = Αφόρητος πόνος</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </FormLabel>
              <div className="flex flex-col space-y-2">
                <div className="flex justify-between text-xs text-gray-500">
                  <span>Καθόλου πόνος (0)</span>
                  <span>Αφόρητος πόνος (10)</span>
                </div>
                <FormControl>
                  <Slider
                    min={0}
                    max={10}
                    step={1}
                    defaultValue={[field.value]}
                    onValueChange={(value) => field.onChange(value[0])}
                    className="mt-2"
                  />
                </FormControl>
              </div>
              <div className="text-center mt-2 font-medium">
                Επιλεγμένη τιμή: {field.value}
              </div>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-8">
          <FormField
            control={form.control}
            name="morningPain"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel>
                    Πόνος το πρωί
                  </FormLabel>
                  <p className="text-sm text-muted-foreground">
                    Παρουσιάζεται πόνος ή δυσκαμψία όταν ξυπνάτε;
                  </p>
                </div>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="nightPain"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel>
                    Πόνος τη νύχτα
                  </FormLabel>
                  <p className="text-sm text-muted-foreground">
                    Σας ξυπνά ο πόνος κατά τη διάρκεια της νύχτας;
                  </p>
                </div>
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="worseningFactors"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="flex items-center gap-2">
                Παράγοντες που επιδεινώνουν τα συμπτώματα
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <HelpCircle className="h-4 w-4 text-muted-foreground" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Τι κάνει τον πόνο ή τα συμπτώματα χειρότερα;</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Περιγράψτε τι επιδεινώνει τον πόνο ή τα συμπτώματά σας (π.χ. παρατεταμένη καθιστή θέση, άσκηση, πρωινή δραστηριότητα κλπ.)" 
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
          name="relievingFactors"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="flex items-center gap-2">
                Παράγοντες που ανακουφίζουν τα συμπτώματα
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <HelpCircle className="h-4 w-4 text-muted-foreground" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Τι ανακουφίζει τον πόνο ή τα συμπτώματά σας;</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Περιγράψτε τι σας ανακουφίζει από τον πόνο (π.χ. ξεκούραση, παγοκύστες, ζεστά επιθέματα, συγκεκριμένη θέση κλπ.)" 
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

export default SymptomsStep;
