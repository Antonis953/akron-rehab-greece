
import React from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { HelpCircle, Activity } from 'lucide-react';
import { Slider } from '@/components/ui/slider';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

const lifestyleSchema = z.object({
  dailyActivity: z.string().min(1, {
    message: 'Παρακαλώ περιγράψτε την καθημερινή σας δραστηριότητα.',
  }),
  occupation: z.string().min(1, {
    message: 'Παρακαλώ συμπληρώστε το επάγγελμά σας.',
  }),
  sleepQuality: z.enum(['good', 'fair', 'poor'], {
    required_error: 'Παρακαλώ επιλέξτε την ποιότητα ύπνου.',
  }),
  stressLevel: z.number().min(1).max(10),
});

type LifestyleData = z.infer<typeof lifestyleSchema>;

interface LifestyleStepProps {
  data: any;
  updateData: (data: Partial<any>) => void;
}

const LifestyleStep: React.FC<LifestyleStepProps> = ({ data, updateData }) => {
  const form = useForm<LifestyleData>({
    resolver: zodResolver(lifestyleSchema),
    defaultValues: {
      dailyActivity: data.dailyActivity || '',
      occupation: data.occupation || '',
      sleepQuality: data.sleepQuality || 'fair',
      stressLevel: data.stressLevel || 5,
    },
  });

  function onSubmit(values: LifestyleData) {
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
          <Activity className="h-5 w-5 text-primary" />
          <h3 className="text-lg font-medium">Συνήθειες Ζωής</h3>
        </div>

        <FormField
          control={form.control}
          name="dailyActivity"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="flex items-center gap-2">
                Καθημερινή Δραστηριότητα
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <HelpCircle className="h-4 w-4 text-muted-foreground" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Περιγράψτε τη σωματική σας δραστηριότητα σε μια τυπική ημέρα.</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Περιγράψτε την καθημερινή σωματική σας δραστηριότητα (π.χ. περπάτημα, γυμναστήριο, καθιστική εργασία κλπ.)" 
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
          name="occupation"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="flex items-center gap-2">
                Επάγγελμα
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <HelpCircle className="h-4 w-4 text-muted-foreground" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Ποιο είναι το επάγγελμά σας και πόσες ώρες εργάζεστε;</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </FormLabel>
              <FormControl>
                <Input 
                  placeholder="π.χ. Προγραμματιστής - 8 ώρες/ημέρα καθιστική εργασία" 
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="sleepQuality"
          render={({ field }) => (
            <FormItem className="space-y-3">
              <FormLabel className="flex items-center gap-2">
                Ποιότητα Ύπνου
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <HelpCircle className="h-4 w-4 text-muted-foreground" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Πώς θα χαρακτηρίζατε την ποιότητα του ύπνου σας;</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </FormLabel>
              <FormControl>
                <RadioGroup
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  className="flex flex-col space-y-1"
                >
                  <FormItem className="flex items-center space-x-3 space-y-0">
                    <FormControl>
                      <RadioGroupItem value="good" id="good" />
                    </FormControl>
                    <FormLabel htmlFor="good" className="font-normal cursor-pointer">
                      Καλή (Κοιμάμαι αρκετά και ξυπνάω ξεκούραστος/η)
                    </FormLabel>
                  </FormItem>
                  <FormItem className="flex items-center space-x-3 space-y-0">
                    <FormControl>
                      <RadioGroupItem value="fair" id="fair" />
                    </FormControl>
                    <FormLabel htmlFor="fair" className="font-normal cursor-pointer">
                      Μέτρια (Μερικές φορές έχω διακοπτόμενο ύπνο)
                    </FormLabel>
                  </FormItem>
                  <FormItem className="flex items-center space-x-3 space-y-0">
                    <FormControl>
                      <RadioGroupItem value="poor" id="poor" />
                    </FormControl>
                    <FormLabel htmlFor="poor" className="font-normal cursor-pointer">
                      Κακή (Συχνά αϋπνία ή μη ξεκούραστος ύπνος)
                    </FormLabel>
                  </FormItem>
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="stressLevel"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="flex items-center gap-2">
                Επίπεδο Στρες (1-10)
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <HelpCircle className="h-4 w-4 text-muted-foreground" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>1 = Ελάχιστο στρες, 10 = Υπερβολικό στρες</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </FormLabel>
              <div className="flex flex-col space-y-2">
                <div className="flex justify-between text-xs text-gray-500">
                  <span>Ελάχιστο στρες (1)</span>
                  <span>Υπερβολικό στρες (10)</span>
                </div>
                <FormControl>
                  <Slider
                    min={1}
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
      </form>
    </Form>
  );
};

export default LifestyleStep;
