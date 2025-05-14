
import React from 'react';
import { format } from 'date-fns';
import { el } from 'date-fns/locale';
import { HelpCircle, Check, Calendar, User, Medkit, Bone, HeartCrack, Activity } from 'lucide-react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface ReviewStepProps {
  data: any;
}

const ReviewStep: React.FC<ReviewStepProps> = ({ data }) => {
  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-2 mb-4">
        <Check className="h-5 w-5 text-primary" />
        <h3 className="text-lg font-medium">Ανασκόπηση Στοιχείων</h3>
      </div>
      
      <div className="bg-muted/50 p-4 rounded-lg mb-6">
        <p className="text-sm">
          Παρακαλούμε ελέγξτε προσεκτικά τα στοιχεία που έχετε συμπληρώσει. 
          Μπορείτε να επιστρέψετε σε οποιοδήποτε βήμα για να κάνετε αλλαγές.
        </p>
      </div>

      <Accordion type="single" collapsible className="w-full">
        <AccordionItem value="personal">
          <AccordionTrigger className="flex items-center">
            <div className="flex items-center gap-2">
              <User className="h-4 w-4 text-primary" />
              <span>Προσωπικά Στοιχεία</span>
            </div>
          </AccordionTrigger>
          <AccordionContent>
            <dl className="divide-y divide-gray-200">
              <div className="grid grid-cols-1 gap-1 py-3 sm:grid-cols-3 sm:gap-4">
                <dt className="text-sm font-medium text-gray-500">Ονοματεπώνυμο</dt>
                <dd className="text-sm text-gray-900 sm:col-span-2">{data.name}</dd>
              </div>
              <div className="grid grid-cols-1 gap-1 py-3 sm:grid-cols-3 sm:gap-4">
                <dt className="text-sm font-medium text-gray-500">Ηλικία</dt>
                <dd className="text-sm text-gray-900 sm:col-span-2">{data.age}</dd>
              </div>
              <div className="grid grid-cols-1 gap-1 py-3 sm:grid-cols-3 sm:gap-4">
                <dt className="text-sm font-medium text-gray-500">Φύλο</dt>
                <dd className="text-sm text-gray-900 sm:col-span-2">
                  {data.gender === 'male' ? 'Άνδρας' : 
                   data.gender === 'female' ? 'Γυναίκα' : 
                   data.gender === 'other' ? 'Άλλο' : ''}
                </dd>
              </div>
              <div className="grid grid-cols-1 gap-1 py-3 sm:grid-cols-3 sm:gap-4">
                <dt className="text-sm font-medium text-gray-500">Email</dt>
                <dd className="text-sm text-gray-900 sm:col-span-2">{data.email}</dd>
              </div>
              <div className="grid grid-cols-1 gap-1 py-3 sm:grid-cols-3 sm:gap-4">
                <dt className="text-sm font-medium text-gray-500">Τηλέφωνο</dt>
                <dd className="text-sm text-gray-900 sm:col-span-2">{data.phoneNumber}</dd>
              </div>
            </dl>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="medical">
          <AccordionTrigger className="flex items-center">
            <div className="flex items-center gap-2">
              <Medkit className="h-4 w-4 text-primary" />
              <span>Ιατρικό Ιστορικό</span>
            </div>
          </AccordionTrigger>
          <AccordionContent>
            <dl className="divide-y divide-gray-200">
              <div className="grid grid-cols-1 gap-1 py-3 sm:grid-cols-3 sm:gap-4">
                <dt className="text-sm font-medium text-gray-500">Προηγούμενοι Τραυματισμοί</dt>
                <dd className="text-sm text-gray-900 sm:col-span-2">{data.previousInjuries || 'Δεν αναφέρθηκαν'}</dd>
              </div>
              <div className="grid grid-cols-1 gap-1 py-3 sm:grid-cols-3 sm:gap-4">
                <dt className="text-sm font-medium text-gray-500">Χρόνια Νοσήματα</dt>
                <dd className="text-sm text-gray-900 sm:col-span-2">{data.chronicConditions || 'Δεν αναφέρθηκαν'}</dd>
              </div>
              <div className="grid grid-cols-1 gap-1 py-3 sm:grid-cols-3 sm:gap-4">
                <dt className="text-sm font-medium text-gray-500">Φαρμακευτική Αγωγή</dt>
                <dd className="text-sm text-gray-900 sm:col-span-2">{data.medications || 'Δεν αναφέρθηκε'}</dd>
              </div>
            </dl>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="problem-area">
          <AccordionTrigger className="flex items-center">
            <div className="flex items-center gap-2">
              <Bone className="h-4 w-4 text-primary" />
              <span>Προβληματική Περιοχή</span>
            </div>
          </AccordionTrigger>
          <AccordionContent>
            <dl className="divide-y divide-gray-200">
              <div className="grid grid-cols-1 gap-1 py-3 sm:grid-cols-3 sm:gap-4">
                <dt className="text-sm font-medium text-gray-500">Περιοχή</dt>
                <dd className="text-sm text-gray-900 sm:col-span-2">{data.problemArea}</dd>
              </div>
              <div className="grid grid-cols-1 gap-1 py-3 sm:grid-cols-3 sm:gap-4">
                <dt className="text-sm font-medium text-gray-500">Περιγραφή</dt>
                <dd className="text-sm text-gray-900 sm:col-span-2">{data.problemDescription}</dd>
              </div>
              <div className="grid grid-cols-1 gap-1 py-3 sm:grid-cols-3 sm:gap-4">
                <dt className="text-sm font-medium text-gray-500">Ημερομηνία Έναρξης</dt>
                <dd className="text-sm text-gray-900 sm:col-span-2">
                  {data.injuryDate ? format(new Date(data.injuryDate), 'd MMMM yyyy', { locale: el }) : ''}
                </dd>
              </div>
            </dl>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="symptoms">
          <AccordionTrigger className="flex items-center">
            <div className="flex items-center gap-2">
              <HeartCrack className="h-4 w-4 text-primary" />
              <span>Συμπτώματα & Πόνος</span>
            </div>
          </AccordionTrigger>
          <AccordionContent>
            <dl className="divide-y divide-gray-200">
              <div className="grid grid-cols-1 gap-1 py-3 sm:grid-cols-3 sm:gap-4">
                <dt className="text-sm font-medium text-gray-500">Επίπεδο Πόνου</dt>
                <dd className="text-sm text-gray-900 sm:col-span-2">{data.painLevel}/10</dd>
              </div>
              <div className="grid grid-cols-1 gap-1 py-3 sm:grid-cols-3 sm:gap-4">
                <dt className="text-sm font-medium text-gray-500">Πόνος το πρωί</dt>
                <dd className="text-sm text-gray-900 sm:col-span-2">{data.morningPain ? 'Ναι' : 'Όχι'}</dd>
              </div>
              <div className="grid grid-cols-1 gap-1 py-3 sm:grid-cols-3 sm:gap-4">
                <dt className="text-sm font-medium text-gray-500">Πόνος τη νύχτα</dt>
                <dd className="text-sm text-gray-900 sm:col-span-2">{data.nightPain ? 'Ναι' : 'Όχι'}</dd>
              </div>
              <div className="grid grid-cols-1 gap-1 py-3 sm:grid-cols-3 sm:gap-4">
                <dt className="text-sm font-medium text-gray-500">Επιδεινωτικοί Παράγοντες</dt>
                <dd className="text-sm text-gray-900 sm:col-span-2">{data.worseningFactors}</dd>
              </div>
              <div className="grid grid-cols-1 gap-1 py-3 sm:grid-cols-3 sm:gap-4">
                <dt className="text-sm font-medium text-gray-500">Ανακουφιστικοί Παράγοντες</dt>
                <dd className="text-sm text-gray-900 sm:col-span-2">{data.relievingFactors}</dd>
              </div>
            </dl>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="lifestyle">
          <AccordionTrigger className="flex items-center">
            <div className="flex items-center gap-2">
              <Activity className="h-4 w-4 text-primary" />
              <span>Συνήθειες Ζωής</span>
            </div>
          </AccordionTrigger>
          <AccordionContent>
            <dl className="divide-y divide-gray-200">
              <div className="grid grid-cols-1 gap-1 py-3 sm:grid-cols-3 sm:gap-4">
                <dt className="text-sm font-medium text-gray-500">Καθημερινή Δραστηριότητα</dt>
                <dd className="text-sm text-gray-900 sm:col-span-2">{data.dailyActivity}</dd>
              </div>
              <div className="grid grid-cols-1 gap-1 py-3 sm:grid-cols-3 sm:gap-4">
                <dt className="text-sm font-medium text-gray-500">Επάγγελμα</dt>
                <dd className="text-sm text-gray-900 sm:col-span-2">{data.occupation}</dd>
              </div>
              <div className="grid grid-cols-1 gap-1 py-3 sm:grid-cols-3 sm:gap-4">
                <dt className="text-sm font-medium text-gray-500">Ποιότητα Ύπνου</dt>
                <dd className="text-sm text-gray-900 sm:col-span-2">
                  {data.sleepQuality === 'good' ? 'Καλή' : 
                   data.sleepQuality === 'fair' ? 'Μέτρια' : 
                   data.sleepQuality === 'poor' ? 'Κακή' : ''}
                </dd>
              </div>
              <div className="grid grid-cols-1 gap-1 py-3 sm:grid-cols-3 sm:gap-4">
                <dt className="text-sm font-medium text-gray-500">Επίπεδο Στρες</dt>
                <dd className="text-sm text-gray-900 sm:col-span-2">{data.stressLevel}/10</dd>
              </div>
            </dl>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="appointment">
          <AccordionTrigger className="flex items-center">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-primary" />
              <span>Επόμενη Συνεδρία</span>
            </div>
          </AccordionTrigger>
          <AccordionContent>
            <dl className="divide-y divide-gray-200">
              <div className="grid grid-cols-1 gap-1 py-3 sm:grid-cols-3 sm:gap-4">
                <dt className="text-sm font-medium text-gray-500">Ημερομηνία</dt>
                <dd className="text-sm text-gray-900 sm:col-span-2">
                  {data.nextAppointment ? format(new Date(data.nextAppointment), 'EEEE, d MMMM yyyy', { locale: el }) : ''}
                </dd>
              </div>
              <div className="grid grid-cols-1 gap-1 py-3 sm:grid-cols-3 sm:gap-4">
                <dt className="text-sm font-medium text-gray-500">Σημείωση</dt>
                <dd className="text-sm text-gray-900 sm:col-span-2">
                  Η ώρα θα επιβεβαιωθεί από το προσωπικό μας μέσω τηλεφώνου.
                </dd>
              </div>
            </dl>
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4 text-blue-800">
        <h4 className="font-medium mb-2 flex items-center gap-2">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <HelpCircle className="h-4 w-4" />
              </TooltipTrigger>
              <TooltipContent>
                <p>Επόμενα βήματα μετά την υποβολή των στοιχείων σας.</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          Επόμενα βήματα
        </h4>
        <p className="text-sm">
          Μετά την ολοκλήρωση της εγγραφής σας, ο φυσικοθεραπευτής σας θα αναλύσει τα δεδομένα και θα δημιουργήσει 
          ένα εξατομικευμένο πρόγραμμα αποκατάστασης για εσάς. Θα λάβετε ειδοποίηση μόλις το πρόγραμμα είναι έτοιμο.
        </p>
      </div>
    </div>
  );
};

export default ReviewStep;
