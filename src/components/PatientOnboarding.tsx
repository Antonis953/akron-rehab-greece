
import React from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Slider } from '@/components/ui/slider';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

const patientFormSchema = z.object({
  name: z.string().min(2, {
    message: 'Το όνομα πρέπει να έχει τουλάχιστον 2 χαρακτήρες.',
  }),
  age: z.coerce.number().min(18, {
    message: 'Η ηλικία πρέπει να είναι τουλάχιστον 18 ετών.',
  }),
  email: z.string().email({
    message: 'Παρακαλώ εισάγετε έγκυρο email.',
  }),
  phoneNumber: z.string().min(10, {
    message: 'Παρακαλώ εισάγετε έγκυρο αριθμό τηλεφώνου.',
  }),
  condition: z.string().min(2, {
    message: 'Παρακαλώ περιγράψτε την κατάστασή σας.',
  }),
  painLevel: z.number().min(0).max(10),
  limitations: z.string().min(2, {
    message: 'Παρακαλώ περιγράψτε τους περιορισμούς σας.',
  }),
  goals: z.string().min(2, {
    message: 'Παρακαλώ περιγράψτε τους στόχους σας.',
  }),
  medicalHistory: z.string().optional(),
});

type PatientFormValues = z.infer<typeof patientFormSchema>;

const PatientOnboarding = () => {
  const navigate = useNavigate();
  const form = useForm<PatientFormValues>({
    resolver: zodResolver(patientFormSchema),
    defaultValues: {
      name: '',
      age: 30,
      email: '',
      phoneNumber: '',
      condition: '',
      painLevel: 5,
      limitations: '',
      goals: '',
      medicalHistory: '',
    },
  });

  const onSubmit = async (data: PatientFormValues) => {
    try {
      console.log('Patient data:', data);
      // In a real implementation, we would save this data to Supabase
      
      // Show success message
      toast.success('Η εγγραφή σας ολοκληρώθηκε με επιτυχία!');
      
      // Navigate to dashboard (we'll create this page next)
      navigate('/dashboard/patient');
    } catch (error) {
      console.error('Error submitting form:', error);
      toast.error('Προέκυψε ένα σφάλμα κατά την εγγραφή. Παρακαλώ δοκιμάστε ξανά.');
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 animate-fade-in">
      <h1 className="text-2xl font-bold mb-6 text-center">Εγγραφή Ασθενούς</h1>
      <p className="text-gray-600 mb-8 text-center">
        Συμπληρώστε τα παρακάτω στοιχεία για τη δημιουργία του εξατομικευμένου προγράμματος αποκατάστασής σας
      </p>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Ονοματεπώνυμο</FormLabel>
                  <FormControl>
                    <Input placeholder="Μαρία Παπαδοπούλου" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="age"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Ηλικία</FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      {...field} 
                      onChange={(e) => field.onChange(parseInt(e.target.value))} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input type="email" placeholder="example@email.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="phoneNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Τηλέφωνο</FormLabel>
                  <FormControl>
                    <Input placeholder="6912345678" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="condition"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Τρέχουσα Κατάσταση</FormLabel>
                <FormControl>
                  <Textarea 
                    placeholder="Περιγράψτε την τρέχουσα κατάσταση της υγείας σας (π.χ. τραυματισμός γόνατος, αποκατάσταση μετά από χειρουργείο, κλπ.)" 
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
            name="painLevel"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Επίπεδο Πόνου (0-10)</FormLabel>
                <div className="flex flex-col space-y-2">
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>Χωρίς πόνο (0)</span>
                    <span>Ακραίος πόνος (10)</span>
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

          <FormField
            control={form.control}
            name="limitations"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Περιορισμοί Κινητικότητας</FormLabel>
                <FormControl>
                  <Textarea 
                    placeholder="Περιγράψτε τους περιορισμούς που αντιμετωπίζετε στην καθημερινότητά σας λόγω της κατάστασής σας" 
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
            name="goals"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Στόχοι Αποκατάστασης</FormLabel>
                <FormControl>
                  <Textarea 
                    placeholder="Τι θα θέλατε να πετύχετε μέσω του προγράμματος αποκατάστασης; (π.χ. επιστροφή στο τρέξιμο, μείωση του πόνου, κλπ.)" 
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
            name="medicalHistory"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Ιατρικό Ιστορικό (προαιρετικό)</FormLabel>
                <FormControl>
                  <Textarea 
                    placeholder="Αναφέρετε τυχόν σχετικό ιατρικό ιστορικό ή προηγούμενους τραυματισμούς" 
                    className="min-h-[100px]" 
                    {...field} 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex justify-end">
            <Button type="submit" className="bg-accent hover:bg-accent/90 text-white">
              Ολοκλήρωση Εγγραφής
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default PatientOnboarding;
