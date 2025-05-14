
import React from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { format } from 'date-fns';
import { el } from 'date-fns/locale';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { CalendarIcon, HelpCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';

const appointmentSchema = z.object({
  nextAppointment: z.date({
    required_error: 'Παρακαλώ επιλέξτε ημερομηνία για την επόμενη συνεδρία.',
  }),
});

type AppointmentData = z.infer<typeof appointmentSchema>;

interface AppointmentStepProps {
  data: any;
  updateData: (data: Partial<any>) => void;
}

const AppointmentStep: React.FC<AppointmentStepProps> = ({ data, updateData }) => {
  const form = useForm<AppointmentData>({
    resolver: zodResolver(appointmentSchema),
    defaultValues: {
      nextAppointment: data.nextAppointment || undefined,
    },
  });

  function onSubmit(values: AppointmentData) {
    updateData(values);
  }

  // Watch for changes and update parent form data
  React.useEffect(() => {
    const subscription = form.watch((value) => {
      updateData(value);
    });
    return () => subscription.unsubscribe();
  }, [form, updateData]);

  // Get future dates (today + next 30 days)
  const today = new Date();
  const thirtyDaysFromNow = new Date();
  thirtyDaysFromNow.setDate(today.getDate() + 30);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="flex items-center space-x-2 mb-4">
          <CalendarIcon className="h-5 w-5 text-primary" />
          <h3 className="text-lg font-medium">Επόμενη Συνεδρία</h3>
        </div>

        <div className="bg-muted/50 p-4 rounded-lg mb-6">
          <p className="text-sm">
            Επιλέξτε την προτιμώμενη ημερομηνία για την πρώτη σας συνεδρία με τον φυσικοθεραπευτή. 
            Μπορείτε να επιλέξετε οποιαδήποτε διαθέσιμη ημερομηνία μέσα στις επόμενες 30 ημέρες.
          </p>
        </div>

        <FormField
          control={form.control}
          name="nextAppointment"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel className="flex items-center gap-2">
                Ημερομηνία Επόμενης Συνεδρίας
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <HelpCircle className="h-4 w-4 text-muted-foreground" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Επιλέξτε την προτιμώμενη ημερομηνία για την επόμενη συνεδρία.</p>
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
                        "w-full md:w-[300px] pl-3 text-left font-normal",
                        !field.value && "text-muted-foreground"
                      )}
                    >
                      {field.value ? (
                        format(field.value, "EEEE, d MMMM yyyy", { locale: el })
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
                    disabled={(date) => {
                      // Disable past dates and dates more than 30 days in the future
                      return date < today || date > thirtyDaysFromNow;
                    }}
                    initialFocus
                    className={cn("p-3 pointer-events-auto")}
                    locale={el}
                  />
                </PopoverContent>
              </Popover>
              <FormDescription>
                Η ώρα θα επιβεβαιωθεί από το προσωπικό μας μέσω τηλεφώνου.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
      </form>
    </Form>
  );
};

export default AppointmentStep;
