import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { X, Calendar, Clock } from 'lucide-react';
import toast from 'react-hot-toast';
import API from '../api';

export function BookingModal({ property, onClose, onBookingSuccess }) {
  const [formData, setFormData] = useState({
    appointmentDate: '',
    appointmentTime: '',
    buyerPhone: '',
    notes: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.appointmentDate || !formData.appointmentTime) {
      toast.error('Please select date and time');
      return;
    }

    setIsSubmitting(true);

    try {
      const { data } = await API.post('/api/appointments', {
        propertyId: property._id,
        ...formData
      });

      toast.success('Appointment booked successfully! Check your email for confirmation.');
      onBookingSuccess?.(data);
      onClose();
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Set minimum date to today
  const today = new Date().toISOString().split('T')[0];

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <CardTitle className="text-xl font-bold">Book Property Viewing</CardTitle>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-5 w-5" />
          </Button>
        </CardHeader>
        <CardContent>
          <div className="mb-6 p-4 bg-slate-50 rounded-lg">
            <h3 className="font-semibold text-lg">{property.title}</h3>
            <p className="text-sm text-muted-foreground mt-1">{property.address}</p>
            <p className="text-primary font-bold mt-2">${property.price?.toLocaleString()}</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="appointmentDate" className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Select Date *
              </Label>
              <Input
                type="date"
                id="appointmentDate"
                name="appointmentDate"
                min={today}
                value={formData.appointmentDate}
                onChange={handleChange}
                required
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="appointmentTime" className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                Select Time *
              </Label>
              <Input
                type="time"
                id="appointmentTime"
                name="appointmentTime"
                value={formData.appointmentTime}
                onChange={handleChange}
                required
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="buyerPhone">Phone Number (Optional)</Label>
              <Input
                type="tel"
                id="buyerPhone"
                name="buyerPhone"
                placeholder="+1 234 567 8900"
                value={formData.buyerPhone}
                onChange={handleChange}
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="notes">Additional Notes (Optional)</Label>
              <Textarea
                id="notes"
                name="notes"
                placeholder="Any specific requirements or questions..."
                value={formData.notes}
                onChange={handleChange}
                rows={3}
                className="mt-1"
              />
            </div>

            <div className="flex gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                className="flex-1"
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="flex-1"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Booking...' : 'Confirm Booking'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
