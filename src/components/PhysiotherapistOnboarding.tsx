
import React from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

const physiotherapistFormSchema = z.object({
  name: z.string().min(2, {
    message: 'Το όνομα πρέπει να έχει τουλάχιστον 2 χαρακτήρες.',
  }),
  email: z.string().email({
    message: 'Παρακαλώ εισάγετε έγκυρο email.',
  }),
  phoneNumber: z.string().min(10, {
    message: 'Παρακαλώ εισάγετε έγκυρο αριθμό τηλεφώνου.',
  }),
  specialization: z.string().min(2, {
    message: 'Παρακαλώ εισάγετε την ειδίκευσή σας.',
  }),
  licenseNumber: z.string().min(2, {
    message: 'Παρακαλώ εισάγετε τον αριθμό άδειας σας.',
  }),
  clinic: z.string().min(2, {
    message: 'Παρακαλώ εισάγετε το όνομα της κλινικής σας.',
  }),
  bio: z.string().optional(),
});

type PhysiotherapistFormValues = z.infer<typeof physiotherapistFormSchema>;

const PhysiotherapistOnboarding = () => {
  const navigate = useNavigate();
  const form = useForm<PhysiotherapistFormValues>({
    resolver: zodResolver(physiotherapistFormSchema),
    defaultValues: {
      name: '',
      email: '',
      phoneNumber: '',
      specialization: '',
      licenseNumber: '',
      clinic: '',
      bio: '',
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
    <div className="max-w-2xl mx-auto p-6 animate-fade-in">
      <h1 className="text-2xl font-bold mb-6 text-center">Εγγραφή Φυσιοθεραπευτή</h1>
      <p className="text-gray-600 mb-8 text-center">
        Συμπληρώστε τα παρακάτω στοιχεία για να δημιουργήσετε τον λογαριασμό σας
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

            <FormField
              control={form.control}
              name="specialization"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Ειδίκευση</FormLabel>
                  <FormControl>
                    <Input placeholder="π.χ. Αθλητική Φυσιοθεραπεία" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="licenseNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Αριθμός Άδειας</FormLabel>
                  <FormControl>
                    <Input placeholder="π.χ. ΦΤ-12345" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="clinic"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Κλινική / Ιατρείο</FormLabel>
                  <FormControl>
                    <Input placeholder="Όνομα κλινικής" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="bio"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Βιογραφικό Σημείωμα (προαιρετικό)</FormLabel>
                <FormControl>
                  <Textarea 
                    placeholder="Σύντομη περιγραφή της εμπειρίας και των ειδικεύσεών σας" 
                    className="min-h-[120px]" 
                    {...field} 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex justify-end">
            <Button type="submit" className="bg-primary hover:bg-primary/90">
              Ολοκλήρωση Εγγραφής
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default PhysiotherapistOnboarding;
