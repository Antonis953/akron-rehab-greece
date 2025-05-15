
import React from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

const physiotherapistFormSchema = z.object({
  name: z.string().min(2, {
    message: 'Το όνομα πρέπει να έχει τουλάχιστον 2 χαρακτήρες.',
  }),
  email: z.string().email({
    message: 'Παρακαλώ εισάγετε έγκυρο email.',
  }),
  password: z.string().min(8, {
    message: 'Ο κωδικός πρέπει να έχει τουλάχιστον 8 χαρακτήρες.',
  })
});

type PhysiotherapistFormValues = z.infer<typeof physiotherapistFormSchema>;

const PhysiotherapistOnboarding = () => {
  const navigate = useNavigate();
  const form = useForm<PhysiotherapistFormValues>({
    resolver: zodResolver(physiotherapistFormSchema),
    defaultValues: {
      name: '',
      email: '',
      password: ''
    },
  });

  const onSubmit = async (data: PhysiotherapistFormValues) => {
    try {
      console.log('Physiotherapist data:', data);
      // In a real implementation, we would save this data to Supabase
      
      // Show success message
      toast.success('Η εγγραφή σας ολοκληρώθηκε με επιτυχία!');
      
      // Navigate to dashboard (we'll create this page next)
      navigate('/dashboard/physiotherapist');
    } catch (error) {
      console.error('Error submitting form:', error);
      toast.error('Προέκυψε ένα σφάλμα κατά την εγγραφή. Παρακαλώ δοκιμάστε ξανά.');
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 animate-fade-in">
      <h1 className="text-2xl font-bold mb-2 text-center">Γρήγορη Εγγραφή</h1>
      <p className="text-gray-600 mb-6 text-center">
        Συμπληρώστε τα παρακάτω στοιχεία για να δημιουργήσετε τον λογαριασμό σας
      </p>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Ονοματεπώνυμο</FormLabel>
                <FormControl>
                  <Input placeholder="Γιάννης Παπαδόπουλος" {...field} />
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
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Κωδικός Πρόσβασης</FormLabel>
                <FormControl>
                  <Input type="password" placeholder="Τουλάχιστον 8 χαρακτήρες" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="mt-6">
            <Button 
              type="submit" 
              className="w-full bg-primary hover:bg-primary/90"
            >
              Δημιουργία Λογαριασμού
            </Button>
          </div>
          
          <p className="text-xs text-center text-gray-500 mt-4">
            Περισσότερες πληροφορίες θα σας ζητηθούν μετά την εγγραφή, στο dashboard σας.
          </p>
        </form>
      </Form>
    </div>
  );
};

export default PhysiotherapistOnboarding;
