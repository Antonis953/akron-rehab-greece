
import React from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { format } from 'date-fns';
import { el } from 'date-fns/locale';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { CalendarIcon, HelpCircle, Bone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const problemAreaSchema = z.object({
  problemArea: z.string({
    required_error: 'Παρακαλώ επιλέξτε την προβληματική περιοχή.',
  }),
  problemDescription: z.string().min(10, {
    message: 'Η περιγραφή πρέπει να έχει τουλάχιστον 10 χαρακτήρες.',
  }),
  injuryDate: z.date({
    required_error: 'Παρακαλώ επιλέξτε ημερομηνία.',
  }),
});

type ProblemAreaData = z.infer<typeof problemAreaSchema>;

interface ProblemAreaStepProps {
  data: any;
  updateData: (data: Partial<any>) => void;
}

const bodyParts = [
  'Αυχένας',
  'Ώμος',
  'Αγκώνας',
  'Καρπός / Χέρι',
  'Μέση / Οσφυϊκή μοίρα',
  'Ισχίο / Λεκάνη',
  'Γόνατο',
  'Αστράγαλος / Πόδι',
  'Άλλο'
];

const ProblemAreaStep: React.FC<ProblemAreaStepProps> = ({ data, updateData }) => {
  const form = useForm<ProblemAreaData>({
    resolver: zodResolver(problemAreaSchema),
    defaultValues: {
      problemArea: data.problemArea || '',
      problemDescription: data.problemDescription || '',
      injuryDate: data.injuryDate || undefined,
    },
  });

  function onSubmit(values: ProblemAreaData) {
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
          <Bone className="h-5 w-5 text-primary" />
          <h3 className="text-lg font-medium">Προβληματική Περιοχή</h3>
        </div>

        <FormField
          control={form.control}
          name="problemArea"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="flex items-center gap-2">
                Περιοχή Τραυματισμού / Πόνου
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <HelpCircle className="h-4 w-4 text-muted-foreground" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Επιλέξτε την περιοχή του σώματος που αντιμετωπίζετε το πρόβλημα.</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </FormLabel>
              <Select 
                onValueChange={field.onChange} 
                defaultValue={field.value}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Επιλέξτε περιοχή" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {bodyParts.map((part) => (
                    <SelectItem key={part} value={part}>
                      {part}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="problemDescription"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="flex items-center gap-2">
                Περιγραφή Προβλήματος
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <HelpCircle className="h-4 w-4 text-muted-foreground" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Περιγράψτε αναλυτικά το πρόβλημα που αντιμετωπίζετε.</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Περιγράψτε με λεπτομέρεια το πρόβλημα που αντιμετωπίζετε (π.χ. πόνος στο γόνατο κατά το ανέβασμα σκάλας, αίσθημα αστάθειας κλπ.)" 
                  className="min-h-[150px]"
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="injuryDate"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel className="flex items-center gap-2">
                Ημερομηνία Έναρξης Συμπτωμάτων
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <HelpCircle className="h-4 w-4 text-muted-foreground" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Πότε ξεκίνησαν τα συμπτώματα ή πότε συνέβη ο τραυματισμός.</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-full pl-3 text-left font-normal",
                        !field.value && "text-muted-foreground"
                      )}
                    >
                      {field.value ? (
                        format(field.value, "d MMMM yyyy", { locale: el })
                      ) : (
                        <span>Επιλέξτε ημερομηνία</span>
                      )}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={field.value}
                    onSelect={field.onChange}
                    disabled={(date) => date > new Date()}
                    initialFocus
                    className={cn("p-3 pointer-events-auto")}
                    locale={el}
                  />
                </PopoverContent>
              </Popover>
              <FormMessage />
            </FormItem>
          )}
        />
      </form>
    </Form>
  );
};

export default ProblemAreaStep;
