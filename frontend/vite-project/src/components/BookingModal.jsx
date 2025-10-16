import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { X, Calendar, Clock, DollarSign, TrendingUp, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import API from '../api';

export function BookingModal({ property, onClose, onBookingSuccess }) {
  const [formData, setFormData] = useState({
    appointmentDate: '',
    appointmentTime: '',
    buyerPhone: '',
    notes: '',
    bidAmount: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [existingAppointments, setExistingAppointments] = useState([]);
  const [bidsInfo, setBidsInfo] = useState({ highestBid: 0, minimumBid: 0, bids: [] });
  const [isLoading, setIsLoading] = useState(true);

  // Fetch existing appointments and bids when modal opens
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        
        // Fetch existing appointments
        const appointmentsRes = await API.get(`/api/properties/${property._id}/appointments`);
        setExistingAppointments(appointmentsRes.data);

        // Fetch bids info
        const bidsRes = await API.get(`/api/properties/${property._id}/bids`);
        setBidsInfo(bidsRes.data);

        // Set suggested bid amount (slightly higher than highest bid or minimum)
        const suggestedBid = bidsRes.data.highestBid > 0 
          ? Math.ceil(bidsRes.data.highestBid * 1.05) 
          : bidsRes.data.minimumBid || property.price * 0.1;
        
        setFormData(prev => ({ ...prev, bidAmount: suggestedBid.toString() }));
      } catch (error) {
        console.error('Failed to fetch data:', error);
        toast.error('Failed to load appointment data');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [property._id, property.price]);

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

    if (!formData.bidAmount || parseFloat(formData.bidAmount) <= 0) {
      toast.error('Please enter a valid bid amount');
      return;
    }

    // Validate bid amount
    const bidAmount = parseFloat(formData.bidAmount);
    if (bidAmount < bidsInfo.minimumBid) {
      toast.error(`Bid must be at least $${bidsInfo.minimumBid}`);
      return;
    }

    setIsSubmitting(true);

    try {
      const { data } = await API.post('/api/appointments', {
        propertyId: property._id,
        appointmentDate: formData.appointmentDate,
        appointmentTime: formData.appointmentTime,
        buyerPhone: formData.buyerPhone,
        notes: formData.notes,
        bidAmount: bidAmount
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
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <CardTitle className="text-xl font-bold">Book Property Viewing & Place Bid</CardTitle>
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

          {isLoading ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">Loading appointment data...</p>
            </div>
          ) : (
            <>
              {/* Bidding Information */}
              <div className="mb-6 p-4 border rounded-lg bg-blue-50/50">
                <div className="flex items-center gap-2 mb-3">
                  <TrendingUp className="h-5 w-5 text-blue-600" />
                  <h4 className="font-semibold">Bidding Information</h4>
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">Minimum Bid</p>
                    <p className="font-bold text-lg">${bidsInfo.minimumBid.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Highest Bid</p>
                    <p className="font-bold text-lg text-green-600">
                      {bidsInfo.highestBid > 0 ? `$${bidsInfo.highestBid.toLocaleString()}` : 'No bids yet'}
                    </p>
                  </div>
                </div>
                <div className="mt-3 p-2 bg-yellow-50 border border-yellow-200 rounded text-xs flex items-start gap-2">
                  <AlertCircle className="h-4 w-4 text-yellow-600 mt-0.5 flex-shrink-0" />
                  <p className="text-yellow-800">
                    Only competitive bids will be considered. The seller prioritizes highest bidders for appointments.
                  </p>
                </div>
              </div>

              {/* Existing Appointments */}
              {existingAppointments.length > 0 && (
                <div className="mb-6 p-4 border rounded-lg">
                  <h4 className="font-semibold mb-3 flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    Existing Appointments ({existingAppointments.length})
                  </h4>
                  <div className="space-y-2 max-h-40 overflow-y-auto">
                    {existingAppointments.map((apt, idx) => (
                      <div key={idx} className="flex items-center justify-between text-sm p-2 bg-gray-50 rounded">
                        <div className="flex items-center gap-3">
                          <span className="font-medium">
                            {new Date(apt.appointmentDate).toLocaleDateString('en-US', { 
                              month: 'short', 
                              day: 'numeric' 
                            })}
                          </span>
                          <span className="text-muted-foreground">{apt.appointmentTime}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="text-xs">
                            ${apt.bidAmount?.toLocaleString() || 0}
                          </Badge>
                          <Badge variant={apt.status === 'confirmed' ? 'default' : 'secondary'} className="text-xs">
                            {apt.status}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">
                    Choose a different time or outbid existing appointments
                  </p>
                </div>
              )}

              <Separator className="my-4" />

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
                  <Label htmlFor="bidAmount" className="flex items-center gap-2">
                    <DollarSign className="h-4 w-4" />
                    Your Bid Amount *
                  </Label>
                  <Input
                    type="number"
                    id="bidAmount"
                    name="bidAmount"
                    placeholder="Enter your bid amount"
                    value={formData.bidAmount}
                    onChange={handleChange}
                    min={bidsInfo.minimumBid}
                    required
                    className="mt-1"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Minimum: ${bidsInfo.minimumBid.toLocaleString()}
                    {bidsInfo.highestBid > 0 && ` | Current Highest: $${bidsInfo.highestBid.toLocaleString()}`}
                  </p>
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
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
